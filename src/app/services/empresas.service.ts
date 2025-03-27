import { Injectable } from '@angular/core';
import { Empresa } from '../interfaces/empresa';
import { EMPRESAS_DB } from '../db/empresas.db';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private arrEmpresas : Empresa[];

  constructor() { 
    this.arrEmpresas = EMPRESAS_DB;
  }

  getAllEmpresas() : Empresa[] {
    return this.arrEmpresas;
  }

}
