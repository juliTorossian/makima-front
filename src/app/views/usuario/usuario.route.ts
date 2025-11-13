import { Routes } from '@angular/router'
import { Usuarios } from './usuarios/usuarios'
import { Usuario } from './usuario/usuario'
import { PermisoClave } from '@core/interfaces/rol'
import { PermisoVerGuard } from '@core/guards/permiso-ver.guard'

export const USUARIOS_ROUTES: Routes = [
  {
    path: 'usuario/usuarios',
    component: Usuarios,
    data: { title: 'Usuarios',  permisoClave: PermisoClave.USUARIO },
    canActivate: [PermisoVerGuard]
  },
  {
    path: 'usuario/perfil/:id',
    component: Usuario,
    data: { title: 'Perfil de Usuario', isPublic: true },
  },
]
