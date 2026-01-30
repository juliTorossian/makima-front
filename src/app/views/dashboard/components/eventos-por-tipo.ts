import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { Chartjs } from '@app/components/chartjs'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { DashboardService } from '@core/services/dashboard'

@Component({
  selector: 'app-eventos-por-tipo',
  standalone: true,
  imports: [NgIcon, Chartjs],
  template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between mb-3">
          <h5 class="text-uppercase">Eventos por tipo</h5>
          <ng-icon name="lucideChartPie" class="fs-24 text-muted"></ng-icon>
        </div>

        <app-chartjs #chartComp [getOptions]="chart" />
      </div>
    </div>
  `,
})
export class EventosPorTipo implements OnInit {
  private cdr = inject(ChangeDetectorRef)

  tipos: string[] = []
  cantidades: number[] = []
  colores: string[] = []

  @ViewChild('chartComp') chartComp?: Chartjs

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getEventosPorTipo().subscribe(res => {
      this.tipos = res.map(e => e.tipo)
      this.cantidades = res.map(e => e.cantidad)
      this.colores = res.map(e => e.color)

      this.cdr.detectChanges()
      setTimeout(() => this.chartComp?.refresh(), 60)
    })
  }

  chart = (): ChartConfiguration => ({
    type: 'doughnut',
    data: {
      labels: this.tipos,
      datasets: [
        {
          data: this.cantidades,
          backgroundColor: this.colores,
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { position: 'bottom' },
      },
    },
  })

}
