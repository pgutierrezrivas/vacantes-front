import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VacantesService } from '../../../services/vacantes.service';

import { Categoria } from '../../../interfaces/categoria';
import { Vacante } from '../../../interfaces/vacante';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { CategoriasService } from '../../../services/categorias.service';
import { EmpresasService } from '../../../services/empresas.service';

@Component({
  selector: 'app-editar-vacante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-vacante.component.html',
  styleUrl: './editar-vacante.component.css'
})
export class EditarVacanteComponent implements OnInit {
  vacanteForm!: FormGroup;
  vacanteId: number = 0;
  idEmpresa: number = 0;
  categorias: Categoria[] = [];
  cargando: boolean = true;
  guardando: boolean = false;
  error: string | null = null;
  fecha: Date = new Date();
  cargandoEmpresa = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vacantesService: VacantesService,
    private categoriaService: CategoriasService,
    private eService: EmpresasService
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario vacío
    this.initForm();

    /*// Obtener el ID de la empresa del localStorage
    const empresaGuardada = localStorage.getItem('empresa');
    if (empresaGuardada) {
      const empresa = JSON.parse(empresaGuardada);
      this.idEmpresa = empresa.id_empresa;
    }*/
    this.obtenerEmpresaDesdeEmail();

    // Obtener el ID de la vacante de los parámetros de la ruta
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.vacanteId = +params['id'];
        this.cargarDatos();
      } else {
        this.error = 'No se encontró la vacante solicitada';
        this.cargando = false;
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

  private initForm(): void {
    this.vacanteForm = this.fb.group({
      idVacante: [0],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]],
      fecha: [new Date()],
      salario: [0, [Validators.required, Validators.min(1)]],
      estatus: ['CREADA', Validators.required],
      destacado: [false],
      imagen: [''],
      detalles: ['', [Validators.required, Validators.minLength(50)]],
      id_Categoria: ['', Validators.required],
      id_empresa: [this.idEmpresa]
    });
  }

  private cargarDatos(): void {
    this.cargando = true;
    this.error = null;

    // Cargar categorías y vacante al mismo tiempo
    forkJoin({
      categorias: this.categoriaService.getAllCategorias().pipe(
        catchError(error => {
          console.error('Error al cargar categorías:', error);
          return of([]);
        })
      ),
      vacante: this.vacantesService.getVacanteById(this.vacanteId).pipe(
        catchError(error => {
          console.error('Error al cargar la vacante:', error);
          this.error = 'No se pudo cargar la vacante solicitada';
          return of(null);
        })
      )
    }).pipe(
      finalize(() => this.cargando = false)
    ).subscribe(({ categorias, vacante }) => {
      this.categorias = categorias;

      if (vacante) {
        // Verificar que la vacante pertenezca a la empresa actual
        if (vacante.id_empresa !== this.idEmpresa) {
          this.error = 'No tiene permisos para editar esta vacante';
          return;
        }

        // Actualizar fecha de la vista previa
        this.fecha = new Date(vacante.fecha);

        // Actualizar el formulario con los datos de la vacante
        this.vacanteForm.patchValue({
          idVacante: vacante.idVacante,
          nombre: vacante.nombre,
          descripcion: vacante.descripcion,
          fecha: new Date(vacante.fecha),
          salario: vacante.salario,
          estatus: vacante.estatus,
          destacado: vacante.destacado,
          imagen: vacante.imagen,
          detalles: vacante.detalles,
          id_Categoria: vacante.id_Categoria,
          id_empresa: vacante.id_empresa
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.vacanteForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  guardarCambios(): void {
    if (this.vacanteForm.invalid) {
      // Marcar todos los campos como tocados para mostrar los errores
      Object.keys(this.vacanteForm.controls).forEach(key => {
        const control = this.vacanteForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.guardando = true;
    const vacante: Vacante = this.vacanteForm.value;

    // Aseguramos que la fecha sea la original si no se modificó
    if (!vacante.fecha) {
      vacante.fecha = this.fecha;
    }

    this.vacantesService.actualizarVacanteCompleta(vacante)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar la vacante:', error);
          alert('No se pudo actualizar la vacante. Por favor, inténtelo de nuevo más tarde.');
          return of(null);
        }),
        finalize(() => this.guardando = false)
      )
      .subscribe(result => {
        if (result) {
          alert('Vacante actualizada correctamente');
          this.router.navigate(['/empresa/vacantes']);
        }
      });
  }

  confirmarEliminar(): void {
    if (confirm(`¿Está seguro que desea eliminar la vacante "${this.vacanteForm.get('nombre')?.value}"?`)) {
      this.guardando = true;
      this.vacantesService.eliminarVacante(this.vacanteId)
        .pipe(
          catchError(error => {
            console.error('Error al eliminar la vacante:', error);
            alert('No se pudo eliminar la vacante. Por favor, inténtelo de nuevo más tarde.');
            return of(0);
          }),
          finalize(() => this.guardando = false)
        )
        .subscribe(result => {
          if (result === 1) {
            alert('Vacante eliminada correctamente');
            this.router.navigate(['/empresa/vacantes']);
          }
        });
    }
  }
}