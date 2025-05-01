import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SolicitudesService } from '../../services/solicitudes.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Solicitud } from '../../interfaces/solicitud';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postular-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './postular-form.component.html',
  styleUrl: './postular-form.component.css'
})
export class PostularFormComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  solicitudService = inject(SolicitudesService);

  idUsuario: string = '';
  idVacante: number | null = null;

  postularForm: FormGroup;

  constructor() {
    const today = new Date().toISOString().substring(0, 10);
    //inicializamos las variables en el constructor
    this.postularForm = new FormGroup({
      fecha: new FormControl(today, []), //fecha de hoy, campo oculto para el usuario
      archivo: new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ]),
      comentarios: new FormControl('', [
        Validators.minLength(10),
        Validators.maxLength(100),
      ]),
      curriculum: new FormControl('', [
        Validators.pattern('https?://.+'),
      ]),
      id_Vacante: new FormControl(null, []), // valor neutro
      email: new FormControl('', []) // valor neutro
    }, []);
  }

  ngOnInit(): void {
    // obtenemos el id del usuario del localStorage
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.idUsuario = usuario.email;
      this.postularForm.get('email')?.setValue(this.idUsuario);
    }

    // obtenemos id de la vacante de la URL
    const idVacanteFromUrl = this.activatedRoute.snapshot.params['id'];
    if (idVacanteFromUrl) {
      this.idVacante = +idVacanteFromUrl;
      this.postularForm.get('id_Vacante')?.setValue(this.idVacante);
    }
  }

  // funcion generica para poder hacer el control del formulario
  checkControl(formControlName: string, validator: string): boolean | undefined {
    return (this.postularForm.get(formControlName)?.hasError(validator) &&
    this.postularForm.get(formControlName)?.touched)
  }

  getDataForm(): void {
    // obtenemos los valores del formulario
    const formValue: Solicitud = this.postularForm.value as Solicitud;

    const nuevaSolicitud: Solicitud = {
      id_solicitud: 0, // Lo ignora el backend
      fecha: new Date(formValue.fecha),
      archivo: formValue.archivo,
      comentarios: formValue.comentarios,
      estado: 0, // porque se presenta una nueva solicitud
      curriculum: formValue.curriculum,
      id_Vacante: this.idVacante!,
      email: formValue.email
    };
    

    if (this.postularForm.valid) {
      try {
        this.solicitudService.agregarSolicitud(nuevaSolicitud);
        console.log(nuevaSolicitud);
        alert('Solicitud creada correctamente');
        this.router.navigate(['/usuario/vacantes']);
      } catch (error) {
        console.error('Error al crear la solicitud: ', error);
        alert('Error al crear la solicitud. Intentelo de nuevo mas tarde')
      }
    } else {
      console.log('Formulario no válido', this.postularForm.errors);
      alert('Formulario no válido. Por favor, revise todos los campos')
    }
  }
}
