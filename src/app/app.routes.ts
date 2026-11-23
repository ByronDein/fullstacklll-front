import { Routes } from '@angular/router';
import { authGuard, invitadoGuard, rolGuard } from './guards/guards';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Recuperar } from './pages/recuperar/recuperar';
import { Perfil } from './pages/perfil/perfil';
import { Inicio } from './pages/inicio/inicio';
import { Categoria } from './pages/categoria/categoria';
import { TemaDetalle } from './pages/tema-detalle/tema-detalle';
import { NuevoTema } from './pages/nuevo-tema/nuevo-tema';
import { Moderacion } from './pages/moderacion/moderacion';
import { Usuarios } from './pages/usuarios/usuarios';
import { NoEncontrado } from './pages/no-encontrado/no-encontrado';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Paginas publicas (solo para quien NO ha iniciado sesion)
  { path: 'login', component: Login, canActivate: [invitadoGuard], title: 'Iniciar sesión · ForoNova' },
  { path: 'registro', component: Registro, canActivate: [invitadoGuard], title: 'Crear cuenta · ForoNova' },
  { path: 'recuperar', component: Recuperar, canActivate: [invitadoGuard], title: 'Recuperar contraseña · ForoNova' },

  // Paginas para usuarios con sesion
  { path: 'inicio', component: Inicio, canActivate: [authGuard], title: 'Inicio · ForoNova' },
  { path: 'categoria/:id', component: Categoria, canActivate: [authGuard], title: 'Categoría · ForoNova' },
  { path: 'tema/:id', component: TemaDetalle, canActivate: [authGuard], title: 'Tema · ForoNova' },
  { path: 'nuevo-tema', component: NuevoTema, canActivate: [authGuard], title: 'Nuevo tema · ForoNova' },
  { path: 'perfil', component: Perfil, canActivate: [authGuard], title: 'Mi perfil · ForoNova' },

  // Paginas segun el rol
  { path: 'moderacion', component: Moderacion, canActivate: [rolGuard(['MODERADOR', 'ADMIN'])], title: 'Moderación · ForoNova' },
  { path: 'usuarios', component: Usuarios, canActivate: [rolGuard(['ADMIN'])], title: 'Usuarios · ForoNova' },

  { path: '**', component: NoEncontrado, title: 'No encontrado · ForoNova' },
];
