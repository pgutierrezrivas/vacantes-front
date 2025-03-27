import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';

// permite acceso solo si el usuario tiene un rol especifico
export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);

  const userRole = authService.getRol(); // obtenemos el rol del usuario
  const expectedRole = route.data['expectedRole']; // obtenemos el rol esperado de la ruta

  // si los roles coinciden, permitimos el acceso
  if (userRole === expectedRole) {
    return true;
  }

  // y si no coinciden, lo denegamos
  return false;

};