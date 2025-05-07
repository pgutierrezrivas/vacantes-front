import { inject, Injectable } from '@angular/core';
import { CATEGORIAS_DB } from '../db/categorias.db';
import { Categoria } from '../interfaces/categoria';
import { environment } from '../enviroments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

//private apiUrl = `${environment.apiUrl}/categorias`;
private apiUrl = '/categorias';

private http: HttpClient = inject(HttpClient);

  constructor() { }

  getAllCategorias(): Observable <Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/todos`);
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`)
  }

  crearCategoria(categoriaActual: Categoria): Observable<Categoria>{
    return this.http.post<Categoria>(`${this.apiUrl}`, categoriaActual);
  }
  actualizarCategoria(categoriaActual: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}`, categoriaActual);
  }

  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete<Categoria>(`${this.apiUrl}/${id}`);
  }

}
