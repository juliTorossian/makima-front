import { Routes } from '@angular/router'
import { Etapas } from './etapas/etapas'

export const ETAPAS_ROUTES: Routes = [
  {
    path: 'etapa/etapas',
    component: Etapas,
    data: { title: 'Etapas' },
  },

]
