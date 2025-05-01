import { Component } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [RouterLink, CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent {
  solicitudes: Solicitud[] = [];
  idUsuario: string = '';

  constructor(
    private solicitudService: SolicitudesService
  ) { }

  ngOnInit(): void {
    //obtenemos el id del usuario del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.idUsuario = usuario.email;
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes(): void {
    //obtenemos todas las solicitudes de un usuario determinado
    this.solicitudes = this.solicitudService.getSolicitudesByUserEmail(this.idUsuario);
  }

  anularSolicitud(id: number): void {
    const confirmacion = confirm("¿Quieres anular esta solicitud?");
    if (!confirmacion) return;

    const resultado = this.solicitudService.eliminarSolicitud(id);
    if (resultado) {
      // actualizamos las solicitudes en el componente
      this.cargarSolicitudes();
    } else {
      alert("No se pudo anular la solicitud.");
    }
  }


}
