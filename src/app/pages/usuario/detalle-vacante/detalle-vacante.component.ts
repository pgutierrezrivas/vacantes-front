import { Component, Input, OnInit } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VACANTES_DB } from '../../../db/vacantes.db';
import { PostularFormComponent } from "../../../components/postular-form/postular-form.component";

@Component({
  selector: 'app-detalle-vacante',
  imports: [CommonModule, RouterModule, PostularFormComponent],
  templateUrl: './detalle-vacante.component.html',
  styleUrl: './detalle-vacante.component.css'
})
export class DetalleVacanteComponent  implements OnInit {
  
  vacante: Vacante | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {

    const idVacante = Number(this.route.snapshot.paramMap.get('id'));
    this.vacante = VACANTES_DB.find(v => v.id_vacante === idVacante) || null;
  }
}