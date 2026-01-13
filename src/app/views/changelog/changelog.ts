import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CHANGELOG, ChangelogEntry, ChangelogChange } from '@core/services/changelog';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { VersionService } from '@core/services/version';
import { UiCard } from '../../components/ui-card';

@Component({
    selector: 'app-changelog',
    standalone: true,
    imports: [CommonModule, UiCard],
    templateUrl: './changelog.html',
    styleUrl: './changelog.scss'
})
export class ChangelogComponent implements OnInit {
    private router = inject(Router);
    private dialogRef = inject(DynamicDialogRef, { optional: true });
    private versionService = inject(VersionService);

    @Input() isModalView = false;

    changelog: ChangelogEntry[] = CHANGELOG;
    maxVersionsInModal = 2; // Mostrar solo las últimas 2 versiones en modal
    currentBuild = signal<string | undefined>(undefined);

    ngOnInit(): void {
        this.versionService.getVersion().subscribe(version => {
            if (version.commitHash) {
                this.currentBuild.set(version.commitHash);
            }
        });
    }

    get displayedChangelog(): ChangelogEntry[] {
        if (this.isModalView) {
            // Filtrar versiones futuras y mostrar solo las últimas maxVersionsInModal
            return this.changelog
                .filter(entry => !entry.isFuture)
                .slice(0, this.maxVersionsInModal);
        }
        return this.changelog;
    }

    get hasMoreVersions(): boolean {
        const releasedVersions = this.changelog.filter(entry => !entry.isFuture);
        return releasedVersions.length > this.maxVersionsInModal;
    }

    isCurrentVersion(entry: ChangelogEntry): boolean {
        // La versión actual es la primera que NO es futura
        const firstReleased = this.changelog.find(e => !e.isFuture);
        return firstReleased === entry;
    }

    shouldExpand(entry: ChangelogEntry): boolean {
        // Expandir solo si es la versión actual (no futura)
        return this.isCurrentVersion(entry);
    }

    navigateToFullChangelog(): void {
        this.closeModal();
        this.router.navigate(['/changelog']);
    }

    closeModal(): void {
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    }

    navigateToFeature(link: string): void {
        this.closeModal();
        this.router.navigate([link]);
    }

    getChangeIcon(type: ChangelogChange['type']): string {
        switch (type) {
            case 'feature':
                return 'pi pi-plus-circle';
            case 'improvement':
                return 'pi pi-arrow-up';
            case 'fix':
                return 'pi pi-wrench';
            default:
                return 'pi pi-circle';
        }
    }

    getChangeClass(type: ChangelogChange['type']): string {
        switch (type) {
            case 'feature':
                return 'change-icon-feature';
            case 'improvement':
                return 'change-icon-improvement';
            case 'fix':
                return 'change-icon-fix';
            default:
                return '';
        }
    }

    getChangeBadgeClass(type: ChangelogChange['type']): string {
        switch (type) {
            case 'feature':
                return 'badge-feature';
            case 'improvement':
                return 'badge-improvement';
            case 'fix':
                return 'badge-fix';
            default:
                return 'badge-secondary';
        }
    }

    getChangeLabel(type: ChangelogChange['type']): string {
        switch (type) {
            case 'feature':
                return 'Nuevo';
            case 'improvement':
                return 'Mejorado';
            case 'fix':
                return 'Corregido';
            default:
                return '';
        }
    }
    getGroupedChanges(entry: ChangelogEntry): { type: ChangelogChange['type']; items: ChangelogChange[] }[] {
        const groups: Record<string, ChangelogChange[]> = {};
        const order: ChangelogChange['type'][] = ['feature', 'improvement', 'fix'];

        entry.changes.forEach(change => {
            if (!groups[change.type]) {
                groups[change.type] = [];
            }
            groups[change.type].push(change);
        });

        return order
            .filter(type => groups[type])
            .map(type => ({
                type,
                items: groups[type]
            }));
    }
}
