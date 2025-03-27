import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../security/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authService = inject(AuthService);
  router = inject(Router);

  email: string = '';
  password: string = '';
  error: string | null = null;

  login(): void {

    const isAuthenticated = this.authService.login(this.email, this.password);

    if (isAuthenticated) {

      const rol = this.authService.getRol(); // obtenemos el rol despues de autenticarse

      // y redirigimos a su dashboard correspondiente segun rol
      switch (rol) {
        case 'ADMON':
          this.router.navigate(['/admin/dashboard']);
          break;
        case 'EMPRESA':
          this.router.navigate(['/empresa/dashboard']);
          break;
        case 'CLIENTE':
          this.router.navigate(['/usuario/dashboard']);
          break;
        default:
          this.router.navigate(['/login']); // si el rol no es valido, redirigimos a login
          break;
      }
    } else {
      this.error = 'Correo o contraseña incorrectos';
    }
  }
}
