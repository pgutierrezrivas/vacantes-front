import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { USUARIOS_DB } from '../db/usuarios.db';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private arrUsuarios : Usuario[];

  constructor() { 
    this.arrUsuarios = USUARIOS_DB;
  }

  getAllUsuarios() : Usuario[] {
    return this.arrUsuarios;
  }

  getUsuariosByRol(rol: String): Usuario[] {
    return this.arrUsuarios.filter(usuario => usuario.rol === rol);
  }

  getUserByEmail(email: string): Usuario | undefined {
    return this.arrUsuarios.find(usuario => usuario.email === email);
  }

  crearUsuario(usuario: Usuario): Usuario | undefined {
    //verificar si el usuario ya existe
    if (!this.getUserByEmail(usuario.email)) {
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
