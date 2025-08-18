import { Component, inject } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { showSuccess, showError, showWarn, showInfo } from '../../utils/message-utils';

@Component({
  selector: 'app-crud-form-modal',
  imports: [],
  templateUrl: './crud-form-modal.html',
  styleUrl: './crud-form-modal.scss'
})
export abstract class CrudFormModal<T> {
  protected ref = inject(DynamicDialogRef);
  protected config = inject(DynamicDialogConfig);
  protected messageService = inject(MessageService);

  showSuccess(summary: string, detail: string) {
    showSuccess(this.messageService, summary, detail);
  }

  showError(summary: string, detail: string) {
    showError(this.messageService, summary, detail);
  }

  showWarn(summary: string, detail: string) {
    showWarn(this.messageService, summary, detail);
  }

  showInfo(summary: string, detail: string) {
    showInfo(this.messageService, summary, detail);
  }

  form!: FormGroup;
  modo!: 'A' | 'M';

  ngOnInit(): void {
    this.modo = this.config.data.modo;
    const data = this.config.data.item as T | null;

    this.form = this.buildForm();

    if (data) this.populateForm(data);

    if (this.modo === 'M') this.setupEditMode();
  }

  protected abstract buildForm(): FormGroup;
  protected abstract populateForm(data: T): void;
  protected abstract toModel(): any;

  protected setupEditMode(): void {
    // Por defecto nada, pero overrideable
  }

  submit(): void {
    if (!this.form.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor completá todos los campos requeridos correctamente'
      });
      return;
    }

    const model = this.toModel();
    this.ref.close(model);
  }

  cancel(): void {
    this.ref.close(null);
  }

  get(campo: string): AbstractControl | null {
    return this.form.get(campo);
  }

  onUppercaseInput(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase();
    input.value = upperValue;
    this.get(controlName)?.setValue(upperValue, { emitEvent: false });
  }

  // Para mostrar mensajes, usar las funciones importadas:
  // showSuccess(this.messageService, summary, detail);
  // showError(this.messageService, summary, detail);
  // showWarn(this.messageService, summary, detail);
  // showInfo(this.messageService, summary, detail);

}
