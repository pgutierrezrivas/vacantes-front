import { Component, OnInit } from '@angular/core';
import { CommonModule,  } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categoria } from '../../../interfaces/categoria';
import { CategoriasService } from '../../../services/categorias.service';
import { VacantesService } from '../../../services/vacantes.service';
import { Vacante, VacanteStatus } from '../../../interfaces/vacante';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-crear-vacante',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-vacante.component.html',
  styleUrl: './crear-vacante.component.css'
})
export class CrearVacanteComponent implements OnInit {
vacanteForm!: FormGroup;
categorias: Categoria[] = [];
idEmpresa: number = 0;
submitted = false;

constructor(
private fb: FormBuilder,
private vService: VacantesService,
private cService: CategoriasService,
private router: Router
) {}

ngOnInit(): void {
  //obtener categoria para el select
  this.obtenerCategorias();

  //Ontener el ID de empresa del localStorage
  const empresaGuardada = localStorage.getItem('empresa');
  if (empresaGuardada) {
    const empresa = JSON.parse(empresaGuardada);
    this.idEmpresa = empresa.id_empresa;
  }


  this.inicializarFormulario();
}

obtenerCategorias(): void {
  // Asignar directamente el resultado a nuestra propiedad categorias
  this.categorias = this.cService.getAllCategorias();
}

inicializarFormulario(): void {
  this.vacanteForm = this.fb.group({
    nombre: ['',[Validators.required, Validators.maxLength(200)]],
    descripcion: ['',[Validators.required]],
    salario: ['',[Validators.required, Validators.min(0)]],
    destacado: [false],
    id_Categoria: ['', [Validators.required]],
    detalles: ['',[Validators.required]],
    imagen: ['',[Validators.required]]
  });
}

onSubmit(): void {

  this.submitted = true;

  if(this.vacanteForm.invalid) {
    console.log('Formulario invalido');
    return;
  }
  //crear el objeto vacante con los valores del formulario
  const nuevaVacante: Vacante = {
    ...this.vacanteForm.value, 
    id_vacante: 0, //se asignara automaticamente en el backend
    fecha: new Date(),
    estatus: 'CREADA' as VacanteStatus,
    id_empresa: this.idEmpresa
  };

  try {
    //llamar al service para guardar vacvnte
    this.vService.crearVacante(nuevaVacante);

    //exito
    alert('Vacante publicada correctamente');

    this.router.navigate(['/empresa/dashboard']);
  } catch (error) {
    console.error('Error al crear la vacante: ', error);
    alert('Error al publicar la vacante. Intentelo de nuevo mas tarde')
  }
}

cancelar(): void {
  this.router.navigate(['/empresa/dashboard']);
}


}
