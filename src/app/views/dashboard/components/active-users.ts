import { Component } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-active-users',
  imports: [NgIcon, NgbProgressbarModule],
  template: `
    <div class="card card-h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <h5 class="text-uppercase mb-3">Active Users</h5>
            <h3 class="mb-0 fw-normal"><span data-target="342">342</span></h3>
            <p class="text-muted mb-2">In the last hour</p>
          </div>
          <div>
            <ng-icon name="lucideUsers" class="text-muted fs-24 svg-sw-10" />
          </div>
        </div>

        <ngb-progressbar [value]="68" class="progress-lg mb-3" />

        <div class="d-flex justify-content-between">
          <div>
            <span class="text-muted">Avg. Session Time</span>
            <h5 class="mb-0">4m 12s</h5>
          </div>
          <div class="text-end">
            <span class="text-muted">Returning Users</span>
            <h5 class="mb-0">54.9%</h5>
          </div>
        </div>
      </div>
      <div class="card-footer text-muted text-center">
        52 new users joined today
      </div>
    </div>
  `,
  styles: ``,
})
export class ActiveUsers {}
