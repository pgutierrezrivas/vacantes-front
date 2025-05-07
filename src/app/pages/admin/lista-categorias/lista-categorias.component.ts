import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Categoria } from '../../../interfaces/categoria';
import { CategoriasService } from '../../../services/categorias.service';

@Component({
  selector: 'app-lista-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lista-categorias.component.html',
  styleUrl: './lista-categorias.component.css'
})
export class ListaCategoriasComponent implements OnInit {

  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];
  categoriaActual: Categoria = {
    id_categoria: 0, nombre: '',
    descripcion: ''
  };
  modoEdicion: boolean = false;
  filtroTexto: string = '';

  constructor(
    private cService: CategoriasService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.cService.getAllCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.categoriasFiltradas = [...this.categorias];
      },
      error: (error) => {
        console.error('Error al cargar categorias' , error);
        alert('Error al cargar las categorias. Intentelo mas tarde')
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filtroTexto = filterValue;
    
    if (!filterValue) {
      this.categoriasFiltradas = [...this.categorias];
      return;
    }
    
    this.categoriasFiltradas = this.categorias.filter(categoria => 
      categoria.nombre.toLowerCase().includes(filterValue)
    );
  }

  prepararNuevaCategoria(): void {
    this.categoriaActual = {id_categoria: 0, nombre: '', descripcion: ''};
    this.modoEdicion = false;
  }

  prepararEditarCategoria(categoria: Categoria): void {
    this.categoriaActual = { ...categoria };
    this.modoEdicion = true;
  }

  guardarCategoria(): void {
    if (!this.categoriaActual.nombre.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar categoría existente
    this.cService.actualizarCategoria(this.categoriaActual).subscribe({
      next: (categoriaActualizada) => {
        alert('Categoria actualizada correctamente');
        this.cargarCategorias();
        this.prepararNuevaCategoria();
      },
      error: (error) => {
        console.error('Error al actualizar categoria', error);
        alert('Error al actualizar la categoria');
      }
    });
    } else {
      // Crear nueva categoría
    this.cService.crearCategoria(this.categoriaActual).subscribe({
      next: (categoriaNueva) => {
        alert('Categoría creada correctamente');
        this.cargarCategorias();
        this.prepararNuevaCategoria();
      },
      error: (error) => {
        console.error('Error al crear categoria: ', error);
        alert('Error al crear la categoria');
      }
    });
    }
  }

  eliminarCategoria(id: number) {
    if(confirm('¿Esta seguro de que desea eliminar esta categoria?')) {
      this.cService.eliminarCategoria(id).subscribe({
        next: () => {
          alert('Categoria eliminada correctamente');
          this.cargarCategorias();
        },
        error: (error) => {
          console.error('Error al eliminar categoria', error);
          alert('Error al eliminar la categoria');
        }
      })
    }
    }


}