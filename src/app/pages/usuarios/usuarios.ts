import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RolNombre } from '../../models/modelos';
import { UsuarioRepository } from '../../repositories/usuario.repository';
import { AuthService } from '../../services/auth.service';
import { claseRol, colorAvatar, iniciales } from '../../utils/ui';

@Component({
  selector: 'app-usuarios',
  imports: [DatePipe],
  templateUrl: './usuarios.html',
})
export class Usuarios {
  private readonly repo = inject(UsuarioRepository);
  protected readonly auth = inject(AuthService);

  protected readonly usuarios = this.repo.usuarios;
  protected readonly roles: RolNombre[] = ['USUARIO', 'MODERADOR', 'ADMIN'];

  // id del usuario que se esta por eliminar (pide confirmacion)
  protected readonly porEliminar = signal<number | null>(null);

  protected readonly claseRol = claseRol;
  protected readonly iniciales = iniciales;
  protected readonly colorAvatar = colorAvatar;

  protected cambiarRol(id: number, evento: Event): void {
    const rol = (evento.target as HTMLSelectElement).value as RolNombre;
    this.repo.actualizar(id, { rol });
  }

  protected alternarActivo(id: number, activo: boolean): void {
    this.repo.actualizar(id, { activo: !activo });
  }

  protected confirmarEliminar(id: number): void {
    this.repo.eliminar(id);
    this.porEliminar.set(null);
  }
}
