import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const aS = inject(Auth);
  const router = inject(Router)

  if(aS.user !== null) {
    aS.logout();
    router.navigate(['/']);
    return false;
  }

  return true;
};
