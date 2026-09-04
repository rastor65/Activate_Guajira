import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';

import { HttpCacheService, SIN_CACHE } from '../cache/http-cache.service';
import { familiaDe } from '../cache/cache-config';
import { environment } from 'src/environments/environment';

/**
 * Cache-aside para todas las vistas.
 *
 * Cada GET a la API pasa antes por el almacen: si hay una respuesta vigente se
 * entrega sin tocar el servidor, y si no, se pide y se guarda. Las escrituras
 * invalidan lo que dejan obsoleto, de modo que entrar de nuevo a una vista solo
 * cuesta lo que haya cambiado.
 *
 * La respuesta se emite una unica vez, venga de donde venga: para el componente
 * que la pidio no hay diferencia entre un acierto y una llamada real.
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cache: HttpCacheService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Solo la API propia: un CDN o un servicio externo no es cosa nuestra.
    if (!request.url.startsWith(environment.API_URI)) {
      return next.handle(request);
    }

    const ruta = this.rutaDe(request.urlWithParams);

    if (request.method !== 'GET') {
      return next.handle(request).pipe(
        tap(evento => {
          // Solo cuenta si el servidor confirmo el cambio: ante un error la
          // copia guardada sigue siendo la buena.
          if (evento instanceof HttpResponse) {
            this.cache.invalidarPorEscritura(ruta);
          }
        })
      );
    }

    const omitir = request.context.get(SIN_CACHE);
    if (omitir || request.responseType !== 'json' || !familiaDe(ruta)) {
      // Un "Recargar" explicito tambien renueva la copia guardada.
      return next.handle(request).pipe(
        tap(evento => {
          if (omitir && evento instanceof HttpResponse) {
            this.cache.guardar(ruta, ruta, evento.body);
          }
        })
      );
    }

    const guardado = this.cache.leer(ruta);
    if (guardado !== undefined) {
      return of(new HttpResponse({ body: guardado, status: 200, url: request.url }));
    }

    // Dos vistas que arrancan a la vez comparten la misma llamada en lugar de
    // pedir dos veces la misma lista.
    const enCurso = this.cache.enCurso(ruta) as Observable<HttpEvent<unknown>> | undefined;
    if (enCurso) {
      return enCurso;
    }

    const peticion = next.handle(request).pipe(
      tap(evento => {
        if (evento instanceof HttpResponse) {
          this.cache.guardar(ruta, ruta, evento.body);
        }
      }),
      finalize(() => this.cache.terminarEnCurso(ruta)),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    this.cache.registrarEnCurso(ruta, peticion);
    return peticion;
  }

  /** Ruta con sus parametros, sin el origen: es la clave del almacen. */
  private rutaDe(url: string): string {
    return url.slice(environment.API_URI.length) || '/';
  }
}
