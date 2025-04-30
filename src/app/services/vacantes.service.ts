import { Injectable } from '@angular/core';
import { Vacante, VacanteStatus } from '../interfaces/vacante';
import { VACANTES_DB } from '../db/vacantes.db';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private arrVacantes : Vacante[];
  private nextId: number;

  constructor() { 
    const storedVacantes = localStorage.getItem('vacantes');
    if(storedVacantes) {
      this.arrVacantes = JSON.parse(storedVacantes);
    } else {
      this.arrVacantes = VACANTES_DB;
    }
    this.nextId = this.calculateNextId();
  }

  getAllVacantes() : Vacante[] {
    return this.arrVacantes;
  }

  getVacanteById(id: number): Vacante | undefined {
    return this.arrVacantes.find(v => v.id_vacante === id);
  }

  getVacantesByEmpresa(empresaId: number): Vacante[] {
    return this.arrVacantes.filter(v => v.id_empresa === empresaId);
  }

  crearVacante(vacante: Vacante): Vacante {
    //nuevo id
    vacante.id_vacante = this.nextId++;

    //añadir al array
    this.arrVacantes.push(vacante);

    //simular presencia en localstorage
    this.persistirVacantes();

    return vacante;
  }

  actualizarVacante(idVacante: number, nuevoEstado: VacanteStatus): boolean {
    const vacante = this.getVacanteById(idVacante);

    if (vacante) {
      vacante.estatus = nuevoEstado;
      this.persistirVacantes();
      return true;
    }
    return false;
  }


  actualizarVacanteCompleta(vacante: Vacante): Vacante | undefined {
    const index = this.arrVacantes.findIndex(v => v.id_vacante === vacante.id_vacante);

    if (index !== -1) {
      this.arrVacantes[index] = vacante;
      this.persistirVacantes();
      return vacante;
    }
    return undefined;
  }

  eliminarVacante(idVacante: number): boolean {
    const index = this.arrVacantes.findIndex(v => v.id_vacante === idVacante);
    
    if (index !== -1) {
      this.arrVacantes.splice(index, 1);
      this.persistirVacantes();
      return true;
    }
    return false;
  }

  private calculateNextId(): number {
    return Math.max(...this.arrVacantes.map(v => v.id_vacante), 0) + 1;
  }

private persistirVacantes(): void {
  
  localStorage.setItem('vacantes', JSON.stringify(this.arrVacantes));
}

}
