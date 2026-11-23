// Modelos del foro. Tienen los mismos campos que las entidades de los microservicios
// (usuarios-service y foro-service) para que despues sea facil conectarlos.

export type RolNombre = 'USUARIO' | 'MODERADOR' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  clave: string;
  rol: RolNombre;
  activo: boolean;
  fechaRegistro: Date;
  biografia: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  icono: string; // clase de bootstrap-icons
  color: string;
}

export interface Tema {
  id: number;
  titulo: string;
  contenido: string;
  autorId: number;
  categoriaId: number;
  fecha: Date;
  baneado: boolean;
  motivoBan: string;
}

export interface Comentario {
  id: number;
  temaId: number;
  autorId: number;
  contenido: string;
  fecha: Date;
  baneado: boolean;
  motivoBan: string;
}
