import { Producto } from "./producto"

export interface Entorno {
  codigo: string;
  nombre: string;
  activo?: boolean;
  productos?: Producto[];
}
