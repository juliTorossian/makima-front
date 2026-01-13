import { Component } from '@angular/core'
import { credits, currentYear } from '@/app/constants'

@Component({
  selector: 'app-error-403',
  imports: [],
  template: `
    <div class="auth-box overflow-hidden align-items-center d-flex">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xxl-4 col-md-6 col-sm-8">
            <div class="card">
              <div class="card-body">
                <div class="p-2 text-center">
                  <div class="text-error fw-bold fs-60">403</div>
                  <h3 class="fw-semibold">Acceso Denegado</h3>
                  <p class="text-muted">
                    No tienes permisos para acceder a esta página.
                  </p>
                  <button
                    class="btn btn-primary mt-3 rounded-pill"
                    onclick="window.location.href='/'"
                  >
                    Ir al inicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class Error403 {
}
