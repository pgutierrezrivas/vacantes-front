import { Injectable } from '@angular/core';
import { Empresa } from '../interfaces/empresa';
import { EMPRESAS_DB } from '../db/empresas.db';
import { Observable, of, throwError } from 'rxjs';

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


  getEmpresaById(id: number): Observable<Empresa>{
    const empresa = this.arrEmpresas.find(e => e.id_empresa === id);
    if(empresa) {
      return of(empresa);
    }
    return throwError(() => new Error('Empresa no encontrada'))
  }

  //crear
  crearEmpresa(empresa: Empresa, usuario: any): Observable<any> {
    // cambiar a 
    // return this.http.post<any>(`${this.apiUrl}/empresas`, { empresa, usuario });

    const nextId = Math.max(...this.arrEmpresas.map(e => e.id_empresa)) + 1;
    empresa.id_empresa = nextId;
    
    // añadir la empresa al array local
    this.arrEmpresas.push(empresa);
    
    // simulacion respuesta del backend para testing
    return of({
      success: true,
      message: 'Empresa creada con éxito',
      data: {
        empresa: empresa,
        usuario: usuario
      }
    })
  }

  
  //deshabilitar / borrar

}
