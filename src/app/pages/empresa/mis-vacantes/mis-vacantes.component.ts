import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { VacantesService } from '../../../services/vacantes.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-mis-vacantes',
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
  cargandoVacantes: boolean = false;
  cargandoEmpresa = false;
  error: string | null = null;

  constructor(private vService: VacantesService, private eService: EmpresasService) { }

  ngOnInit(): void {
    this.obtenerEmpresaDesdeEmail();
  }

  obtenerEmpresaDesdeEmail(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const email = usuario.email;

      if (email) {
        this.cargandoEmpresa = true;
        this.eService.getEmpresaPorUsuario(email).subscribe({
          next: (empresa) => {
            this.idEmpresa = empresa.id_empresa;
            this.cargandoEmpresa = false;
            this.cargarVacantes();
          },
          error: (err) => {
            console.error('Error al obtener la empresa por email', err);
            this.error = 'No se pudo obtener la información de la empresa.';
            this.cargandoEmpresa = false;
          }
        });
      }
    }
  }

  cargarVacantes(): void {
    this.cargandoVacantes = true;
    this.vService.getVacantesByEmpresa(this.idEmpresa)
      .pipe(
        catchError(error => {
          console.error('Error al cargar vacantes: ', error);
          this.error = 'No se pudieron cargar las vacantes. Por favor, inténtelo de nuevo.';
          return of([]);
        }),
        finalize(() => this.cargandoVacantes = false)
      )
      .subscribe(vacantes => {
        this.misVacantes = vacantes;
        this.aplicarFiltros();
      });
  }

  aplicarFiltros(): void {
    this.vacantesFiltradas = this.misVacantes.filter(vacante => {
      const cumpleFiltroEstatus = this.filtroEstatus === 'TODAS' || vacante.estatus === this.filtroEstatus;
      const cumpleFiltroTexto = this.filtroBusqueda === '' ||
        vacante.nombre.toLowerCase().includes(this.filtroBusqueda.toLowerCase()) ||
        vacante.descripcion.toLowerCase().includes(this.filtroBusqueda.toLowerCase());

      return cumpleFiltroEstatus && cumpleFiltroTexto;
    });
  }

  cambiarEstadoVacante(vacante: Vacante, nuevoEstado: 'CREADA' | 'CUBIERTA' | 'CANCELADA'): void {
    this.cargandoVacantes = true;
    this.vService.actualizarVacante(vacante, nuevoEstado)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el estado de la vacante', error);
          alert('Error al actualizar el estado de la vacante. Inténtelo de nuevo más tarde.');
          return of(null);
        }),
        finalize(() => this.cargandoVacantes = false)
      )
      .subscribe(result => {
        if (result) {
          this.cargarVacantes();
          alert(`Estado de la vacante "${vacante.nombre}" actualizado a ${nuevoEstado}`);
        }
      });
  }

  eliminarVacante(idVacante: number, nombreVacante: string): void {
    if (confirm(`¿Está seguro que desea eliminar la vacante "${nombreVacante}"?`)) {
      this.cargandoVacantes = true;
      this.vService.eliminarVacante(idVacante)
        .pipe(
          catchError(error => {
            console.error('Error al eliminar la vacante', error);
            alert('Error al eliminar la vacante. Inténtelo de nuevo más tarde.');
            return of(0);
          }),
          finalize(() => this.cargandoVacantes = false)
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