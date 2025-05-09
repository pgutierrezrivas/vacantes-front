import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Vacante } from '../../../interfaces/vacante';
import { Categoria } from '../../../interfaces/categoria';
import { VacantesService } from '../../../services/vacantes.service';
import { CategoriasService } from '../../../services/categorias.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-editar-vacante',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-vacante.component.html',
  styleUrl: './editar-vacante.component.css'
})
export class EditarVacanteComponent implements OnInit {
  vacanteForm!: FormGroup;
  vacante!: Vacante;
  categorias: Categoria[] = [];
  idVacante: number = 0;
  idEmpresa: number = 0;
  cargando: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vService: VacantesService,
    private categoriaService: CategoriasService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la vacante de los parámetros de la URL
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idVacante = +idParam;
    }
    
    // Obtener el ID de la empresa del localStorage
    const empresaGuardada = localStorage.getItem('empresa');
    if (empresaGuardada) {
      const empresa = JSON.parse(empresaGuardada);
      this.idEmpresa = empresa.id_empresa;
    }
    
    // Inicializar el formulario vacío
    this.initForm();
    
    // Cargar las categorías
    this.cargarCategorias();
    
    // Cargar los datos de la vacante
    if (this.idVacante) {
      this.cargarVacante();
    }
  }

  initForm(): void {
    this.vacanteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      detalles: ['', [Validators.required, Validators.minLength(20)]],
      salario: [0, [Validators.required, Validators.min(0)]],
      id_Categoria: [0, [Validators.required, Validators.min(1)]],
      destacado: [false],
      imagen: ['']
    });
  }

  cargarCategorias(): void {
    this.cargando = true;
    this.categoriaService.getAllCategorias()
      .pipe(
        catchError(error => {
          console.error('Error al cargar categorías:', error);
          this.error = 'No se pudieron cargar las categorías. Por favor, inténtelo de nuevo.';
          return of([]);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(categorias => {
        this.categorias = categorias;
      });
  }

  cargarVacante(): void {
    this.cargando = true;
    this.vService.getVacanteById(this.idVacante)
      .pipe(
        catchError(error => {
          console.error('Error al cargar la vacante:', error);
          this.error = 'No se pudo cargar la información de la vacante. Por favor, inténtelo de nuevo.';
          return of(null);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(vacante => {
        if (vacante) {
          this.vacante = vacante;
          
          // Verificar que la vacante pertenece a la empresa actual
          if (vacante.id_empresa !== this.idEmpresa) {
            this.error = 'No tiene permisos para editar esta vacante.';
            setTimeout(() => {
              this.router.navigate(['/empresa/vacantes']);
            }, 2000);
            return;
          }
          
          // Actualizar el formulario con los datos de la vacante
          this.vacanteForm.patchValue({
            nombre: vacante.nombre,
            descripcion: vacante.descripcion,
            detalles: vacante.detalles,
            salario: vacante.salario,
            id_Categoria: vacante.id_Categoria,
            destacado: vacante.destacado,
            imagen: vacante.imagen || ''
          });
        }
      });
  }

  guardarCambios(): void {
    if (this.vacanteForm.invalid) {
      this.vacanteForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const vacanteActualizada: Vacante = {
      ...this.vacante,
      ...this.vacanteForm.value,
      id_empresa: this.idEmpresa
    };

    this.vService.actualizarVacanteCompleta(vacanteActualizada)
      .pipe(
        catchError(error => {
          console.error('Error al actualizar la vacante:', error);
          this.error = 'No se pudo actualizar la vacante. Por favor, inténtelo de nuevo.';
          return of(null);
        }),
        finalize(() => this.cargando = false)
      )
      .subscribe(result => {
        if (result) {
          this.successMessage = 'Vacante actualizada correctamente';
          setTimeout(() => {
            this.router.navigate(['/empresa/vacantes']);
          }, 1500);
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['/empresa/vacantes']);
  }

  // Métodos de utilidad para las validaciones
  get nombreInvalid(): boolean {
    return this.vacanteForm.get('nombre')?.invalid && this.vacanteForm.get('nombre')?.touched || false;
  }

  get descripcionInvalid(): boolean {
    return this.vacanteForm.get('descripcion')?.invalid && this.vacanteForm.get('descripcion')?.touched || false;
  }

  get detallesInvalid(): boolean {
    return this.vacanteForm.get('detalles')?.invalid && this.vacanteForm.get('detalles')?.touched || false;
  }

  get salarioInvalid(): boolean {
    return this.vacanteForm.get('salario')?.invalid && this.vacanteForm.get('salario')?.touched || false;
  }

  get categoriaInvalid(): boolean {
    return this.vacanteForm.get('id_Categoria')?.invalid && this.vacanteForm.get('id_Categoria')?.touched || false;
  }
}