import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { PermisosService } from '@core/services/permisos';
import { PermisoClave } from '@core/interfaces/rol';

@Injectable({ providedIn: 'root' })
export class PermisoVerGuard implements CanActivate {
  constructor(
    private permisosService: PermisosService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    // Se espera que la ruta tenga data: { permisoClave: 'EVT' }
    const permisoClave = route.data['permisoClave'] as PermisoClave;
    if (!permisoClave) {
      // Si no se especifica, permite el acceso
      return true;
    }
    if (this.permisosService.can(permisoClave, 'V')) {
      return true;
    }
    // Redirige a una página de error o login
    return this.router.parseUrl('/error/403');
  }
}
