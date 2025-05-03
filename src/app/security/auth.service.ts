import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { environment } from '../enviroments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private _usuario = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this._usuario.asObservable();

  private apiUrl = `${environment.apiUrlPublic}/auth`;

  // ⚠️ Almacenar la contraseña en memoria: aún así es riesgoso
  private _password: string | null = null;

  constructor() {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this._usuario.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('usuario');
        this._usuario.next(null);
      }
    }
  }

  signup(userData: Omit<Usuario, 'fecha_Registro' | 'enabled'>): Observable<boolean> {
    return this.http.post<Usuario>(`${this.apiUrl}/signup`, userData).pipe(
      map(user => {
        const formattedUser: Usuario = {
          ...user,
          fecha_Registro: new Date(user.fecha_Registro),
          enabled: user.enabled ? 1 : 0,
        };
        this._usuario.next(formattedUser);
        localStorage.setItem('usuario', JSON.stringify(formattedUser));
        return true;
      }),
      catchError((error) => {
        console.error('Signup failed:', error);
        return of(false);
      })
    );
  }

  //HACIENDO CAMBIOS EN LOGIN PARA AJUSTAR AL NUEVO LOGIN DEL AUTHENTICATION
  // CONTROLLER EN SPRING
  login(email: string, password: string): Observable<boolean> {

    //AÑADIDA CONST BODY
    const body = { email, password };

    return this.http.post<Usuario>(`${this.apiUrl}/login`, body).pipe(
      tap(user => {
        // Guardamos usuario completo (ya viene con rol, enabled...)
        this._usuario.next(user);
        this._password = password; // para e interceptor
        localStorage.setItem('usuario', JSON.stringify(user));
      }),
      map(() => true),
      catchError(err => {
        console.error('Login failed:', err);
        this.logout();
        return of(false);
      })
    )
  
    // comentamos esto que va con GET como el antiguo login y adaptamos a POST
   /* 
   // guardamos credenciales para el interceptor…
    this._usuario.next({ email, nombre: '', apellidos: '', password: '', enabled: 1, fecha_Registro: new Date(), rol: null });
    this._password = password;

   return this.http.get(`${this.apiUrl}/login`, {
      observe: 'response',
      responseType: 'text'
    }).pipe(
      map(resp => resp.status === 200),
      catchError(err => {
        console.error('Login failed:', err);
        this.logout();
        return of(false);
      })
    );
  */
  }
  


  logout(): void {
    this._usuario.next(null);
    this._password = null;
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  getUsuario(): Observable<Usuario | null> {
    return this.usuario$;
  }

  getRol(): Observable<string | null> {
    return this.usuario$.pipe(map(user => user?.rol || null));
  }

  isAuthenticated(): Observable<boolean> {
    return this.usuario$.pipe(map(user => !!user?.enabled));
  }

  getUsername(): string | null {
    return this._usuario.value?.email || null;
  }

  getPassword(): string | null {
    return this._password;
  }

  /** Método para obtener el header Authorization con Basic */
  getBasicAuthHeader(): string | null {
    const username = this.getUsername();
    const password = this.getPassword();
    if (username && password) {
      const credentials = btoa(`${username}:${password}`);
      const header = `Basic ${credentials}`;
      console.log('Authorization Header:', header); // 👈 añade esto para verificar
      return header;
    }
    return null;
  }  
}
