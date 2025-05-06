import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../enviroments/environment.development';
import { USUARIOS_DB } from '../db/usuarios.db';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private arrUsuarios : Usuario[]; //dato mockeado eliminar

  private apiUrl = `${environment.apiUrl}/users`;
  private http: HttpClient = inject(HttpClient);

  constructor() { 
    this.arrUsuarios = USUARIOS_DB; //dato mockeado eliminar
  }

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
        return of([]); // devuelve un array vacio en caso de error para que la aplicación no se rompa
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
        console.error(`Error fetching usuario with ID ${id}:`, error);
        return of(undefined);
      })
    );
  }

  getUsuariosByRol(rol: String): Usuario[] {
    return this.arrUsuarios.filter(usuario => usuario.rol === rol);
  }
  
  getUsuarioByEmail(email: string): Usuario | undefined {
    return this.arrUsuarios.find(usuario => usuario.email === email);
  }

  crearUsuario(usuario: Usuario): Usuario | undefined {
    //verificar si el usuario ya existe
    if (!this.getUsuarioByEmail(usuario.email)) {
      this.arrUsuarios.push(usuario);
      this.persistirUsuarios();
      return usuario;
    }
    return undefined;
  }
  
  actualizarUsuario(usuario: Usuario): Usuario | undefined {
    const index = this.arrUsuarios.findIndex(u => u.email === usuario.email);
    if (index !== -1) {
      this.arrUsuarios[index] = usuario;
      this.persistirUsuarios();
      return usuario;
    }
    return undefined;
  }
  
  deshabilitarUsuario(email: string): boolean {
    const index = this.arrUsuarios.findIndex(u => u.email === email);
    if (index !== -1) {
      this.arrUsuarios[index].enabled = 0;
      this.persistirUsuarios();
      return true;
    }
    return false;
  }
  
  private persistirUsuarios(): void {
    localStorage.setItem('usuarios', JSON.stringify(this.arrUsuarios));
  }
}