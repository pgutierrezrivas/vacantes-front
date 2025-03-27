import { Injectable } from '@angular/core';
import { CATEGORIAS_DB } from '../db/categorias.db';
import { Categoria } from '../interfaces/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private arrCategorias : Categoria[];

  constructor() { 
    this.arrCategorias = CATEGORIAS_DB;
  }

  getAllCategorias() : Categoria[] {
    return this.arrCategorias;
  }

}
