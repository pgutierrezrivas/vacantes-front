import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../interfaces/usuario';
import { USUARIOS_DB } from '../db/usuarios.db';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  router = inject(Router);
  usuario = signal<Usuario | null>(null); // usamos signal para gestionar el usuario autenticado

  constructor() {
    // intentamos cargar el usuario desde localStorage al inicializar el servicio
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      this.usuario.set(JSON.parse(storedUser)); // establecemos el usuario en la señal
    }
  }

  // metodo para logearse
  login(email: string, password: string): boolean {
    const user = USUARIOS_DB.find(u => u.email === email && u.password === `{noop}${password}`);
    if (user) {
      this.usuario.set(user);
      localStorage.setItem('usuario', JSON.stringify(user)); // guardamos el usuario en localStorage
      return true;
    }
    return false;
  }

  // metodo para cerrar sesión
  logout(): void {
    this.usuario.set(null);
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }

  // metodo para obtener el usuario
  getUsuario(): Usuario | null {
    return this.usuario();
  }

  // metodo para obtener el rol
  getRol(): string | null {
    return this.usuario()?.rol || null;
  }

  // metodo para comprobar si esta autenticado
  isAuthenticated(): boolean {
    return this.usuario() !== null;
  }
}


