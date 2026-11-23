import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { ForoRepository } from './repositories/foro.repository';
import { ForoMemoriaRepository } from './repositories/foro-memoria.repository';
import { UsuarioRepository } from './repositories/usuario.repository';
import { UsuarioMemoriaRepository } from './repositories/usuario-memoria.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),

    // PATRON REPOSITORY: aqui se elige donde viven los datos.
    // Ahora usan arreglos en memoria. Para conectar con los microservicios solo hay que
    // cambiar estas dos lineas por repositorios que usen HttpClient.
    { provide: UsuarioRepository, useClass: UsuarioMemoriaRepository },
    { provide: ForoRepository, useClass: ForoMemoriaRepository },
  ],
};
