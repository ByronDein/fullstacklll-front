import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RolNombre } from '../models/modelos';
import { AuthService } from '../services/auth.service';

// Solo deja pasar a usuarios que iniciaron sesion
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.logueado() ? true : router.createUrlTree(['/login']);
};

// Solo deja pasar a ciertos roles (ej: moderacion = MODERADOR y ADMIN)
export function rolGuard(roles: RolNombre[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const usuario = auth.usuarioActual();
    if (!usuario) {
      return router.createUrlTree(['/login']);
    }
    return roles.includes(usuario.rol) ? true : router.createUrlTree(['/inicio']);
  };
}

// Si ya inicio sesion, no tiene sentido mostrar login/registro
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.logueado() ? router.createUrlTree(['/inicio']) : true;
};
