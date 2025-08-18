export interface Modulo {
  codigo: string;
  nombre: string;
  padreCodigo?: string;
  activo: boolean;
  hijos?: Modulo[];
  // eventos?: Evento[];
}
