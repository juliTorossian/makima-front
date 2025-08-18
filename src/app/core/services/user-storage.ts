import { Injectable } from '@angular/core';

export interface UsuarioLogeado {
  id: string
  nombre: string
  apellido: string
  email: string
}
const STORAGE_KEY = 'usuario'

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  setUsuario(usuario: UsuarioLogeado): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario))
  }

  getUsuario(): UsuarioLogeado | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }

  clearUsuario(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}
