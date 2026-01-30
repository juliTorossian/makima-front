import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MilkdownConfig, MilkdownEditorComponent } from './milkdown-editor.component';

@Component({
  selector: 'app-milkdown-example',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MilkdownEditorComponent
  ],
  template: `
    <div class="example-container">
      <h1>Ejemplos de Uso - Standalone Milkdown</h1>
      
      <!-- Ejemplo 1: Editor Básico -->
      <section class="example-section">
        <h2>1. Editor Básico</h2>
        <milkdown-editor 
          [config]="basicConfig"
          (contentChange)="onBasicContentChange($event)"
          (ready)="onEditorReady('basic')">
        </milkdown-editor>
        <div class="output">
          <strong>Contenido actual:</strong>
          <pre>{{ basicContent }}</pre>
        </div>
      </section>

      <!-- Ejemplo 2: Con Reactive Forms -->
      <section class="example-section">
        <h2>2. Con Reactive Forms</h2>
        <form [formGroup]="documentForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="title">Título del Documento</label>
            <input 
              id="title"
              type="text" 
              formControlName="title" 
              class="form-control"
              placeholder="Ingresa el título">
          </div>
          
          <div class="form-group">
            <label>Contenido</label>
            <milkdown-editor 
              formControlName="content"
              [config]="formConfig">
            </milkdown-editor>
            <div *ngIf="contentErrors" class="error">
              {{ contentErrors }}
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" [disabled]="documentForm.invalid" class="btn-primary">
              💾 Guardar Documento
            </button>
            <button type="button" (click)="loadSampleDocument()" class="btn-secondary">
              📄 Cargar Ejemplo
            </button>
            <button type="button" (click)="clearForm()" class="btn-secondary">
              🗑️ Limpiar
            </button>
          </div>
        </form>
        
        <div *ngIf="documentForm.value.title || documentForm.value.content" class="form-output">
          <h3>Vista Previa del Formulario:</h3>
          <strong>Título:</strong> {{ documentForm.value.title }}<br>
          <strong>Caracteres:</strong> {{ documentForm.value.content?.length || 0 }}
        </div>
      </section>

      <!-- Ejemplo 3: Solo Lectura -->
      <section class="example-section">
        <h2>3. Modo Solo Lectura</h2>
        <div class="controls">
          <button (click)="toggleReadonly()" class="btn-secondary">
            {{ readonlyConfig.readonly ? '✏️ Habilitar Edición' : '🔒 Solo Lectura' }}
          </button>
        </div>
        <milkdown-editor 
          [config]="readonlyConfig"
          [initialValue]="sampleContent"
          (contentChange)="onReadonlyContentChange($event)">
        </milkdown-editor>
      </section>

      <!-- Ejemplo 4: Configuración Personalizada -->
      <section class="example-section">
        <h2>4. Configuración Personalizada</h2>
        <div class="config-controls">
          <label>
            <input type="checkbox" [(ngModel)]="customConfig.features!.toolbar"> 
            Barra de herramientas
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="customConfig.features!.table"> 
            Tablas
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="customConfig.features!.imageBlock"> 
            Imágenes
          </label>
          <label>
            <input type="checkbox" [(ngModel)]="customConfig.features!.latex"> 
            LaTeX
          </label>
          <label>
            Altura:
            <select [(ngModel)]="customConfig.height">
              <option value="200px">200px</option>
              <option value="400px">400px</option>
              <option value="600px">600px</option>
            </select>
          </label>
        </div>
        <milkdown-editor 
          [config]="customConfig"
          [showStatus]="true"
          [initialValue]="customInitialContent">
        </milkdown-editor>
      </section>

      <!-- Ejemplo 5: Múltiples Editores -->
      <section class="example-section">
        <h2>5. Múltiples Editores</h2>
        <div class="multi-editor-container">
          <div class="editor-column">
            <h3>Editor 1 - Notas</h3>
            <milkdown-editor 
              [config]="multiConfig1"
              [initialValue]="'# Mis Notas\\n\\nEscribe tus notas aquí...'"
              (contentChange)="onMultiEditor1Change($event)">
            </milkdown-editor>
          </div>
          
          <div class="editor-column">
            <h3>Editor 2 - Documentación</h3>
            <milkdown-editor 
              [config]="multiConfig2"
              [initialValue]="'# Documentación\\n\\nEscribe la documentación aquí...'"
              (contentChange)="onMultiEditor2Change($event)">
            </milkdown-editor>
          </div>
        </div>
        
        <div class="sync-actions">
          <button (click)="syncEditors()" class="btn-primary">
            🔄 Sincronizar Editores
          </button>
          <button (click)="exportBothEditors()" class="btn-secondary">
            📥 Exportar Ambos
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .example-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }

    .example-section {
      margin-bottom: 3rem;
      padding: 2rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
    }

    .example-section h2 {
      margin-top: 0;
      color: #1f2937;
      border-bottom: 2px solid #3b82f6;
      padding-bottom: 0.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .controls {
      margin-bottom: 1rem;
    }

    .config-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .config-controls label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
    }

    .multi-editor-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 1rem;
    }

    .editor-column h3 {
      margin-bottom: 1rem;
      color: #4b5563;
    }

    .sync-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .output, .form-output {
      margin-top: 1rem;
      padding: 1rem;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }

    .output pre {
      background: #1f2937;
      color: #f9fafb;
      padding: 1rem;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 0.875rem;
      margin: 0.5rem 0 0 0;
    }

    .error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    @media (max-width: 768px) {
      .example-container {
        padding: 1rem;
      }

      .multi-editor-container {
        grid-template-columns: 1fr;
      }

      .config-controls {
        flex-direction: column;
      }

      .form-actions, .sync-actions {
        flex-direction: column;
      }
    }
  `]
})
export class MilkdownExampleComponent {
  // Configuraciones para diferentes ejemplos
  basicConfig: MilkdownConfig = {
    height: '300px',
    placeholder: 'Escribe algo aquí...'
  };

