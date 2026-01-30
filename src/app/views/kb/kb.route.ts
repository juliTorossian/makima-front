import { Routes } from '@angular/router'
import { Kbs } from './kbs/kbs'

export const KB_ROUTES: Routes = [
  {
    path: 'kb/kbs',
    component: Kbs,
    data: { title: 'Knowledge Base' },
  },
]
