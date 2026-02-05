import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core'
import { credits, currentYear } from '@/app/constants'
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router'
import { AppLogo } from '@app/components/app-logo'
import { IntegracionesService } from '@core/services/integraciones'
import { finalize, firstValueFrom } from 'rxjs'

@Component({
  selector: 'app-link-integracion',
  imports: [
    AppLogo
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
                  <p class="text-muted w-lg-75 mt-3">
                    Linkeando la cuenta de GEM con la plataforma externa...
                  </p>
                </div>

                <div class="text-center mb-4">
                  @if ( success ) {
                    <div class="alert alert-success" role="alert">
                      {{ mensaje }}
                    </div>
                  }
                  @if ( error ) { 
                    <div class="alert alert-danger" role="alert">
                      {{ mensaje }}
                    </div>
                  }
                </div>

                <!-- <button
                  type="submit"
                  class="btn btn-primary fw-semibold py-2"
                >
                  Unlock
                </button> -->
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class LinkIntegracion implements OnInit {
  private integracionesService = inject(IntegracionesService)
  private rutaActiva = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  
  success: boolean = false;
  error: boolean = false;
  mensaje: string = '';

  token:string='';
  tokenPreview: any;

  ngOnInit(): void {
    this.token= this.rutaActiva.snapshot.queryParams['token'];
    console.log('Token recibido:', this.token);
    this.obtenerPreviewLink(this.token);
    console.log('Preview del link:', this.tokenPreview);
    this.confirmarLinkIntegracion();
  }

  obtenerPreviewLink(token: any) {
    this.tokenPreview = firstValueFrom(this.integracionesService.linkPreview(token));
  }
  confirmarLinkIntegracion() {
    this.integracionesService.link(this.token).pipe(
      finalize(() => this.cdr.detectChanges())
    ).subscribe({
      next: (res:any) => {
        console.log('Integracion confirmada', res);
        this.success = true;
        this.mensaje = 'Integración confirmada exitosamente.';
      },
      error: (err) => {
        console.error('Error al confirmar la integración', err);
        this.error = true;
        this.mensaje = 'Error al confirmar la integración.';
      },
    })
    
  }

}
