import { Component } from '@angular/core'
import { CountUpModule } from 'ngx-countup'
import { NgIcon } from '@ng-icons/core'
import { ChartConfiguration } from 'chart.js'
import { getColor } from '@/app/utils/color-utils'
import { Chartjs } from '@app/components/chartjs'

@Component({
  selector: 'app-request-statistics',
  imports: [CountUpModule, NgIcon, Chartjs],
  template: `
    <div class="card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-xl-3 col-md-6">
            <div class="text-center">
              <p
                class="mb-4 d-flex align-items-center gap-1 justify-content-center"
              >
                <ng-icon name="lucideBot" />
                AI Requests
              </p>
              <h2 class="fw-bold mb-0"><span [countUp]="807621">0</span></h2>
              <p class="text-muted">Total AI requests in last 30 days</p>
              <p
                class="mb-0 mt-4 d-flex align-items-center gap-1 justify-content-center"
              >
                <ng-icon name="lucideCalendar" /> Data from May
              </p>
            </div>
          </div>

          <div class="col-xl-3 col-md-6 order-xl-last">
            <div class="text-center">
              <p
                class="mb-4 d-flex align-items-center gap-1 justify-content-center"
              >
                <ng-icon name="lucideTimer" />
                Usage Duration
              </p>
              <h2 class="fw-bold mb-0">9 Months</h2>
              <p class="text-muted">Including 4 weeks this quarter</p>
              <p
                class="mb-0 mt-4 d-flex align-items-center gap-1 justify-content-center"
              >
                <ng-icon name="lucideClock" />
                Last accessed: 12.06.2025
              </p>
            </div>
          </div>

          <div class="col-xl-6">
            <div class="w-100" style="height: 240px;">
              <app-chartjs
                [height]="240"
                [getOptions]="activeUsersChartOptions"
                style="max-height: 240px"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <div
          class="d-flex align-items-center text-muted justify-content-between"
        >
          <div>Last update: 16.06.2025</div>
          <div>You received 2 new AI feedback reports</div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RequestStatistics {
  generateSmoothData(count: number, start: number = 40, variation: number = 5) {
    const data = [start]
    for (let i = 1; i < count; i++) {
      const prev = data[i - 1]
      const next = prev + (Math.random() * variation * 2 - variation)
      data.push(Math.round(next))
    }
    return data
  }

  generateHigherData(baseData: number[], diffRange: [number, number] = [3, 6]) {
    return baseData.map(
      (val) =>
        val +
        Math.floor(Math.random() * (diffRange[1] - diffRange[0] + 1)) +
        diffRange[0]
    )
  }

  labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h']

  currentAiUsers = this.generateSmoothData(8, 45, 4)
  previousAiUsers = this.generateHigherData(this.currentAiUsers)

  activeUsersChartOptions = (): ChartConfiguration => ({
    type: 'line',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'AI Users (Today)',
          data: this.currentAiUsers,
          fill: true,
          borderColor: getColor('chart-primary'),
          backgroundColor: getColor('chart-primary-rgb', 0.2),
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1,
        },
        {
          label: 'AI Users (Yesterday)',
          data: this.previousAiUsers,
          fill: true,
          borderColor: getColor('chart-gray'),
          backgroundColor: getColor('chart-gray-rgb', 0.2),
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1,
        },
      ],
    },
  })
}