  formConfig: MilkdownConfig = {
    height: '400px',
    features: {
      toolbar: true,
      table: true,
      imageBlock: true,
      latex: true
    }
  };

  readonlyConfig: MilkdownConfig = {
    height: '350px',
    readonly: false,
    features: {
      toolbar: false
    }
  };

  customConfig: MilkdownConfig = {
    height: '400px',
    features: {
      toolbar: true,
      table: true,
      imageBlock: true,
      latex: true,
      blockEdit: true,
      linkTooltip: true
    }
  };

  multiConfig1: MilkdownConfig = {
    height: '250px',
    maxWidth: '100%',
    features: {
      toolbar: true,
      table: false
    }
  };

  multiConfig2: MilkdownConfig = {
    height: '250px',
    maxWidth: '100%',
    features: {
      toolbar: true,
      table: true,
      latex: true
    }
  };

  // Estado del componente
  basicContent = '';
  multiEditor1Content = '';
  multiEditor2Content = '';

  // Formulario reactivo
  documentForm: FormGroup;

  // Contenido de ejemplo
  sampleContent = `# Documento de Ejemplo

Este es un documento **de ejemplo** que demuestra las capacidades del editor Milkdown.

## Características Destacadas

- **Texto enriquecido** con formato
- \`Código inline\` y bloques de código
- > Citas y blockquotes
- Enlaces: [Milkdown](https://milkdown.dev)

### Lista de Tareas
- [x] Implementar editor básico
- [x] Agregar soporte para tablas
- [ ] Añadir plugins personalizados

### Tabla de Ejemplo
| Característica | Estado | Notas |
|---------------|--------|-------|
| Markdown | ✅ | Completo |
| LaTeX | ✅ | Soporte básico |
| Imágenes | ✅ | Con redimensionamiento |

### Código de Ejemplo
\`\`\`typescript
const editor = new MilkdownEditor({
  features: ['toolbar', 'table', 'image']
});
\`\`\`

¡Disfruta editando! 🎉`;

  customInitialContent = `# Editor Personalizable

Puedes configurar qué características están habilitadas:

- ✅ Barra de herramientas
- ✅ Soporte para tablas  
- ✅ Bloques de imagen
- ✅ Ecuaciones LaTeX: $E = mc^2$

¡Prueba las opciones de arriba!`;

  constructor(private fb: FormBuilder) {
    this.documentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // Getters para errores de validación
  get contentErrors() {
    const control = this.documentForm.get('content');
    if (control?.errors?.['required']) return 'El contenido es requerido';
    if (control?.errors?.['minlength']) return 'Mínimo 10 caracteres requeridos';
    return null;
  }

  // Event handlers
  onBasicContentChange(content: string) {
    this.basicContent = content;
    console.log('Editor básico actualizado:', content.length, 'caracteres');
  }

  onReadonlyContentChange(content: string) {
    console.log('Editor readonly actualizado:', content);
  }

  onMultiEditor1Change(content: string) {
    this.multiEditor1Content = content;
  }

  onMultiEditor2Change(content: string) {
    this.multiEditor2Content = content;
  }

  onEditorReady(editorType: string) {
    console.log(`Editor ${editorType} está listo`);
  }

  // Form methods
  onSubmit() {
    if (this.documentForm.valid) {
      console.log('Documento guardado:', this.documentForm.value);
      alert('¡Documento guardado exitosamente!');
    }
  }

  loadSampleDocument() {
    this.documentForm.patchValue({
      title: 'Documento de Ejemplo',
      content: this.sampleContent
    });
  }

  clearForm() {
    this.documentForm.reset();
  }

  // Readonly methods
  toggleReadonly() {
    this.readonlyConfig = {
      ...this.readonlyConfig,
      readonly: !this.readonlyConfig.readonly
    };
  }

  // Multi-editor methods
  syncEditors() {
    // Sincronizar contenido del editor 1 al editor 2
    this.multiConfig2 = { ...this.multiConfig2 };
    alert('Editores sincronizados');
  }

  exportBothEditors() {
    const combinedContent = `# Editor 1 - Notas\n\n${this.multiEditor1Content}\n\n---\n\n# Editor 2 - Documentación\n\n${this.multiEditor2Content}`;
    
    const blob = new Blob([combinedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editores-combinados.md';
    a.click();
    URL.revokeObjectURL(url);
  }
}