import { Injectable } from '@angular/core';
import { Solicitud } from '../interfaces/solicitud';
import { SOLICITUDES_DB } from '../db/solicitudes.db';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private arrSolicitudes : Solicitud[];

  constructor() { 
    this.arrSolicitudes = SOLICITUDES_DB;
  }

  getAllSolicitudes() : Solicitud[] {
    return this.arrSolicitudes;
  }

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
