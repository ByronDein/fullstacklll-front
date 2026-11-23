import { Injectable, signal } from '@angular/core';
import { RolNombre, Usuario } from '../models/modelos';
import { USUARIOS_INICIALES } from '../data/datos-iniciales';
import { UsuarioRepository } from './usuario.repository';

// Implementacion que guarda los usuarios en un arreglo en memoria
@Injectable()
export class UsuarioMemoriaRepository extends UsuarioRepository {
  private readonly lista = signal<Usuario[]>(USUARIOS_INICIALES.map((u) => ({ ...u })));
  private siguienteId = Math.max(...USUARIOS_INICIALES.map((u) => u.id)) + 1;

  readonly usuarios = this.lista.asReadonly();

  buscarPorId(id: number): Usuario | undefined {
    return this.lista().find((u) => u.id === id);
  }

  buscarPorCorreo(correo: string): Usuario | undefined {
    return this.lista().find((u) => u.correo.toLowerCase() === correo.trim().toLowerCase());
  }

  crear(datos: { nombre: string; correo: string; clave: string; rol: RolNombre }): Usuario {
    const nuevo: Usuario = {
      id: this.siguienteId++,
      nombre: datos.nombre.trim(),
      correo: datos.correo.trim().toLowerCase(),
      clave: datos.clave,
      rol: datos.rol,
      activo: true,
      fechaRegistro: new Date(),
      biografia: '',
    };
    this.lista.update((lista) => [...lista, nuevo]);
    return nuevo;
  }

  actualizar(id: number, cambios: Partial<Usuario>): void {
    this.lista.update((lista) => lista.map((u) => (u.id === id ? { ...u, ...cambios, id } : u)));
  }

  eliminar(id: number): void {
    this.lista.update((lista) => lista.filter((u) => u.id !== id));
  }
}
