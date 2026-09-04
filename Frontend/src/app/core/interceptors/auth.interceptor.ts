import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpCacheService } from '../cache/http-cache.service';

/**
 * Adjunta el token a cada peticion a la API y centraliza el 401.
 *
 * Antes cada servicio armaba su propia cabecera: unos mandaban Bearer, otros
 * no, y un token invalido se traducia en listas vacias sin explicacion. Con
 * esto la autenticacion deja de depender de que cada llamada se acuerde.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private cache: HttpCacheService,
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    // Solo se adjunta si hay token real: enviar "Bearer null" provoca un 401
    // donde la peticion anonima habria funcionado.
    if (token && token !== 'null' && token !== 'undefined' && !request.headers.has('Authorization')) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // La sesion caduco: limpiar y volver al login, en vez de dejar la
          // interfaz mostrando datos vacios como si no hubiera nada. El cache
          // se va con ella: son datos de una sesion que ya no vale.
          this.cache.limpiar();
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('menu');
          this.router.navigateByUrl('/login');
        }
        return throwError(() => error);
      })
    );
  }
}
