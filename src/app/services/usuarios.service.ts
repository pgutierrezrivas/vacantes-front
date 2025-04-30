import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = `${environment.apiUrlPublic}/users`; // Asegúrate de tener un endpoint para obtener todos los usuarios

  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(users => {
        // Opcional: Puedes realizar alguna transformación en los datos aquí si es necesario
        return users.map(user => ({
          ...user,
          fecha_Registro: new Date(user.fecha_Registro), // Asegúrate de que la fecha se convierta a Date
          enabled: user.enabled ? 1 : 0, // Ensure 'enabled' remains a number (1 for true, 0 for false)
        }));
      }),
      catchError((error) => {
        console.error('Error fetching usuarios:', error);
        return of([]); // Devuelve un array vacío en caso de error para que la aplicación no se rompa
      })
    );
  }

  // Puedes agregar otros métodos para obtener usuarios por ID, crear, actualizar, eliminar, etc.
  // Ejemplo para obtener un usuario por ID:
  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0, // Ensure 'enabled' is a number (1 for true, 0 for false)
      })),
      catchError((error) => {
        console.error(`Error fetching usuario with ID ${id}:`, error);
        return of(undefined);
      })
    );
  }
}