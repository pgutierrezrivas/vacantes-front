import { Injectable } from '@angular/core';
import { Vacante } from '../interfaces/vacante';
import { VACANTES_DB } from '../db/vacantes.db';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private arrVacantes : Vacante[];

  constructor() { 
    this.arrVacantes = VACANTES_DB;
  }

  getAllVacantes() : Vacante[] {
    return this.arrVacantes;
  }

}
