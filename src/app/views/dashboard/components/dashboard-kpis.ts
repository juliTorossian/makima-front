import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { CountUpModule } from 'ngx-countup'
import { DashboardService } from '@core/services/dashboard'

@Component({
  selector: 'app-dashboard-kpis',
  standalone: true,
  imports: [CountUpModule],
  template: `
    <div class="row g-3 mb-4">
      @for ( kpi of kpis ; track kpi.label ) {
        <div class="col-xl-3 col-md-6">
          <div class="card card-h-100">
            <div class="card-body">
              <span class="text-muted">{{ kpi.label }}</span>
              <h3 class="mt-2 fw-bold">
                <span [countUp]="kpi.value">{{ kpi.value }}</span>
              </h3>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardKpis implements OnInit {
  private cdr = inject(ChangeDetectorRef)

  kpis: { label: string; value: number }[] = []

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe(res => {
      this.kpis = [
        { label: 'Eventos activos', value: res.kpis.eventosActivos },
        { label: 'Eventos creados', value: res.kpis.eventosCreadosPeriodo },
        // { label: 'Eventos en riesgo', value: res.kpis.eventosEnRiesgo },
        { label: 'Eventos finalizados', value: res.kpis.eventosCompletadosPeriodo },
        { label: 'Eventos rechazados', value: res.kpis.eventosRechazadosPeriodo },
      ]
      this.cdr.detectChanges()
    })
  }
}
