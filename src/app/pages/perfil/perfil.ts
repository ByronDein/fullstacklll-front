import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ForoRepository } from '../../repositories/foro.repository';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AuthService } from '../../services/auth.service';
import { ChecklistClave } from '../../shared/checklist-clave/checklist-clave';
import { ErrorCampo } from '../../shared/error-campo/error-campo';
import { claseRol, colorAvatar, iniciales } from '../../utils/ui';
import { camposIguales, claveSegura, correoDisponible, SOLO_LETRAS } from '../../validators/validadores';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, ErrorCampo, ChecklistClave, DatePipe],
  templateUrl: './perfil.html',
})
export class Perfil {
  private readonly fb = inject(NonNullableFormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly usuarios = inject(UsuarioRepository);
  private readonly foro = inject(ForoRepository);

  protected readonly claseRol = claseRol;
  protected readonly iniciales = iniciales;
  protected readonly colorAvatar = colorAvatar;

  protected readonly mensajePerfil = signal('');
  protected readonly mensajeClave = signal('');
  protected readonly errorClave = signal('');

  // estadisticas del usuario
  protected readonly totalTemas = computed(
    () => this.foro.temas().filter((t) => t.autorId === this.auth.usuarioActual()?.id).length,
  );
  protected readonly totalComentarios = computed(
    () => this.foro.comentarios().filter((c) => c.autorId === this.auth.usuarioActual()?.id).length,
  );

  private readonly usuario = this.auth.usuarioActual();

  protected readonly formPerfil = this.fb.group({
    nombre: [this.usuario?.nombre ?? '', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(SOLO_LETRAS)]],
    correo: [
      this.usuario?.correo ?? '',
      [Validators.required, Validators.email, correoDisponible(this.usuarios, () => this.auth.usuarioActual()?.id ?? null)],
    ],
    biografia: [this.usuario?.biografia ?? '', [Validators.maxLength(200)]],
  });

  protected readonly formClave = this.fb.group(
    {
      claveActual: ['', [Validators.required]],
      clave: ['', [Validators.required, claveSegura]],
      confirmarClave: ['', [Validators.required]],
    },
    { validators: camposIguales('clave', 'confirmarClave') },
  );

  protected guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }
    this.auth.actualizarPerfil(this.formPerfil.getRawValue());
    this.mensajePerfil.set('Tus datos se guardaron correctamente');
    setTimeout(() => this.mensajePerfil.set(''), 3000);
  }

  protected cambiarClave(): void {
    if (this.formClave.invalid) {
      this.formClave.markAllAsTouched();
      return;
    }
    const { claveActual, clave } = this.formClave.getRawValue();
    const error = this.auth.cambiarClave(claveActual, clave);
    if (error) {
      this.errorClave.set(error);
      this.mensajeClave.set('');
      return;
    }
    this.errorClave.set('');
    this.mensajeClave.set('Tu contraseña se actualizó correctamente');
    this.formClave.reset();
    setTimeout(() => this.mensajeClave.set(''), 3000);
  }
}
