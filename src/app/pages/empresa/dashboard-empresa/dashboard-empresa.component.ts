import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-dashboard-empresa',
  imports: [RouterLink],
  templateUrl: './dashboard-empresa.component.html',
  styleUrl: './dashboard-empresa.component.css'
})
export class DashboardEmpresaComponent {

  @Input() miUsuario!: Usuario; // para yo poder usarlo en mi html

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario'); // recuperamos el usuario almacenado del localStorage
    if (usuarioGuardado) {
      this.miUsuario = JSON.parse(usuarioGuardado); // convertimos el string que nos llega en un objeto
    }
  }
}
