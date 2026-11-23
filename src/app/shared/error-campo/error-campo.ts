import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

// Muestra el mensaje de error de un campo cuando ya fue tocado y es invalido.
// Uso: <app-error-campo [control]="form.controls.correo" [mensajes]="{ required: 'Obligatorio' }" />
@Component({
  selector: 'app-error-campo',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (mensaje(); as texto) {
      <div class="invalid-feedback d-block">{{ texto }}</div>
    }
  `,
})
export class ErrorCampo {
  readonly control = input.required<AbstractControl>();
  readonly mensajes = input.required<Record<string, string>>();

  // no es computed a proposito: el estado del control cambia sin que cambie ningun signal
  mensaje(): string | null {
    const control = this.control();
    if (!control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    const errores = control.errors ?? {};
    const mensajes = this.mensajes();
    const clave = Object.keys(errores).find((k) => mensajes[k]);
    return clave ? mensajes[clave] : null;
  }
}
