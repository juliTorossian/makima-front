import { Routes } from '@angular/router'
import { SignIn } from '@/app/views/auth/sign-in'
import { SignUp } from '@/app/views/auth/sign-up'
import { ResetPassword } from '@/app/views/auth/reset-password'
import { NewPassword } from '@/app/views/auth/new-password'
import { LockScreen } from '@/app/views/auth/lock-screen'
import { LinkIntegracion } from './link-integracion'

export const Auth_ROUTES: Routes = [
  {
    path: 'login',
    component: SignIn,
    data: { title: 'Iniciar Sesion' },
  },
  {
    path: 'auth/sign-up',
    component: SignUp,
    data: { title: 'Sign Up' },
  },
  {
    path: 'auth/reset-password',
    component: ResetPassword,
    data: { title: 'Reset Password' },
  },
  {
    path: 'auth/new-password',
    component: NewPassword,
    data: { title: 'New Password' },
  },
  {
    path: 'auth/lock-screen',
    component: LockScreen,
    data: { title: 'Lock Screen' },
  },
  {
    path: 'integraciones/link',
    component: LinkIntegracion,
    data: { title: 'Link Integracion' },
  },
]
