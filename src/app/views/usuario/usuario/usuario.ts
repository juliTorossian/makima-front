import { ChangeDetectorRef, Component, inject, Inject, Input, OnInit } from '@angular/core';
import { UsuarioService } from '../../../core/services/usuario';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UiCard } from '../../../components/ui-card';
import { UserStorageService } from '@core/services/user-storage';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIcon } from '@ng-icons/core';
import { TableModule } from 'primeng/table';
import { BadgeClickComponent } from '@app/components/badge-click';
import { PadZeroPipe } from '@core/pipes/pad-zero.pipe';
import { EventoCompleto } from '@core/interfaces/evento';
import { UsuarioCompleto } from '@core/interfaces/usuario';
import { EventoDrawerComponent } from '../../evento/evento-drawer/evento-drawer';
import { LoadingSpinnerComponent } from '@app/components/index';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TabPerfil } from './components/tab-perfil';
import { TabModificar } from './components/tab-modificar';
import { TabSeguridad } from './components/tab-seguridad';
import { TabPreferencias } from './components/tab-preferencias';

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [
        CommonModule,
        NgbNavModule, 
        UiCard, 
        NgIcon,
        LoadingSpinnerComponent,
        ReactiveFormsModule,
        ConfirmDialogModule,
        ToastModule,
        TabPerfil,
        TabModificar,
        TabPreferencias,
        TabSeguridad,
    ],
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './usuario.html',
})
export class Usuario implements OnInit {
    @Input() usuarioIdParam!: string;
    @Input() esMitadPantalla: boolean = false;

    private usuarioService = inject(UsuarioService);
    private rutActiva = inject(ActivatedRoute);
    private userStorageService = inject(UserStorageService);
    private cdr = inject(ChangeDetectorRef);
    protected messageService = inject(MessageService);
    protected confirmationService = inject(ConfirmationService);

    usuario!:UsuarioCompleto;
    eventosActuales!: EventoCompleto[];
    cargandoUsuario: boolean = false;

    activeTab:number = 1;
    esPropioPerfil: boolean = false;

    ngOnInit() {
        const userId = this.getUsuarioId();
        if (userId) {
            this.cargarUsuario(userId);
        }
    }

    private getUsuarioId(): string | null {
        return this.usuarioIdParam || this.rutActiva.snapshot.paramMap.get('id');
    }

    cargarUsuario(userId: string): void {
        this.cargandoUsuario = true;
        this.usuarioService.getByIdCompleto(userId).subscribe({
            next: (usuario: any) => this.onUsuarioCargado(usuario),
            error: (err: any) => this.showError("Error",err),
            complete: () => {
                this.cargandoUsuario = false;
                this.cdr.detectChanges();
            }
        });
    }

    private onUsuarioCargado(usuario: any): void {
        this.usuario = usuario;
        this.eventosActuales = usuario.eventosActuales || [];
        this.esPropioPerfil = this.userStorageService.getUsuario()?.id === usuario.id;

        this.cdr.detectChanges();
    }

    protected showSuccess(summary: string, detail: string) {
        this.messageService.add({ severity: 'success', summary, detail });
    }

    protected showError(summary: string, detail: string) {
        this.messageService.add({ severity: 'error', summary, detail });
    }

}
