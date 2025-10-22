import { ChangeDetectorRef, Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { EventosPorEtapa } from './components/eventos-por-etapa'
import { UiCard } from '@app/components/ui-card'
import { EventosPorCliente } from './components/eventos-por-cliente'
import { EventosPorTipo } from './components/eventos-por-tipo'

@Component({
  selector: 'app-dashboard',
  imports: [
    // PromptsUsage,
    // ActiveUsers,
    // ResponseAccuracy,
    // TokenUsage,
    // RequestStatistics,
    // RecentSessions,
    // ModelUsageSummary,
    // ApiPerformanceMetrics,
    EventosPorEtapa,
    EventosPorCliente,
    EventosPorTipo,
    UiCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // this.reloadActividad();

    setTimeout(() => {
      this.reloadActividad();
    }, 500);
  }

  actividadLoading = false;
  reloadActividad() {
    this.actividadLoading = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    setTimeout(() => {
      this.actividadLoading = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }, 0);
  }

}
