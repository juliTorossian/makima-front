import { Component } from '@angular/core'
import { appName, credits, currentYear } from '@/app/constants'

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
})
export class Footer {
  currentYear = currentYear
  appName = appName
  credits = credits
}
