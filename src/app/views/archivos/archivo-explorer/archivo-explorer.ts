import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { TreeModule } from 'primeng/tree';
import { TreeNode } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { saveAs } from 'file-saver';
import { ArchivosService } from '@core/services/archivos';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoadingSpinnerComponent } from '../../../components/loading-spinner/loading-spinner';

@Component({
  selector: 'app-archivo-explorer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TreeModule,
    SelectModule,
    TooltipModule,
    DialogModule,
    ButtonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './archivo-explorer.html',
  styleUrls: ['./archivo-explorer.scss']
})
export class ArchivoExplorer implements OnInit {

  // selects
  tipos = [
    { label: 'Logs', value: 'logs' },
    { label: 'Reportes', value: 'reportes' },
    { label: 'Uploads', value: 'uploads' }
  ];

  ordenOptions = [
    { label: 'Nombre', value: 'name' },
    { label: 'Última modificación', value: 'updatedAt' },
    { label: 'Fecha creación', value: 'createdAt' },
    { label: 'Tamaño', value: 'size' }
  ];

  directionOptions = [
    { label: 'Ascendente', value: 'asc' },
    { label: 'Descendente', value: 'desc' }
  ];

  // signals
  selectedTipo = signal('logs');
  ordenSeleccionado = signal<'name' | 'updatedAt' | 'createdAt' | 'size'>('name');
  ordenDirection = signal<'asc' | 'desc'>('asc');
  nodes = signal<TreeNode[]>([]);

  loadingNodeKeys = new Set<string>();

  // PREVIEW
  previewVisible = signal(false);
  previewType = signal<'image' | 'pdf' | 'json' | 'text' | 'none'>('none');
  previewContent = signal<any>(null);
  previewTitle = signal('');
  // loading
  loadingRoot = signal(false);

  constructor(
    protected cdr: ChangeDetectorRef,
    private archivosService: ArchivosService,
  private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.cargarRoot();
  }

