import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Empresa } from '../../../interfaces/empresa';
import { EmpresasService } from '../../../services/empresas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../interfaces/usuario';

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

  constructor(
    private empresasService: EmpresasService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit(): void {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresas = this.empresasService.getAllEmpresas();
    this.empresasFiltradas = [...this.empresas];
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
    //aqui luego implementar la logica para deshabilitar una empresa
    //actualizar el estado de la empresa
    //deshabilitar el usuario asociado a la empresa
    if (confirm('¿Esta seguro de que desea desahabilitar una empresa? Tambien se deshabilitara el usuario asociado.')){
    const empresa = this.empresas.find(e => e.id_empresa === id);
    if (empresa) {
      // Buscar el usuario asociado y deshabilitarlo
      this.usuariosService.getUsuariosByRol('EMPRESA').subscribe((usuarios: Usuario[]) => {
        const usuarioEmpresa = usuarios.find((u: Usuario) => u.email === empresa.email);
        
        if (usuarioEmpresa) {
          this.usuariosService.deshabilitarUsuario(usuarioEmpresa.email).subscribe(() => {
            alert('Empresa y usuario asociado deshabilitados correctamente');
            //recargar la lista de empresas
            this.cargarEmpresas();
          });
        }
      });
    }
  }
}
}