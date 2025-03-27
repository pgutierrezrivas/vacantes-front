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

}
