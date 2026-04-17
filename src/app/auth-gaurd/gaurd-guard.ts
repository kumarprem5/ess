import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { inject, Inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const auth = Inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};