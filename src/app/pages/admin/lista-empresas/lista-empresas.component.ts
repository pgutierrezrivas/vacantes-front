import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Empresa } from '../../../interfaces/empresa';
import { EmpresasService } from '../../../services/empresas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../interfaces/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-empresas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-empresas.component.html',
  styleUrl: './lista-empresas.component.css'
})
export class ListaEmpresasComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];

  filtroTexto: string = '';

  private subscriptions: Subscription = new Subscription();

  constructor(
    private eService: EmpresasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
   this.eService.getAllEmpresas().subscribe({
    next: (empresas: Empresa[]) => {
      this.empresas = empresas;
      this.empresasFiltradas = [...this.empresas];
    },
    error: (error) => {
      console.error('Error al cargar empresas: ', error);
      alert('Error al cargar la lista de empresas')
    }
   });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroTexto = filterValue;
    

    if (!filterValue) {
      this.empresasFiltradas = [...this.empresas];
      return;
    }
    
    this.empresasFiltradas = this.empresas.filter(empresa => 
      empresa.nombre_empresa.toLowerCase().includes(filterValue) || 
      empresa.cif.toLowerCase().includes(filterValue)
    );
  }

  deshabilitarEmpresa(id: number): void {
    if (confirm('¿Esta seguro de que desea desahabilitar una empresa? Tambien se deshabilitara el usuario asociado.')){

    this.eService.getEmpresaById(id).subscribe({
      next: (empresa: Empresa) => {
        this.usuariosService.getUsuariosByRol('EMPRESA').subscribe({
          next: (usuarios: Usuario[]) => {
            const usuarioEmpresa = usuarios.find((u: Usuario) => u.email === empresa.email);

            if(usuarioEmpresa) {
              this.usuariosService.deshabilitarUsuario(usuarioEmpresa.email).subscribe({
                next: () => {
                  this.eService.eliminarEmpresa(id).subscribe({
                    next: () => {
                      alert('Empresa y usuario asociado deshabilitados correctamente');
                      this.cargarEmpresas();
                    },error: (error) => {
                      console.error('Error al eliminar la empresa:', error);
                      alert('Error al deshabilitar la empresa');
                    }
                  });
                },
                error: (error) => {
                  console.error('Error al deshabilitar el usuario:', error);
                  alert('Error al deshabilitar el usuario asociado');
                }
              });
            } else {
              alert('No se encontró el usuario asociado a esta empresa');
            }
          },
          error: (error) => {
            console.error('Error al buscar usuarios:', error);
            alert('Error al buscar el usuario asociado');
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener detalle de empresa:', error);
        alert('Error al obtener información de la empresa');
      }
    });
  }
}

ngOnDestroy(): void {
  // Limpiar todas las suscripciones para evitar memory leaks
  this.subscriptions.unsubscribe();
}
}