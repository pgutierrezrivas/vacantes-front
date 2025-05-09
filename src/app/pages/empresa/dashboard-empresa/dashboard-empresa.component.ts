import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Usuario } from '../../../interfaces/usuario';
import { AnimacionTextoComponent } from "../../../shared/animacion-texto/animacion-texto.component";
import { Empresa } from '../../../interfaces/empresa';
import { Vacante } from '../../../interfaces/vacante';

@Component({
  selector: 'app-dashboard-empresa',
  imports: [RouterLink, AnimacionTextoComponent],
  templateUrl: './dashboard-empresa.component.html',
  styleUrl: './dashboard-empresa.component.css'
})



export class DashboardEmpresaComponent implements OnInit {

  saludosFrases: string[] = [];
  vacantes: Vacante[] = [];     
  @Input() miEmpresa!: Empresa;
  @Input() miUsuario!: Usuario;

  ngOnInit() {
    // Recuperamos los datos guardados
    const usuarioGuardado = localStorage.getItem('usuario');
    const empresaGuardada = localStorage.getItem('empresa');
    
    if (usuarioGuardado) {
      this.miUsuario = JSON.parse(usuarioGuardado);
    }
    
    if (empresaGuardada) {
      this.miEmpresa = JSON.parse(empresaGuardada);
      
      // Configuramos las frases de la animación con el nombre de la empresa
      this.saludosFrases = [
        `¡Hola ${this.miEmpresa.nombre_empresa}!`,
        `¿En qué podemos ayudarte hoy?`,
        `Bienvenido a tu dashboard`,
        `Gestiona tus vacantes fácilmente`,
        `Encuentra el mejor talento`
      ];
    } else {
      // En caso de que no haya datos de empresa, usamos frases genéricas
      this.saludosFrases = [
        `¡Bienvenido ${this.miUsuario.nombre}!`,
        `¿En qué podemos ayudarte hoy?`,
        `Gestiona tus vacantes fácilmente`,
        `Encuentra el mejor talento`,
        `Explora nuestros servicios`
      ];
    }
  }
}