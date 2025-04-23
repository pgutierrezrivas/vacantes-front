import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { VacantesService } from '../../../services/vacantes.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-vacantes',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-vacantes.component.html',
  styleUrl: './mis-vacantes.component.css'
})
export class MisVacantesComponent {
  misVacantes: Vacante[] = [];
  vacantesFiltradas: Vacante[] = [];
  idEmpresa: number = 0;
  filtroEstatus: string = 'TODAS';
  filtroBusqueda: string = '';


  constructor(
    private vService: VacantesService
  ) {}

  ngOnInit(): void {
    //Obtener el id de la empresa del localStoraGE
    const empresaGuardada = localStorage.getItem('empresa');
    if (empresaGuardada) {
      const empresa = JSON.parse(empresaGuardada);
      this.idEmpresa = empresa.id_empresa;
      this.cargarVacantes();
    }
  }

  cargarVacantes(): void {
    //obtener todas las vcacantes de la empresa
    this.misVacantes = this.vService.getVacantesByEmpresa(this.idEmpresa);
    this.aplicarFiltros();
  }


  aplicarFiltros(): void {
    this.vacantesFiltradas = this.misVacantes.filter(vacante => {
      //filtrar por estatus
      const cumpleFiltroEstatus = this.filtroEstatus === 'TODAS' || vacante.estatus === this.filtroEstatus;

      //filtrar por texto de busqueda
      const cumpleFiltroTexto = this.filtroBusqueda === '' ||
        vacante.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        vacante.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleFiltroEstatus && cumpleFiltroTexto;
    });
  }



  cambiarEstadoVacante(vacante : Vacante, nuevoEstado: 'CREADA' | 'CUBIERTA' | 'CANCELADA'): void {
    try {
      this.vService.actualizarVacante(vacante.id_vacante, nuevoEstado);
      this.cargarVacantes(); //recargar vacantes para mostrar los cambios
      alert(`Estado de la vacante "${vacante.nombre}" actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error('Error al actualizar el estado de la vacantes', error);
      alert('Error al actualizar el estado de la vacante. Intenetelo de neuvo mas tarde.')
    }
  }

  eliminarVacante(idVacante: number, nombreVacante: string): void {
    if(confirm(`¿Esta seguro que desea eliminar la vacante "${nombreVacante}"?`)) {
      try {
        this.vService.eliminarVacante(idVacante);
        this.cargarVacantes(); //recargamos vacantes
        alert(`Vacante "${nombreVacante}" eliminada correctamente`);
      } catch (error){
        console.error('Error al eliminar la vacante', error);
        alert('Error al eliminar la vacante. Intentelo de nuevo mas tarde')
      }
    }
  }


}
