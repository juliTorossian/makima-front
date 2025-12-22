# Sistema de Filtros de Catálogo - Guía de Uso

## Descripción General

El sistema de filtros de catálogo es una solución generalizada y reutilizable para filtrar datos por catálogos en diferentes módulos de la aplicación. Actualmente está implementado para KB, pero puede adaptarse fácilmente a otros módulos como Proyecto, Evento, etc.

## Componentes Principales

### 1. Utilidades (`catalogo-filter-utils.ts`)

Contiene funciones para construir y parsear parámetros de filtro:

- `buildCatalogoParams()`: Construye HttpParams a partir de filtros
- `convertToCatalogoFiltros()`: Convierte objeto de filtros a array
- `parseCatalogoQueryParams()`: Parsea query params de URL
- `combineCatalogoParams()`: Combina filtros con otros parámetros

### 2. Interfaces (`catalogo-filter.ts`)

Define las estructuras de datos:

- `CatalogoFiltro`: Representa un filtro individual
- `CatalogoFiltroState`: Estado de filtros en un componente
- `CatalogoFiltroItemConfig`: Configuración de un filtro
- `CatalogoSearchOptions`: Opciones de búsqueda completas

### 3. Componente (`catalogo-filtros.ts`)

Componente reutilizable para mostrar filtros en la UI.

---

## Formatos de Consulta Soportados

### Formato Simple
```
GET /kb?plataforma=GENEXUS,ANGULAR&estado=ACTIVA
```

### Formato JSON
```
GET /kb?catalogos=[{"tipo":"KB_PLATAFORMA","valores":["GENEXUS"]},{"tipo":"KB_ESTADO","valores":["ACTIVA"]}]
```

---

## Implementación Paso a Paso

### Paso 1: Configurar los Filtros del Módulo

En `catalogo-filter-utils.ts`, agregar la configuración:

```typescript
export const CATALOGO_FILTROS_CONFIG: Record<string, CatalogoFiltroConfig> = {
  KB: {
    plataforma: 'KB_PLATAFORMA',
    tecnologia: 'KB_TECNOLOGIA',
    compilador: 'KB_COMPILADOR',
    tipo: 'KB_TIPO',
    estado: 'KB_ESTADO',
    uso_actual: 'KB_USO_ACTUAL'
  },
  PROYECTO: {
    estado: 'PROYECTO_ESTADO',
    tipo: 'PROYECTO_TIPO',
    prioridad: 'PROYECTO_PRIORIDAD'
  }
  // Agregar más módulos aquí
};
```

### Paso 2: Actualizar el Servicio

Modificar el servicio para aceptar opciones de filtro:

```typescript
import { CatalogoSearchOptions } from "@core/interfaces/catalogo-filter";
import { combineCatalogoParams, CATALOGO_FILTROS_CONFIG } from "@/app/utils/catalogo-filter-utils";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.BASE_URL}/proyecto`;

  /**
   * Obtener todos los proyectos con filtros de catálogo
   */
  findAll(options: CatalogoSearchOptions = {}): Observable<Proyecto[]> {
    const { activo, search, catalogos, page, limit, sortBy, sortOrder } = options;
    
    // Preparar parámetros base
    const baseParams: Record<string, string | number | boolean> = {};
    if (activo !== undefined) {
      baseParams['activo'] = activo;
    }
    if (search) {
      baseParams['search'] = search;
    }
    if (page !== undefined) {
      baseParams['page'] = page;
    }
    if (limit !== undefined) {
      baseParams['limit'] = limit;
    }
    if (sortBy) {
      baseParams['sortBy'] = sortBy;
    }
    if (sortOrder) {
      baseParams['sortOrder'] = sortOrder;
    }

    // Combinar con filtros de catálogo
    const params = catalogos
      ? combineCatalogoParams(baseParams, catalogos, CATALOGO_FILTROS_CONFIG.PROYECTO, 'simple')
      : new HttpParams({ fromObject: baseParams as any });

    return this.http.get<Proyecto[]>(`${this.baseUrl}`, { params });
  }
}
```

### Paso 3: Usar el Componente de Filtros en la Vista

```typescript
import { Component, inject } from '@angular/core';
import { CatalogoFiltrosComponent } from '@app/components/catalogo-filtros';
import { CatalogoFiltroItemConfig, CatalogoFiltroState } from '@core/interfaces/catalogo-filter';
import { ProyectoService } from '@core/services/proyecto';

