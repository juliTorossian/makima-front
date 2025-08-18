import { Component, Input } from '@angular/core'
import { RouterLink } from '@angular/router'
import { NgIcon } from '@ng-icons/core'
import { appLogo, appName } from '@/app/constants'

@Component({
  selector: 'app-app-logo',
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="logo-dark">
      <span class="d-flex align-items-center gap-1">
        <img [src]="appLogo" alt="Logo" [style.max-width.px]="logoMaxWidth">
        <span class="logo-text text-body fw-bold fs-xl m-2">{{appName}}</span>
      </span>
    </a>
    <a routerLink="/" class="logo-light">
      <span class="d-flex align-items-center gap-1">
        <img [src]="appLogo" alt="Logo" [style.max-width.px]="logoMaxWidth">
        <span class="logo-text text-white fw-bold fs-xl m-2">{{appName}}</span>
      </span>
    </a>
  `,
  styles: ``,
})
export class AppLogo {
  @Input() logoMaxWidth: number = 80
  appName=appName
  appLogo=appLogo
}
