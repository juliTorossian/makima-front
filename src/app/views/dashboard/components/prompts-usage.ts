import { Component } from '@angular/core'
import { BaseChartDirective } from 'ng2-charts'
import { NgIcon } from '@ng-icons/core'
import { Chartjs } from '@app/components/chartjs'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { CountUpModule } from 'ngx-countup'

@Component({
  selector: 'app-prompts-usage',
  imports: [NgIcon, Chartjs, CountUpModule],
  template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="text-uppercase">Today's Prompts</h5>
          </div>
          <div>
            <ng-icon
              name="lucideMessageSquare"
              class="text-muted fs-24 svg-sw-10"
            ></ng-icon>
          </div>
        </div>

        <div class="mb-3">
          <app-chartjs [getOptions]="promptChart" style="max-height: 60px" />
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted">Today</span>
            <div class="fw-semibold">
              <span [countUp]="1245">1,245</span> prompts
            </div>
          </div>
          <div class="text-end">
            <span class="text-muted">Yesterday</span>
            <div
              class="fw-semibold d-flex align-items-center justify-content-end gap-1"
            >
              <span [countUp]="1110">1,110</span>
              <ng-icon name="tablerArrowUp" />
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        Prompt volume increased by <strong>12%</strong> today
      </div>
    </div>
  `,
  styles: ``,
})
export class PromptsUsage {
  public promptChart = (): ChartConfiguration => ({
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [120, 150, 180, 220, 200, 245, 145],
          backgroundColor: getColor('chart-primary'),
          borderRadius: 4,
          borderSkipped: false,
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
