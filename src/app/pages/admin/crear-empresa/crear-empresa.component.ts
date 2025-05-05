import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { EmpresasService } from '../../../services/empresas.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Empresa } from '../../../interfaces/empresa';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-empresa',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-empresa.component.html',
  styleUrl: './crear-empresa.component.css'
})
export class CrearEmpresaComponent {
  
  empresaForm: FormGroup;
  subido: boolean = false;
  cargando: boolean = false;
  
  // Lista de países para el select
  paises: string[] = [
    'España', 'Argentina', 'Chile', 'Colombia', 'México', 'Perú', 
    'Uruguay', 'Venezuela', 'Estados Unidos', 'Canadá', 'Brasil', 
    'Francia', 'Alemania', 'Italia', 'Portugal', 'Reino Unido', 'Otro'
  ];

  constructor(
    private fb: FormBuilder, 
    private eService: EmpresasService,
    private uService: UsuariosService,
    private router: Router
  ) {
    this.empresaForm = this.fb.group({
      //Datos de la empresa
      nombre_empresa: ['', [Validators.required]],
      cif: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      pais: ['', [Validators.required]],
      direccion_fiscal: ['', [Validators.required]],

      //Datos del usuario administrador
      nombre: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      usuario_email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern(/^[0-9]{9}$/)]]
    })
  }

  ngOnInit(): void {

  }

  //Getter para acceder a los controles del form
  get controlesTest() {
    return this.empresaForm.controls;
  }

  generateRandomPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  onSubmit(): void {
    this.subido = true;

    //si el formulario es invalido lo detenemos
    if (this.empresaForm.invalid) {
      //scroll al primer campo error
      const primerElementoConError = document.querySelector('.ng-invalid');
      if(primerElementoConError) {
        primerElementoConError.scrollIntoView({ behavior: 'smooth'});
      }
      return;
    }
    this.cargando = true

    //Crear objeto empresa
    const nuevaEmpresa: Empresa ={
      id_empresa: 0, //el backend se lo asignara
      nombre_empresa: this.empresaForm.value.nombre_empresa,
      cif: this.empresaForm.value.cif,
      email: this.empresaForm.value.email,
      pais: this.empresaForm.value.pais,
      direccion_fiscal: this.empresaForm.value.direccion_fiscal
    };

    //crear objeto usuario
    const nuevoUsuario = {
      nombre: this.empresaForm.value.nombre,
      apellidos: this.empresaForm.value.apellidos,
      email: this.empresaForm.value.usuario_email,
      telefono: this.empresaForm.value.telefono || '',
      password: this.generateRandomPassword(),
      rol: 'EMPRESA',
      enabled: 1
    };

    //llamada al servicio para crear la empresa y el user asociado a esta
    this.eService.crearEmpresa(nuevaEmpresa, nuevoUsuario) 
    .subscribe({
      next: (response: { exito: boolean; mensaje: string; data?: any}) => {
        console.log('Empresa creada con exito', response);
        this.cargando = false;
        alert('Empresa creada con exito. Se ha generado un usuario con rol EMPRESA.');
        this.router.navigate(['/admin/empresas']);
      },
      error: (error: { exito: boolean; mensaje: string; data?: any}) => {
        console.error('Error al crear la empresa', error);
        this.cargando = false;
        // Mostrar mensaje de error
        alert('Error al crear la empresa. Por favor, inténtalo de nuevo.');
      }
    })

  }

}
