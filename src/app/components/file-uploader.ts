import { Component, Input } from '@angular/core'
import { NgIcon } from '@ng-icons/core'
import { Output, EventEmitter } from '@angular/core'
import {
  DROPZONE_CONFIG,
  DropzoneConfigInterface,
  DropzoneModule,
} from 'ngx-dropzone-wrapper'
import { formatFileSize } from '../utils/file-utils'

type UploadedFile = {
  name: string
  size: number
  type: string
  dataURL?: string
  loading?: boolean
}

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  maxFilesize: 50,
  acceptedFiles: '*',
}

@Component({
  selector: 'FileUploader',
  standalone: true,
  imports: [DropzoneModule, NgIcon],
  template: `
    <dropzone
      class="dropzone"
      [config]="dropzoneConfig"
      [message]="dropzone"
      (addedFile)="onFileAdded($event)"
    ></dropzone>
    @if (uploadedFiles) {
      <div class="dropzone-previews mt-3" id="file-previews">
        @for (file of uploadedFiles; track index; let index = $index) {
          <div class="card mt-1 mb-0 border-dashed border">
            <div class="p-2">
              <div class="row align-items-center">
                <div class="col-auto">
                  @if (file.type && file.type.startsWith('image/') && file.dataURL) {
                      <img
                        data-dz-thumbnail=""
                        [src]="file.dataURL"
                        class="avatar-sm rounded bg-light"
                      />
                  } @else {
                    <div class="avatar-sm rounded bg-light d-flex align-items-center justify-content-center" style="width:40px;height:40px;">
                      <ng-icon name="lucideFileText" />
                      <!-- @if (file.type === 'application/pdf'){
                      } @if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                        <ng-icon name="tablerFileTypeDoc" />
                      } @if (file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                        <ng-icon name="tablerFileTypeXls" />
                      } @if (file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
                        <ng-icon name="tablerFileTypePpt" />
                      } @if (file.type && !(file.type.startsWith('image/') || file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-powerpoint' || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
                        <ng-icon name="tablerFile" />
                      } -->
                    </div>
                  }
                </div>
                <div class="col ps-0">
                  <a href="javascript:void(0);" class="fw-semibold">{{
                    file.name
                  }}</a>
                  <p class="mb-0 text-muted" data-dz-size="">
                    <strong>{{ formatFileSize(file.size) }}</strong>
                  </p>
                </div>
                <div class="col-auto">
                  <a
                    (click)="removeFile(index)"
                    class="btn btn-link shadow-none btn-lg text-danger"
                  >
                    <ng-icon name="tablerX" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    }
  `,
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG,
    },
  ],
})
export class FileUploader {
  @Input() url:string = '/fake'
  @Input() maxFilesize:number = 10
  @Output() fileAdded = new EventEmitter<File>()
  formatFileSize = formatFileSize
  uploadedFiles: UploadedFile[] = []

  dropzoneConfig: DropzoneConfigInterface = { ...DEFAULT_DROPZONE_CONFIG };

  dropzone = `
   <div class="dz-message needsclick">
             <div class="avatar-lg mx-auto my-3">
                        <span class="avatar-title bg-info-subtle text-info rounded-circle">
                            <span class="fs-24 text-info">
                            <span class="fs-24 upload-icon"></span>
                        </span>
                        </span>
                    </div>
                        <h4 class="mb-2">Arrastras archivos o click para subir.</h4>
            <span class="d-block pb-3">
                <span type="button" class="btn btn-sm shadow btn-default">Mis Achivos</span>
            </span>
        </div>`

  imageURL: string = ''

  ngOnInit() {
    // Actualiza la configuración con los @Input
    this.dropzoneConfig = {
      ...DEFAULT_DROPZONE_CONFIG,
      url: this.url,
      maxFilesize: this.maxFilesize,
      clickable: true,
      addRemoveLinks: true,
      previewsContainer: false,
    };
  }

  onFileAdded(file: any) {
    const isImage = file.type && file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    const isDoc = file.type === 'application/msword'
      || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || file.type === 'application/vnd.ms-excel'
      || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      || file.type === 'application/vnd.ms-powerpoint'
      || file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataUrl = e.target?.result as string;
        this.uploadedFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          dataURL: dataUrl,
        });
      };
      reader.readAsDataURL(file);
    } else {
      this.uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        dataURL: '',
      });
    }
    this.fileAdded.emit(file);
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1)
  }
}
