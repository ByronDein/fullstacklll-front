import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-encontrado',
  imports: [RouterLink],
  template: `
    <div class="text-center py-5">
      <div class="display-1 fw-bold text-primary">404</div>
      <h1 class="h4 mb-3">Esta página no existe</h1>
      <p class="text-muted">Quizás el enlace está mal escrito o el contenido fue eliminado.</p>
      <a routerLink="/inicio" class="btn btn-primary">Volver al inicio</a>
    </div>
  `,
})
export class NoEncontrado {}
