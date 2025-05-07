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
      },
      error: (error) => {
        console.error('Error al cargar vacantes: ', error);
        alert('Error al cargar la lista de vacantes')
      }
    });
  }

  aplicarFiltros(): void {
    let resultado = this.vacantes

    // filtrado por nombre
    if (this.filtroNombre) {
      resultado = resultado.filter(vacante =>
        vacante.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }

    // filtro por fecha
    if (this.filtroFecha === 'reciente') {
      resultado = resultado.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    } else if (this.filtroFecha === 'antigua') {
      resultado = resultado.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    }

    // filtro por salario 
    if (this.filtroSalario === 'mayor') {
      resultado = resultado.sort((a, b) => b.salario - a.salario);
    } else if (this.filtroSalario === 'menor') {
      resultado = resultado.sort((a, b) => a.salario - b.salario);
    }

    this.vacantesFiltradas = resultado;
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

}
