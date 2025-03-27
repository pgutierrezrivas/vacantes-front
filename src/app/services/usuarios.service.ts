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

}
