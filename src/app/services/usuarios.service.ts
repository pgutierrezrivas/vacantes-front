import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../enviroments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiUrl = `${environment.apiUrl}/usuarios`;
  private http: HttpClient = inject(HttpClient);

  constructor() { }

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/todos`).pipe(
      map(users => {
        return users.map(user => ({
          ...user,
          // Safe date parsing with error handling
          fecha_Registro: this.parsearDatosDeManeraSegura(user.fecha_Registro),
          enabled: user.enabled ? 1 : 0, // (1 true, 0 false)
        }));
      }),
      catchError((error) => {
        console.error('Error fetching usuarios:', error);
        return of([]);
      })
    );
  }

  private parsearDatosDeManeraSegura(dateStr: any): Date {
    if (!dateStr) return new Date(); // Default to today if no date
    
    try {
      const parsed = new Date(dateStr);
      // Check if the date is valid
      if (isNaN(parsed.getTime())) {
        console.warn(`Invalid date format: ${dateStr}, using current date`);
        return new Date();
      }
      return parsed;
    } catch (e) {
      console.warn(`Error parsing date: ${dateStr}, using current date`, e);
      return new Date();
    }
  }


  // metodo para obtener usuario por id
  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0, // (1 true, 0 false)
      })),
      catchError((error) => {
        console.error(`Error fetching usuario con ID ${id}:`, error);
        return of(undefined);
      })
    );
  }

  getUsuariosByRol(rol: String): Observable<Usuario[]> {
    return this.getAllUsuarios().pipe(
      map(usuarios => usuarios.filter(usuario => usuario.rol === rol))
    )
  }

  // metodo para obtener usuario por email
  getUsuarioByEmail(email: string): Observable<Usuario | undefined> {
    return this.http.get<Usuario>(`${this.apiUrl}/uno/${email}`).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0,
      })),
      catchError((error) => {
        console.error(`Error fetching usuario con email ${email}: `, error);
        return of(undefined);
      })
    );
  }

  // metodo para crear un nuevo usuario
  crearUsuario(usuario: Usuario): Observable<Usuario | undefined> {
    return this.http.post<Usuario>(`${this.apiUrl}/alta`, usuario).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0
      })),
      catchError((error) => {
        console.error('Error creando el usuario', error)
        return of(undefined)
      })
    )
  }

  // metodo para actualizar un usuario
  actualizarUsuario(usuario: Usuario): Observable<Usuario | undefined> {
    return this.http.put<Usuario>(`${this.apiUrl}/modificar`, usuario).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0
      })),
      catchError((error) => {
        console.error('Error actualizando usuario:', error);
        return of(undefined);
      })
    );
  }

  // metodo para deshabilitar/eliminar un usuario
  deshabilitarUsuario(email: string): Observable<boolean> {
    return this.http.delete<number>(`${this.apiUrl}/eliminar/${email}`).pipe(
      map(result => result > 0),
      catchError((error) => {
        console.error(`Error deshabilitando usuario con email ${email}:`, error);
        return of(false);
      })
    );
  }

}