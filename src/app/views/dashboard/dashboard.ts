import { Component } from '@angular/core'
import { PromptsUsage } from '@/app/views/dashboard/components/prompts-usage'
import { ActiveUsers } from '@/app/views/dashboard/components/active-users'
import { ResponseAccuracy } from '@/app/views/dashboard/components/response-accuracy'
import { TokenUsage } from '@/app/views/dashboard/components/token-usage'
import { RequestStatistics } from '@/app/views/dashboard/components/request-statistics'
import { RecentSessions } from '@/app/views/dashboard/components/recent-sessions'
import { ModelUsageSummary } from '@/app/views/dashboard/components/model-usage-summary'
import { ApiPerformanceMetrics } from '@/app/views/dashboard/components/api-performance-metrics'

@Component({
  selector: 'app-dashboard',
  imports: [
    PromptsUsage,
    ActiveUsers,
    ResponseAccuracy,
    TokenUsage,
    RequestStatistics,
    RecentSessions,
    ModelUsageSummary,
    ApiPerformanceMetrics,
  ],
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard {}
