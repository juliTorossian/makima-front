import { Routes } from '@angular/router'
import { Parametros } from './parametros/parametros'

export const PARAMETROS_ROUTES: Routes = [
  {
    path: 'parametro/parametros',
    component: Parametros,
    data: { title: 'Parámetros' },
  },
]
