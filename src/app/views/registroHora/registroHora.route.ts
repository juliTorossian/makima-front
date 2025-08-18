import { Routes } from '@angular/router'
import { Horas } from './horas/horas'
import { HorasUsuario } from './horas-usuario/horas-usuario'

export const HORAS_ROUTES: Routes = [
  {
    path: 'hora/horas',
    component: Horas,
    data: { title: 'Horas' },
  },
  {
    path: 'hora/horas/usuario',
    component: HorasUsuario,
    data: { title: 'Horas por Usuario' },
  },


]
