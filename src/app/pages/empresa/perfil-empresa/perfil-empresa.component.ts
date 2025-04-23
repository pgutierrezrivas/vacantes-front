import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Empresa } from '../../../interfaces/empresa';

@Component({
  selector: 'app-perfil-empresa',
  imports: [CommonModule],
  templateUrl: './perfil-empresa.component.html',
  styleUrl: './perfil-empresa.component.css'
})
export class PerfilEmpresaComponent implements OnInit {
usuario?: Usuario;
empresa?: Empresa;

constructor (private router : Router) {}

ngOnInit(): void {
//Cargar datos del user desde localStorage
const usuarioGuardado = localStorage.getItem('usuario');
if (usuarioGuardado) {
  this.usuario = JSON.parse(usuarioGuardado);
}
}

editarPerfil(): void {
  alert('Pendiente')
  console.log('Editar perfil TO-DO');
}


}
