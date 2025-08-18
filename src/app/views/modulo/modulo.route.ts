import { Routes } from '@angular/router'
import { Modulos } from './modulos/modulos'

export const  MODULOS_ROUTES: Routes = [
  {
    path: 'modulo/modulos',
    component: Modulos,
    data: { title: 'Modulos' },
  },

]
