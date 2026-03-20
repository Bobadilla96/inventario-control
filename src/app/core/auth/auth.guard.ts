import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../models/user.model';
import { AuthService } from '../services/auth.service';

function evaluate(url: string, roles?: UserRole[]) {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: url } });
  }

  if (roles?.length && !auth.hasAnyRole(roles)) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
}

export const authGuard: CanActivateFn = (route, state) => {
  const roles = route.data?.['roles'] as UserRole[] | undefined;
  return evaluate(state.url, roles);
};

export const authChildGuard: CanActivateChildFn = (route, state) => {
  const roles = route.data?.['roles'] as UserRole[] | undefined;
  return evaluate(state.url, roles);
};
