import { inject, Injectable } from '@angular/core';
import { Empresa } from '../interfaces/empresa';
import { EMPRESAS_DB } from '../db/empresas.db';
import { Observable, of, throwError } from 'rxjs';
import { environment } from '../enviroments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  private apiUrl = `${environment.apiUrl}/empresas`;
  private http: HttpClient = inject(HttpClient);

  private arrEmpresas : Empresa[];

  constructor() { 
    this.arrEmpresas = EMPRESAS_DB;
  }

  getAllEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/todos`);
  }

  getEmpresaPorUsuario(email: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/email/${email}`);
  }

  getEmpresaById(id: number): Observable<Empresa>{
    return this.http.get<Empresa>(`${this.apiUrl}/uno/${id}`)
  }

  //crear
  crearEmpresa(empresa: Empresa, usuario: any): Observable<any> {
    return this.http.post<Empresa>(`${this.apiUrl}/alta`, empresa);
  }

  
  modificarEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/modificar`, empresa);
  }

  eliminarEmpresa(id: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/eliminar/${id}`);
  }

  getSolicitudesEmpresa(idEmpresa: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vacante/solicitudes/${idEmpresa}`);
  }

}
