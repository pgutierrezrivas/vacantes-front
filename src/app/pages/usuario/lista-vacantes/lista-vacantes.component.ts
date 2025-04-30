import { Component } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { VACANTES_DB } from '../../../db/vacantes.db';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-vacantes',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-vacantes.component.html',
  styleUrl: './lista-vacantes.component.css'
})
export class ListaVacantesComponent {
  vacantes: Vacante[] = VACANTES_DB
  filtroNombre: string = '';
  filtroFecha: 'reciente' | 'antigua' | '' = '';
  filtroSalario: 'mayor' | 'menor' | '' = '';


  get vacanteFiltrada(): Vacante[] {
    let resultado = this.vacantes


    //filtrado por nombre
    if (this.filtroNombre) {
      resultado = resultado.filter(vacante =>
        vacante.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
      );
    }

    //filtro por fecha
    if (this.filtroFecha === 'reciente') {
      resultado = resultado.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
    } else if (this.filtroFecha === 'antigua') {
      resultado = resultado.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
    }


    //filtro por salario 
    if (this.filtroSalario === 'mayor') {
      resultado = resultado.sort((a, b) => b.salario - a.salario)
    } else if (this.filtroSalario === 'menor') {
      resultado = resultado.sort((a, b) => a.salario - b.salario);
    }


    return resultado;
  }
}
