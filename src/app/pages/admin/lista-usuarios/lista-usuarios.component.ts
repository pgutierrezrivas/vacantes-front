import { Component, OnDestroy, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-usuarios.component.html',
  styleUrl: './lista-usuarios.component.css'
})
export class ListaUsuariosComponent implements OnInit, OnDestroy  {


  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] =[];
  usuarioSeleccionado: Usuario | null = null;
  filtroTexto: string = '';
  filtroRol: string = '';
  filtroEstado: string = '';

  private subscriptions: Subscription = new Subscription();

constructor(
  private uService: UsuariosService
) {}

ngOnInit(): void{
  this.cargarUsuarios();
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


cargarUsuarios(): void {
  const sub = this.uService.getAllUsuarios().subscribe({
    next: (usuarios) => {
      this.usuarios = usuarios;
      this.usuariosFiltrados = [...this.usuarios];
    },
    error: (error) => {
      console.error('Error al cargar usuarios:', error);
      
    }
  });
  
  this.subscriptions.add(sub);
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
    const sub = this.uService.deshabilitarUsuario(this.usuarioSeleccionado.email).subscribe({
      next: (success) => {
        if (success) {
          alert('Usuario desactivado correctamente');
          this.cargarUsuarios(); // Recargar la lista de usuarios
        } else {
          alert('Error al desactivar el usuario');
        }
        this.usuarioSeleccionado = null;
      },
      error: (error) => {
        console.error('Error al desactivar usuario:', error);
        alert('Error al desactivar el usuario');
        this.usuarioSeleccionado = null;
      }
    });
    
    this.subscriptions.add(sub);
  }
}

activarUsuario(email: string): void {
  // Primero obtenemos el usuario actual
  const sub = this.uService.getUsuarioByEmail(email).subscribe({
    next: (usuario) => {
      if (usuario) {
        // Cambiar el estado y actualizar
        const usuarioActualizado = { ...usuario, enabled: 1 };
        
        this.uService.actualizarUsuario(usuarioActualizado).subscribe({
          next: (result) => {
            if (result) {
              alert('Usuario activado correctamente');
              this.cargarUsuarios();
            } else {
              alert('Error al activar el usuario');
            }
          },
          error: (error) => {
            console.error('Error al actualizar usuario:', error);
            alert('Error al activar el usuario');
          }
        });
      } else {
        alert('No se pudo encontrar el usuario');
      }
    },
    error: (error) => {
      console.error('Error al buscar el usuario:', error);
      alert('Error al buscar el usuario');
    }
  });
  
  this.subscriptions.add(sub);
}
}