export interface Catalogo {
  id: number;
  tipo: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