  cargarRoot() {
    this.loadingRoot.set(true);
    this.archivosService.getTree(this.selectedTipo()).subscribe({
      next: resp => {
        const root = this.buildTree(this.selectedTipo(), '', resp);
        this.nodes.set([root]);
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingRoot.set(false);
        this.cdr.detectChanges();
      },
      complete: () => {
        this.loadingRoot.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  // -------------------------
  // NAVEGACIÓN DE CARPETAS
  // -------------------------
  buildTree(tipo: string, path: string, resp: any): TreeNode {
    const folderNodes = resp.folders.map((f:any) => this.folderNode(tipo, path, f));
    const fileNodes = resp.files.map((f:any) => this.fileNode(tipo, path, f));

    return {
      key: path || tipo,
      label: path || tipo,
      data: { tipo, path },
      icon: 'pi pi-folder',
      children: this.sortNodes([...folderNodes, ...fileNodes])
    };
  }

  folderNode(tipo: string, base: string, f: any): TreeNode {
    const full = this.join(base, f.name);
    return {
      key: full,
      label: f.name,
      icon: 'pi pi-folder',
      data: { tipo, path: full, createdAt: f.createdAt, updatedAt: f.updatedAt },
      children: [],
      leaf: false
    };
  }

  fileNode(tipo: string, base: string, f: any): TreeNode {
    const full = this.join(base, f.name);
    return {
      key: full,
      label: f.name,
      icon: this.getIcon(f.name),
      data: { tipo, path: full, createdAt: f.createdAt, updatedAt: f.updatedAt, size: f.size },
      leaf: true
    };
  }

  onNodeExpand(evt: any) {
    const node = evt.node;
    const { tipo, path } = node.data;

    if (node.key) this.loadingNodeKeys.add(node.key);

    this.archivosService.getTree(tipo, path).subscribe({
      next: resp => {
        node.children = this.buildTree(tipo, path, resp).children!;
        if (node.key) this.loadingNodeKeys.delete(node.key);
        this.cdr.detectChanges();
      },
      error: () => {
        if (node.key) this.loadingNodeKeys.delete(node.key);
        this.cdr.detectChanges();
      }
    });
  }

  isLoading(node: TreeNode) {
    return !!node.key && this.loadingNodeKeys.has(node.key);
  }

  onNodeSelect(evt: any) {
    const node = evt;
    if (!node.leaf) return;

    const { tipo, path } = node.data;
    this.previsualizar(tipo, path, node.label);
  }
  
  onDescargar(node: TreeNode) {
    const { tipo, path } = node.data;

    // 👉 si es archivo → descarga normal
    if (node.leaf) {
      this.archivosService.descargarArchivo(tipo, path).subscribe(blob => {
        saveAs(blob, node.label);
      });
      return;
    }

    // 👉 si es carpeta → descarga ZIP
    this.archivosService.descargarZip(tipo, path).subscribe(blob => {
      const nombreZip = `${node.label}.zip`;
      saveAs(blob, nombreZip);
    });
  }

  // -------------------------
  // PREVISUALIZACIÓN
  // -------------------------
  previsualizar(tipo: string, path: string, nombre: string) {
    this.archivosService.descargarArchivo(tipo, path).subscribe(blob => {
      const ext = nombre.split('.').pop()?.toLowerCase();
      this.previewTitle.set(nombre);

      // IMAGEN
      if (['png', 'jpg', 'jpeg', 'webp'].includes(ext!)) {
        this.previewType.set('image');
        this.previewContent.set(URL.createObjectURL(blob));
      }
      // PDF
      else if (ext === 'pdf') {
        const url = URL.createObjectURL(blob);

        this.previewType.set('pdf');
        this.previewContent.set(
          this.sanitizer.bypassSecurityTrustResourceUrl(url)
        );
      }
      // JSON
      else if (ext === 'json') {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewType.set('json');
          this.previewContent.set(JSON.parse(reader.result as string));
        };
        reader.readAsText(blob);
      }
      // TEXTO
      else if (['txt', 'log'].includes(ext!)) {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewType.set('text');
          this.previewContent.set(reader.result);
        };
        reader.readAsText(blob);
      }
      // DESCONOCIDO → descarga
      else {
        saveAs(blob, nombre);
        return;
      }

      this.previewVisible.set(true);
      this.cdr.detectChanges();
    });
  }

  // -------------------------
  // UTILIDADES
  // -------------------------
  join(a: string, b: string) {
    return a ? `${a}/${b}` : b;
  }

  getIcon(name: string) {
    const ext = name.split('.').pop()?.toLowerCase();
    return {
      'json': 'pi pi-code',
      'png': 'pi pi-image',
      'jpg': 'pi pi-image',
      'jpeg': 'pi pi-image',
      'pdf': 'pi pi-file-pdf',
      'xlsx': 'pi pi-file-excel',
      'xls': 'pi pi-file-excel',
      'log': 'pi pi-book',
      'txt': 'pi pi-file'
    }[ext!] ?? 'pi pi-file';
  }

  isNew(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    return diff < 24 * 60 * 60 * 1000;
  }

  formatDate(iso: string) {
    return new Date(iso).toLocaleString();
  }

  formatSize(bytes?: number) {
    if (!bytes) return '';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = Math.floor(Math.log(bytes) / Math.log(1024));
    let v = bytes / Math.pow(1024, i);
    return `${v.toFixed(1)} ${u[i]}`;
  }

  sortNodes(nodes: TreeNode[]): TreeNode[] {
    const field = this.ordenSeleccionado();
    const dir = this.ordenDirection() === 'asc' ? 1 : -1;

    return nodes.sort((a, b) => {
      const A = a.data[field];
      const B = b.data[field];

      if (field === 'name') {
        return a.label!.localeCompare(b.label!) * dir;
      }

      if (field === 'size') {
        return ((A || 0) - (B || 0)) * dir;
      }

      return (new Date(A).getTime() - new Date(B).getTime()) * dir;
    });
  }

  getTooltip(node: TreeNode) {
    const d = node.data;
    return `Creado: ${this.formatDate(d.createdAt)}
Modificado: ${this.formatDate(d.updatedAt)}
${d.size ? 'Tamaño: ' + this.formatSize(d.size) : ''}`;
  }
}
