import { Routes } from '@angular/router'
import { TiposEvento } from './tipos-evento/tipos-evento'

export const TIPO_EVENTO_ROUTES: Routes = [
  {
    path: 'tipo-evento/tipos-evento',
    component: TiposEvento,
    data: { title: 'Tipos evento' },
  },

]
