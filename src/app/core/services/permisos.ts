import { Injectable } from '@angular/core';
import { PermisoClave, permisosVacios } from '@core/interfaces/rol';
import { PermisoAccion } from '@/app/types/permisos';

@Injectable({ providedIn: 'root' })
export class PermisosService {
    // Aquí deberías cargar los permisos del usuario desde el backend
    private static readonly STORAGE_KEY = 'permisos';
    private permisos: Record<PermisoClave, number> = PermisosService.loadPermisos();

    clearPermisos() {
        this.permisos = permisosVacios;
        sessionStorage.removeItem(PermisosService.STORAGE_KEY);
    }

    private static loadPermisos(): Record<PermisoClave, number> {
        const raw = sessionStorage.getItem(PermisosService.STORAGE_KEY);
        if (raw) {
            try {
                return JSON.parse(raw);
            } catch {
                // Si hay error, retorna todos en 0
            }
        }
        return permisosVacios;
    }

    setPermisos(permisos: Array<{ clave: PermisoClave; nivel: number }>) {
        const base: Record<PermisoClave, number> = permisosVacios;
        
        for (const permiso of permisos) {
            base[permiso.clave] = permiso.nivel;
        }
        this.permisos = base;
        sessionStorage.setItem(PermisosService.STORAGE_KEY, JSON.stringify(base));
    }

    can(clave: PermisoClave, accion: PermisoAccion): boolean {
        const permisos = PermisosService.loadPermisos();

        // Si el usuario es admin (nivel >= 1), acceso total
        if ((permisos['ADM'] ?? 0) >= 1) {
            return true;
        }
        const nivel = permisos[clave] ?? 0;
        if (accion === 'V') return nivel >= 1;
        if (accion === 'A' || accion === 'M') return nivel >= 2;
        if (accion === 'B') return nivel >= 3;
        return false;
    }
}