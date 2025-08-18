import { Routes } from '@angular/router'
import { Productos } from './productos/productos'

export const PRODUCTOS_ROUTES: Routes = [
  {
    path: 'producto/productos',
    component: Productos,
    data: { title: 'Productos' },
  },

]
