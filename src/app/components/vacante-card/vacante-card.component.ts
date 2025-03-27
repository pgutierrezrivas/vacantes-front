import { Component, Input } from '@angular/core';
import { Vacante } from '../../interfaces/vacante';
import { BotoneraComponent } from "../botonera/botonera.component";

@Component({
  selector: 'app-vacante-card',
  imports: [BotoneraComponent],
  templateUrl: './vacante-card.component.html',
  styleUrl: './vacante-card.component.css'
})
export class VacanteCardComponent {
  @Input() miVacante! : Vacante;
}
