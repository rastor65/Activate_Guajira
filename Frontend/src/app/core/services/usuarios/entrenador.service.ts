import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medicion } from 'src/app/models/medicion';

@Injectable({
  providedIn: 'root'
})

export class EntrenadorService {
  API_URI = environment.API_URI;

  base_entrenamiento = `${this.API_URI}/entrenamiento/entrenamientos/`;
  base_alimentacion = `${this.API_URI}/alimentacion/alimentaciones/`;

  constructor(private http: HttpClient) { }

  getEntrenamientos(): Observable<any> {
    return this.http.get<any>(this.base_entrenamiento);
  }
  
  getEntrenamientosPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.base_entrenamiento}usuario/${usuarioId}/`);
  }

  createEntrenamiento(data: any): Observable<any> {
    return this.http.post<any>(this.base_entrenamiento, data);
  }

  updateEntrenamiento(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base_entrenamiento}${id}/`, data);
  }

  deleteEntrenamiento(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_entrenamiento}${id}/`);
  }

  getAlimentaciones(): Observable<any> {
    return this.http.get<any>(this.base_alimentacion);
  }

  getAlimentacionesPorUsuario(usuarioId: number): Observable<any> {
    return this.http.get<any>(`${this.base_alimentacion}usuario/${usuarioId}/`);
  }

  getOneAlimentacion(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_alimentacion}${id}/`);
  }

  getOneEntrenamiento(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_entrenamiento}${id}/`);
  }

  createAlimentacion(data: any): Observable<any> {
    return this.http.post<any>(this.base_alimentacion, data);
  }

  updateAlimentacion(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.base_alimentacion}${id}/`, data);
  }

  deleteAlimentacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_alimentacion}${id}/`);
  }

}
