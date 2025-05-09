import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { VacantesService } from '../../../services/vacantes.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-mis-vacantes',
  standalone: true, // Añadido para ser consistente con EditarVacanteComponent
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './mis-vacantes.component.html',
  styleUrl: './mis-vacantes.component.css'
})
export class MisVacantesComponent implements OnInit {
  misVacantes: Vacante[] = [];
  vacantesFiltradas: Vacante[] = [];
  idEmpresa: number = 0;
  filtroEstatus: string = 'TODAS';
  filtroBusqueda: string = '';
  cargando: boolean = false;
  error: string | null = null;

  constructor(private vService: VacantesService) { }

  ngOnInit(): void {
    // Obtener el id de la empresa del localStorage
    const empresaGuardada = localStorage.getItem('empresa');
    if (empresaGuardada) {
      const empresa = JSON.parse(empresaGuardada);
      this.cargarVacantes();
    } else {
      this.error = 'No se encontró información de la empresa. Por favor, inicie sesión nuevamente.';
    }
  }

  cargarVacantes(): void {
    this.cargando = true;
    this.vService.getVacantesByEmpresa(this.idEmpresa)
      .pipe(
        catchError(error => {
          console.error('Error al cargar vacantes: ', error);
          this.error = 'No se pudieron cargar las vacantes. Por favor, inténtelo de nuevo';
          return of([]);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(vacantes => {
        // Corregido: asignar las vacantes recibidas a misVacantes
        this.misVacantes = vacantes;
        this.aplicarFiltros();
      });
  }

  aplicarFiltros(): void {
    this.vacantesFiltradas = this.misVacantes.filter(vacante => {
      // Filtrar por estatus
      const cumpleFiltroEstatus = this.filtroEstatus === 'TODAS' || vacante.estatus === this.filtroEstatus;
      // Filtrar por texto de búsqueda
      const cumpleFiltroTexto = this.filtroBusqueda === '' || 
        vacante.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) || 
        vacante.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase());
      
      return cumpleFiltroEstatus && cumpleFiltroTexto;
    });
  }

  cambiarEstadoVacante(vacante: Vacante, nuevoEstado: 'CREADA' | 'CUBIERTA' | 'CANCELADA'): void {
    this.cargando = true;
    this.vService.actualizarVacante(vacante, nuevoEstado)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el estado de la vacante', error);
          alert('Error al actualizar el estado de la vacante. Inténtelo de nuevo más tarde.');
          return of(null);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(result => {
        if (result) {
          this.cargarVacantes(); // Recargar vacantes para mostrar los cambios
          alert(`Estado de la vacante "${vacante.nombre}" actualizado a ${nuevoEstado}`);
        }
      });
  }

  eliminarVacante(idVacante: number, nombreVacante: string): void {
    if (confirm(`¿Está seguro que desea eliminar la vacante "${nombreVacante}"?`)) {
      this.cargando = true;
      this.vService.eliminarVacante(idVacante)
        .pipe(
          catchError(error => {
            console.error('Error al eliminar la vacante', error);
            alert('Error al eliminar la vacante. Inténtelo de nuevo más tarde');
            return of(0);
          }),
          finalize(() => this.cargando = false)
        )
        .subscribe(result => {
          if (result === 1) {
            this.cargarVacantes();
            alert(`Vacante "${nombreVacante}" eliminada correctamente`);
          }
        });
    }
  }
}