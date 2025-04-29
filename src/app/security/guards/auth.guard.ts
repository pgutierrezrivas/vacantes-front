import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take, Observable, switchMap, of } from 'rxjs';

// para evitar que usuarios autenticados accedan a las rutas publicas (como login o registro)
export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    take(1),
    switchMap((isAuthenticated) => {
      if (isAuthenticated) {
        return authService.getRol().pipe(
          take(1),
          map((rol) => {
            if (rol === 'ADMON') {
              return router.parseUrl('/admin/dashboard');
            } else if (rol === 'EMPRESA') {
              return router.parseUrl('/empresa/dashboard');
            } else if (rol === 'CLIENTE') {
              return router.parseUrl('/usuario/dashboard');
            }
            return true; // Si el rol no coincide, permitimos el acceso
          })
        );
      }
      // si no esta autenticado, permitimos el acceso a la ruta
      return of(true);
    })
  );
};