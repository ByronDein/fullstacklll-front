import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForoRepository } from '../../repositories/foro.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AuthService } from '../../services/auth.service';
import { ErrorCampo } from '../../shared/error-campo/error-campo';
import { claseRol, colorAvatar, iniciales } from '../../utils/ui';

@Component({
  selector: 'app-tema-detalle',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, ErrorCampo],
  templateUrl: './tema-detalle.html',
})
export class TemaDetalle {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly foro = inject(ForoRepository);
  private readonly usuarios = inject(UsuarioRepository);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  // viene de la ruta /tema/:id
  readonly id = input.required<string>();

  protected readonly claseRol = claseRol;
  protected readonly iniciales = iniciales;
  protected readonly colorAvatar = colorAvatar;

  protected readonly tema = computed(() => this.foro.temas().find((t) => t.id === Number(this.id())));

  protected readonly categoria = computed(() => {
    const tema = this.tema();
    return tema ? this.foro.categorias().find((c) => c.id === tema.categoriaId) : undefined;
  });

  protected readonly comentarios = computed(() =>
    this.foro
      .comentarios()
      .filter((c) => c.temaId === Number(this.id()))
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime()),
  );

  protected readonly formComentario = this.fb.group({
    contenido: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
  });

  protected autor(id: number) {
    return this.usuarios.buscarPorId(id);
  }

  // el autor o un administrador pueden borrar
  protected puedeBorrar(autorId: number): boolean {
    const usuario = this.auth.usuarioActual();
    return !!usuario && (usuario.id === autorId || usuario.rol === 'ADMIN');
  }

  protected comentar(): void {
    const tema = this.tema();
    const usuario = this.auth.usuarioActual();
    if (this.formComentario.invalid || !tema || !usuario) {
      this.formComentario.markAllAsTouched();
      return;
    }
    this.foro.crearComentario({
      temaId: tema.id,
      autorId: usuario.id,
      contenido: this.formComentario.controls.contenido.value,
    });
    this.formComentario.reset();
  }

  protected borrarComentario(id: number): void {
    this.foro.eliminarComentario(id);
  }

  protected borrarTema(): void {
    const tema = this.tema();
    if (tema) {
      this.foro.eliminarTema(tema.id);
      this.router.navigate(['/categoria', tema.categoriaId]);
    }
  }
}
