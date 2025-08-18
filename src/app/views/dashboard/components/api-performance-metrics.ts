import { Component } from '@angular/core'
import { TableType } from '@/app/types'
import { currency } from '@/app/constants'
import { DecimalPipe } from '@angular/common'

type APIPerformanceMetricsType = {
  endpoint: string
  latency: string
  requests: string
  errorRate: number
  cost: number
}

@Component({
  selector: 'app-api-performance-metrics',
  imports: [DecimalPipe],
  template: `
    <div class="card">
      <div class="card-header border-dashed">
        <h4 class="card-title mb-0">AI API Performance Metrics</h4>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table
            class="table table-sm table-centered table-nowrap table-custom mb-0"
          >
            <thead class="bg-light-subtle thead-sm">
              <tr class="text-uppercase fs-xxs">
                @for (
                  header of apiPerformanceMetricsTable.headers;
                  track header
                ) {
                  <th>{{ header }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (
                item of apiPerformanceMetricsTable.body;
                track item.endpoint
              ) {
                <tr>
                  <td>{{ item.endpoint }}</td>
                  <td>{{ item.latency }}</td>
                  <td>{{ item.requests }}</td>
                  <td>{{ item.errorRate | number: '1.2-2' }}%</td>
                  <td>{{ item.cost | number: '1.2-2' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer border-top-0 text-end">
        <span class="text-muted">API stats updated: 2025-06-16 08:32 AM</span>
      </div>
    </div>
  `,
  styles: ``,
})
export class ApiPerformanceMetrics {
  apiPerformanceMetricsTable: TableType<APIPerformanceMetricsType> = {
    headers: [
      'Endpoint',
      'Latency',
      'Requests',
      'Error Rate',
      `Cost (${currency})`,
    ],
    body: [
      {
        endpoint: '/v1/chat/completions',
        latency: '720ms',
        requests: '8,204',
        errorRate: 0.18,
        cost: 128.34,
      },
      {
        endpoint: '/v1/images/generations',
        latency: '930ms',
        requests: '1,029',
        errorRate: 0.03,
        cost: 43.89,
      },
      {
        endpoint: '/v1/audio/transcriptions',
        latency: '1.2s',
        requests: '489',
        errorRate: 0.0,
        cost: 16.45,
      },
      {
        endpoint: '/v1/embeddings',
        latency: '610ms',
        requests: '2,170',
        errorRate: 0.1,
        cost: 24.98,
      },
      {
        endpoint: '/v1/chat/moderation',
        latency: '450ms',
        requests: '5,025',
        errorRate: 0.01,
        cost: 7.52,
      },
    ],
  }
}
