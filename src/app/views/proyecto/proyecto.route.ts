import { Routes } from '@angular/router'
import { Proyectos } from './proyectos/proyectos'

export const PROYECTO_ROUTES: Routes = [
  {
    path: 'proyecto/proyectos',
    component: Proyectos,
    data: { title: 'Proyectos' },
  },

]
