import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLogged()) return true;

  auth.setReturnUrl(router.url);
  return router.parseUrl('/auth/login');
};
