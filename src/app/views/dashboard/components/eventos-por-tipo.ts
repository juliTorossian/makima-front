import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { Chartjs } from '@app/components/chartjs'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { CountUpModule } from 'ngx-countup'
import { DashboardService } from '@core/services/dashboard'

@Component({
    selector: 'app-eventos-por-tipo',
    imports: [NgIcon, Chartjs, CountUpModule],
    template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="text-uppercase">Eventos por tipo</h5>
          </div>
          <div>
            <ng-icon
              name="lucideTags"
              class="text-muted fs-24 svg-sw-10"
            ></ng-icon>
          </div>
        </div>

        <div class="mb-3">
          <app-chartjs #chartComp [getOptions]="etapaChart" style="max-height: 200px" />
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted">Tipo con más eventos</span>
            <div class="fw-semibold">
              <span [countUp]="maxTickets">{{ maxTickets }}</span> eventos
            </div>
          </div>
          <div class="text-end">
            <span class="text-muted">Tipo con menos eventos</span>
            <div class="fw-semibold">
              <span [countUp]="minTickets">{{ minTickets }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        Total eventos: <strong>{{ totalTickets }}</strong>
      </div>
    </div>
  `,
    styles: ``,
})
export class EventosPorTipo implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    tipos: string[] = []
    ticketsPorTipo: number[] = []
  @ViewChild('chartComp') chartComp?: Chartjs

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getEventosPorTipo().subscribe({
            next: (res) => {
                // console.log(res)
                this.tipos = res.tipos.map((t) => t.tipoCodigo)
                this.ticketsPorTipo = res.tipos.map((t) => t.cantidad)
                this.cdr.markForCheck();
                this.cdr.detectChanges();
                // give time for child to initialize then refresh chart to trigger animation
                setTimeout(() => this.chartComp?.refresh(), 60)
            },
            error: (err: any) => {
                console.error(err)
            }
        })
    }

    public etapaChart = (): ChartConfiguration => ({
        type: 'bar',
        data: {
            labels: this.tipos,
            datasets: [
                {
                    data: this.ticketsPorTipo,
                    backgroundColor: getColor('chart-primary'),
                    borderRadius: 4,
                    borderSkipped: false,
                },
            ],
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
            },
            scales: {
                x: {
                    display: true,
                    grid: { display: false },
                },
                y: {
                    display: true,
                    grid: { display: false },
                },
            },
        },
    })

    get maxTickets() {
        return this.ticketsPorTipo.length ? Math.max(...this.ticketsPorTipo) : 0
    }
    get minTickets() {
        return this.ticketsPorTipo.length ? Math.min(...this.ticketsPorTipo) : 0
    }
    get totalTickets() {
        return this.ticketsPorTipo.reduce((a, b) => a + b, 0)
    }
}
