import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../security/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
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
    this.authService.login(this.email, this.password).subscribe(response => {

      if (!!response) {
        switch (response.rol) {
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
            this.router.navigate(['/login']);
            break;
        }
      } else {
        this.error = 'Correo o contraseña incorrectos';
      }
    });
  }
}