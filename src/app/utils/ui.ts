import { RolNombre } from '../models/modelos';

// Clase de Bootstrap segun el rol (para las etiquetas de colores)
export function claseRol(rol: RolNombre): string {
  switch (rol) {
    case 'ADMIN':
      return 'text-bg-danger';
    case 'MODERADOR':
      return 'text-bg-warning';
    default:
      return 'text-bg-secondary';
  }
}

// Iniciales para el avatar (ej: "Byron Gonzalez" -> "BG")
export function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/);
  const primera = partes[0]?.charAt(0) ?? '?';
  const segunda = partes.length > 1 ? partes[1].charAt(0) : '';
  return (primera + segunda).toUpperCase();
}

const COLORES_AVATAR = ['#4f46e5', '#e11d48', '#16a34a', '#d97706', '#0891b2', '#9333ea'];

export function colorAvatar(id: number): string {
  return COLORES_AVATAR[id % COLORES_AVATAR.length];
}
