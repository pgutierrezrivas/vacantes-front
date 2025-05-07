import { Injectable } from '@angular/core';
import { Solicitud } from '../interfaces/solicitud';
import { environment } from '../enviroments/environment.development';
import { HttpClient , HttpErrorResponse} from '@angular/common/http';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  private apiUrl = `${environment.apiUrl}/solicitudes`;


  constructor(private http: HttpClient) {}

  getAllSolicitudes(): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/todos`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSolicitudesByVacanteId(vacanteId: number): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/vacante/${vacanteId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSolicitudesByUserEmail(email: string): Observable<Solicitud[]> {
    return this.http.get<Solicitud[]>(`${this.apiUrl}/usuario/${email}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  getSolicitudById(solicitudId: number): Observable<Solicitud> {
    return this.http.get<Solicitud>(`${this.apiUrl}/uno/${solicitudId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  agregarSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.post<Solicitud>(`${this.apiUrl}/alta`, solicitud)
      .pipe(
        catchError(this.handleError)
      );
  }

  actualizarEstadoSolicitud(solicitudId: number, estado: number): Observable<boolean> {
    // mirar si hay endpoint para esto
    // primero obtenemos la solicitud completa
    return this.getSolicitudById(solicitudId).pipe(
      map(solicitud => {
        solicitud.estado = estado;
        return solicitud;
      }),
      // Luego enviamos la solicitud actualizada al endpoint de modificar
      switchMap(solicitud => 
        this.http.put<Solicitud>(`${this.apiUrl}/modificar`, solicitud)
          .pipe(
            map(() => true),
            catchError(() => {
              return throwError(() => new Error('Error al actualizar el estado de la solicitud'));
            })
          )
      )
    );
  }

  modificarSolicitud(solicitud: Solicitud): Observable<Solicitud> {
    return this.http.put<Solicitud>(`${this.apiUrl}/modificar`, solicitud)
      .pipe(
        catchError(this.handleError)
      );
  }

  eliminarSolicitud(solicitudId: number): Observable<boolean> {
    return this.http.delete<number>(`${this.apiUrl}/eliminar/${solicitudId}`)
      .pipe(
        map(response => response > 0),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // El backend devolvió un código de respuesta fallido
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}
