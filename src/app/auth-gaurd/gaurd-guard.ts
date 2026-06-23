import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route, state) => {

  const auth   = inject(AuthService);
  const router = inject(Router);

  // ✅ Always allow verify route — public QR scan page
  if (state.url.startsWith('/verify')) {
    return true;
  }

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};