import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../security/auth.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../interfaces/usuario';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  
  authService = inject(AuthService);
  usuariosService = inject(UsuariosService);
  router = inject(Router);

  // Modelo para el formulario
  usuario: Omit<Usuario, 'fecha_Registro' | 'enabled'> = {
    email: '',
    nombre: '',
    apellidos: '',
    password: '',
    rol: 'CLIENTE' // Por defecto, clientes
  };


  confirmPassword: string = '';
  acceptTerms: boolean = false;


  error: string | null = null;
  loading: boolean = false;
  passwordsMatch: boolean = true;

  // Método para verificar si las contraseñas coinciden
  checkPasswords(): void {
    this.passwordsMatch = this.usuario.password === this.confirmPassword;
  }

  // Método para registrar al usuario
  register(): void {
    // Validar que las contraseñas coincidan
    if (this.usuario.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    // Validar que se aceptan los términos
    if (!this.acceptTerms) {
      this.error = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.loading = true;
    this.error = null;

    // Crear un usuario completo con los valores necesarios para el backend
    const usuarioCompleto: Omit<Usuario, 'fecha_Registro' | 'enabled'> = {
      ...this.usuario,
      rol: 'CLIENTE'
    };

    // Usar AuthService.signup que apunta al endpoint público permitido por Spring Security
    this.authService.signup(usuarioCompleto).subscribe({
      next: (success) => {
        if (success) {
          // Si el registro es exitoso, intentar iniciar sesión automáticamente
          this.authService.login(usuarioCompleto.email, usuarioCompleto.password).subscribe({
            next: (loginResult) => {
              if (loginResult) {
                this.router.navigate(['/usuario/dashboard']);
              } else {
                this.error = 'Registro exitoso pero error al iniciar sesión. Por favor, inicia sesión manualmente.';
                this.router.navigate(['/login']);
              }
              this.loading = false;
            },
            error: (err) => {
              console.error('Error en login tras registro:', err);
              this.error = 'Registro exitoso. Por favor, inicia sesión.';
              this.router.navigate(['/login']);
              this.loading = false;
            }
          });
        } else {
          this.error = 'Error al registrar el usuario. Inténtalo de nuevo.';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        if (err.status === 409 || (err.error && err.error.includes('duplicate'))) {
          this.error = 'El correo electrónico ya está en uso.';
        } else {
          this.error = 'Error al conectar con el servidor. Inténtalo más tarde.';
        }
        this.loading = false;
      }
    });
  }
}