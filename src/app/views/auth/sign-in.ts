import { Component, inject } from '@angular/core'
import { AppLogo } from '@app/components/app-logo'
import { Router } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '@core/services/auth'
import { NgIcon } from '@ng-icons/core'
import { showError } from '@/app/utils/message-utils'
import { MessageService } from 'primeng/api'
import { LoadingSpinnerComponent } from '@app/components/index'
import { finalize } from 'rxjs'

@Component({
  selector: 'app-sign-in',
  imports: [AppLogo, ReactiveFormsModule, NgIcon, LoadingSpinnerComponent],
  template: `
    @if (cargando) {
        <app-loading-spinner></app-loading-spinner>
    }
    <div class="auth-box overflow-hidden align-items-center d-flex">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-4 col-md-6 col-sm-8">
            <div class="card">
              <div class="card-body">
                <div class="auth-brand mb-4">
                  <app-app-logo />
                  <!-- <p class="text-muted w-lg-75 mt-3">
                    Let’s get you signed in. Enter your email and password to
                    continue.
                  </p> -->
                </div>

                <div class="">
                  <form [formGroup]="loginForm" (ngSubmit)="login()">
                    <div class="mb-3">
                      <label for="usuario" class="form-label"
                        >Usuario <span class="text-danger">*</span></label
                      >
                      <div class="input-group">
                        <input
                          formControlName="usuario"
                          type="text"
                          class="form-control"
                          id="usuario"
                          placeholder="Usuario"
                          required
                        />
                      </div>
                    </div>

                    <div class="mb-3">
                      <label for="userPassword" class="form-label"
                        >Contraseña <span class="text-danger">*</span></label
                      >
                      <div class="input-group">
                        <input
                          formControlName="password"
                          [type]="showPassword ? 'text' : 'password'"
                          class="form-control"
                          id="userPassword"
                          placeholder="••••••••"
                          required
                        />
                        <button
                          class="btn btn-light btn-icon"
                          type="button"
                          (click)="togglePassword()"
                        >
                          <ng-icon
                            name="tablerEye"
                            [class.d-block]="showPassword"
                            [class.d-none]="!showPassword"
                          ></ng-icon>
                          <ng-icon
                            name="tablerEyeClosed"
                            [class.d-block]="!showPassword"
                            [class.d-none]="showPassword"
                          ></ng-icon>
                        </button>
                      </div>
                    </div>

                    <!-- <div
                      class="d-flex justify-content-between align-items-center mb-3"
                    >
                      <div class="form-check">
                        <input
                          class="form-check-input form-check-input-light fs-14"
                          type="checkbox"
                          id="rememberMe"
                        />
                        <label class="form-check-label" for="rememberMe"
                          >Keep me signed in</label
                        >
                      </div>
                      <a
                        routerLink="/auth/reset-password"
                        class="text-decoration-underline link-offset-3 text-muted"
                        >Forgot Password?</a
                      >
                    </div> -->

                    <div class="d-grid">
                      <button
                        type="submit"
                        class="btn btn-primary fw-semibold py-2"
                      >
                        Iniciar Sesion
                      </button>
                    </div>
                  </form>

                  <!-- <p class="text-muted text-center mt-4 mb-0">
                    New here?
                    <a
                      routerLink="/auth/sign-up"
                      class="text-decoration-underline link-offset-3 fw-semibold"
                      >Create an account</a
                    >
                  </p> -->
                </div>
              </div>
            </div>
            <!-- <p class="text-center text-muted mt-4 mb-0">
              ©
              {{ currentYear }}
              Simple — by <span class="fw-semibold">{{ credits.name }}</span>
            </p> -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class SignIn {
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  showPassword: boolean = false
  cargando:boolean = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword
  }

  loginForm = new FormGroup({
    usuario: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required ]),
  });

  login() {
    if (this.loginForm.valid) {
      this.cargando = true;
      this.authService.login(this.loginForm.value).pipe(
        finalize(() => this.cargando = false)
      ).subscribe({
        next: () => {
          this.loginOk()
        },
        error: (err) => {
          // this.mostrarError('Credenciales inválidas')  // podés mostrar un toast, mensaje, etc.
          console.error(err)
          showError(this.messageService, 'Error', 'Credenciales inválidas');
        },
      })
    }
  }

  loginOk() {
    this.router.navigateByUrl('/');
  }

}
