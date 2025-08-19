import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { NgIcon } from '@ng-icons/core'
import { Chartjs } from '@app/components/chartjs'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { EtapaService } from '@core/services/etapa'
import { Etapa } from '@core/interfaces/etapa'
import { CountUpModule } from 'ngx-countup'
import { DashboardService } from '@core/services/dashboard'

@Component({
    selector: 'app-tickets-by-stage',
    imports: [NgIcon, Chartjs, CountUpModule],
    template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="text-uppercase">Eventos por etapa</h5>
          </div>
          <div>
            <ng-icon
              name="lucideLayers"
              class="text-muted fs-24 svg-sw-10"
            ></ng-icon>
          </div>
        </div>

        <div class="mb-3">
          <app-chartjs #chartComp [getOptions]="etapaChart" style="max-height: 200px" />
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted">Etapa con más eventos</span>
            <div class="fw-semibold">
              <span [countUp]="maxTickets">{{ maxTickets }}</span> eventos
            </div>
          </div>
          <div class="text-end">
            <span class="text-muted">Etapa con menos eventos</span>
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
export class TicketsByStage implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    etapas: string[] = []
    ticketsPorEtapa: number[] = []
  @ViewChild('chartComp') chartComp?: Chartjs

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.dashboardService.getEventosPorEtapa().subscribe({
            next: (res) => {
                console.log(res)
                this.etapas = res.etapas.map((e) => e.etapaNombre)
                this.ticketsPorEtapa = res.etapas.map((e) => e.cantidad)
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
            labels: this.etapas,
            datasets: [
                {
                    data: this.ticketsPorEtapa,
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
        return this.ticketsPorEtapa.length ? Math.max(...this.ticketsPorEtapa) : 0
    }
    get minTickets() {
        return this.ticketsPorEtapa.length ? Math.min(...this.ticketsPorEtapa) : 0
    }
    get totalTickets() {
        return this.ticketsPorEtapa.reduce((a, b) => a + b, 0)
    }
}
