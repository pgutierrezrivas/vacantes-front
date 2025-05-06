import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent {

/*
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] =[];
  usuarioSeleccionado: Usuario | null = null;
  filtroTexto: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';

constructor(
  private uService: UsuariosService
) {}

ngOnInit(): void{
this.cargarUsuarios();
}

cargarUsuarios(): void {
  this.usuarios = this.uService.getAllUsuarios();
  this.usuariosFiltrados = [...this.usuarios]
}

aplicarFiltros(): void {
  let resultado = [...this.usuarios];

  //filtrado por texto
  if (this.filtroTexto) {
    const textoBusqueda = this.filtroTexto.toLowerCase();
    resultado = resultado.filter ( usuario => 
      usuario.email.toLowerCase().includes(textoBusqueda) ||
      usuario.nombre.toLowerCase().includes(textoBusqueda) || 
      usuario.apellidos.toLowerCase().includes(textoBusqueda));
  }

  //filtrado por rol
  if (this.filtroRol) {
    resultado = resultado.filter(usuario => usuario.rol === this.filtroRol);
  }

  //filtro por estado
  if (this.filtroEstado !== '') {
    const estadoNumerico = parseInt(this.filtroEstado);
    resultado = resultado.filter(usuario => usuario.enabled === estadoNumerico);
  }

  this.usuariosFiltrados = resultado;
}

aplicarFiltro(event: Event): void {
  this.filtroTexto = (event.target as HTMLInputElement).value;
  this.aplicarFiltros();
}

aplicarFiltroRol(): void {
  this.aplicarFiltros();
}

aplicarFiltroEstado(): void {
  this.aplicarFiltros();
}

abrirModalDesactivar(usuario: Usuario): void {
  this.usuarioSeleccionado = usuario;
}

desactivarUsuario(): void {
  if (this.usuarioSeleccionado) {
    const success = this.uService.deshabilitarUsuario(this.usuarioSeleccionado.email);
    if(success) {
      alert('Usuario desactivado correctamente');
      this.cargarUsuarios();
    } else {
      alert('Error al desactivar el usuario');
    }
    this.usuarioSeleccionado = null;
  }
}

activarUsuario(email: string): void {
  const usuario = this.uService.getUserByEmail(email);
  if (usuario) {
    usuario.enabled = 1;
    const success = this.uService.actualizarUsuario(usuario);
    if (success) {
      alert('Usuario activado correctamente');
      this.cargarUsuarios();
    } else {
      alert('Error al activar el usuario');
    }
  }
}

*/
}
