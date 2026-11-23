import { Signal } from '@angular/core';
import { RolNombre, Usuario } from '../models/modelos';

// PATRON REPOSITORY
// Esta clase abstracta define QUE se puede hacer con los usuarios, sin decir DONDE se guardan.
// Hoy los datos viven en un arreglo (UsuarioMemoriaRepository). Si despues se conecta al
// backend, se crea un UsuarioHttpRepository y se cambia solo una linea en app.config.ts.
export abstract class UsuarioRepository {
  abstract readonly usuarios: Signal<Usuario[]>;

  abstract buscarPorId(id: number): Usuario | undefined;
  abstract buscarPorCorreo(correo: string): Usuario | undefined;
  abstract crear(datos: { nombre: string; correo: string; clave: string; rol: RolNombre }): Usuario;
  abstract actualizar(id: number, cambios: Partial<Usuario>): void;
  abstract eliminar(id: number): void;
}
