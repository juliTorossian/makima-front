import { ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import { Preferencia, UsuarioCompleto } from "@core/interfaces/usuario";
import { NgIcon } from "@ng-icons/core";
import { USUARIO_PREFERENCIAS_GRUPOS, getDescripcionUsuarioPref } from "@/app/constants/preferencias_usuario";
import { CommonModule } from '@angular/common';
import { UsuarioService } from "@core/services/usuario";

@Component({
    selector: 'app-tab-preferencias',
    imports: [
        NgIcon,
        CommonModule
    ],
    template: `
        @for(grupo of grupos; track grupo) {
            <div class="row">
                <div class="col-12">
                    <h4><ng-icon name="{{grupo.icono}}"/> {{ grupo.titulo }}</h4>
                </div>
            </div>
            @for(pref of grupo.pref; track pref) {
                <div class="row">
                    <div class="form-check form-check-info form-switch mb-2">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            id="switchInfo"
                            [checked]="isPreferenciaActiva(pref)"
                            (change)="togglePreferencia(pref, $event)"
                        />
                        <label class="form-check-label" for="switchInfo">
                            &nbsp;&nbsp;{{ pref.descripcion }}
                        </label>
                    </div>
                    <!-- <div class="col-8">
                        <label>
                            {{ pref.descripcion }}
                        </label>
                    </div>
                    <div class="col-4">
                        <input type="checkbox"
                            [checked]="isPreferenciaActiva(pref)"
                            (change)="togglePreferencia(pref, $event)" />
                    </div> -->
                </div>
            }
        }
    `,
})
export class TabPreferencias implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private usuarioService = inject(UsuarioService);
    @Input() usuario!: UsuarioCompleto;

    grupos:any = USUARIO_PREFERENCIAS_GRUPOS;

    ngOnInit(): void {
        // console.log(this.usuario);
        // console.log(this.grupos);
    }

    isPreferenciaActiva(pref: any): boolean {
        if (!this.usuario || !this.usuario.preferencias) return false;
        return this.usuario.preferencias.some((p: any) => p.clave === pref.clave);
    }

    togglePreferencia(pref: any, event: any) {
        if (!this.usuario) return;
        if (!this.usuario.preferencias) this.usuario.preferencias = [];
        const checked = event.target.checked;
        if (checked) {
            if (!this.usuario.preferencias.some((p: any) => p.clave === pref.clave)) {
                this.usuario.preferencias.push({ usuarioId: this.usuario.id!, clave: pref.clave, descripcion: pref.descripcion });
            }
        } else {
            this.usuario.preferencias = this.usuario.preferencias.filter((p: any) => p.clave !== pref.clave);
        }
        this.usuarioService.setPreferencias(this.usuario.id!, this.usuario.preferencias).subscribe({
            next: (res) => {
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error al actualizar preferencias:', err);
            }
        });
    }

}
