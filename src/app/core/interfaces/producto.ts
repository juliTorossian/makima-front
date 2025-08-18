export interface Producto {
  id?: number;
  sigla: string;
  nombre: string;
  entornoCodigo: string;
  activo?: boolean;
  // eventos?: Evento[];
}
