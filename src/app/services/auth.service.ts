import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario } from '../models/modelos';
import { UsuarioRepository } from '../repositories/usuario.repository';

const CLAVE_SESION = 'foronova_sesion';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly repo = inject(UsuarioRepository);

  // id del usuario que inicio sesion (se guarda en sessionStorage para que F5 no cierre la sesion)
  private readonly idSesion = signal<number | null>(this.leerSesion());

  // codigos de recuperacion generados (simulan el correo que se enviaria)
  private readonly codigos = new Map<string, string>();

  readonly usuarioActual = computed<Usuario | null>(() => {
    const id = this.idSesion();
    if (id === null) {
      return null;
    }
    return this.repo.usuarios().find((u) => u.id === id && u.activo) ?? null;
  });

  readonly logueado = computed(() => this.usuarioActual() !== null);
  readonly esAdmin = computed(() => this.usuarioActual()?.rol === 'ADMIN');
  readonly esModerador = computed(() => {
    const rol = this.usuarioActual()?.rol;
    return rol === 'MODERADOR' || rol === 'ADMIN';
  });

  // Devuelve un mensaje de error, o null si el login fue correcto
  login(correo: string, clave: string): string | null {
    const usuario = this.repo.buscarPorCorreo(correo);
    if (!usuario || usuario.clave !== clave) {
      return 'Correo o contraseña incorrectos';
    }
    if (!usuario.activo) {
      return 'Tu cuenta está desactivada. Contacta a un administrador';
    }
    this.guardarSesion(usuario.id);
    return null;
  }

  // Crea la cuenta con rol USUARIO e inicia sesion
  registrar(nombre: string, correo: string, clave: string): void {
    const nuevo = this.repo.crear({ nombre, correo, clave, rol: 'USUARIO' });
    this.guardarSesion(nuevo.id);
  }

  logout(): void {
    this.guardarSesion(null);
  }

  // Paso 1 de recuperar contrasena: genera un codigo de 6 digitos (simulado)
  solicitarCodigo(correo: string): string | null {
    const usuario = this.repo.buscarPorCorreo(correo);
    if (!usuario) {
      return null;
    }
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    this.codigos.set(usuario.correo, codigo);
    return codigo;
  }

  // Paso 2: valida el codigo y cambia la contrasena
  restablecerClave(correo: string, codigo: string, nuevaClave: string): string | null {
    const usuario = this.repo.buscarPorCorreo(correo);
    if (!usuario || this.codigos.get(usuario.correo) !== codigo) {
      return 'El código ingresado no es correcto';
    }
    this.repo.actualizar(usuario.id, { clave: nuevaClave });
    this.codigos.delete(usuario.correo);
    return null;
  }

  actualizarPerfil(datos: { nombre: string; correo: string; biografia: string }): void {
    const usuario = this.usuarioActual();
    if (usuario) {
      this.repo.actualizar(usuario.id, {
        nombre: datos.nombre.trim(),
        correo: datos.correo.trim().toLowerCase(),
        biografia: datos.biografia.trim(),
      });
    }
  }

  // Devuelve un mensaje de error, o null si se cambio bien
  cambiarClave(claveActual: string, nuevaClave: string): string | null {
    const usuario = this.usuarioActual();
    if (!usuario) {
      return 'No hay una sesión activa';
    }
    if (usuario.clave !== claveActual) {
      return 'La contraseña actual no es correcta';
    }
    this.repo.actualizar(usuario.id, { clave: nuevaClave });
    return null;
  }

  private guardarSesion(id: number | null): void {
    this.idSesion.set(id);
    try {
      if (id === null) {
        sessionStorage.removeItem(CLAVE_SESION);
      } else {
        sessionStorage.setItem(CLAVE_SESION, String(id));
      }
    } catch {
      // si el navegador no deja usar sessionStorage la sesion dura hasta que se recargue
    }
  }

  private leerSesion(): number | null {
    try {
      const guardado = sessionStorage.getItem(CLAVE_SESION);
      return guardado ? Number(guardado) : null;
    } catch {
      return null;
    }
  }
}
