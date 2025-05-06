import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { Vacante } from '../../../interfaces/vacante';
import { Usuario } from '../../../interfaces/usuario';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { VacantesService } from '../../../services/vacantes.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-solicitudes',
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-solicitudes.component.html',
  styleUrl: './lista-solicitudes.component.css'
})
export class ListaSolicitudesComponent implements OnInit {

solicitudes: Solicitud[] = [];
vacanteId: number = 0;
vacante?: Vacante;  
candidatos: Usuario[] = [];


  constructor(
    private sService : SolicitudesService,
    private vService : VacantesService,
    private uService : UsuariosService,
    private route : ActivatedRoute
  ) {}


  ngOnInit(): void {
      
    //Obtener el id de la vacante desde la url
    this.route.params.subscribe(params => {
      this.vacanteId = +params['id']; //convertir a numero
      this.loadVacante();
      this.loadSolicitudes();
    });
  }
 
  loadVacante(): void {
    this.vacante = this.vService.getVacanteById(this.vacanteId);
  }

  loadSolicitudes(): void {
    //obtener todas las solicitudes para esta vacante
    this.solicitudes = this.sService.getSolicitudesByVacanteId(this.vacanteId);

    //cargar datos de usuarios para mostrar informacion de el/los canditato/s
    this.candidatos = [];
    this.solicitudes.forEach(solicitud => {
      const usuario = this.uService.getUsuarioByEmail(solicitud.email);
      if (usuario) {
        this.candidatos.push(usuario);
      }
    });
  }

  actualizarEstadoSolicitud(solicitud : Solicitud, estado : number): void {
    //actualizar estado de la solicitud
    this.sService.actualizarEstadoSolicitud(solicitud.id_solicitud, estado);

    //si se adjudica la vacante (estado = 1), actualiza estado de la vaca cubierta
    if ( estado === 1) {
      this.vService.actualizarVacante(this.vacanteId, 'CUBIERTA');
      this.vacante = this.vService.getVacanteById(this.vacanteId);
    
    //Actualizar todas las demas solicitudes para esta vacante como no adjudicadas
    this.solicitudes.forEach(s =>{
      if (s.id_solicitud !== solicitud.id_solicitud) {
        this.sService.actualizarEstadoSolicitud(s.id_solicitud, 0);
      }
    });
  }
  this.loadSolicitudes();
  }

  descargarCurriculum(archivo: string): void {
    //esta funcion simulario la descarga del CV
    console.log('Descargando archivo: ' + archivo);
    alert('Descargando curriculum: ' + archivo);
  }
  
    // Método público para obtener el nombre completo desde la plantilla
    obtenerNombreCompleto(email: string): string {
      const usuario = this.uService.getUsuarioByEmail(email);
      if (usuario) {
        return `${usuario.nombre} ${usuario.apellidos}`;
      }
      return 'Usuario desconocido';
    }

}
