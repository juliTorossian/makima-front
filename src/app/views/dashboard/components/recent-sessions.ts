import { Component } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { RouterLink } from '@angular/router'
import { DecimalPipe } from '@angular/common'
import { toTitleCase } from '@/app/utils/string-utils'
import {
  NgbDropdownModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'

type SessionType = {
  id: string
  user: {
    name: string
    avatar: string
  }
  aiModel: string
  date: string
  tokens: number
  status: 'completed' | 'pending' | 'failed'
}

@Component({
  selector: 'app-recent-sessions',
  imports: [
    NgIcon,
    RouterLink,
    DecimalPipe,
    NgbPaginationModule,
    NgbDropdownModule,
  ],
  template: `
    <div class="card">
      <div
        class="card-header justify-content-between align-items-center border-dashed"
      >
        <h4 class="card-title mb-0">Recent AI Sessions</h4>
        <div class="d-flex gap-2">
          <a href="javascript:void(0);" class="btn btn-sm btn-light">
            <ng-icon name="tablerPlus" class="me-1" />
            New Session
          </a>
          <a href="javascript:void(0);" class="btn btn-sm btn-primary">
            <ng-icon name="tablerFileExport" class="me-1" />
            Export Logs
          </a>
        </div>
      </div>

      <div class="card-body p-0">
        <div class="table-responsive">
          <table
            class="table table-centered table-custom table-sm table-nowrap table-hover mb-0"
          >
            <tbody>
              @for (session of sessions; track session.id) {
                <tr>
                  <td>
                    <div class="d-flex align-items-center">
                      <img
                        [src]="session.user.avatar"
                        [alt]="session.user.name"
                        class="avatar-sm rounded-circle me-2"
                      />
                      <div>
                        <span class="text-muted fs-xs">{{
                          session.user.name
                        }}</span>
                        <h5 class="fs-base mb-0">
                          <a [routerLink]="[]" class="text-body">{{
                            session.id
                          }}</a>
                        </h5>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-muted fs-xs">Model</span>
                    <h5 class="fs-base mb-0 fw-normal">
                      {{ session.aiModel }}
                    </h5>
                  </td>
                  <td>
                    <span class="text-muted fs-xs">Date</span>
                    <h5 class="fs-base mb-0 fw-normal">{{ session.date }}</h5>
                  </td>
                  <td>
                    <span class="text-muted fs-xs">Tokens</span>
                    <h5 class="fs-base mb-0 fw-normal">
                      {{ session.tokens | number }}
                    </h5>
                  </td>
                  <td>
                    <span class="text-muted fs-xs">Status</span>
                    <h5
                      class="fs-base mb-0 fw-normal d-flex align-items-center"
                    >
                      <ng-icon
                        name="tablerCircleFill"
                        class="fs-xs me-1"
                        [class]="
                          session.status === 'failed' ? 'text-danger' : ''
                        "
                      ></ng-icon>
                      {{ toTitleCase(session.status) }}
                    </h5>
                  </td>
                  <td style="width: 30px;">
                    <div ngbDropdown placement="bottom-end">
                      <a
                        href="javascript:void(0);"
                        ngbDropdownToggle
                        class="text-muted drop-arrow-none card-drop p-0"
                      >
                        <ng-icon name="tablerDotsVertical" class="fs-lg" />
                      </a>
                      <div class="dropdown-menu-end" ngbDropdownMenu>
                        <a href="javascript:void(0)" ngbDropdownItem
                          >View Details</a
                        >
                        @if (session.status === 'completed') {
                          <a href="javascript:void(0)" ngbDropdownItem
                            >Delete</a
                          >
                        } @else if (
                          session.status === 'pending' ||
                          session.status === 'failed'
                        ) {
                          <a href="javascript:void(0)" ngbDropdownItem>Retry</a>
                        }
                      </div>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer border-0">
        <div
          class="align-items-center justify-content-between row text-center text-sm-start"
        >
          <div class="col-sm">
            <div class="text-muted">
              Showing <span class="fw-semibold">1</span> to
              <span class="fw-semibold">10</span> of
              <span class="fw-semibold">2684</span> Sessions
            </div>
          </div>
          <div class="col-sm-auto mt-3 mt-sm-0">
            <ngb-pagination
              [pageSize]="10"
              [collectionSize]="20"
              class="pagination-sm pagination-boxed mb-0 justify-content-center"
            >
              <ng-template ngbPaginationPrevious>
                <ng-icon name="tablerChevronLeft" />
              </ng-template>
              <ng-template ngbPaginationNext>
                <ng-icon name="tablerChevronRight" />
              </ng-template>
            </ngb-pagination>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class RecentSessions {
  sessions: SessionType[] = [
    {
      id: '#AI-5001',
      user: { name: 'Alice Cooper', avatar: 'assets/images/users/User-1.png' },
      aiModel: 'GPT-4',
      date: '2025-05-01',
      tokens: 2304,
      status: 'completed',
    },
    {
      id: '#AI-5002',
      user: { name: 'David Lee', avatar: 'assets/images/users/User-2.png' },
      aiModel: 'DALL·E',
      date: '2025-04-30',
      tokens: 580,
      status: 'pending',
    },
    {
      id: '#AI-5003',
      user: { name: 'Sophia Turner', avatar: 'assets/images/users/User-3.png' },
      aiModel: 'Whisper',
      date: '2025-04-29',
      tokens: 1102,
      status: 'completed',
    },
    {
      id: '#AI-5004',
      user: { name: 'James Wilson', avatar: 'assets/images/users/User-4.png' },
      aiModel: 'GPT-3.5',
      date: '2025-04-28',
      tokens: 760,
      status: 'failed',
    },
    {
      id: '#AI-5005',
      user: { name: 'Ava Carter', avatar: 'assets/images/users/User-5.png' },
      aiModel: 'Claude 2',
      date: '2025-04-27',
      tokens: 1678,
      status: 'completed',
    },
    {
      id: '#AI-5006',
      user: { name: 'Ethan Brooks', avatar: 'assets/images/users/User-6.png' },
      aiModel: 'Gemini Pro',
      date: '2025-04-26',
      tokens: 945,
      status: 'pending',
    },
    {
      id: '#AI-5007',
      user: { name: 'Mia Clarke', avatar: 'assets/images/users/User-7.png' },
      aiModel: 'GPT-4 Turbo',
      date: '2025-04-25',
      tokens: 2189,
      status: 'completed',
    },
    {
      id: '#AI-5008',
      user: { name: 'Lucas Perry', avatar: 'assets/images/users/User-8.png' },
      aiModel: 'Stable Diffusion',
      date: '2025-04-24',
      tokens: 312,
      status: 'failed',
    },
    {
      id: '#AI-5009',
      user: { name: 'Chloe Adams', avatar: 'assets/images/users/User-3.png' },
      aiModel: 'GPT-4',
      date: '2025-04-23',
      tokens: 1784,
      status: 'completed',
    },
    {
      id: '#AI-5010',
      user: {
        name: 'Benjamin Gray',
        avatar: 'assets/images/users/User-4.png',
      },
      aiModel: 'Whisper',
      date: '2025-04-22',
      tokens: 890,
      status: 'pending',
    },
  ]
  protected readonly toTitleCase = toTitleCase
}
