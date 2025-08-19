import { AfterViewInit, ChangeDetectorRef, Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core'
import { PromptsUsage } from '@/app/views/dashboard/components/prompts-usage'
import { ActiveUsers } from '@/app/views/dashboard/components/active-users'
import { ResponseAccuracy } from '@/app/views/dashboard/components/response-accuracy'
import { TokenUsage } from '@/app/views/dashboard/components/token-usage'
import { RequestStatistics } from '@/app/views/dashboard/components/request-statistics'
import { RecentSessions } from '@/app/views/dashboard/components/recent-sessions'
import { ModelUsageSummary } from '@/app/views/dashboard/components/model-usage-summary'
import { ApiPerformanceMetrics } from '@/app/views/dashboard/components/api-performance-metrics'
import { ChartOptions, ChartType } from 'chart.js'
import { Chartjs } from '@app/components/chartjs'
import { TicketsByStage } from './components/tickets-by-stage'
import { UiCard } from '@app/components/ui-card'

@Component({
  selector: 'app-dashboard',
  imports: [
    PromptsUsage,
    ActiveUsers,
    ResponseAccuracy,
    TokenUsage,
    RequestStatistics,
    RecentSessions,
    ModelUsageSummary,
    ApiPerformanceMetrics,
    TicketsByStage,
    UiCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.reloadActividad();
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
