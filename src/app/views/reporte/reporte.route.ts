import { Routes } from '@angular/router'
import { Reportes } from './reportes/reportes'

export const  REPORTES_ROUTES: Routes = [
  {
    path: 'reporte/reportes',
    component: Reportes,
    data: { title: 'Reportes' },
  },

]
