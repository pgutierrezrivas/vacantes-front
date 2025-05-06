import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs';

// permite acceso solo si el usuario tiene un rol especifico
export const roleGuard: CanActivateFn = (route) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  return authService.getRol().pipe(
    take(1),
    map(userRole => {
      if (userRole === expectedRole) {
        return true;
      } else {
        router.navigate(['/unauthorized']);
        return false;
      }
    })
  );
};