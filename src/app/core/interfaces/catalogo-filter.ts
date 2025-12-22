/**
 * Interfaz para representar un filtro de catálogo individual
 */
export interface CatalogoFiltro {
  tipo: string;        // Tipo de catálogo (ej: "KB_PLATAFORMA", "PROYECTO_ESTADO")
  valores: string[];   // Valores seleccionados para filtrar
}

/**
 * Interfaz para el estado de filtros en un componente
 */
export interface CatalogoFiltroState {
  [key: string]: string[];  // key es el nombre del filtro, value es el array de valores seleccionados
}

/**
 * Interfaz para la configuración de un filtro individual
 */
export interface CatalogoFiltroItemConfig {
  /** Nombre del parámetro de query (ej: "plataforma") */
  paramName: string;
  /** Tipo de catálogo (ej: "KB_PLATAFORMA") */
  tipoCatalogo: string;
  /** Label para mostrar en la UI */
  label: string;
  /** Placeholder para el select */
  placeholder?: string;
  /** Si permite selección múltiple */
  multiple?: boolean;
}

/**
 * Interfaz para las opciones de búsqueda con filtros de catálogo
 */
export interface CatalogoSearchOptions {
  /** Estado activo (true/false/undefined para todos) */
  activo?: boolean;
  /** Texto de búsqueda general */
  search?: string;
  /** Filtros de catálogo */
  catalogos?: Record<string, string[]> | CatalogoFiltro[];
  /** Número de página (para paginación) */
  page?: number;
  /** Cantidad de items por página */
  limit?: number;
  /** Campo por el cual ordenar */
  sortBy?: string;
  /** Dirección de ordenamiento */
  sortOrder?: 'ASC' | 'DESC';
}
