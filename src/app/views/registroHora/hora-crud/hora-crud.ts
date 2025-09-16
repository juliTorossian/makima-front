import { modalConfig } from '@/app/types/modals';
import { formatTime } from '@/app/utils/datetime-utils';
import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/index';
import { Evento } from '@core/interfaces/evento';
import { Hora, RegistroHora } from '@core/interfaces/registro-hora';
import { EventoService } from '@core/services/evento';
import { RegistroHoraService } from '@core/services/registro-hora';
import { UserStorageService, UsuarioLogeado } from '@core/services/user-storage';
import { NgIcon } from '@ng-icons/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { EventoSelect } from '../../evento/evento-select/evento-select';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FiltroActivo } from '@/app/constants/filtros_activo';

@Component({
  selector: 'app-hora-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    NgIcon
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './hora-crud.html',
  styleUrl: './hora-crud.scss'
})
export class HoraCrud extends CrudFormModal<RegistroHora> {
  protected modalSel = inject(DynamicDialogRef);
  private eventoService = inject(EventoService)
  private userStorageService = inject(UserStorageService);
  private dialogService = inject(DialogService);

  usuarioActivo: UsuarioLogeado | null = this.userStorageService.getUsuario();

  eventos!: Evento[];
  eventosFiltrados!: Evento[];

  override ngOnInit(): void {
    super.ngOnInit();

    this.eventoService.getAll(FiltroActivo.FALSE).subscribe({
      next: (res: any) => {
        this.eventos = res
      },
      error: () => this.showError('Error', 'Error al cargar los eventos.')
    })
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl('',),
      fecha: new FormControl(new Date(), [Validators.required]),
      usuarioId: new FormControl(this.usuarioActivo?.id, [Validators.required]),
      horas: new FormArray([])
    });
  }

  get horasFormArray(): FormArray {
    return this.form.get('horas') as FormArray;
  }

  protected populateForm(data: RegistroHora): void {
    const fechaStr = data.fecha ? new Date(data.fecha).toISOString().slice(0, 10) : '';
    this.form.patchValue({
      id: data.id,
      fecha: fechaStr,
      usuarioId: data.usuarioId,
      horas: []
    });

    this.horasFormArray.clear();
    data.horas?.forEach(hora => {
      const inicioStr = hora.inicio ? formatTime(hora.inicio) : '';
      const finStr = hora.fin ? formatTime(hora.fin) : '';

      this.horasFormArray.push(this.createHoraForm({
        id: hora.id != null ? Number(hora.id) : undefined,
        registroId: hora.registroId != null ? Number(hora.registroId) : undefined,
        eventoId: hora.eventoId != null ? String(hora.eventoId) : undefined,
        inicio: inicioStr,
        fin: finStr,
        detalle: hora.detalle != null ? String(hora.detalle) : undefined
      }));
    });
  }

  protected override setupEditMode(): void {
  }

  protected toModel(): RegistroHora {
    console.log('hola')
    return {
      id: this.get('id')?.value,
      fecha: this.get('fecha')?.value,
      usuarioId: this.get('usuarioId')?.value,
      horas: this.horasFormArray.value.map((h: any) => ({
        // id: h.id != null ? Number(h.id) : null,
        // registroId: h.registroId != null ? Number(h.registroId) : null,
        eventoId: h.eventoId != null ? String(h.eventoId) : null,
        inicio: h.inicio != null ? String(h.inicio) : null,
        fin: h.fin != null ? String(h.fin) : null,
        detalle: h.detalle != null ? String(h.detalle) : null
      }))
    };
  }

  accion(event: Event) {
    event.preventDefault();
    console.log(event)
    this.submit();
  }

  private createHoraForm(hora?: Partial<Hora>): FormGroup {
    return new FormGroup({
      // obligamos a number (o null)
      id: new FormControl<number | null>(
        hora?.id != null ? Number(hora.id) : null,
      ),
      registroId: new FormControl<number | null>(
        hora?.registroId != null ? Number(hora.registroId) : null,
      ),
      eventoId: new FormControl<string | null>(
        hora?.eventoId != null ? String(hora.eventoId) : null,
        [Validators.required]
      ),
      inicio: new FormControl<string | null>(
        hora?.inicio != null ? String(hora.inicio) : null,
        [Validators.required]
      ),
      fin: new FormControl<string | null>(
        hora?.fin != null ? String(hora.fin) : null,
        [Validators.required]
      ),
      detalle: new FormControl<string | null>(
        hora?.detalle != null ? String(hora.detalle) : null,
      ),
    });
  }

  addHora() {
    this.horasFormArray.push(this.createHoraForm());
  }

  removeHora(index: number) {
    this.horasFormArray.removeAt(index);
  }

  modalSelEvento(hora:any, event: Event) {
    event.preventDefault();
    this.modalSel = this.dialogService.open(EventoSelect, {
      ...modalConfig,
      header: "Seleccionar Evento",
      data: {
        filtroEvento: FiltroActivo.FALSE
      }
    });

    this.modalSel.onClose.subscribe((result: any) => {
      if (!result) return;
      hora.patchValue({
        eventoId: result.id
      })
    });
  }

}
