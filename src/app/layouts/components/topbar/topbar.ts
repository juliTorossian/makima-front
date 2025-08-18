import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { LayoutStoreService } from '@core/services/layout-store.service'

import { ThemeToggler } from '@layouts/components/topbar/components/theme-toggler/theme-toggler'
import { UserProfile } from '@layouts/components/topbar/components/user-profile/user-profile'
import { NotificationDropdown } from '@layouts/components/topbar/components/notification-dropdown/notification-dropdown'
import { ThemeDropdown } from '@layouts/components/topbar/components/theme-dropdown/theme-dropdown'
import { AppLogo } from "@app/components/app-logo";
import { appLogo } from '@/app/constants'

@Component({
  selector: 'app-topbar',
  imports: [
    NgIcon,
    RouterLink,
    ThemeToggler,
    UserProfile,
    NotificationDropdown,
    AppLogo
],
  templateUrl: './topbar.html',
  standalone: true
})
export class Topbar {
  constructor(public layout: LayoutStoreService) {}
  appLogo = appLogo;

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
}
