import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../../security/auth.service';
import { EmpresasService } from '../../../services/empresas.service';
import { Empresa } from '../../../interfaces/empresa';

@Component({
  selector: 'app-perfil-empresa',
  imports: [CommonModule],
  templateUrl: './perfil-empresa.component.html',
  styleUrl: './perfil-empresa.component.css'
})
export class PerfilEmpresaComponent implements OnInit {

  usuario$!: Observable<Usuario | null>;
  empresa?: Empresa;
  private subscription: Subscription | undefined;

  constructor(private authService: AuthService, private eService: EmpresasService) { }

  ngOnInit(): void {
    this.usuario$ = this.authService.getUsuario();

    this.subscription = this.usuario$.subscribe(usuario => {
      console.log('Usuario recibido:', usuario);

      if (usuario?.email) {
        this.eService.getEmpresaPorUsuario(usuario.email).subscribe(empresa => {
          console.log('Empresa recibida:', empresa);
          this.empresa = empresa;
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Desuscribirse para evitar fugas de memoria
    }
  }

  editarPerfil() {
    throw new Error('Method not implemented.');
  }

}