@Component({
  selector: 'app-proyectos',
  imports: [CatalogoFiltrosComponent, /* otros imports */],
  template: `
    <div class="container">
      <!-- Filtros de catálogo -->
      <app-catalogo-filtros
        [filtrosConfig]="filtrosConfig"
        [autoApply]="false"
        (onFiltrosChange)="aplicarFiltros($event)"
        (onLimpiar)="limpiarFiltros()"
      ></app-catalogo-filtros>

      <!-- Tabla de resultados -->
      <p-table [value]="proyectos" [loading]="loading">
        <!-- ... -->
      </p-table>
    </div>
  `
})
export class ProyectosComponent {
  private proyectoService = inject(ProyectoService);

  proyectos: Proyecto[] = [];
  loading = false;

  // Configuración de filtros
  filtrosConfig: CatalogoFiltroItemConfig[] = [
    {
      paramName: 'estado',
      tipoCatalogo: 'PROYECTO_ESTADO',
      label: 'Estado',
      placeholder: 'Seleccione estados',
      multiple: true
    },
    {
      paramName: 'tipo',
      tipoCatalogo: 'PROYECTO_TIPO',
      label: 'Tipo',
      placeholder: 'Seleccione tipo',
      multiple: false
    },
    {
      paramName: 'prioridad',
      tipoCatalogo: 'PROYECTO_PRIORIDAD',
      label: 'Prioridad',
      placeholder: 'Seleccione prioridad',
      multiple: false
    }
  ];

