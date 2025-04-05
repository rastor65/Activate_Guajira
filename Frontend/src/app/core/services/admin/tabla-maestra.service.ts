import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablaMaestraService {
  API_URI = environment.API_URI;
  base_maestra = `${this.API_URI}/tabla_maestra/tabla-maestra/`;
  base_categoria = `${this.API_URI}/categoria_tipo/categoria-tipo/`;

  constructor(private http: HttpClient) { }

  // TABLA MAESTRA

  // Obtener todos los registros
  getAllMaestra(): Observable<any[]> {
    return this.http.get<any[]>(this.base_maestra);
  }

  // Obtener un solo registro por ID
  getByIdMaestra(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_maestra}${id}/`);
  }

  // Agregar un nuevo registro
  addMaestra(data: any): Observable<any> {
    return this.http.post(this.base_maestra, data);
  }

  // Editar un registro existente
  updateMaestra(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base_maestra}${id}/`, data);
  }

  // Eliminar un registro
  deleteMaestra(id: number): Observable<any> {
    return this.http.delete(`${this.base_maestra}${id}/`);
  }

  // CATEGORIA
  
  // Obtener todos los registros
  getAllCategoria(): Observable<any[]> {
    return this.http.get<any[]>(this.base_categoria);
  }

  // Obtener un solo registro por ID
  getByIdCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${this.base_categoria}${id}/`);
  }

  // Agregar un nuevo registro
  addCategoria(data: any): Observable<any> {
    return this.http.post(this.base_categoria, data);
  }

  // Editar un registro existente
  updateCategoria(id: number, data: any): Observable<any> {
    return this.http.put(`${this.base_categoria}${id}/`, data);
  }

  // Eliminar un registro
  deleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.base_categoria}${id}/`);
  }

}
