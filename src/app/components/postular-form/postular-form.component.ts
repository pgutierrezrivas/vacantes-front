import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Solicitud } from '../../interfaces/solicitud';

@Component({
  selector: 'app-postular-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './postular-form.component.html',
  styleUrl: './postular-form.component.css'
})
export class PostularFormComponent {

  @Input() vacanteId: number | null = null;

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  solicitudService = inject(SolicitudesService);

  postularForm: FormGroup;

  private subscription!: Subscription;

  constructor() {
    const today = new Date().toISOString().substring(0, 10);
    //inicializo las variables en el constructor
    this.postularForm = new FormGroup({
      fecha: new FormControl(today, []), //fecha de hoy, campo oculto para el usuario
      comentarios: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      curriculum: new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ])
    }, []);
  }

  //funcion generica para poder hacer el control del formulario
  checkControl(formControlName: string, validator: string): boolean | undefined {
    return (this.postularForm.get(formControlName)?.hasError(validator) &&
    this.postularForm.get(formControlName)?.touched)
  }

  getDataForm(): void {
    // obtengo los valores del formulario
    let newSolicitud: Solicitud = this.postularForm.value as Solicitud;
    // me aseguro de que id_vacante no sea null antes de asignarla
    if (this.vacanteId !== null) {
      newSolicitud.id_Vacante = this.vacanteId!;
    } else {
      alert('No se encontró una vacante válida.');
      return;
    }

    // verifico si el formulario es valido
    if (this.postularForm.valid) {
      // modo creacion de una solicitud (insert)
      this.solicitudService.insert(newSolicitud).subscribe({
        next: (response: Solicitud) => {
          console.log('Solicitud creada: ', response);
          alert('Solicitud creada correctamente');
          this.router.navigate(['/usuario/vacantes']);
        },
        error: (err) => {
          console.error('Error al crear la solicitud: ', err);
          alert('Hubo un error al crear la solicitud');
        }
      });
    } else {
      console.log('Formulario no válido', this.postularForm.errors);
      alert('Formulario no válido. Por favor, revise todos los campos')
    }
  }

  // si se abandona la pagina antes de que la solicitud se complete, cancelo la suscripcion para evitar fugas de memoria
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // cancelar la suscripción
    }
  }
}