  aplicarFiltros(filtros: CatalogoFiltroState): void {
    this.loading = true;
    
    this.proyectoService.findAll({
      activo: true,
      catalogos: filtros
    }).subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.loading = true;
    
    this.proyectoService.findAll({ activo: true }).subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
```

---

## Ejemplos de Uso

### Ejemplo 1: Filtros Simples sin Componente

```typescript
// En el componente
aplicarFiltros(): void {
  const filtros = {
    plataforma: ['GENEXUS', 'ANGULAR'],
    estado: ['ACTIVA']
  };

  this.kbService.findAll({
    activo: true,
    catalogos: filtros
  }).subscribe(kbs => {
    this.kbs = kbs;
  });
}
```

### Ejemplo 2: Filtros con Formato JSON

```typescript
import { CatalogoFiltro } from '@core/interfaces/catalogo-filter';

const filtros: CatalogoFiltro[] = [
  { tipo: 'KB_PLATAFORMA', valores: ['GENEXUS'] },
  { tipo: 'KB_ESTADO', valores: ['ACTIVA'] }
];

this.kbService.findAll({
  catalogos: filtros
}).subscribe(kbs => {
  this.kbs = kbs;
});
```

### Ejemplo 3: Construir Params Manualmente

```typescript
import { buildCatalogoParams, CATALOGO_FILTROS_CONFIG } from '@/app/utils/catalogo-filter-utils';

const filtros = {
  plataforma: ['GENEXUS'],
  estado: ['ACTIVA']
};

// Formato simple
const paramsSimple = buildCatalogoParams(filtros, CATALOGO_FILTROS_CONFIG.KB, 'simple');
// Resultado: plataforma=GENEXUS&estado=ACTIVA

// Formato JSON
const paramsJson = buildCatalogoParams(filtros, CATALOGO_FILTROS_CONFIG.KB, 'json');
// Resultado: catalogos=[{"tipo":"KB_PLATAFORMA","valores":["GENEXUS"]},{"tipo":"KB_ESTADO","valores":["ACTIVA"]}]
```

### Ejemplo 4: Combinar con Paginación y Búsqueda

```typescript
this.kbService.findAll({
  activo: true,
  search: 'angular',
  page: 1,
  limit: 10,
  sortBy: 'nombre',
  sortOrder: 'ASC',
  catalogos: {
    plataforma: ['ANGULAR', 'REACT'],
    estado: ['ACTIVA']
  }
}).subscribe(kbs => {
  this.kbs = kbs;
});
```

### Ejemplo 5: Parsear desde URL

```typescript
import { parseCatalogoQueryParams, CATALOGO_FILTROS_CONFIG } from '@/app/utils/catalogo-filter-utils';
import { ActivatedRoute } from '@angular/router';

// En el componente
constructor(private route: ActivatedRoute) {
  this.route.queryParams.subscribe(params => {
    const filtros = parseCatalogoQueryParams(params, CATALOGO_FILTROS_CONFIG.KB);
    // filtros = { plataforma: ['GENEXUS'], estado: ['ACTIVA'] }
    
    this.aplicarFiltros(filtros);
  });
}
```

---

## Ventajas del Sistema

1. **Reutilizable**: Se puede usar en cualquier módulo con mínima configuración
2. **Flexible**: Soporta múltiples formatos de query params
3. **Type-safe**: Usa TypeScript para definir tipos
4. **Desacoplado**: El componente UI está separado de la lógica
5. **Fácil de mantener**: Toda la configuración está centralizada
6. **Retrocompatible**: Los servicios existentes pueden seguir funcionando

---

## Migración de Código Existente

### Antes (sin sistema de filtros)
```typescript
findAll(activo?: boolean): Observable<kb[]> {
  let params = new HttpParams();
  if (activo !== undefined) {
    params = params.set('activo', activo.toString());
  }
  return this.http.get<kb[]>(`${this.baseUrl}`, { params });
}
```

### Después (con sistema de filtros)
```typescript
findAll(options: CatalogoSearchOptions = {}): Observable<kb[]> {
  const { activo, catalogos } = options;
  
  const baseParams: Record<string, string | number | boolean> = {};
  if (activo !== undefined) {
    baseParams['activo'] = activo;
  }

  const params = catalogos
    ? combineCatalogoParams(baseParams, catalogos, CATALOGO_FILTROS_CONFIG.KB, 'simple')
    : new HttpParams({ fromObject: baseParams as any });

  return this.http.get<kb[]>(`${this.baseUrl}`, { params });
}
```

---

## Preguntas Frecuentes

### ¿Cómo agrego un nuevo módulo?

1. Agregar configuración en `CATALOGO_FILTROS_CONFIG`
2. Actualizar el servicio del módulo
3. Usar el componente `CatalogoFiltrosComponent` en la vista

### ¿Puedo usar filtros sin el componente UI?

Sí, puedes usar las utilidades directamente y construir tu propia UI.

### ¿Qué pasa si el backend no soporta algún formato?

El sistema soporta ambos formatos (simple y JSON). Por defecto usa el formato simple que es más compatible.

### ¿Cómo manejo múltiples valores para un filtro?

Los filtros siempre manejan arrays de valores. Para un solo valor, usa un array con un elemento: `['ACTIVA']`

---

## Siguiente Paso: Integración con Routing

Para persistir filtros en la URL:

```typescript
import { Router } from '@angular/router';

aplicarFiltros(filtros: CatalogoFiltroState): void {
  // Actualizar URL
  this.router.navigate([], {
    queryParams: filtros,
    queryParamsHandling: 'merge'
  });

  // Hacer búsqueda
  this.kbService.findAll({ catalogos: filtros }).subscribe(...);
}
```
