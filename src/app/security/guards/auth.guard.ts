import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

// para evitar que usuarios autenticados accedan a las rutas publicas (como login o registro)
export const authGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // si el usuario esta autenticado, lo redirigimos a su dashboard correspondiente y bloqueamos el acceso a la ruta
  if (authService.isAuthenticated()) {

    const rol = authService.getRol();

    switch (rol) {
      case 'ADMON':
        router.navigate(['/admin/dashboard']);
        return false;
      case 'EMPRESA':
        router.navigate(['/empresa/dashboard']);
        return false;
      case 'CLIENTE':
        router.navigate(['/usuario/dashboard']);
        return false;
    }
  }
  // si no esta autenticado, permitimos el acceso a la ruta
  return true;
};
