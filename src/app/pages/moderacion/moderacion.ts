import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ForoRepository } from '../../repositories/foro.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { ErrorCampo } from '../../shared/error-campo/error-campo';

type Pestana = 'temas' | 'comentarios';
type Filtro = 'todos' | 'activos' | 'baneados';

// lo que el moderador esta por banear
interface Seleccion {
  tipo: Pestana;
  id: number;
  titulo: string;
}

@Component({
  selector: 'app-moderacion',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, ErrorCampo],
  templateUrl: './moderacion.html',
})
export class Moderacion {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly foro = inject(ForoRepository);
  private readonly usuarios = inject(UsuarioRepository);

  protected readonly pestana = signal<Pestana>('temas');
  protected readonly filtro = signal<Filtro>('todos');
  protected readonly seleccion = signal<Seleccion | null>(null);

  protected readonly formMotivo = this.fb.group({
    motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
  });

  protected readonly temas = computed(() =>
    this.foro
      .temas()
      .filter((t) => this.pasaFiltro(t.baneado))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
  );

  protected readonly comentarios = computed(() =>
    this.foro
      .comentarios()
      .filter((c) => this.pasaFiltro(c.baneado))
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
  );

  protected readonly totalBaneados = computed(
    () => this.foro.temas().filter((t) => t.baneado).length + this.foro.comentarios().filter((c) => c.baneado).length,
  );

  private pasaFiltro(baneado: boolean): boolean {
    const filtro = this.filtro();
    return filtro === 'todos' || (filtro === 'baneados' ? baneado : !baneado);
  }

  protected nombreAutor(id: number): string {
    return this.usuarios.buscarPorId(id)?.nombre ?? 'Usuario eliminado';
  }

  protected tituloTema(id: number): string {
    return this.foro.temas().find((t) => t.id === id)?.titulo ?? 'Tema eliminado';
  }

  protected cambiarPestana(pestana: Pestana): void {
    this.pestana.set(pestana);
    this.cancelar();
  }

  protected iniciarBaneo(tipo: Pestana, id: number, titulo: string): void {
    this.seleccion.set({ tipo, id, titulo });
    this.formMotivo.reset();
  }

  protected cancelar(): void {
    this.seleccion.set(null);
    this.formMotivo.reset();
  }

  protected confirmarBaneo(): void {
    const seleccion = this.seleccion();
    if (this.formMotivo.invalid || !seleccion) {
      this.formMotivo.markAllAsTouched();
      return;
    }
    const motivo = this.formMotivo.controls.motivo.value;
    if (seleccion.tipo === 'temas') {
      this.foro.moderarTema(seleccion.id, true, motivo);
    } else {
      this.foro.moderarComentario(seleccion.id, true, motivo);
    }
    this.cancelar();
  }

  protected restaurar(tipo: Pestana, id: number): void {
    if (tipo === 'temas') {
      this.foro.moderarTema(id, false, '');
    } else {
      this.foro.moderarComentario(id, false, '');
    }
  }
}
