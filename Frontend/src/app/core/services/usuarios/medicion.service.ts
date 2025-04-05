import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Medicion } from 'src/app/models/medicion';

@Injectable({
  providedIn: 'root'
})

export class MedicionService {
  API_URI = environment.API_URI;

  base_medicion = `${this.API_URI}/medicion/medicion/`;
  base_medicion_usuario = `${this.API_URI}/medicion/medicion/mis-mediciones/`;
  base_medicion_x_usuario = `${this.API_URI}/medicion/mis-mediciones/`;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////
  // MEDICION
  crearMedicion(data: any): Observable<any> {
    return this.http.post(this.base_medicion, data);
  }

  obtenerMediciones(): Observable<any> {
    return this.http.get<any[]>(this.base_medicion);
  }

  agregarMedicion(medicion: any): Observable<any> {
    return this.http.post<any>(`${this.base_medicion}`, medicion);
  }

  actualizarMedicion(id: number, medicion: any): Observable<any> {
    return this.http.put<any>(`${this.base_medicion}${id}/`, medicion);
  }

  eliminarMedicion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.base_medicion}${id}/`);
  }

  obtenerMedicionesPorUsuario(userId: number): Observable<Medicion[]> {
    return this.http.get<Medicion[]>(`${this.base_medicion_x_usuario}${userId}/`, { headers: this.getHeaders() });
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////
}