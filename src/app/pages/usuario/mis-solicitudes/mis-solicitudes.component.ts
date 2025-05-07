import { Component } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [RouterLink, CommonModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent {
  solicitudes: Solicitud[] = [];
  idUsuario: string = '';
  cargando: boolean = false;
  error: string | null = null;

  constructor(
    private solicitudService: SolicitudesService
  ) { }

  ngOnInit(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.idUsuario = usuario.email;
      this.cargarSolicitudes();
    }
  }

  cargarSolicitudes(): void {
    this.cargando = true;
    this.error = null;
    
    this.solicitudService.getSolicitudesByUserEmail(this.idUsuario)
      .pipe(
        catchError(error => {
          console.error('Error al cargar solicitudes:', error);
          this.error = 'No se pudieron cargar tus solicitudes. Por favor, intenta de nuevo más tarde.';
          return of([] as Solicitud[]); 
        }),
        finalize(() => {
          this.cargando = false; 
        })
      )
      .subscribe(solicitudes => {
        this.solicitudes = solicitudes;
      });
  }

  anularSolicitud(id: number): void {
    const confirmacion = confirm("¿Quieres anular esta solicitud?");
    if (!confirmacion) return;

    this.cargando = true;
    this.error = null;
    
    this.solicitudService.eliminarSolicitud(id)
      .pipe(
        catchError(error => {
          console.error('Error al anular solicitud:', error);
          this.error = 'No se pudo anular la solicitud.';
          return of(false);
        }),
        finalize(() => {
          this.cargando = false;
        })
      )
      .subscribe(resultado => {
        if (resultado) {
          this.cargarSolicitudes();
        } else if (!this.error) {
          this.error = "No se pudo anular la solicitud.";
        }
      });
  }
}