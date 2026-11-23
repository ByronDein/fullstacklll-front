import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { reglasClave } from '../../validators/validadores';

// Lista en vivo de las reglas de seguridad de la contrasena
@Component({
  selector: 'app-checklist-clave',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <ul class="list-unstyled small mb-0 mt-2">
      @for (regla of reglas(); track regla.texto) {
        <li [class]="regla.cumple ? 'text-success' : 'text-muted'">
          <i class="bi me-1" [class.bi-check-circle-fill]="regla.cumple" [class.bi-circle]="!regla.cumple"></i>
          {{ regla.texto }}
        </li>
      }
    </ul>
  `,
})
export class ChecklistClave {
  readonly valor = input<string>('');
  readonly reglas = computed(() => reglasClave(this.valor() ?? ''));
}
