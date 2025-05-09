import { inject, Injectable } from '@angular/core';
import { Vacante, VacanteStatus } from '../interfaces/vacante';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VacantesService {

  private apiUrl = `${environment.apiUrl}/vacantes`
  private http: HttpClient = inject(HttpClient);

  constructor() {}

  getAllVacantes() :  Observable<Vacante[]>  {
    return this.http.get<Vacante[]>(`${this.apiUrl}/todos`);
  }

  getVacanteById(id: number):  Observable<Vacante>  {
    return this.http.get<Vacante>(`${this.apiUrl}/uno/${id}`);
  }

  getVacantesByEmpresa(idEmpresa: number): Observable<Vacante[]> {
    return this.http.get<Vacante[]>(`${this.apiUrl}/empresa/${idEmpresa}`);
  }

  crearVacante(vacante: Vacante): Observable<Vacante> {
    return this.http.post<Vacante>(
      `${this.apiUrl}/alta`, 
      vacante, 
      { params: { 
        id_categoria: vacante.id_Categoria.toString(), 
        id_empresa: vacante.id_empresa.toString() 
      }}
    );
  }

  actualizarVacante(vacante: Vacante, nuevoEstado: VacanteStatus): Observable<Vacante> {
  
    const vacanteActualizada: Vacante = {
      ...vacante,
      estatus: nuevoEstado
    };
    
    return this.actualizarVacanteCompleta(vacanteActualizada);
  }


  actualizarVacanteCompleta(vacante: Vacante): Observable<Vacante> {
    return this.http.put<Vacante>(
      `${this.apiUrl}/modificar`, 
      vacante, 
      { params: { 
        id_categoria: vacante.id_Categoria.toString(), 
        id_empresa: vacante.id_empresa.toString() 
      }}
    );
  }

  eliminarVacante(idVacante: number): Observable<number> {
    return this.http.delete<number>(`${this.apiUrl}/eliminar/${idVacante}`);
  }



}
