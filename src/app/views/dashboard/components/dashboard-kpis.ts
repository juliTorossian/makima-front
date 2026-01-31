import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { CountUpModule } from 'ngx-countup'
import { DashboardService } from '@core/services/dashboard'
import { finalize } from 'rxjs'
import { NgIcon } from "@ng-icons/core";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [
    CountUpModule,
    NgIcon,
    CommonModule,
  ],
  template: `
    <div class="row g-3 mb-4">
      @for ( kpi of kpis ; track kpi.label ) {
        <div class="col-xl-3 col-md-6">
          <div class="card card-h-100">
            <div class="card-body">
              <div>
                <ng-icon [name]="kpi.icon" class="position-absolute top-0 end-0 mt-3 me-3" [ngClass]="kpi.iconColor" style="width: 30px; height: 30px;"></ng-icon>
              </div>
              <div>
                <span class="text-muted">{{ kpi.label }}</span>
                <h3 class="mt-2 fw-bold">
                  <span [countUp]="kpi.value">{{ kpi.value }}</span>
                </h3>
              </div>
            </div>
            <div class="card-footer">
              <span class="text-muted">Ultimos 14 dias</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardKpis implements OnInit {
  private cdr = inject(ChangeDetectorRef)

  kpis: { label: string; value: number, icon: string, iconColor: string }[] = []

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard()
    .pipe(
      finalize(() => {
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      })
    )
    .subscribe(res => {
      this.kpis = [
        { label: 'Eventos activos', value: res.kpis.eventosActivos, icon: 'lucideActivity', iconColor: 'text-primary' },
        { label: 'Eventos creados', value: res.kpis.eventosCreadosPeriodo, icon: 'lucideCirclePlus', iconColor: 'text-success' },
        // { label: 'Eventos en riesgo', value: res.kpis.eventosEnRiesgo },
        { label: 'Eventos finalizados', value: res.kpis.eventosCompletadosPeriodo, icon: 'lucideCircleCheck', iconColor: 'text-info' },
        { label: 'Eventos rechazados', value: res.kpis.eventosRechazadosPeriodo, icon: 'lucideCircleX', iconColor: 'text-danger' },
      ]
    })
  }
}
