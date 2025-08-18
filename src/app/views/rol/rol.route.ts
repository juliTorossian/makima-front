import { Routes } from '@angular/router'
import { Roles } from './roles/roles'

export const ROLES_ROUTES: Routes = [
  {
    path: 'rol/roles',
    component: Roles,
    data: { title: 'Roles' },
  },

]
