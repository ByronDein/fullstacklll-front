import { Signal } from '@angular/core';
import { Categoria, Comentario, Tema } from '../models/modelos';

// PATRON REPOSITORY (parte del foro). Mismo concepto que UsuarioRepository.
export abstract class ForoRepository {
  abstract readonly categorias: Signal<Categoria[]>;
  abstract readonly temas: Signal<Tema[]>;
  abstract readonly comentarios: Signal<Comentario[]>;

  abstract crearTema(datos: { titulo: string; contenido: string; autorId: number; categoriaId: number }): Tema;
  abstract eliminarTema(id: number): void;
  abstract moderarTema(id: number, baneado: boolean, motivo: string): void;

  abstract crearComentario(datos: { temaId: number; autorId: number; contenido: string }): Comentario;
  abstract eliminarComentario(id: number): void;
  abstract moderarComentario(id: number, baneado: boolean, motivo: string): void;
}
