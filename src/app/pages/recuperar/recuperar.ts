import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChecklistClave } from '../../shared/checklist-clave/checklist-clave';
import { ErrorCampo } from '../../shared/error-campo/error-campo';
import { camposIguales, claveSegura } from '../../validators/validadores';

@Component({
  selector: 'app-recuperar',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo, ChecklistClave],
  templateUrl: './recuperar.html',
})
export class Recuperar {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // paso 1: pedir el codigo  |  paso 2: ingresar codigo y nueva contrasena
  protected readonly paso = signal<1 | 2>(1);
  protected readonly error = signal('');
  protected readonly exito = signal(false);
  protected readonly codigoSimulado = signal('');

  protected readonly formCorreo = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
  });

  protected readonly formClave = this.fb.group(
    {
      codigo: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      clave: ['', [Validators.required, claveSegura]],
      confirmarClave: ['', [Validators.required]],
    },
    { validators: camposIguales('clave', 'confirmarClave') },
  );

  protected enviarCodigo(): void {
    if (this.formCorreo.invalid) {
      this.formCorreo.markAllAsTouched();
      return;
    }
    const codigo = this.auth.solicitarCodigo(this.formCorreo.controls.correo.value);
    if (!codigo) {
      this.error.set('No existe una cuenta registrada con ese correo');
      return;
    }
    this.error.set('');
    this.codigoSimulado.set(codigo);
    this.paso.set(2);
  }

  protected cambiarClave(): void {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }
    const { codigo, clave } = this.formClave.getRawValue();
    const mensaje = this.auth.restablecerClave(this.formCorreo.controls.correo.value, codigo, clave);
    if (mensaje) {
      this.error.set(mensaje);
      return;
    }
    this.error.set('');
    this.exito.set(true);
    setTimeout(() => this.router.navigate(['/login']), 2200);
  }

  protected volver(): void {
    this.paso.set(1);
    this.error.set('');
  }
}
