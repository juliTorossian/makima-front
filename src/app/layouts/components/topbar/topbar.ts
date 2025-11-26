import { ChangeDetectorRef, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { LayoutStoreService } from '@core/services/layout-store.service'

import { ThemeToggler } from '@layouts/components/topbar/components/theme-toggler/theme-toggler'
import { UserProfile } from '@layouts/components/topbar/components/user-profile/user-profile'
import { NotificationDropdown } from '@layouts/components/topbar/components/notification-dropdown/notification-dropdown'
import { ThemeDropdown } from '@layouts/components/topbar/components/theme-dropdown/theme-dropdown'
import { AppLogo } from "@app/components/app-logo";
import { appLogo } from '@/app/constants'
import { UserNotes } from '../user-notes/user-notes'

@Component({
  selector: 'app-topbar',
  imports: [
    NgIcon,
    RouterLink,
    ThemeToggler,
    UserProfile,
    NotificationDropdown,
    AppLogo,
    UserNotes,
    // ThemeDropdown,
],
  templateUrl: './topbar.html',
  standalone: true
})
export class Topbar {
  constructor(
    public layout: LayoutStoreService,
    protected cdr: ChangeDetectorRef,
  ) {}
  appLogo = appLogo;

  // Estado para el offcanvas
  showUserNotes = false;
  // eventoSeleccionadoId: string | null = null;

  toggleSidebar() {
    const html = document.documentElement
    const currentSize = html.getAttribute('data-sidenav-size')
    const savedSize = this.layout.sidenavSize


    if (currentSize === 'offcanvas') {
      html.classList.toggle('sidebar-enable')
      this.layout.showBackdrop()
    } else {
      this.layout.setSidenavSize(
        currentSize === 'collapse' ? 'default' : 'collapse'
      )
    }
  }
  
  abrirUserNotes() {
    // this.eventoSeleccionadoId = evento.id || null;
    this.showUserNotes = true;
    this.cdr.detectChanges();
  }

  cerrarUserNotes() {
    this.showUserNotes = false;
    // this.eventoSeleccionadoId = null;
    this.cdr.detectChanges();
  }
}
