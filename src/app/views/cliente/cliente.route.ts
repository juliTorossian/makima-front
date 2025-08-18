import { Routes } from '@angular/router'
import { Clientes } from './clientes/clientes'

export const CLIENTE_ROUTES: Routes = [
  {
    path: 'cliente/clientes',
    component: Clientes,
    data: { title: 'Clientes' },
  },

]
