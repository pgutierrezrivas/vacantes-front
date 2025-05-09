import { Component, OnInit, OnDestroy } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { VacantesService } from '../../../services/vacantes.service';

@Component({
  selector: 'app-lista-vacantes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-vacantes.component.html',
  styleUrl: './lista-vacantes.component.css'
})
export class ListaVacantesComponent implements OnInit, OnDestroy {
  vacantes: Vacante[] = []
  vacantesFiltradas: Vacante[] = [];

  // filtros
  filtroNombre: string = '';
  filtroFecha: 'reciente' | 'antigua' | '' = '';
  filtroSalario: 'mayor' | 'menor' | '' = '';

  private subscriptions: Subscription = new Subscription();

  constructor(private vService: VacantesService) { }

  ngOnInit(): void {
    this.cargarVacantes();
  }

  cargarVacantes(): void {
    this.vService.getAllVacantes().subscribe({
      next: (vacantes: Vacante[]) => {
        this.vacantes = vacantes;
        this.aplicarFiltros();
        console.log('Vacantes recibidas:', vacantes);
        console.log('Ejemplo de vacante:', this.vacantes[0]);
      },
      error: (error) => {
        console.error('Error al cargar vacantes: ', error);
        alert('Error al cargar la lista de vacantes')
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = this.vacantes;
  
    // filtrado por nombre
    if (this.filtroNombre.trim() !== '') {
      const texto = this.filtroNombre.trim().toLowerCase();
      resultado = resultado.filter(vacante =>
        vacante.nombre.toLowerCase().includes(texto)
      );
    }
  
    // Orden combinado (primero por fecha, luego por salario si hay empate)
    resultado = resultado.sort((a, b) => {
      // filtro por fecha 
      let comparacionFecha = 0;
      if (this.filtroFecha === 'reciente') {
        comparacionFecha = new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      } else if (this.filtroFecha === 'antigua') {
        comparacionFecha = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
      }
  
      // si ya hay diferencia por fecha, devuelvo esa comparacion
      if (comparacionFecha !== 0) return comparacionFecha;
  
      // filtro por salario solo si no hay diferencia de fecha
      if (this.filtroSalario === 'mayor') {
        return b.salario - a.salario;
      } else if (this.filtroSalario === 'menor') {
        return a.salario - b.salario;
      }
  
      return 0; // sin cambios
    });
  
    this.vacantesFiltradas = resultado;
  }

  
  ngOnDestroy(): void {
    // limpiar todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

}
