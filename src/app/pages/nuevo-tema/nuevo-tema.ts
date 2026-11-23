import { Component, inject, input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ForoRepository } from '../../repositories/foro.repository';
import { AuthService } from '../../services/auth.service';
import { ErrorCampo } from '../../shared/error-campo/error-campo';

@Component({
  selector: 'app-nuevo-tema',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo],
  templateUrl: './nuevo-tema.html',
})
export class NuevoTema implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly foro = inject(ForoRepository);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // viene de la URL: /nuevo-tema?categoria=2
  readonly categoria = input<string>();

  protected readonly categorias = this.foro.categorias;

  protected readonly form = this.fb.group({
    categoriaId: [0, [Validators.min(1)]],
    titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    contenido: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
  });

  ngOnInit(): void {
    const id = Number(this.categoria());
    if (id) {
      this.form.controls.categoriaId.setValue(id);
    }
  }

  protected publicar(): void {
    const usuario = this.auth.usuarioActual();
    if (this.form.invalid || !usuario) {
      this.form.markAllAsTouched();
      return;
    }
    const { categoriaId, titulo, contenido } = this.form.getRawValue();
    const tema = this.foro.crearTema({ categoriaId: Number(categoriaId), titulo, contenido, autorId: usuario.id });
    this.router.navigate(['/tema', tema.id]);
  }
}
