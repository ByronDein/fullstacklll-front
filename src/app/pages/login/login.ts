import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ErrorCampo } from '../../shared/error-campo/error-campo';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ErrorCampo],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]],
  });

  protected readonly error = signal('');
  protected readonly verClave = signal(false);

  // cuentas de ejemplo para probar los distintos roles
  protected readonly cuentasPrueba = [
    { rol: 'ADMIN', correo: 'byron@foro.cl', clave: 'admin123' },
    { rol: 'MODERADOR', correo: 'camila@foro.cl', clave: 'mod123' },
    { rol: 'USUARIO', correo: 'matias@foro.cl', clave: 'user123' },
  ];

  protected usarCuenta(correo: string, clave: string): void {
    this.form.setValue({ correo, clave });
    this.error.set('');
  }

  protected ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { correo, clave } = this.form.getRawValue();
    const mensaje = this.auth.login(correo, clave);
    if (mensaje) {
      this.error.set(mensaje);
      return;
    }
    this.router.navigate(['/inicio']);
  }
}
