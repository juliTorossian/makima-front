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


@Component({
  selector: 'app-evento-crud',
  imports: [
    ReactiveFormsModule,
    ToastModule,
    NgbTypeaheadModule,
    FileUploader,
  ],
  providers: [
    MessageService,
  ],
  templateUrl: './evento-crud.html',
  styleUrl: './evento-crud.scss'
})
export class EventoCrud extends CrudFormModal<Evento> {
  private tipoEventoService = inject(TipoEventoService);
  private moduloService = inject(ModuloService);
  private clienteService = inject(ClienteService);
  private productoService = inject(ProductoService);
  private userStorageService = inject(UserStorageService);
  private cdr = inject(ChangeDetectorRef);

  usuarioActivo:UsuarioLogeado | null = this.userStorageService.getUsuario();

  uploadedFiles: File[] = [];

  tiposEvento!:TipoEvento[];
  modulos!:Modulo[];
  clientes!:Cliente[];
  productos!:Producto[];

  // Vars para typeahead
  selectedTipoEvento?: TipoEvento;
  selectedModulo?: Modulo;
  selectedCliente?: Cliente;
  selectedProducto?: Producto;

  private dataLoadedCount = 0;
  private totalDataToLoad = 4;

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

  searchCliente = createTypeaheadSearch<Cliente>(
    this.clientes,
    item => `${item.sigla} - ${item.nombre}`
  );
  formatterCliente = createTypeaheadFormatter<Cliente>(
    item => `${item.sigla} - ${item.nombre}`
  );

  searchProducto = createTypeaheadSearch<Producto>(
    this.productos,
    item => `${item.sigla} - ${item.nombre} | ${item.entornoCodigo}`
  );
  formatterProducto = createTypeaheadFormatter<Producto>(
    item => `${item.sigla} - ${item.nombre} | ${item.entornoCodigo}`
  );

  onFilesChange(files: File[]) {
    this.uploadedFiles = files;
  }
  
  onFileAdded(file: File) {
    this.uploadedFiles.push(file);
  }

  override ngOnInit(): void {
    super.ngOnInit();

      this.dataLoadedCount = 0;
      this.totalDataToLoad = 4;

      this.moduloService.getAll().subscribe({
        next: (res:any) => {
          this.modulos = res;
          this.searchModulo = createTypeaheadSearch(this.modulos, m => `${m.codigo} - ${m.nombre}`);
          this.checkAndSetupEditMode();
        }
      });

      this.tipoEventoService.getAll().subscribe({
        next: (res:any) => {
          this.tiposEvento = res;
          this.searchTipoEvento = createTypeaheadSearch(this.tiposEvento, te => `${te.codigo} - ${te.descripcion}`);
          this.checkAndSetupEditMode();
        }
      });

      this.clienteService.getAll().subscribe({
        next: (res:any) => {
          this.clientes = res;
          this.searchCliente = createTypeaheadSearch(this.clientes, c => `${c.sigla} - ${c.nombre}`);
          this.checkAndSetupEditMode();
        }
      });

      this.productoService.getAll().subscribe({
        next: (res:any) => {
          this.productos = res;
          this.searchProducto = createTypeaheadSearch(this.productos, p => `${p.sigla} - ${p.nombre} | ${p.entornoCodigo}`);
          this.checkAndSetupEditMode();
        }
      });
  }


  protected buildForm(): FormGroup {
      return new FormGroup({
        id: new FormControl(''),
        tipoEvento: new FormControl(null, [Validators.required]),
        numero: new FormControl({value: 0, disabled: true}),
        titulo: new FormControl('', [Validators.required]),
        cerrado: new FormControl(false),
        etapaActual: new FormControl(1),
        cliente: new FormControl(null, [Validators.required]),
        producto: new FormControl(null, [Validators.required]),
        usuarioAltaId: new FormControl(this.usuarioActivo?.id),
        estimacion: new FormControl(0),
        modulo: new FormControl(null, [Validators.required]),
        prioridad: new FormControl(0),
        activo: new FormControl(true),
        createdAt: new FormControl(''),
        updateAt: new FormControl(''),
        deletedAt: new FormControl(''),
        comentario: new FormControl(''),
      });
  }

  protected populateForm(data: Evento): void {
    // Buscar los objetos completos para los typeahead
    const tipoEventoObj = this.tiposEvento?.find(te => te.codigo === data.tipoCodigo) || null;
    const clienteObj = this.clientes?.find(c => c.id === data.clienteId) || null;
    const productoObj = this.productos?.find(p => p.id === data.productoId) || null;
    const moduloObj = this.modulos?.find(m => m.codigo === data.moduloCodigo) || null;

      setTimeout(() => {
        this.form.patchValue({
          id: data.id ?? '',
          tipoEvento: tipoEventoObj,
          numero: data.numero,
          titulo: data.titulo,
          cerrado: data.cerrado,
          etapaActual: data.etapaActual,
          cliente: clienteObj,
          producto: productoObj,
          usuarioAltaId: data.usuarioAltaId,
          estimacion: data.estimacion,
          modulo: moduloObj,
          prioridad: data.prioridad,
          activo: data.activo,
          createdAt: data.createdAt,
          updateAt: data.updatedAt,
          deletedAt: data.deletedAt,
          comentario: data.comentario ?? ''
        });
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
    if (this.dataLoadedCount === this.totalDataToLoad && this.modo === 'M') {
      this.setupEditMode();
    }
  }

  protected toModel(): FormData {
    let tipoEvento = this.get('tipoEvento')?.value;
    let cliente = this.get('cliente')?.value;
    let producto = this.get('producto')?.value;
    let modulo = this.get('modulo')?.value;

    const formData = new FormData();
    if (this.get('id')?.value) {
      formData.append('id', this.get('id')?.value);
    }
    formData.append('tipoCodigo', tipoEvento.codigo);
    formData.append('numero', this.get('numero')?.value);
    formData.append('prioridad', this.get('prioridad')?.value);
    formData.append('titulo', this.get('titulo')?.value);
    formData.append('clienteId', cliente.id);
    formData.append('productoId', producto.id);
    formData.append('moduloCodigo', modulo.codigo);
    formData.append('comentario', this.get('comentario')?.value);
    formData.append('activo', this.get('activo')?.value);

    formData.append('cerrado', this.get('cerrado')?.value);
    formData.append('etapaActual', this.get('etapaActual')?.value);
    formData.append('usuarioAltaId', this.get('usuarioAltaId')?.value);
    formData.append('estimacion', this.get('estimacion')?.value);
    formData.delete('createdAt');
    formData.delete('updateAt');
    formData.delete('deletedAt');


    this.uploadedFiles.forEach(file => formData.append('archivos', file));

    return formData;
  }

  accion(event: Event) {
    event.preventDefault();
    this.submit();
  }

}
