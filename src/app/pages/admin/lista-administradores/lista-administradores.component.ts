import { Component } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-administradores',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-administradores.component.html',
  styleUrl: './lista-administradores.component.css'
})
export class ListaAdministradoresComponent {


  administradores: Usuario[] = [];
  administradoresFiltrados: Usuario[] = [];
  administradorActual: Usuario = {
    email: '',
    nombre: '',
    apellidos: '',
    password: '',
    enabled: 1,
    fecha_Registro: new Date(),
    rol: 'ADMON'
  };
  modoEdicion: boolean = false;
  termoBusqueda: string = '';

  constructor(private uService: UsuariosService) {

  }

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.administradores = this.uService.getUsuariosByRol('ADMON');
    this.administradoresFiltrados = [...this.administradores];
  }

  aplicarFiltro(event: Event): void {
    const filtro = (event.target as HTMLInputElement).value.toLowerCase();
    this.administradoresFiltrados = this.administradores.filter(admin => 
      admin.nombre.toLowerCase().includes(filtro) || 
      admin.apellidos.toLowerCase().includes(filtro) ||
      admin.email.toLowerCase().includes(filtro)
    );
  }

  prepararNuevoAdministrador(): void {
    this.administradorActual = {
      email: '',
    nombre: '',
    apellidos: '',
    password: this.generarPasswordAleatorio(),
    enabled: 1,
    fecha_Registro: new Date(),
    rol: 'ADMON'
    };
    this.modoEdicion = false;
  }

  prepararEditarAdministrador(administrador: Usuario): void {
    //crear una copia
    this.administradorActual ={...administrador};
    this.modoEdicion = true;
  }

  guardarAdministrador(): void {
    if (this.validarDatosAdministrador()) {
      if(this.modoEdicion) {
        this.uService.actualizarUsuario(this.administradorActual);
      } else {
        this.uService.crearUsuario(this.administradorActual);
      }
      this.cargarAdministradores();
      //cerrar el modal
      document.getElementById('adminModal')?.dispatchEvent(new Event('close'));
    }
  }

  deshabilitarAdministrador(email: string): void {
    if (confirm('¿Estas seguro de que desesa deshabilitar este administrador?')) {
      this.uService.deshabilitarUsuario(email); 
      this.cargarAdministradores();
    }
  }

  generarPasswordAleatorio(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';

    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password;
  }

  
  validarDatosAdministrador(): boolean {
    if (!this.administradorActual.email || !this.administradorActual.nombre || !this.administradorActual.apellidos) {
      alert('Por favor, complete todos los campos obligatorios.');
      return false;
    }
    // Validar formato de email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.administradorActual.email)) {
      alert('Por favor, introduzca un email válido.');
      return false;
    }
    return true;
  }


}
