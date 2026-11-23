import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForoRepository } from '../../repositories/foro.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly auth = inject(AuthService);
  private readonly foro = inject(ForoRepository);
  private readonly usuarios = inject(UsuarioRepository);

  protected readonly categorias = this.foro.categorias;

  // buscador de temas
  protected readonly buscador = new FormControl('', { nonNullable: true });
  private readonly texto = toSignal(this.buscador.valueChanges, { initialValue: '' });

  // temas visibles (los baneados no se muestran en las listas)
  private readonly temasVisibles = computed(() => this.foro.temas().filter((t) => !t.baneado));

  protected readonly temasPorCategoria = computed(() => {
    const conteo = new Map<number, number>();
    for (const tema of this.temasVisibles()) {
      conteo.set(tema.categoriaId, (conteo.get(tema.categoriaId) ?? 0) + 1);
    }
    return conteo;
  });

  protected readonly buscando = computed(() => this.texto().trim().length > 0);

  protected readonly temas = computed(() => {
    const texto = this.texto().trim().toLowerCase();
    const ordenados = [...this.temasVisibles()].sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    if (!texto) {
      return ordenados.slice(0, 6);
    }
    return ordenados.filter(
      (t) => t.titulo.toLowerCase().includes(texto) || t.contenido.toLowerCase().includes(texto),
    );
  });

  protected readonly totalTemas = computed(() => this.temasVisibles().length);
  protected readonly totalComentarios = computed(() => this.foro.comentarios().filter((c) => !c.baneado).length);
  protected readonly totalUsuarios = computed(() => this.usuarios.usuarios().length);

  protected nombreAutor(id: number): string {
    return this.usuarios.buscarPorId(id)?.nombre ?? 'Usuario eliminado';
  }

  protected nombreCategoria(id: number): string {
    return this.categorias().find((c) => c.id === id)?.nombre ?? '';
  }

  protected cantidadComentarios(idTema: number): number {
    return this.foro.comentarios().filter((c) => c.temaId === idTema && !c.baneado).length;
  }
}
