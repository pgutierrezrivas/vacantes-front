import { Component, OnInit } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Categoria } from '../../../interfaces/categoria';
import { CategoriasService } from '../../../services/categorias.service';
import { VacantesService } from '../../../services/vacantes.service';
import { Vacante, VacanteStatus } from '../../../interfaces/vacante';
import { Router, RouterLink } from '@angular/router';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-crear-vacante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crear-vacante.component.html',
  styleUrl: './crear-vacante.component.css'
})
export class CrearVacanteComponent implements OnInit {
  vacanteForm!: FormGroup;
  categorias: Categoria[] = [];
  idEmpresa: number = 0;
  submitted = false;
  cargandoCategorias = false;
  cargandoEmpresa = false;
  cargandoEnvio = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vService: VacantesService,
    private cService: CategoriasService,
    private eService: EmpresasService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
    this.obtenerEmpresaDesdeEmail();
    this.inicializarFormulario();
  }

  obtenerCategorias(): void {
    this.cargandoCategorias = true;
    this.cService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargandoCategorias = false;
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.error = 'No se pudieron cargar las categorías.';
        this.cargandoCategorias = false;
      }
    });
  }

  obtenerEmpresaDesdeEmail(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      const email = usuario.email;

      if (email) {
        this.cargandoEmpresa = true;
        this.eService.getEmpresaPorUsuario(email).subscribe({
          next: (empresa) => {
            this.idEmpresa = empresa.id_empresa;
            this.cargandoEmpresa = false;
          },
          error: (err) => {
            console.error('Error al obtener la empresa por email', err);
            this.error = 'No se pudo obtener la información de la empresa.';
            this.cargandoEmpresa = false;
          }
        });
      }
    }
  }

  inicializarFormulario(): void {
    this.vacanteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', [Validators.required]],
      salario: ['', [Validators.required, Validators.min(0)]],
      destacado: [false],
      id_Categoria: ['', [Validators.required]],
      detalles: ['', [Validators.required]],
      imagen: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.idEmpresa === 0) {
      alert('No se ha cargado la empresa correctamente.');
      return;
    }

    if (this.vacanteForm.invalid) {
      return;
    }

    const destacadoByte = this.vacanteForm.value.destacado ? 1 : 0;

    const nuevaVacante: Vacante = {
      ...this.vacanteForm.value,
      id_vacante: 0,
      fecha: new Date(),
      estatus: 'CREADA' as VacanteStatus,
      id_empresa: this.idEmpresa,
      destacado: destacadoByte
    };

    this.cargandoEnvio = true;

    this.vService.crearVacante(nuevaVacante).subscribe({
      next: () => {
        this.cargandoEnvio = false;
        alert('Vacante publicada correctamente');
        this.router.navigate(['/empresa/dashboard']);
      },
      error: (error) => {
        this.cargandoEnvio = false;
        console.error('Error al crear la vacante:', error);
        alert('Error al publicar la vacante. Inténtelo de nuevo más tarde.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/empresa/dashboard']);
  }

}
