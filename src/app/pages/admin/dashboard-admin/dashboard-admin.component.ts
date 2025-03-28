import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-dashboard-admin',
  imports: [RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent {

  @Input() miUsuario!: Usuario; // para yo poder usarlo en mi html

  ngOnInit() {
    const usuarioGuardado = localStorage.getItem('usuario'); // recuperamos el usuario almacenado del localStorage
    if (usuarioGuardado) {
      this.miUsuario = JSON.parse(usuarioGuardado); // convertimos el string que nos llega en un objeto
    }
  }
}
