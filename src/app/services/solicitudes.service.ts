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

}