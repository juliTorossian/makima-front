import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DrawerState {
  visible: boolean;
  id: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private eventoDrawerSubject = new BehaviorSubject<DrawerState>({ visible: false, id: null });
  private usuarioDrawerSubject = new BehaviorSubject<DrawerState>({ visible: false, id: null });

  eventoDrawer$ = this.eventoDrawerSubject.asObservable();
  usuarioDrawer$ = this.usuarioDrawerSubject.asObservable();

  abrirEventoDrawer(eventoId: string): void {
    this.eventoDrawerSubject.next({ visible: true, id: eventoId });
  }

  cerrarEventoDrawer(): void {
    this.eventoDrawerSubject.next({ visible: false, id: null });
  }

  abrirUsuarioDrawer(usuarioId: string): void {
    this.usuarioDrawerSubject.next({ visible: true, id: usuarioId });
  }

  cerrarUsuarioDrawer(): void {
    this.usuarioDrawerSubject.next({ visible: false, id: null });
  }
}
