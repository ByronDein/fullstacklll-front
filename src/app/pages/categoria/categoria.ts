import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForoRepository } from '../../repositories/foro.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';

@Component({
  selector: 'app-categoria',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './categoria.html',
})
export class Categoria {
  private readonly foro = inject(ForoRepository);
  private readonly usuarios = inject(UsuarioRepository);

  // viene de la ruta /categoria/:id
  readonly id = input.required<string>();

  protected readonly buscador = new FormControl('', { nonNullable: true });
  private readonly texto = toSignal(this.buscador.valueChanges, { initialValue: '' });

  protected readonly categoria = computed(() => this.foro.categorias().find((c) => c.id === Number(this.id())));

  protected readonly temas = computed(() => {
    const texto = this.texto().trim().toLowerCase();
    return this.foro
      .temas()
      .filter((t) => t.categoriaId === Number(this.id()) && !t.baneado)
      .filter((t) => !texto || t.titulo.toLowerCase().includes(texto) || t.contenido.toLowerCase().includes(texto))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  });

  protected nombreAutor(id: number): string {
    return this.usuarios.buscarPorId(id)?.nombre ?? 'Usuario eliminado';
  }

  protected cantidadComentarios(idTema: number): number {
    return this.foro.comentarios().filter((c) => c.temaId === idTema && !c.baneado).length;
  }
}
