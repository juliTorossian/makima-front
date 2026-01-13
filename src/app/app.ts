import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import * as tablerIcons from '@ng-icons/tabler-icons'
import * as tablerIconsFill from '@ng-icons/tabler-icons/fill'
import * as lucideIcons from '@ng-icons/lucide'
import { provideIcons } from '@ng-icons/core';
import { filter, map, mergeMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Toast, ToastModule } from "primeng/toast";
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { appTitle } from './constants';
import Clarity from '@microsoft/clarity';
import { CHANGELOG } from '@core/services/changelog';
import { ChangelogModalComponent } from '@views/changelog/changelog-modal';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    LoadingSpinnerComponent,
    ToastModule
  ],
  providers: [
    MessageService,
    DialogService
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  viewProviders: [
    provideIcons({ ...tablerIcons, ...tablerIconsFill, ...lucideIcons }),
  ],
})
export class App implements OnInit {
  private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private loadingService = inject(LoadingService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);
  isLoading = false;

  ngOnInit(): void {

    // Clarity.init("tcuivyetkx");

    // Mostrar changelog si hay una nueva versión
    this.checkAndShowChangelog();

    this.loadingService.loading$.subscribe((loading) => {
      this.isLoading = loading;
      this.cdr.detectChanges();
    });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap((route: any) => route.data)
      )
      .subscribe((data: any) => {
        if (data['title']) {
          this.titleService.setTitle(
            data['title'] + ' | ' + appTitle
          );
        }
      });
  }

  private checkAndShowChangelog(): void {
    const latestVersion = CHANGELOG[0]?.version;
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');

    if (latestVersion && latestVersion !== lastSeenVersion) {
      // Esperar un poco para que la app termine de cargar
      setTimeout(() => {
        this.dialogService.open(ChangelogModalComponent, {
          header: 'Novedades',
          width: '600px',
          modal: true,
          dismissableMask: true,
          styleClass: 'changelog-dialog'
        });
      }, 1000);
    }
  }
}
