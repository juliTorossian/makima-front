import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
} from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { NgIcon } from '@ng-icons/core'
import { EstadosNotificacion, NotificacionService } from '@core/services/notificacion'
import { UserStorageService, UsuarioLogeado } from '@core/services/user-storage'
import { showError } from '@/app/utils/message-utils'
import { MessageService } from 'primeng/api'
import { Notificacion } from '@core/interfaces/notificacion'
import { getTimeAgo } from '@/app/utils/datetime-utils'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { getIconNameAccion } from '@/app/constants/actividad_acciones'
import { parseTimeToMs } from '@/app/utils/time-utils'

const TIEMPO_INTERVALO = parseTimeToMs('30m');

@Component({
  selector: 'app-notification-dropdown',
  imports: [
    NgbDropdown,
    NgbDropdownToggle,
    SimplebarAngularModule,
    NgbDropdownMenu,
    NgIcon,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './notification-dropdown.html',
  styleUrls: ['./notificacion-dropdown.scss'],
})
export class NotificationDropdown implements OnInit{
  private intervalId: any;
  private notificacionService = inject(NotificacionService);
  private userStorageService = inject(UserStorageService);
  private messageService = inject(MessageService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  usuarioActivo:UsuarioLogeado | null = this.userStorageService.getUsuario();
  notifications: Notificacion[] = [];

  verSoloNoLeidas = false;

  getIconNameAccion=getIconNameAccion

  ngOnInit(): void {
    this.loadNotifications();
    this.intervalId = setInterval(() => {
      this.loadNotifications();
    }, TIEMPO_INTERVALO);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadNotifications(): void {

    let filtro = this.verSoloNoLeidas ? EstadosNotificacion.NoLeidas : EstadosNotificacion.Todas;

    this.notificacionService.getByUsuario(this.usuarioActivo?.id||'', 10, filtro).subscribe({
      next: (data) => {
        // console.log(data)
        this.notifications = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        showError(this.messageService, 'Error', 'No se pudieron cargar las notificaciones');
        console.error('Error loading notifications:', error);
      }
    });
  }

  toggleLida(notificacion: Notificacion) {
    this.notificacionService.toggleLeida(notificacion.id?.toString()||'').subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        showError(this.messageService, 'Error', 'No se pudo cambiar el estado de la notificación');
        console.error('Error toggling notification read status:', error);
      }
    });
  }

  getTimeAgo(fecha: Date) { return getTimeAgo(new Date(fecha)) }

  getCantidadNoLeidas(): number {
    return this.notifications.filter(n => !n.leida).length;
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      if (!notification.leida) {
        this.toggleLida(notification);
      }
    });
  }

  onToggleNoLeidas(event: Event) {
    setTimeout(() => {
      this.verSoloNoLeidas = (event.target as HTMLInputElement).checked;
      this.loadNotifications();
    });
  }

}
