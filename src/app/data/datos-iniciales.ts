import { Categoria, Comentario, Tema, Usuario } from '../models/modelos';

// Datos de ejemplo. Todo vive en arreglos (no hay conexion con el backend en esta etapa).

const fecha = (dia: number, hora = 12) => new Date(2026, 10, dia, hora, 0);

export const USUARIOS_INICIALES: Usuario[] = [
  { id: 1, nombre: 'Byron Gonzalez', correo: 'byron@foro.cl', clave: 'admin123', rol: 'ADMIN', activo: true, fechaRegistro: fecha(1), biografia: 'Administrador del foro. Me gusta la programación y el café.' },
  { id: 2, nombre: 'Camila Rojas', correo: 'camila@foro.cl', clave: 'mod123', rol: 'MODERADOR', activo: true, fechaRegistro: fecha(2), biografia: 'Moderadora. Cuido que todos respetemos las normas.' },
  { id: 3, nombre: 'Matias Soto', correo: 'matias@foro.cl', clave: 'user123', rol: 'USUARIO', activo: true, fechaRegistro: fecha(3), biografia: 'Estudiante de programación.' },
  { id: 4, nombre: 'Valentina Perez', correo: 'valentina@foro.cl', clave: 'user123', rol: 'USUARIO', activo: true, fechaRegistro: fecha(4), biografia: 'Fan del cine y los videojuegos indie.' },
];

export const CATEGORIAS_INICIALES: Categoria[] = [
  { id: 1, nombre: 'Tecnología', descripcion: 'Noticias, programación y gadgets', icono: 'bi-cpu', color: '#4f46e5' },
  { id: 2, nombre: 'Videojuegos', descripcion: 'Todo sobre consolas y juegos de PC', icono: 'bi-controller', color: '#e11d48' },
  { id: 3, nombre: 'Deportes', descripcion: 'Fútbol, tenis y más', icono: 'bi-trophy', color: '#16a34a' },
  { id: 4, nombre: 'Música', descripcion: 'Artistas, discos y conciertos', icono: 'bi-music-note-beamed', color: '#d97706' },
  { id: 5, nombre: 'Cine y Series', descripcion: 'Estrenos, críticas y recomendaciones', icono: 'bi-film', color: '#0891b2' },
];

export const TEMAS_INICIALES: Tema[] = [
  { id: 1, titulo: '¿Cuál es el mejor lenguaje para aprender backend?', contenido: 'Estoy partiendo en programación y no sé si irme por Java, Python o Node. ¿Qué me recomiendan para conseguir trabajo?', autorId: 3, categoriaId: 1, fecha: fecha(10, 9), baneado: false, motivoBan: '' },
  { id: 2, titulo: 'Angular vs React para un proyecto de estudio', contenido: 'Tengo que hacer un proyecto para la universidad y dudo entre Angular y React. ¿Cuál es más fácil de partir?', autorId: 4, categoriaId: 1, fecha: fecha(12, 18), baneado: false, motivoBan: '' },
  { id: 3, titulo: '¿Qué juegos recomiendan para este fin de semana?', contenido: 'Busco algo para jugar con amigos, de preferencia cooperativo y que no sea muy largo.', autorId: 2, categoriaId: 2, fecha: fecha(13, 20), baneado: false, motivoBan: '' },
  { id: 4, titulo: 'Los mejores juegos indie del año', contenido: 'Este año salieron varios juegos independientes muy buenos. Comparto mi lista y me cuentan la suya.', autorId: 4, categoriaId: 2, fecha: fecha(15, 11), baneado: false, motivoBan: '' },
  { id: 5, titulo: 'Predicción para la fecha del campeonato', contenido: '¿Quién creen que va a ganar el clásico este fin de semana? Yo apuesto por el local.', autorId: 1, categoriaId: 3, fecha: fecha(16, 10), baneado: false, motivoBan: '' },
  { id: 6, titulo: 'Discos que no pueden faltar en tu playlist', contenido: 'Vamos a armar una lista colaborativa con los discos que todos deberíamos escuchar al menos una vez.', autorId: 3, categoriaId: 4, fecha: fecha(17, 16), baneado: false, motivoBan: '' },
  { id: 7, titulo: 'Series para maratonear en vacaciones', contenido: 'Se vienen las vacaciones y necesito series buenas, de pocas temporadas. ¡Recomienden!', autorId: 4, categoriaId: 5, fecha: fecha(18, 19), baneado: false, motivoBan: '' },
  { id: 8, titulo: 'Gana dinero fácil, entra a este enlace', contenido: 'Entra a mi página y gana dinero sin hacer nada, solo deposita tus datos.', autorId: 3, categoriaId: 5, fecha: fecha(19, 8), baneado: true, motivoBan: 'Spam y publicidad engañosa' },
];

export const COMENTARIOS_INICIALES: Comentario[] = [
  { id: 1, temaId: 1, autorId: 1, contenido: 'Yo te recomiendo Java con Spring Boot, se usa harto en empresas y hay mucho trabajo.', fecha: fecha(10, 11), baneado: false, motivoBan: '' },
  { id: 2, temaId: 1, autorId: 4, contenido: 'Python es más fácil para partir, pero Java te ordena mejor la cabeza.', fecha: fecha(10, 14), baneado: false, motivoBan: '' },
  { id: 3, temaId: 2, autorId: 3, contenido: 'Angular trae todo incluido (rutas, formularios), para un proyecto de la U es muy cómodo.', fecha: fecha(13, 9), baneado: false, motivoBan: '' },
  { id: 4, temaId: 3, autorId: 3, contenido: 'Prueba It Takes Two, es muy bueno para jugar de a dos.', fecha: fecha(14, 12), baneado: false, motivoBan: '' },
  { id: 5, temaId: 3, autorId: 4, contenido: 'También Overcooked, aunque puede terminar en pelea de amigos jaja.', fecha: fecha(14, 15), baneado: false, motivoBan: '' },
  { id: 6, temaId: 4, autorId: 2, contenido: 'Hollow Knight sigue siendo de mis favoritos, aunque no sea de este año.', fecha: fecha(15, 13), baneado: false, motivoBan: '' },
  { id: 7, temaId: 5, autorId: 2, contenido: 'Yo creo que gana el local, juega mucho mejor en casa.', fecha: fecha(16, 12), baneado: false, motivoBan: '' },
  { id: 8, temaId: 5, autorId: 3, contenido: 'Tonto el que no apueste por el visitante, viene en racha.', fecha: fecha(16, 13), baneado: true, motivoBan: 'Falta de respeto hacia otros usuarios' },
  { id: 9, temaId: 6, autorId: 4, contenido: 'Dark Side of the Moon es obligatorio.', fecha: fecha(17, 18), baneado: false, motivoBan: '' },
  { id: 10, temaId: 7, autorId: 1, contenido: 'Breaking Bad, aunque ya la debes haber visto.', fecha: fecha(18, 21), baneado: false, motivoBan: '' },
  { id: 11, temaId: 7, autorId: 3, contenido: 'Chernobyl, es corta y muy buena.', fecha: fecha(19, 10), baneado: false, motivoBan: '' },
];
