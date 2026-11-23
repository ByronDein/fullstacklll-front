import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AuthService } from '../../services/auth.service';
import { ChecklistClave } from '../../shared/checklist-clave/checklist-clave';
import { ErrorCampo } from '../../shared/error-campo/error-campo';
import { camposIguales, claveSegura, correoDisponible, SOLO_LETRAS } from '../../validators/validadores';

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo, ChecklistClave],
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly repo = inject(UsuarioRepository);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(SOLO_LETRAS)]],
      correo: ['', [Validators.required, Validators.email, correoDisponible(this.repo)]],
      clave: ['', [Validators.required, claveSegura]],
      confirmarClave: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]],
    },
    { validators: camposIguales('clave', 'confirmarClave') },
  );

  protected readonly verClave = signal(false);

  protected registrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, correo, clave } = this.form.getRawValue();
    this.auth.registrar(nombre, correo, clave);
    this.router.navigate(['/inicio']);
  }
}
