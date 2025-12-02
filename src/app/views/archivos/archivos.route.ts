import { Routes } from '@angular/router'
import { ArchivoExplorer } from './archivo-explorer/archivo-explorer'

export const ARCHIVOS_ROUTES: Routes = [
  {
    path: 'archivos',
    component: ArchivoExplorer,
    data: { title: 'Archivos' },
  },

]
