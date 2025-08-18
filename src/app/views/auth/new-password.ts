import { Component } from '@angular/core'
import { credits, currentYear } from '@/app/constants'
import { RouterLink } from '@angular/router'
import { PasswordStrengthBar } from '@app/components/password-strength-bar'
import { FormsModule } from '@angular/forms'
import { AppLogo } from '@app/components/app-logo'
import { NgOtpInputModule } from 'ng-otp-input'

@Component({
  selector: 'app-new-password',
  imports: [
    RouterLink,
    PasswordStrengthBar,
    FormsModule,
    AppLogo,
    NgOtpInputModule,
  ],
  template: `
    <div class="auth-box overflow-hidden align-items-center d-flex">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-4 col-md-6 col-sm-8">
            <div class="card">
              <div class="card-body">
                <div class="auth-brand mb-4">
                  <app-app-logo />
                  <p class="text-muted mt-3">
                    We've emailed you a 6-digit verification code. Please enter
                    it below to confirm your email address
                  </p>
                </div>

                <form>
                  <div class="mb-3">
                    <label for="userEmail" class="form-label"
                      >Email address <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <input
                        type="email"
                        class="form-control"
                        id="userEmail"
                        placeholder="you@example.com"
                        disabled
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label"
                      >Enter your 6-digit code
                      <span class="text-danger">*</span></label
                    >
                    <ng-otp-input
                      [config]="{
                        length: 6,
                        allowNumbersOnly: true,
                        inputClass: 'form-control text-center',
                      }"
                    >
                    </ng-otp-input>
                  </div>

                  <div class="mb-3" data-password="bar">
                    <label for="userPassword" class="form-label"
                      >Password <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <input
                        type="password"
                        name="password"
                        [(ngModel)]="password"
                        class="form-control"
                        id="userPassword"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <app-password-strength-bar [password]="password" />
                    <div class="password-bar my-2"></div>
                  </div>

                  <div class="mb-3">
                    <label for="userNewPassword" class="form-label"
                      >Confirm New Password
                      <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <input
                        type="password"
                        class="form-control"
                        id="userNewPassword"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div class="mb-3">
                    <div class="form-check">
                      <input
                        class="form-check-input form-check-input-light fs-14"
                        type="checkbox"
                        id="termAndPolicy"
                      />
                      <label class="form-check-label" for="termAndPolicy"
                        >Agree the Terms & Policy</label
                      >
                    </div>
                  </div>

                  <div class="d-grid">
                    <button
                      type="submit"
                      class="btn btn-primary fw-semibold py-2"
                    >
                      Update Password
                    </button>
                  </div>
                </form>

                <p class="mt-4 text-muted text-center mb-4">
                  Don’t have a code?
                  <a
                    href="javascript:void(0);"
                    class="text-decoration-underline link-offset-2 fw-semibold"
                    >Resend</a
                  >
                  or
                  <a
                    href="javascript:void(0);"
                    class="text-decoration-underline link-offset-2 fw-semibold"
                    >Call Us</a
                  >
                </p>
                <p class="text-muted text-center mb-0">
                  Return to
                  <a
                    routerLink="/auth/sign-in"
                    class="text-decoration-underline link-offset-3 fw-semibold"
                    >Sign in</a
                  >
                </p>
              </div>
            </div>

            <p class="text-center text-muted mt-4 mb-0">
              © {{ currentYear }} Simple — by
              <span class="fw-semibold">{{ credits.name }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class NewPassword {
  password: string = ''
  protected readonly currentYear = currentYear
  protected readonly credits = credits
}
