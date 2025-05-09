import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { Vacante } from '../../../interfaces/vacante';
import { Usuario } from '../../../interfaces/usuario';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { VacantesService } from '../../../services/vacantes.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, finalize, forkJoin, Observable, of } from 'rxjs';

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
  cargando: boolean = false;
  error: string | null = null;

  constructor(
    private sService: SolicitudesService,
    private vService: VacantesService,
    private uService: UsuariosService,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    // obtenemos el id de la vacante desde la url
    this.route.params.subscribe(params => {
      console.log('Parámetros de ruta recibidos:', params);
     // Verificar si existe el parámetro 'id'
    if (!params['id']) {
      this.error = 'No se ha proporcionado un ID de vacante';
      console.error('Falta el parámetro ID en la ruta');
      return;
    }

    // Verificamos si el ID es ':id' (literal) y evitamos procesarlo
    if (params['id'] === ':id') {
      this.error = 'ID de vacante no válido';
      console.error('ID literal detectado en lugar de un valor numérico');
      return;
    }
    
    // Convertir el parámetro a número y verificar que sea válido
    const id = Number(params['id']);
    
    if (isNaN(id)) {
      this.error = 'El ID de vacante proporcionado no es válido';
      console.error('ID de vacante inválido (NaN):', params['id']);
      return;
    }
    
    // Si llegamos aquí, el ID es válido
    this.vacanteId = id;
    console.log('ID de vacante válido:', this.vacanteId);
    
    // Proceder a cargar los datos
    this.loadVacante();
    this.loadSolicitudes();
  });
  }

  loadVacante(): void {
    // Verificación adicional por seguridad
    if (this.vacanteId <= 0) {
      this.error = 'ID de vacante inválido';
      return;
    }
    
    this.cargando = true;
    this.error = null; // Limpiar errores anteriores
    
    this.vService.getVacanteById(this.vacanteId)
      .pipe(
        catchError(error => {
          console.error('Error al cargar la vacante:', error);
          
          // Manejar diferentes tipos de errores HTTP
          if (error.status === 403) {
            this.error = 'No tienes permisos para acceder a esta vacante';
          } else if (error.status === 404) {
            this.error = 'La vacante no existe o ha sido eliminada';
          } else {
            this.error = 'No se pudo cargar la información de la vacante';
          }
          
          return of(undefined);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(vacante => {
        if (vacante) {
          this.vacante = vacante;
        } else if (!this.error) {
          // Si no tenemos vacante pero tampoco error (raro, pero posible)
          this.error = 'No se encontró información de la vacante';
        }
      });
  }
  loadSolicitudes(): void {
    // Verificación adicional por seguridad
    if (this.vacanteId <= 0) {
      this.error = 'ID de vacante inválido';
      return;
    }
    this.cargando = true;
    // obtenemos todas las solicitudes para esta vacante
    this.sService.getSolicitudesByVacanteId(this.vacanteId)
      .pipe(
        catchError(error => {
          console.error('Error al cargar las solicitudes:', error);
          this.error = 'No se pudieron cargar las solicitudes';
          return of([]);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(solicitudes => {
        this.solicitudes = solicitudes;
        this.cargarCandidatos();
      });
  }

  cargarCandidatos(): void {
    if (this.solicitudes.length === 0) {
      return;
    }

    this.cargando = true;
    const userObservables: Observable<Usuario | undefined>[] = [];

    this.solicitudes.forEach(solicitud => {
      userObservables.push(
        this.uService.getUsuarioByEmail(solicitud.email).pipe(
          catchError(() => of(undefined))
        )
      );
    });

    forkJoin(userObservables)
      .pipe(finalize(() => this.cargando = false))
      .subscribe(results => {
        this.candidatos = results.filter(user => user !== undefined) as Usuario[];
      });
  }

  actualizarEstadoSolicitud(solicitud: Solicitud, estado: number): void {
    this.cargando = true;

    // actualizamos el estado de la solicitud usando el servicio conectado a la api
    this.sService.actualizarEstadoSolicitud(solicitud.idSolicitud, estado)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar el estado de la solicitud:', error);
          alert('Error al actualizar el estado de la solicitud');
          return of(false);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(success => {
        if (success && estado === 1 && this.vacante) {
          // si se adjudica la vacante (estado = 1), actualiza estado de la vacante a cubierta
          this.vService.actualizarVacante(this.vacante, 'CUBIERTA')
            .subscribe({
              next: (vacante) => {
                this.vacante = vacante;

                // actualizamos todas las demás solicitudes para esta vacante como no adjudicadas
                const otherSolicitudes = this.solicitudes.filter(s =>
                  s.idSolicitud !== solicitud.idSolicitud
                );

                if (otherSolicitudes.length > 0) {
                  this.cargando = true;
                  const updateObservables = otherSolicitudes.map(s =>
                    this.sService.actualizarEstadoSolicitud(s.idSolicitud, 0)
                  );

                  forkJoin(updateObservables)
                    .pipe(finalize(() => {
                      this.loadSolicitudes();
                      this.cargando = false;
                    }))
                    .subscribe();
                } else {
                  this.loadSolicitudes();
                }
              },
              error: (error) => {
                console.error('Error al actualizar el estado de la vacante:', error);
                alert('Error al actualizar el estado de la vacante');
                this.cargando = false;
              }
            });
        } else {
          this.loadSolicitudes();
        }
      });
  }

  descargarCurriculum(archivo: string): void {
    //esta funcion simulario la descarga del CV
    console.log('Descargando archivo: ' + archivo);
    alert('Descargando curriculum: ' + archivo);
  }

  // metodo para buscar un usuario por email en el array de candidatos ya cargados
  private findCandidatoByEmail(email: string): Usuario | undefined {
    return this.candidatos.find(candidato => candidato.email === email);
  }

  // metodo público para obtener el nombre completo desde la plantilla
  obtenerNombreCompleto(email: string): string {
    const usuario = this.findCandidatoByEmail(email);
    if (usuario) {
      return `${usuario.nombre} ${usuario.apellidos}`;
    }
    return 'Usuario desconocido';
  }

}