import { Routes } from '@angular/router'
import { Usuarios } from './usuarios/usuarios'
import { Usuario } from './usuario/usuario'

export const USUARIOS_ROUTES: Routes = [
  {
    path: 'usuario/usuarios',
    component: Usuarios,
    data: { title: 'Usuarios' },
  },
  {
    path: 'usuario/perfil/:id',
    component: Usuario,
    data: { title: 'Perfil de Usuario' },
  },
]
