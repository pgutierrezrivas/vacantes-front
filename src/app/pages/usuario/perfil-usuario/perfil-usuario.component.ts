import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { AuthService } from '../../../security/auth.service';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-usuario',
  imports: [CommonModule],
  templateUrl:'./perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {

  usuario$!: Observable<Usuario | null>; // Declaramos 'usuario' como un Observable
  private subscription: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario$ = this.authService.getUsuario(); // Asignamos el Observable a la variable
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