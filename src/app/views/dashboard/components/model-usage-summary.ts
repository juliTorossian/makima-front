import { Component } from '@angular/core'
import { TableType } from '@/app/types'
import { DecimalPipe } from '@angular/common'

type ModelUsageType = {
  model: string
  requests: number
  totalTokens: number
  averageTokens: number
  lastUsed: string
}

@Component({
  selector: 'app-model-usage-summary',
  imports: [DecimalPipe],
  template: `
    <div class="card">
      <div class="card-header border-dashed">
        <h4 class="card-title mb-0">AI Model Usage Summary</h4>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table
            class="table table-sm table-centered table-custom table-nowrap mb-0"
          >
            <thead class="bg-light-subtle thead-sm">
              <tr class="text-uppercase fs-xxs">
                @for (header of modelUsageTable.headers; track header) {
                  <th>{{ header }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (item of modelUsageTable.body; track item.model) {
                <tr>
                  <td>{{ item.model }}</td>
                  <td>{{ item.requests | number }}</td>
                  <td>{{ item.totalTokens | number }}</td>
                  <td>{{ item.averageTokens | number }}</td>
                  <td>{{ item.lastUsed }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer border-top-0 text-end">
        <span class="text-muted">Updated 1 hour ago</span>
      </div>
    </div>
  `,
  styles: ``,
})
export class ModelUsageSummary {
  modelUsageTable: TableType<ModelUsageType> = {
    headers: [
      'Model',
      'Requests',
      'Total Tokens',
      'Average Tokens',
      'Last Used',
    ],
    body: [
      {
        model: 'GPT-4',
        requests: 1248,
        totalTokens: 2483920,
        averageTokens: 1989,
        lastUsed: '2025-06-15',
      },
      {
        model: 'DALL·E',
        requests: 328,
        totalTokens: 194320,
        averageTokens: 592,
        lastUsed: '2025-06-14',
      },
      {
        model: 'Claude 2',
        requests: 814,
        totalTokens: 1102390,
        averageTokens: 1354,
        lastUsed: '2025-06-13',
      },
      {
        model: 'Whisper',
        requests: 512,
        totalTokens: 653210,
        averageTokens: 1275,
        lastUsed: '2025-06-12',
      },
      {
        model: 'Stable Diffusion',
        requests: 102,
        totalTokens: 61400,
        averageTokens: 602,
        lastUsed: '2025-06-10',
      },
    ],
  }
}
