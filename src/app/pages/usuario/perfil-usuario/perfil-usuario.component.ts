import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { AuthService } from '../../../security/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-usuario',
  imports: [CommonModule],
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit{

usuario: Usuario | null = null;


  constructor(private AuthService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.AuthService.getUsuario();
  }

  editarPerfil() {
    throw new Error('Method not implemented.');
    }

}
