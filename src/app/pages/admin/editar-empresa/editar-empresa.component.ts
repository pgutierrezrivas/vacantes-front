import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Empresa } from '../../../interfaces/empresa';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-editar-empresa',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.css'
})
export class EditarEmpresaComponent {


empresaForm: FormGroup;
subido: boolean = false;
cargando: boolean = false;
empresaId: number = 0;
empresaActual: Empresa | null = null;

  // Lista de países para el select
  paises: string[] = [
    'España', 'Argentina', 'Chile', 'Colombia', 'México', 'Perú', 
    'Uruguay', 'Venezuela', 'Estados Unidos', 'Canadá', 'Brasil', 
    'Francia', 'Alemania', 'Italia', 'Portugal', 'Reino Unido', 'Otro'
  ];

constructor(private fb: FormBuilder, private eService: EmpresasService, private router: Router, private route: ActivatedRoute) {
this.empresaForm = this.fb.group({
  id_empresa: [0, [Validators.required]],
  nombre_empresa: ['',[Validators.required]],
  cif: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{9}$/)]],
  email: ['', [Validators.required, Validators.email]],
  pais: ['', [Validators.required]],
  direccion_fiscal: ['', [Validators.required]]
})
}


ngOnInit(): void {
  //Obtener el ID de la empresa de la URL
  this.route.params.subscribe(params => {
  this.empresaId = +params['id']; // El '+' convierte el parámetro string a número
      this.cargarDatosEmpresa();
  }
  )
}

//Cargar datos de la empresa desde el back
cargarDatosEmpresa(): void {
  this.cargando = true; 
  this.eService.getEmpresaById(this.empresaId)
  .subscribe({
    next: (empresa: Empresa) => {
      this.empresaActual = empresa;
      //rellenar form con datos actuales 
      this.empresaForm.patchValue({
            id_empresa: empresa.id_empresa,
            nombre_empresa: empresa.nombre_empresa,
            cif: empresa.cif,
            email: empresa.email,
            pais: empresa.pais,
            direccion_fiscal: empresa.direccion_fiscal
          });
          this.cargando = false;
    }, error: (error) => {
          console.error('Error al cargar datos de la empresa', error);
          this.cargando = false;
          alert('Error al cargar los datos de la empresa. Por favor, inténtalo de nuevo.');
          this.router.navigate(['/admin/empresas']);
        }
      });
}

//getter para acceder a los controles del form
get controlesTest() {
  return this.empresaForm.controls;
}

onSubmit(): void {
  this.subido = true;

  //si el formulario es invalido lo paramos
  if (this.empresaForm.invalid) {
    //scroll al primer capo error
    const primerElementoConError = document.querySelector('.ng-invalid');
      if(primerElementoConError) {
        primerElementoConError.scrollIntoView({ behavior: 'smooth'});
      }
      return;
  }
  this.cargando =true;

   //Crear objeto empresa actualizado
    const empresaActualizada: Empresa = {
      id_empresa: this.empresaId,
      nombre_empresa: this.empresaForm.value.nombre_empresa,
      cif: this.empresaForm.value.cif,
      email: this.empresaForm.value.email,
      pais: this.empresaForm.value.pais,
      direccion_fiscal: this.empresaForm.value.direccion_fiscal
    };

       //llamada al servicio para actualizar la empresa
    this.eService.modificarEmpresa(empresaActualizada) 
      .subscribe({
        next: (response: Empresa) => {
          console.log('Empresa actualizada con éxito', response);
          this.cargando = false;
          alert('Empresa actualizada con éxito.');
          this.router.navigate(['/admin/empresas']);
        },
        error: (error) => {
          console.error('Error al actualizar la empresa', error);
          this.cargando = false;
          alert('Error al actualizar la empresa. Por favor, inténtalo de nuevo.');
        }
      });
  }


}





