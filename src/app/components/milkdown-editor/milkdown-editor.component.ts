import { 
  Component, 
  ElementRef, 
  ViewChild, 
  OnDestroy, 
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnInit,
  inject
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Crepe } from "@milkdown/crepe";
import { LayoutStoreService } from "@/app/core/services/layout-store.service";
import { Subscription } from "rxjs";

export interface MilkdownConfig {
  placeholder?: string;
  readonly?: boolean;
  features?: {
    toolbar?: boolean;
    table?: boolean;
    linkTooltip?: boolean;
    imageBlock?: boolean;
    blockEdit?: boolean;
    listItem?: boolean;
    cursor?: boolean;
    placeholder?: boolean;
    latex?: boolean;
    codeMirror?: boolean;
  };
  height?: string;
  maxWidth?: string;
}

@Component({
  selector: 'milkdown-editor',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MilkdownEditorComponent),
      multi: true
    }
  ],
  template: `
    <div class="milkdown-wrapper" [style.max-width]="config.maxWidth || '900px'">
      <!-- Barra de herramientas opcional -->
      @if (showControls) {
        <div class="milkdown-controls">
          <button 
            type="button"
            (click)="toggleReadonly()" 
            class="control-btn"
            [disabled]="disabled">
            {{ isReadonly ? 'Habilitar Edición' : 'Solo Lectura' }}
          </button>
          <button 
            type="button"
            (click)="exportMarkdown()" 
            class="control-btn"
            [disabled]="disabled">
            📄 Exportar
          </button>
          <button 
            type="button"
            (click)="clearContent()" 
            class="control-btn clear-btn"
            [disabled]="disabled">
            🗑️ Limpiar
          </button>
          <button 
            type="button"
            (click)="logContent()" 
            class="control-btn"
            [disabled]="disabled">
            🔍 Ver Contenido
          </button>
        </div>
      }
      
      <!-- Container del editor -->
      <div 
        #editorRef 
        class="milkdown-editor-container"
        [style.min-height]="config.height || '300px'"
        [class.disabled]="disabled">
      </div>
      
      @if (showStatus) {
        <!-- Indicador de estado -->
        <div class="milkdown-status">
          <span class="status-item">
            <span class="status-dot" [class.active]="!isReadonly"></span>
            {{ isReadonly ? 'Solo lectura' : 'Editable' }}
          </span>
          <span class="status-item">
            Caracteres: {{ characterCount }}
          </span>
        </div>
      }
    </div>
  `,
  styleUrls: ['./milkdown-editor.component.scss']
})
export class MilkdownEditorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @ViewChild("editorRef") editorRef!: ElementRef;
  
  // Inputs
  @Input() config: MilkdownConfig = {};
  @Input() showControls: boolean = true;
  @Input() showStatus: boolean = true;
  @Input() disabled: boolean = false;
  @Input() initialValue: string = '';
  
  // Outputs
  @Output() contentChange = new EventEmitter<string>();
  @Output() focusEvent = new EventEmitter<void>();
  @Output() blurEvent = new EventEmitter<void>();
  @Output() ready = new EventEmitter<void>();
  
  // Estado interno
  private crepe?: Crepe;
  isReadonly = false;
  characterCount = 0;
  private isInitialized = false;
  private currentContent = '';
  
  // ControlValueAccessor
  private onChange = (value: string) => {};
  private onTouched = () => {};
  
  // Servicio de layout y suscripción
  private layoutStore = inject(LayoutStoreService);
  private themeSubscription?: Subscription;
  private currentThemeLink?: HTMLLinkElement;
  
  // Valor por defecto
  private defaultContent = `# Editor Milkdown

¡Bienvenido al editor Milkdown! 

## Características:

- **Formato rico** con barra de herramientas intuitiva
- **Comandos rápidos** con \`/\` para inserción eficiente  
- **Drag & drop** para reorganizar contenido
- **Tablas** con gestión completa
- **Imágenes** con redimensionamiento
- **Enlaces** con previsualizaciones
- **Listas** y tareas
- **Código** con sintaxis destacada
- **Matemáticas** LaTeX

### Instrucciones:
1. Selecciona texto para acceder a herramientas
2. Usa \`/\` para comandos rápidos
3. Arrastra elementos para reordenar

> ¡Comienza a escribir y disfruta de la experiencia! ✨`;

  ngOnInit() {
    // Configurar readonly inicial
    this.isReadonly = this.config.readonly || false;
    this.currentContent = this.initialValue || this.defaultContent;
    
    // Cargar el tema inicial
    this.loadMilkdownTheme(this.layoutStore.theme);
    
    // Suscribirse a cambios de tema
    this.themeSubscription = this.layoutStore.layoutState$.subscribe((state) => {
      const resolvedTheme = state.theme === 'system' 
        ? this.layoutStore.getSystemTheme() 
        : state.theme;
      this.loadMilkdownTheme(resolvedTheme);
    });
  }

  async ngAfterViewInit() {
    await this.initializeEditor();
  }

  ngOnDestroy() {
    this.destroyEditor();
    
    // Limpiar suscripción
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
    
    // Limpiar el link del tema
    this.removeMilkdownTheme();
  }

  // ControlValueAccessor Implementation
  writeValue(value: string): void {
    if (value !== undefined) {
      this.currentContent = value || '';
      this.updateCharacterCount(this.currentContent);
      // Si el editor ya está inicializado, lo recreamos con el nuevo valor
      if (this.isInitialized) {
        this.recreateEditor();
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.crepe) {
      this.crepe.setReadonly(isDisabled || this.isReadonly);
    }
  }

  // Métodos principales
  private async initializeEditor(): Promise<void> {
    try {
      if (!this.editorRef?.nativeElement) {
        console.error('Editor reference not available');
        return;
      }

      await this.createEditor();
      
    } catch (error) {
      console.error("Error al inicializar Milkdown Editor:", error);
    }
  }

  private async createEditor(): Promise<void> {
    // Configuración por defecto
    const defaultConfig = {
      toolbar: true,
      table: true,
      linkTooltip: true,
      imageBlock: true,
      blockEdit: true,
      listItem: true,
      cursor: true,
      placeholder: true,
      latex: true,
      codeMirror: true,
      ...this.config.features
    };

    // Crear instancia de Crepe
    this.crepe = new Crepe({
      root: this.editorRef.nativeElement,
      defaultValue: this.currentContent,
      features: {
        [Crepe.Feature.CodeMirror]: defaultConfig.codeMirror,
        [Crepe.Feature.Table]: defaultConfig.table,
        [Crepe.Feature.LinkTooltip]: defaultConfig.linkTooltip,
        [Crepe.Feature.ImageBlock]: defaultConfig.imageBlock,
        [Crepe.Feature.BlockEdit]: defaultConfig.blockEdit,
        [Crepe.Feature.ListItem]: defaultConfig.listItem,
        [Crepe.Feature.Toolbar]: false, // Toolbar desactivado para interfaz más limpia
        [Crepe.Feature.Cursor]: defaultConfig.cursor,
        [Crepe.Feature.Placeholder]: defaultConfig.placeholder,
        [Crepe.Feature.Latex]: defaultConfig.latex,
      },
      featureConfigs: {
        [Crepe.Feature.LinkTooltip]: {
          inputPlaceholder: "Ingresa la URL...",
        },
      },
    });

    // Inicializar
    await this.crepe.create();

    // Configurar readonly y disabled
    if (this.disabled || this.isReadonly) {
      this.crepe.setReadonly(true);
    }

    // Configurar listeners
    this.setupEventListeners();
    
    this.isInitialized = true;
    this.ready.emit();
    
    console.log("Milkdown Editor inicializado correctamente");
  }

  private async recreateEditor(): Promise<void> {
    this.destroyEditor();
    await this.createEditor();
  }

  private setupEventListeners(): void {
    if (!this.crepe) return;

    this.crepe.on((listener) => {
      listener.markdownUpdated((ctx) => {
        // El parámetro es un contexto, necesitamos obtener el markdown del editor
        const markdown = this.crepe?.getMarkdown() || '';
        this.currentContent = markdown;
        this.updateCharacterCount(markdown);
        this.contentChange.emit(markdown);
        this.onChange(markdown);
      });

      listener.focus(() => {
        this.focusEvent.emit();
        this.onTouched();
      });

      listener.blur(() => {
        this.blurEvent.emit();
      });
    });
  }

  private updateCharacterCount(content: string): void {
    this.characterCount = content.length;
  }

  private destroyEditor(): void {
    if (this.crepe) {
      this.crepe.destroy();
      this.crepe = undefined;
    }
    this.isInitialized = false;
  }

  // Métodos públicos para interactuar con el editor
  getMarkdown(): string {
    return this.crepe?.getMarkdown() || this.currentContent;
  }

  setMarkdown(markdown: string): void {
    this.currentContent = markdown;
    this.updateCharacterCount(markdown);
    if (this.isInitialized) {
      this.recreateEditor();
    }
  }

  setReadonly(readonly: boolean): void {
    this.isReadonly = readonly;
    if (this.crepe) {
      this.crepe.setReadonly(readonly || this.disabled);
    }
  }

  toggleReadonly(): void {
    this.setReadonly(!this.isReadonly);
  }

  clearContent(): void {
    this.setMarkdown('');
    this.contentChange.emit('');
    this.onChange('');
  }

  exportMarkdown(): void {
    const markdown = this.getMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  logContent(): void {
    const markdown = this.getMarkdown();
    console.log('Contenido Markdown:', markdown);
    
    // También mostrar en una ventana modal simple
    const newWindow = window.open('', '_blank', 'width=600,height=400');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Contenido Markdown</title></head>
          <body>
            <h2>Contenido del Editor</h2>
            <pre style="white-space: pre-wrap; font-family: monospace; background: #f5f5f5; padding: 1rem; border-radius: 4px;">${markdown}</pre>
          </body>
        </html>
      `);
    }
  }

  // Métodos de utilidad
  focusEditor(): void {
    if (this.crepe && this.editorRef?.nativeElement) {
      this.editorRef.nativeElement.focus();
    }
  }

  blurEditor(): void {
    if (this.editorRef?.nativeElement) {
      this.editorRef.nativeElement.blur();
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  // Manejo de temas dinámicos para Milkdown
  private loadMilkdownTheme(theme: 'light' | 'dark' | 'system'): void {
    const resolvedTheme = theme === 'system' 
      ? this.layoutStore.getSystemTheme() 
      : theme;
    
    const themeFile = resolvedTheme === 'dark' 
      ? 'node_modules/@milkdown/crepe/theme/nord-dark.css'
      : 'node_modules/@milkdown/crepe/theme/nord.css';
    
    // Remover el tema anterior si existe
    this.removeMilkdownTheme();
    
    // Crear nuevo link element para el tema
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = themeFile;
    link.id = 'milkdown-theme';
    
    // Agregar al head
    document.head.appendChild(link);
    this.currentThemeLink = link;
  }
  
  private removeMilkdownTheme(): void {
    if (this.currentThemeLink && this.currentThemeLink.parentNode) {
      this.currentThemeLink.parentNode.removeChild(this.currentThemeLink);
      this.currentThemeLink = undefined;
    }
  }
}