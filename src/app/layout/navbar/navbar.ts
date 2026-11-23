import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { claseRol, colorAvatar, iniciales } from '../../utils/ui';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class Navbar {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly abierto = signal(false);

  protected readonly claseRol = claseRol;
  protected readonly iniciales = iniciales;
  protected readonly colorAvatar = colorAvatar;

  protected alternar(): void {
    this.abierto.update((v) => !v);
  }

  protected cerrar(): void {
    this.abierto.set(false);
  }

  protected salir(): void {
    this.auth.logout();
    this.cerrar();
    this.router.navigate(['/login']);
  }
}
