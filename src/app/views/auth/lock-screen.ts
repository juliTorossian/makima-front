import { Component } from '@angular/core'
import { credits, currentYear } from '@/app/constants'
import { RouterLink } from '@angular/router'
import { AppLogo } from '@app/components/app-logo'

@Component({
  selector: 'app-lock-screen',
  imports: [RouterLink, AppLogo],
  template: `
    <div class="auth-box overflow-hidden align-items-center d-flex">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-4 col-md-6 col-sm-8">
            <div class="card">
              <div class="card-body">
                <div class="auth-brand mb-4">
                  <app-app-logo />
                  <p class="text-muted w-lg-75 mt-3">
                    This screen is locked. Enter your password to continue
                  </p>
                </div>

                <div class="text-center mb-4">
                  <img
                    src="assets/images/users/user-2.jpg"
                    class="rounded-circle img-thumbnail avatar-xxl mb-2"
                    alt="thumbnail"
                  />
                  <span>
                    <h5 class="my-0 fw-semibold">Maxine Kennedy</h5>
                    <h6 class="my-0 text-muted">Admin Head</h6>
                  </span>
                </div>

                <form>
                  <div class="mb-3">
                    <label for="userPassword" class="form-label"
                      >Password <span class="text-danger">*</span></label
                    >
                    <div class="input-group">
                      <input
                        type="password"
                        class="form-control"
                        id="userPassword"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <div class="d-grid">
                    <button
                      type="submit"
                      class="btn btn-primary fw-semibold py-2"
                    >
                      Unlock
                    </button>
                  </div>
                </form>

                <p class="text-muted text-center mt-4 mb-0">
                  Not you? Return to
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
export class LockScreen {
  protected readonly currentYear = currentYear
  protected readonly credits = credits
}
