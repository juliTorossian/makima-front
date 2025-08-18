import { Component } from '@angular/core'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { NgIcon } from '@ng-icons/core'
import { Chartjs } from '@app/components/chartjs'
import { CountUpModule } from 'ngx-countup'

@Component({
  selector: 'app-token-usage',
  imports: [NgIcon, Chartjs, CountUpModule],
  template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="text-uppercase">Token Usage</h5>
          </div>
          <div>
            <ng-icon name="lucideCpu" class="text-muted fs-24 svg-sw-10" />
          </div>
        </div>

        <div class="mb-3">
          <app-chartjs
            [getOptions]="tokenChartOptions"
            [height]="60"
            style="max-height: 60px"
          />
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted">Today</span>
            <div class="fw-semibold">
              <span [countUp]="920400">920,400</span> tokens
            </div>
          </div>
          <div class="text-end">
            <span class="text-muted">Yesterday</span>
            <div
              class="fw-semibold d-flex align-items-center justify-content-end gap-1"
            >
              <span [countUp]="865100">865,100</span>
              <ng-icon name="tablerArrowUp" />
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        Token usage up <strong>6.4%</strong> from yesterday
      </div>
    </div>
  `,
  styles: ``,
})
export class TokenUsage {
  tokenChartOptions = (): ChartConfiguration => ({
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [82000, 95000, 103000, 112000, 121500, 135200, 148000],
          backgroundColor: getColor('chart-primary-rgb', 0.1),
          borderColor: getColor('chart-primary'),
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
        },
      },
    },
  })
}
