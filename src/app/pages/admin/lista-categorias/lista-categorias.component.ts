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
    private categoriasService: CategoriasService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categorias = this.categoriasService.getAllCategorias();
    this.categoriasFiltradas = [...this.categorias];
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
    //this.categoriaActual = { id_categoria: 0, nombre: '' };
    this.modoEdicion = false;
  }

  prepararEditarCategoria(categoria: Categoria): void {
    this.categoriaActual = { ...categoria };
    this.modoEdicion = true;
  }

  guardarCategoria(): void {
    alert('HACER!!')
    if (!this.categoriaActual.nombre.trim()) {
      alert('El nombre de la categoría es obligatorio');
      return;
    }

    if (this.modoEdicion) {
      // Actualizar categoría existente
    this.categoriasService.actualizarCategoria(this.categoriaActual);
      alert('Categoría actualizada correctamente');
    } else {
      // Crear nueva categoría
    this.categoriasService.crearCategoria(this.categoriaActual);
      alert('Categoría creada correctamente');
    }

    this.cargarCategorias();
    this.prepararNuevaCategoria();
  }

  eliminarCategoria(arg0: number) {
    throw new Error('Method not implemented.');
    }


}