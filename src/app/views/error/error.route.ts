import { Routes } from '@angular/router'
import { Error404 } from '@/app/views/error/error-404'
import { Error403 } from './error-403'

export const ERROR_PAGES_ROUTES: Routes = [
  {
    path: 'error/404',
    component: Error404,
    data: { title: 'Error 404' },
  },
  {
    path: 'error/403',
    component: Error403,
    data: { title: 'Error 403' },
  },
]
