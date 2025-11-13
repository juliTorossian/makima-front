import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudFormModal } from '@app/components/crud-form-modal/crud-form-modal';
import { Cliente } from '@core/interfaces/cliente';
import { Evento } from '@core/interfaces/evento';
import { Modulo } from '@core/interfaces/modulo';
import { TipoEvento } from '@core/interfaces/tipo-evento';
import { ClienteService } from '@core/services/cliente';
import { ModuloService } from '@core/services/modulo';
import { ProductoService } from '@core/services/producto';
import { TipoEventoService } from '@core/services/tipo-evento';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { createTypeaheadFormatter, createTypeaheadSearch } from '@/app/utils/typeahead-utils';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Producto } from '@core/interfaces/producto';
import { FileUploader } from '@app/components/file-uploader';
import { AuthService } from '@core/services/auth';
import { UserStorageService, UsuarioLogeado } from '@core/services/user-storage';
import { Proyecto } from '@core/interfaces/proyecto';
import { ProyectoService } from '@core/services/proyecto';
import { NgIcon } from '@ng-icons/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClienteSelect } from '../../cliente/cliente-select/cliente-select';
import { modalConfig } from '@/app/types/modals';
import { ProyectoSelect } from '../../proyecto/proyecto-select/proyecto-select';
import { ModuloSelect } from '../../modulo/modulo-select/modulo-select';
import { ProductoSelect } from '../../producto/producto-select/producto-select';
import { PermisoAccion } from '@/app/types/permisos';
import { PermisosService } from '@core/services/permisos';
import { PermisoClave } from '@core/interfaces/rol';
import { SelectModule } from 'primeng/select';
import { PrioridadIconComponent } from '@app/components/priority-icon';
import { getPrioridadDesc } from '@/app/constants/prioridad';
import { LoadingService } from '@core/services/loading.service';
import { LoadingSpinnerComponent } from '@app/components/index';
import { FiltroActivo } from '@/app/constants/filtros_activo';
import { map } from 'rxjs';


