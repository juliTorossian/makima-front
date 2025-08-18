import { Routes } from '@angular/router'
import { Dashboard } from './dashboard/dashboard'
import { PermisoVerGuard } from '@core/guards/permiso-ver.guard'

export const VIEWS_ROUTES: Routes = [
  {
    path: 'dashboard',
    component: Dashboard,
    data: { title: 'Dashboard', permisoClave: 'ADM' },
  },
  {
    path: '',
    loadChildren: () =>
      import('./usuario/usuario.route').then((mod) => mod.USUARIOS_ROUTES),
    data: { permisoClave: 'USR' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./rol/rol.route').then((mod) => mod.ROLES_ROUTES),
    data: { permisoClave: 'ROL' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./etapa/etapa.route').then((mod) => mod.ETAPAS_ROUTES),
    data: { permisoClave: 'ETA' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./tipo-evento/tipo-evento.route').then((mod) => mod.TIPO_EVENTO_ROUTES),
    data: { permisoClave: 'TEV' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./entorno/entorno.route').then((mod) => mod.ENTORNOS_ROUTES),
    data: { permisoClave: 'ENT' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./producto/producto.route').then((mod) => mod.PRODUCTOS_ROUTES),
    data: { permisoClave: 'PRD' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./modulo/modulo.route').then((mod) => mod.MODULOS_ROUTES),
    data: { permisoClave: 'MOD' },
    canActivate: [PermisoVerGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./cliente/cliente.route').then((mod) => mod.CLIENTE_ROUTES),
    data: { permisoClave: 'CLI' },
    canActivate: [PermisoVerGuard]
  },
  // Evento y registroHora quedan públicos
  {
    path: '',
    loadChildren: () =>
      import('./evento/evento.route').then((mod) => mod.EVENTOS_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./registroHora/registroHora.route').then((mod) => mod.HORAS_ROUTES),
  },
  
]
