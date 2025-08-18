import { Routes } from '@angular/router'
import { Entornos } from './entornos/entornos'

export const  ENTORNOS_ROUTES: Routes = [
  {
    path: 'entorno/entornos',
    component: Entornos,
    data: { title: 'Entornos' },
  },

]