@Component({
  selector: 'app-evento-crud',
  imports: [
    NgIcon,
    ReactiveFormsModule,
    ToastModule,
    NgbTypeaheadModule,
    FileUploader,
    SelectModule,
    PrioridadIconComponent,
    LoadingSpinnerComponent
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './evento-crud.html',
  styleUrl: './evento-crud.scss'
})
export class EventoCrud extends CrudFormModal<Evento> {
  private permisosService = inject(PermisosService);
  private tipoEventoService = inject(TipoEventoService);
  private moduloService = inject(ModuloService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private proyectoService = inject(ProyectoService);
  private userStorageService = inject(UserStorageService);
  private dialogService = inject(DialogService);
  private selCliente = inject(DynamicDialogRef);
  private selProyecto = inject(DynamicDialogRef);
  private selProducto = inject(DynamicDialogRef);
  private selModulo = inject(DynamicDialogRef);
  private cdr = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);

  getPrioridadDesc = getPrioridadDesc

  usuarioActivo: UsuarioLogeado | null = this.userStorageService.getUsuario();

  uploadedFiles: File[] = [];

  tiposEvento!: TipoEvento[];
  modulos!: Modulo[];
  clientes!: Cliente[];
  productos!: Producto[];
  proyectos!: Proyecto[];
  proyectosCompletos!: Proyecto[]; // Todos los proyectos sin filtrar

  loading: boolean = false;

  // Vars para typeahead
  selectedTipoEvento?: TipoEvento;
  selectedModulo?: Modulo;
  selectedCliente?: Cliente;
  selectedProducto?: Producto;
  selectedProyecto?: Proyecto;

  private dataLoadedCount = 0;
  private totalDataToLoad = 5;

  searchTipoEvento = createTypeaheadSearch<TipoEvento>(
    this.tiposEvento,
    item => `${item.codigo} - ${item.descripcion}`
  );
  formatterTipoEvento = createTypeaheadFormatter<TipoEvento>(
    item => `${item.codigo} - ${item.descripcion}`
  );

  searchModulo = createTypeaheadSearch<Modulo>(
    this.modulos,
    item => `${item.codigo} - ${item.nombre}`
  );
  formatterModulo = createTypeaheadFormatter<Modulo>(
    item => `${item.codigo} - ${item.nombre}`
  );
  modalSelModulo(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.selModulo = this.dialogService.open(ModuloSelect, {
      ...modalConfig,
      header: "Seleccionar Modulo",
      focusOnShow: false
    });

    this.selModulo.onClose.subscribe((result: any) => {
      if (result) {
        this.form.patchValue({
          modulo: result
        });
      }
      // Prevenir el comportamiento por defecto y mantener foco
      setTimeout(() => {
        const moduloInput = document.getElementById('modulo') as HTMLInputElement;
        if (moduloInput) {
          moduloInput.focus();
          moduloInput.select();
        }
      }, 200);
    });
  }

  limpiarCliente(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.form.patchValue({ cliente: null });
    const proyectoCtrl = this.form.get('proyecto');
    if (proyectoCtrl?.hasError('sinProyectos')) {
      proyectoCtrl.setErrors(null);
    }
  }

  limpiarProyecto(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.form.patchValue({ proyecto: null });
    const proyectoCtrl = this.form.get('proyecto');
    if (proyectoCtrl?.hasError('sinProyectos')) {
      proyectoCtrl.setErrors(null);
    }
  }

  limpiarProducto(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.form.patchValue({ producto: null });
  }

  limpiarModulo(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.form.patchValue({ modulo: null });
  }

  searchCliente = createTypeaheadSearch<Cliente>(
    this.clientes,
    item => `${item.sigla} - ${item.nombre}`
  );
  formatterCliente = createTypeaheadFormatter<Cliente>(
    item => `${item.sigla} - ${item.nombre}`
  );
  modalSelCliente(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.selCliente = this.dialogService.open(ClienteSelect, {
      ...modalConfig,
      header: "Seleccionar Cliente",
      focusOnShow: false
    });

    this.selCliente.onClose.subscribe((result: any) => {
      if (result) {
        this.form.patchValue({
          cliente: result
        });
      }
      // Prevenir el comportamiento por defecto y mantener foco
      setTimeout(() => {
        const clienteInput = document.getElementById('cliente') as HTMLInputElement;
        if (clienteInput) {
          clienteInput.focus();
          clienteInput.select();
        }
      }, 200);
    });
  }

  searchProyecto = createTypeaheadSearch<Proyecto>(
    this.proyectos,
    item => `${item.sigla} - ${item.nombre}`
  );
  formatterProyecto = createTypeaheadFormatter<Proyecto>(
    item => `${item.sigla} - ${item.nombre}`
  );
  modalSelProyecto(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    const clienteId = this.form.get('cliente')?.value?.id ?? null;
    this.selProyecto = this.dialogService.open(ProyectoSelect, {
      ...modalConfig,
      header: "Seleccionar Proyecto",
      focusOnShow: false,
      data: {
        clienteId: clienteId
      }
    });

    this.selProyecto.onClose.subscribe((result: any) => {
      if (result) {
        this.form.patchValue({
          proyecto: result
        });
      }
      // Prevenir el comportamiento por defecto y mantener foco
      setTimeout(() => {
        const proyectoInput = document.getElementById('proyecto') as HTMLInputElement;
        if (proyectoInput) {
          proyectoInput.focus();
          proyectoInput.select();
        }
      }, 200);
    });
  }

  searchProducto = createTypeaheadSearch<Producto>(
    this.productos,
    item => `${item.sigla} - ${item.nombre} | ${item.entornoCodigo}`
  );
  formatterProducto = createTypeaheadFormatter<Producto>(
    item => `${item.sigla} - ${item.nombre} | ${item.entornoCodigo}`
  );
  modalSelProducto(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.selProducto = this.dialogService.open(ProductoSelect, {
      ...modalConfig,
      header: "Seleccionar Producto",
      focusOnShow: false
    });

    this.selProducto.onClose.subscribe((result: any) => {
      if (result) {
        this.form.patchValue({
          producto: result
        });
      }
      // Prevenir el comportamiento por defecto y mantener foco
      setTimeout(() => {
        const productoInput = document.getElementById('producto') as HTMLInputElement;
        if (productoInput) {
          productoInput.focus();
          productoInput.select();
        }
      }, 200);
    });
  }

  onFilesChange(files: File[]) {
    this.uploadedFiles = files;
  }

  onFileAdded(file: File) {
    this.uploadedFiles.push(file);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Mostrar loading si estamos en modo modificar
    if (this.modo === 'M') {
      this.loading = true;
      // Deshabilitar el campo tipoEvento en modo modificar
      this.form.get('tipoEvento')?.disable();
    }

    this.dataLoadedCount = 0;
    this.totalDataToLoad = 5;

    this.moduloService.getAll().subscribe({
      next: (res: any) => {
        this.modulos = res;
        this.searchModulo = createTypeaheadSearch(this.modulos, m => `${m.codigo} - ${m.nombre}`);
        this.checkAndSetupEditMode();
      }
    });

    this.tipoEventoService.getAll().pipe(
      map((tipos: TipoEvento[]) => tipos.map(te => ({
        ...te,
        label: `${te.codigo} - ${te.descripcion}`
      })))
    ).subscribe({
      next: (res: any) => {
        this.tiposEvento = res;
        this.searchTipoEvento = createTypeaheadSearch(this.tiposEvento, te => `${te.codigo} - ${te.descripcion}`);
        this.checkAndSetupEditMode();
        // Forzar detección de cambios después de cargar
        this.cdr.detectChanges();
      }
    });

    this.clienteService.getAll().subscribe({
      next: (res: any) => {
        this.clientes = res;
        this.searchCliente = createTypeaheadSearch(this.clientes, c => `${c.sigla} - ${c.nombre}`);
        this.checkAndSetupEditMode();
      }
    });

    this.productoService.getAll().subscribe({
      next: (res: any) => {
        this.productos = res;
        this.searchProducto = createTypeaheadSearch(this.productos, p => `${p.sigla} - ${p.nombre} | ${p.entornoCodigo}`);
        this.checkAndSetupEditMode();
      }
    });

    // Cargar proyectos inicialmente sin filtro
    this.getProyectos();

    // Suscribirse a cambios en tipoEvento para ajustar validadores dinámicamente
    this.form.get('tipoEvento')?.valueChanges.subscribe((te: TipoEvento | null) => {
      this.applyTipoPropioValidators(te);
    });

    // Suscribirse a cambios en cliente para filtrar proyectos localmente
    this.form.get('cliente')?.valueChanges.subscribe((cliente: Cliente | null) => {
      // Solo filtrar proyectos si es un objeto Cliente válido, no un string
      if (cliente && typeof cliente === 'object' && cliente.id) {
        const clienteId = cliente.id;
        
        // Asegurarse de que proyectosCompletos esté inicializado
        if (!this.proyectosCompletos || this.proyectosCompletos.length === 0) {
          return;
        }
        
        // Filtrar localmente los proyectos que incluyen este cliente
        const proyectosFiltrados = this.proyectosCompletos.filter(p => 
          p.clienteIds && Array.isArray(p.clienteIds) && p.clienteIds.includes(clienteId)
        );
        
        // Usar setTimeout para evitar NG0100
        setTimeout(() => {
          // Actualizar la lista de proyectos y el typeahead search
          this.proyectos = proyectosFiltrados;
          this.searchProyecto = createTypeaheadSearch(
            this.proyectos, 
            p => `${p.sigla} - ${p.nombre}`
          );
          
          // Limpiar el proyecto seleccionado cuando cambia el cliente
          this.form.patchValue({ proyecto: null }, { emitEvent: false });
          
          // Validar si hay proyectos disponibles
          const proyectoCtrl = this.form.get('proyecto');
          if (proyectosFiltrados.length === 0) {
            proyectoCtrl?.setErrors({ sinProyectos: true });
            this.showWarn(
              'Formulario incompleto',
              `El cliente seleccionado no tiene proyectos asociados. Por favor seleccione otro cliente o cree un proyecto para este cliente.`
            );
          } else {
            if (proyectoCtrl?.hasError('sinProyectos')) {
              proyectoCtrl.setErrors(null);
            }
          }
          
          this.cdr.detectChanges();
        }, 0);
      } else if (!cliente) {
        // Si se limpia el cliente, restaurar todos los proyectos
        setTimeout(() => {
          this.proyectos = this.proyectosCompletos || [];
          this.searchProyecto = createTypeaheadSearch(
            this.proyectos, 
            p => `${p.sigla} - ${p.nombre}`
          );
          this.cdr.detectChanges();
        }, 0);
      }
    });

    // Validar que el proyecto pertenezca al cliente seleccionado
    this.form.get('proyecto')?.valueChanges.subscribe((proyecto: Proyecto | null) => {
      // Solo validar si es un objeto Proyecto válido, no un string
      if (proyecto && typeof proyecto === 'object' && proyecto.id) {
        this.validateProyectoCliente();
      }
    });
  }

  getProyectos() {
    // Cargar todos los proyectos activos una sola vez
    this.proyectoService.getAll(FiltroActivo.TRUE).subscribe({
      next: (res: any) => {
        // Transformar la estructura si viene con la relación 'clientes' en lugar de 'clienteIds'
        const proyectosTransformados = res.map((p: any) => {
          if (!p.clienteIds && p.clientes && Array.isArray(p.clientes)) {
            // Extraer los clienteId desde el array de relaciones
            return {
              ...p,
              clienteIds: p.clientes.map((c: any) => c.clienteId)
            };
          }
          return p;
        });
        
        this.proyectosCompletos = proyectosTransformados;
        this.proyectos = proyectosTransformados;
        this.searchProyecto = createTypeaheadSearch(this.proyectos, p => `${p.sigla} - ${p.nombre}`);
        this.checkAndSetupEditMode();
      }
    });
  }

  protected buildForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      tipoEvento: new FormControl(null, [Validators.required]),
      numero: new FormControl({ value: 0, disabled: true }),
      titulo: new FormControl('', [Validators.required]),
      cerrado: new FormControl(false),
      etapaActual: new FormControl(1),
      estimacion: new FormControl(0),
      prioridadUsu: new FormControl(1),
      facEventoCerr: new FormControl(false),
      cliente: new FormControl(null, [Validators.required]),
      proyecto: new FormControl(null, [Validators.required]),
      producto: new FormControl(null, [Validators.required]),
      usuarioAltaId: new FormControl(this.usuarioActivo?.id),
      modulo: new FormControl(null, [Validators.required]),
      comentario: new FormControl(''),
    });
  }

  private validateClienteProyectoRelation(): boolean {
    const clienteCtrl = this.form.get('cliente');
    const proyectoCtrl = this.form.get('proyecto');
    
    const cliente = clienteCtrl?.value;
    const proyecto = proyectoCtrl?.value;

    // Si no hay cliente válido seleccionado
    if (!cliente || typeof cliente !== 'object' || !cliente.id) {
      return false;
    }

    // Verificar si el cliente tiene proyectos asociados (relación muchos a muchos)
    const proyectosDelCliente = this.proyectosCompletos?.filter(p => 
      p.clienteIds && Array.isArray(p.clienteIds) && p.clienteIds.includes(cliente.id)
    ) || [];
    
    return proyectosDelCliente.length > 0;
  }

  onProyectoBlur(): void {
    const proyectoCtrl = this.form.get('proyecto');
    proyectoCtrl?.markAsTouched();
  }

  protected populateForm(data: Evento): void {
    // Buscar los objetos completos para los typeahead
    const tipoEventoObj = this.tiposEvento?.find(te => te.codigo === data.tipoCodigo) || null;
    const clienteObj = this.clientes?.find(c => c.id === data.clienteId) || null;
    const proyectoObj = this.proyectosCompletos?.find(p => p.id === data.proyectoId) || null;
    const productoObj = this.productos?.find(p => p.id === data.productoId) || null;
    const moduloObj = this.modulos?.find(m => m.codigo === data.moduloCodigo) || null;

    setTimeout(() => {
      this.form.patchValue({
        id: data.id ?? '',
        tipoEvento: tipoEventoObj,
        numero: data.numero,
        titulo: data.titulo,
        cerrado: data.cerrado,
        facEventoCerr: data.facEventoCerr,
        etapaActual: data.etapaActual,
        cliente: clienteObj,
        proyecto: proyectoObj,
        producto: productoObj,
        usuarioAltaId: data.usuarioAltaId,
        estimacion: data.estimacion,
        modulo: moduloObj,
        prioridadUsu: data.prioridadUsu,
        comentario: data.comentario ?? ''
      });
      // Aplicar validadores según el tipo (propio o no) después de poblar el formulario
      this.applyTipoPropioValidators(tipoEventoObj);

      this.cdr.detectChanges();
    }, 0);
  }

  protected override setupEditMode(): void {
    // Solo llamamos a populateForm cuando todos los datos están cargados
    if (this.config?.data?.item) {
      this.populateForm(this.config.data.item);
    }
  }
  private checkAndSetupEditMode() {
    this.dataLoadedCount++;
    if (this.dataLoadedCount === this.totalDataToLoad) {
      if (this.modo === 'M') {
        this.setupEditMode();
        // Usar setTimeout para evitar el error NG0100
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
        });
      }
    }
  }

  protected toModel(): FormData {
    let tipoEvento = this.get('tipoEvento')?.value;
    let cliente = this.get('cliente')?.value;
    let producto = this.get('producto')?.value;
    let modulo = this.get('modulo')?.value;
    let proyecto = this.get('proyecto')?.value;

    const formData = new FormData();
    if (this.get('id')?.value) {
      formData.append('id', this.get('id')?.value);
    }
    formData.append('tipoCodigo', tipoEvento.codigo);
    formData.append('numero', this.get('numero')?.value);
    formData.append('prioridadUsu', this.get('prioridadUsu')?.value);
    formData.append('titulo', this.get('titulo')?.value);
    if (!tipoEvento.propio) {
      formData.append('clienteId', cliente.id);
      formData.append('proyectoId', proyecto.id);
      formData.append('productoId', producto.id);
      formData.append('moduloCodigo', modulo.codigo);
    } else {
      // Si es tipo propio, solo agregar cliente y proyecto si están seleccionados
      if (cliente?.id) {
        formData.append('clienteId', cliente.id);
      }
      if (proyecto?.id) {
        formData.append('proyectoId', proyecto.id);
      }
    }
    formData.append('comentario', this.get('comentario')?.value);
    formData.append('facEventoCerr', this.get('facEventoCerr')?.value);

    formData.append('cerrado', this.get('cerrado')?.value);
    formData.append('etapaActual', this.get('etapaActual')?.value);
    formData.append('usuarioAltaId', this.get('usuarioAltaId')?.value);
    formData.append('estimacion', this.get('estimacion')?.value);


    this.uploadedFiles.forEach(file => formData.append('archivos', file));

    return formData;
  }

  accion(event: Event) {
    event.preventDefault();
    
    // Marcar todos los controles como touched para mostrar errores
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });

    // Si el formulario es inválido, mostrar mensaje con campos faltantes
    if (this.form.invalid) {
      const camposFaltantes = this.getCamposFaltantes();
      if (camposFaltantes.length > 0) {
        this.showError(
          'Formulario incompleto',
          `Por favor complete los siguientes campos: ${camposFaltantes.join(', ')}`
        );
      }
      return;
    }

    this.submit();
  }

  private getCamposFaltantes(): string[] {
    const campos: { [key: string]: string } = {
      tipoEvento: 'Tipo de evento',
      titulo: 'Título',
      cliente: 'Cliente',
      proyecto: 'Proyecto',
      producto: 'Producto',
      modulo: 'Módulo',
      prioridadUsu: 'Prioridad',
      comentario: 'Comentario'
    };

    const faltantes: string[] = [];
    
    Object.keys(campos).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid && control?.errors?.['required']) {
        faltantes.push(campos[key]);
      }
    });

    // Validar relación cliente-proyecto al enviar
    const proyectoCtrl = this.form.get('proyecto');
    if (proyectoCtrl?.errors?.['sinProyectos']) {
      // Ya tiene el error, no agregarlo a la lista
    } else if (!proyectoCtrl?.errors?.['required'] && !this.validateClienteProyectoRelation()) {
      const tipoEventoCtrl = this.form.get('tipoEvento');
      const tipoEvento = tipoEventoCtrl?.value;
      const esPropio = !!tipoEvento?.propio;
      
      if (!esPropio) {
        proyectoCtrl?.setErrors({ sinProyectos: true });
        proyectoCtrl?.markAsTouched();
      }
    }

    return faltantes;
  }

  can(accion: PermisoAccion): boolean {
    return this.permisosService.can(PermisoClave.EVENTO_TIPO_FAC, accion);
  }

  private applyTipoPropioValidators(tipo: TipoEvento | null) {
    const propio = !!tipo?.propio;
    const controlNames = ['cliente', 'proyecto', 'producto', 'modulo'];

    controlNames.forEach(name => {
      const ctrl = this.form.get(name);
      if (!ctrl) return;

      if (propio) {
        // quitar required si es propio
        ctrl.clearValidators();
      } else {
        // volver a poner required si no es propio
        ctrl.setValidators([Validators.required]);
      }
      ctrl.updateValueAndValidity({ emitEvent: false });
    });
  }

  private validateProyectoCliente() {
    const clienteCtrl = this.form.get('cliente');
    const proyectoCtrl = this.form.get('proyecto');
    const tipoEventoCtrl = this.form.get('tipoEvento');
    
    const cliente = clienteCtrl?.value;
    const proyecto = proyectoCtrl?.value;
    const tipoEvento = tipoEventoCtrl?.value;
    const esPropio = !!tipoEvento?.propio;

    // Verificar que proyecto sea un objeto válido, no un string
    if (!proyecto || typeof proyecto !== 'object' || !proyecto.id) {
      return;
    }

    // Si hay proyecto pero no hay cliente válido
    if (!cliente || typeof cliente !== 'object' || !cliente.id) {
      // Si es tipo propio, es válido (proyecto sin cliente)
      if (esPropio) {
        return;
      }
      // Si no es propio, es inválido
      this.showError('Error', 'Debe seleccionar un cliente antes de seleccionar un proyecto.');
      this.form.patchValue({ proyecto: null }, { emitEvent: false });
      return;
    }

    // Si hay cliente y proyecto válidos, validar que coincidan (relación muchos a muchos)
    const clienteId = cliente.id;
    const proyectoClienteIds = proyecto.clienteIds;
    
    if (!proyectoClienteIds || !Array.isArray(proyectoClienteIds) || !proyectoClienteIds.includes(clienteId)) {
      this.showError('Error', 'El proyecto seleccionado no pertenece al cliente seleccionado.');
      this.form.patchValue({ proyecto: null }, { emitEvent: false });
    }
  }

  get tipoNumero(): string {
    const str = String(this.form.get('numero')?.value);
    return this.form.get('tipoEvento')?.value?.codigo +"-" + str.padStart(3, '0');
  }
}
