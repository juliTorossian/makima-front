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

@Component({
    selector: 'app-usuario',
    standalone: true,
    imports: [
        CommonModule,
        NgbNavModule, 
        UiCard, 
        NgIcon,
        TableModule,
        BadgeClickComponent,
        PadZeroPipe,
        EventoDrawerComponent,
        LoadingSpinnerComponent,
        ReactiveFormsModule,
        ConfirmDialogModule,
        ToastModule,
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
    private fb = inject(FormBuilder);
    protected messageService = inject(MessageService);
    protected confirmationService = inject(ConfirmationService);

    usuario!:UsuarioCompleto;
    eventosActuales!: EventoCompleto[];
    cargandoUsuario: boolean = false;

    activeTab: number = 1;
    esPropioPerfil: boolean = false;

    // Estado para el offcanvas
    showEventoDrawer = false;
    eventoSeleccionadoId: string | null = null;

    formUsuario = this.fb.group({
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        color: ['']
    });

    formPassword = this.fb.group({
        contrasenaActual: ['', Validators.required],
        nuevaContrasena: ['', [Validators.required]],
        passwordConfirm: ['', [Validators.required]]
    });
    showPasswordActual:boolean = false;
    showPasswordNueva:boolean = false;
    showPasswordConfirm:boolean = false;
    togglePassword(tipo: 'actual' | 'nueva' | 'confirm') {
        if (tipo === 'actual') {
            this.showPasswordActual = !this.showPasswordActual;
        } else if (tipo === 'nueva') {
            this.showPasswordNueva = !this.showPasswordNueva;
        } else if (tipo === 'confirm') {
            this.showPasswordConfirm = !this.showPasswordConfirm;
        }
    }

    cambiarPassword() {
        if (this.formPassword.invalid) {
            this.formPassword.markAllAsTouched();
            return;
        }
        const actual = this.formPassword.get('contrasenaActual')?.value ?? '';
        const nueva = this.formPassword.get('nuevaContrasena')?.value ?? '';
        const confirm = this.formPassword.get('passwordConfirm')?.value ?? '';
        if (nueva !== confirm) {
            this.showError('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }
        this.confirmationService.confirm({
            message: '¿Está seguro que desea cambiar la contraseña?',
            header: 'Confirmar cambio de contraseña',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usuarioService.cambiarPassword(this.usuario.id ?? '', actual, nueva).subscribe({
                    next: () => {
                        this.showSuccess('Contraseña cambiada', 'La contraseña se cambió correctamente');
                        this.formPassword.reset();
                    },
                    error: (err) => {
                        this.showError('Error', err.error.message);
                        console.error(err);
                    }
                });
            }
        });
    }

    ngOnInit() {
        const userId = this.getUsuarioId();
        if (userId) {
            this.cargarUsuario(userId);
        } else {
            this.mostrarAdvertenciaIdInvalido();
        }
    }

    private getUsuarioId(): string | null {
        return this.usuarioIdParam || this.rutActiva.snapshot.paramMap.get('id');
    }

    private cargarUsuario(userId: string): void {
        this.cargandoUsuario = true;
        this.usuarioService.getByIdCompleto(userId).subscribe({
            next: (usuario: any) => this.onUsuarioCargado(usuario),
            error: (err: any) => this.onErrorCargarUsuario(err),
            complete: () => {
                this.cargandoUsuario = false;
                this.cdr.detectChanges();
            }
        });
    }

    private onUsuarioCargado(usuario: any): void {
        console.log(usuario);
        console.log(usuario.eventosActuales);
        this.usuario = usuario;
        this.eventosActuales = usuario.eventosActuales || [];
        this.esPropioPerfil = this.userStorageService.getUsuario()?.id === usuario.id;

        this.populateForm();

        this.cdr.detectChanges();
    }

    private populateForm(): void {
        this.formUsuario.patchValue({
            nombre: this.usuario.nombre,
            apellido: this.usuario.apellido,
            email: this.usuario.email,
            color: this.usuario.color,
        })
    }

    modificarUsuario(event:any) {
        let usuario = {
            id: this.usuario.id,
            nombre: this.formUsuario.get('nombre')?.value ?? this.usuario.nombre,
            apellido: this.formUsuario.get('apellido')?.value ?? this.usuario.apellido,
            email: this.formUsuario.get('email')?.value ?? this.usuario.email,
            color: this.formUsuario.get('color')?.value ?? this.usuario.color,
            usuario: this.usuario.usuario, // No se puede modificar el usuario
        };
        this.confirmationService.confirm({
            message: '¿Está seguro que desea modificar los datos del usuario?',
            header: 'Confirmar modificación',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.usuarioService.update(usuario.id!, usuario).subscribe({
                    next: () => {
                        this.showSuccess('Usuario actualizado', 'Los datos se actualizaron correctamente');
                        this.cargarUsuario(usuario.id!);
                    },
                    error: () => {
                        this.showError('Error', 'No se pudo modificar el usuario');
                        this.onErrorCargarUsuario('Error al modificar el usuario.');
                    }
                });
            }
        });
    }
    protected showSuccess(summary: string, detail: string) {
        this.messageService.add({ severity: 'success', summary, detail });
    }

    protected showError(summary: string, detail: string) {
        this.messageService.add({ severity: 'error', summary, detail });
    }

    private onErrorCargarUsuario(err: any): void {
        console.error('Error al cargar el usuario:', err);
    }

    private mostrarAdvertenciaIdInvalido(): void {
        console.warn('No se proporcionó un ID de usuario válido.');
    }


    abrirEventoDrawer(evento: EventoCompleto) {
        this.eventoSeleccionadoId = evento.id;
        this.showEventoDrawer = true;
        this.cdr.detectChanges();
    }

    cerrarEventoDrawer() {
        this.showEventoDrawer = false;
        this.eventoSeleccionadoId = null;
        this.cdr.detectChanges();
    }

    get(campo: string) {
        return this.formUsuario.get(campo);
    }
}
