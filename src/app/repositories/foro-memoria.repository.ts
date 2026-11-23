import { Injectable, signal } from '@angular/core';
import { Comentario, Tema } from '../models/modelos';
import { CATEGORIAS_INICIALES, COMENTARIOS_INICIALES, TEMAS_INICIALES } from '../data/datos-iniciales';
import { ForoRepository } from './foro.repository';

// Implementacion que guarda categorias, temas y comentarios en arreglos en memoria
@Injectable()
export class ForoMemoriaRepository extends ForoRepository {
  private readonly listaCategorias = signal(CATEGORIAS_INICIALES.map((c) => ({ ...c })));
  private readonly listaTemas = signal<Tema[]>(TEMAS_INICIALES.map((t) => ({ ...t })));
  private readonly listaComentarios = signal<Comentario[]>(COMENTARIOS_INICIALES.map((c) => ({ ...c })));

  private siguienteIdTema = Math.max(...TEMAS_INICIALES.map((t) => t.id)) + 1;
  private siguienteIdComentario = Math.max(...COMENTARIOS_INICIALES.map((c) => c.id)) + 1;

  readonly categorias = this.listaCategorias.asReadonly();
  readonly temas = this.listaTemas.asReadonly();
  readonly comentarios = this.listaComentarios.asReadonly();

  crearTema(datos: { titulo: string; contenido: string; autorId: number; categoriaId: number }): Tema {
    const nuevo: Tema = {
      id: this.siguienteIdTema++,
      titulo: datos.titulo.trim(),
      contenido: datos.contenido.trim(),
      autorId: datos.autorId,
      categoriaId: datos.categoriaId,
      fecha: new Date(),
      baneado: false,
      motivoBan: '',
    };
    this.listaTemas.update((lista) => [...lista, nuevo]);
    return nuevo;
  }

  eliminarTema(id: number): void {
    this.listaTemas.update((lista) => lista.filter((t) => t.id !== id));
    // al borrar un tema tambien se borran sus comentarios
    this.listaComentarios.update((lista) => lista.filter((c) => c.temaId !== id));
  }

  moderarTema(id: number, baneado: boolean, motivo: string): void {
    this.listaTemas.update((lista) =>
      lista.map((t) => (t.id === id ? { ...t, baneado, motivoBan: baneado ? motivo.trim() : '' } : t)),
    );
  }

  crearComentario(datos: { temaId: number; autorId: number; contenido: string }): Comentario {
    const nuevo: Comentario = {
      id: this.siguienteIdComentario++,
      temaId: datos.temaId,
      autorId: datos.autorId,
      contenido: datos.contenido.trim(),
      fecha: new Date(),
      baneado: false,
      motivoBan: '',
    };
    this.listaComentarios.update((lista) => [...lista, nuevo]);
    return nuevo;
  }

  eliminarComentario(id: number): void {
    this.listaComentarios.update((lista) => lista.filter((c) => c.id !== id));
  }

  moderarComentario(id: number, baneado: boolean, motivo: string): void {
    this.listaComentarios.update((lista) =>
      lista.map((c) => (c.id === id ? { ...c, baneado, motivoBan: baneado ? motivo.trim() : '' } : c)),
    );
  }
}
