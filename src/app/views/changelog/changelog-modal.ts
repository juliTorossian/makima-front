import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ChangelogComponent } from './changelog';
import { CHANGELOG } from '@core/services/changelog';

@Component({
  selector: 'app-changelog-modal',
  standalone: true,
  imports: [CommonModule, ChangelogComponent],
  template: `<app-changelog [isModalView]="true"></app-changelog>`,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ChangelogModalComponent implements OnInit {
  protected ref = inject(DynamicDialogRef);

  ngOnInit(): void {
    // Marcar que el usuario ya vio este changelog
    const latestVersion = CHANGELOG[0]?.version;
    if (latestVersion) {
      localStorage.setItem('lastSeenVersion', latestVersion);
    }
  }
}
