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

  constructor() {}

  getAllUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl).pipe(
      map(users => {
        return users.map(user => ({
          ...user,
          fecha_Registro: new Date(user.fecha_Registro),
          enabled: user.enabled ? 1 : 0, // (1 true, 0 false)
        }));
      }),
      catchError((error) => {
        console.error('Error fetching usuarios:', error);
        return of([]);
      })
    );
  }

  // metodo para obtener usuario por ID
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
  
  // Metodo para obtener usuario por email (GET /usuarios/uno/{email}
  getUsuarioByEmail(email: string): Observable<Usuario | undefined> {
    return this.http.get<Usuario>(`${this.apiUrl}/uno/${email}`).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0, 
      })),
      catchError((error) => {
        console.error(`Error fetching usuario con email ${email}: `, error);
        return of (undefined);
      })
    );
  }

  // Metodo para crear un nuevo usuario (POST /usuarios/alta)
  crearUsuario(usuario: Usuario): Observable<Usuario | undefined> {
    return this.http.post<Usuario>(`${this.apiUrl}/alta`, usuario).pipe(
      map(user => ({
        ...user,
        fecha_Registro: new Date(user.fecha_Registro),
        enabled: user.enabled ? 1 : 0
      })),
      catchError((error) => {
        console.error('Error creando el usuario', error)
        return of (undefined)
      })
    )
  }

  // metodo para actualizar un usuario (PUT /usuarios/modificar)
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
  // metodo para deshabilitar/eliminar un usuario (DELETE /usuarios/eliminar/{email})
  deshabilitarUsuario(email: string):Observable<boolean> {
    return this.http.delete<number>(`${this.apiUrl}/eliminar/${email}`).pipe(
      map(result => result > 0),
      catchError((error) => {
        console.error(`Error deshabilitando usuario con email ${email}:`, error);
        return of(false);
      })
    );
  }
  
  // private persistirUsuarios(): void {
  //   localStorage.setItem('usuarios', JSON.stringify(this.arrUsuarios));
  // }
}