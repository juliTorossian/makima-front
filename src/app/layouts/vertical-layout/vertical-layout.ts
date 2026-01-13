import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { SidenavComponent } from '@layouts/components/sidenav/sidenav.component'
import { Topbar } from '@layouts/components/topbar/topbar'
import { debounceTime, fromEvent, Subscription } from 'rxjs'
import { LayoutStoreService } from '@core/services/layout-store.service'
import { DialogModule } from 'primeng/dialog'
import { SHORTCUTS } from '@/app/constants/shortcut'
import { ShortcutTable } from "@layouts/components/shortcut-table/shortcut-table";
import { EventoCronometroComponent } from '@app/components/evento-cronometro';
import { Footer } from '@layouts/components/footer/footer'
import { DrawerContainerComponent } from '@app/components/drawer-container/drawer-container'

@Component({
  selector: 'app-vertical-layout',
  imports: [
    RouterOutlet,
    SidenavComponent,
    Topbar,
    ShortcutTable,
    EventoCronometroComponent,
    Footer,
    DrawerContainerComponent,
],
  templateUrl: './vertical-layout.html',
  styles: `
    .content-page {
      position: relative;
    }
  `,
})
export class VerticalLayout implements OnInit, OnDestroy {
  @ViewChild(EventoCronometroComponent) cronometroComponent!: EventoCronometroComponent;
  
  constructor(public layout: LayoutStoreService) {}
  resizeSubscription!: Subscription

  ngOnInit() {
    this.onResize()

    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => this.onResize())
  }

  onResize(): void {
    const width = window.innerWidth

    if (width <= 1140) {
      this.layout.setSidenavSize('offcanvas')
    } else {
      this.layout.setSidenavSize('default')
    }
  }

  ngOnDestroy(): void {
    this.resizeSubscription?.unsubscribe()
  }
}
