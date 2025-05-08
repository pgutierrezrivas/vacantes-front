import { Component, inject, Input, OnInit } from '@angular/core';
import { Vacante } from '../../../interfaces/vacante';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { PostularFormComponent } from "../../../components/postular-form/postular-form.component";
import { VacantesService } from '../../../services/vacantes.service';

@Component({
  selector: 'app-detalle-vacante',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, PostularFormComponent],
  templateUrl: './detalle-vacante.component.html',
  styleUrl: './detalle-vacante.component.css'
})

export class DetalleVacanteComponent implements OnInit {
  vacante: Vacante | null = null;

  private route = inject(ActivatedRoute);
  private vacantesService = inject(VacantesService);

  ngOnInit(): void {
    const idVacante = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(idVacante)) {
      this.vacantesService.getVacanteById(idVacante).subscribe({
        next: (data) => this.vacante = data,
        error: (err) => {
          console.error('Error al cargar la vacante:', err);
          this.vacante = null;
        }
      });
    }
  }
}