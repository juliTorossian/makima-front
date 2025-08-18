import { Component } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { getColor } from '@/app/utils/color-utils'
import { Chartjs } from '@app/components/chartjs'
import { ChartConfiguration } from 'chart.js'

@Component({
  selector: 'app-response-accuracy',
  imports: [NgIcon, Chartjs],
  template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h5 class="text-uppercase">Response Accuracy</h5>
          </div>
          <div>
            <ng-icon name="lucideActivity" class="text-muted fs-24 svg-sw-10" />
          </div>
        </div>

        <div class="d-flex align-items-center justify-content-center ">
          <app-chartjs
            [getOptions]="accuracyChartOptions"
            style="height: 120px"
          />
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        Current accuracy: <strong>94.3%</strong>
      </div>
    </div>
  `,
  styles: ``,
})
export class ResponseAccuracy {
  accuracyChartOptions = (): ChartConfiguration => ({
    type: 'pie',
    data: {
      labels: ['Correct', 'Partially Correct', 'Incorrect', 'Unclear'],
      datasets: [
        {
          data: [65, 20, 10, 5],
          backgroundColor: [
            getColor('chart-primary'),
            getColor('chart-secondary'),
            getColor('chart-gray'),
            getColor('chart-dark'),
          ],
          borderColor: '#fff',
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (ctx: any) {
              return `${ctx.label}: ${ctx.parsed}%`
            },
          },
        },
      },
      scales: {
        x: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
        y: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
      },
    },
  })
}
