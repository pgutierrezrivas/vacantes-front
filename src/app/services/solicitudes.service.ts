import { inject, Injectable } from '@angular/core';
import { Solicitud } from '../interfaces/solicitud';
import { SOLICITUDES_DB } from '../db/solicitudes.db';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  httpClient = inject(HttpClient); // inyeccion de dependencias httpClient
  private apiURL: string = 'http://localhost:5000/';
  private arrSolicitudes : Solicitud[];

  constructor() { 
    this.arrSolicitudes = SOLICITUDES_DB;
  }

  getAllSolicitudes() : Solicitud[] {
    return this.arrSolicitudes;
  }

  //con observables
  // GET
  getAll(): Observable<Solicitud[]> {
    return this.httpClient.get<Solicitud[]>(this.apiURL); // todo esto hace la llamada y devuelve un observable
  }

  // POST
  insert(solicitud: Solicitud): Observable<Solicitud> {
    return this.httpClient.post<Solicitud>(this.apiURL, solicitud);
  }

  // PUT
  update(solicitud: Solicitud): Observable<Solicitud> {
    return this.httpClient.put<Solicitud>(`${this.apiURL}/${solicitud.id_solicitud}`, solicitud);
  }

  // DELETE
  delete(id_solicitud: string): Observable<Solicitud> {
    return this.httpClient.delete<Solicitud>(`${this.apiURL}/${id_solicitud}`);
  }

  //con datos mockeados mateo
  getSolicitudesByVacanteId(vacanteId : number): Solicitud[] {
    return this.arrSolicitudes.filter(solicitud => solicitud.id_Vacante === vacanteId);
  }

  getSolicitudesByUserEmail(email: string): Solicitud[] {
    return this.arrSolicitudes.filter(solicitud => solicitud.email === email);
  }
  
  getSolicitudById(solicitudId: number): Solicitud | undefined {
    return this.arrSolicitudes.find(solicitud => solicitud.id_solicitud === solicitudId);
  }

  agregarSolicitud(solicitud : Solicitud): void {
    // Generar un nuevo ID para la solicitud
    const maxId = Math.max(...this.arrSolicitudes.map(s => s.id_solicitud), 0);
    solicitud.id_solicitud = maxId + 1;

    //agregar la nueva solicitud
    this.arrSolicitudes.push(solicitud);
  }

  actualizarEstadoSolicitud(solicitudId: number, estado: number): boolean {
    const index = this.arrSolicitudes.findIndex(s => s.id_solicitud === solicitudId);
    if (index !== -1) {
      this.arrSolicitudes[index].estado = estado;
      return true;
    }
    return false;
  }

  eliminarSolicitud(solicitudId: number): boolean {
    const index = this.arrSolicitudes.findIndex(s => s.id_solicitud === solicitudId);
    if(index !== -1) {
      this.arrSolicitudes.splice(index, 1);
      return true;
    }
    return false;
  }

}
