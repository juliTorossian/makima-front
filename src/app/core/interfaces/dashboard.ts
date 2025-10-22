
export interface DashboardEventosPorEtapa {
	etapas: {
            etapaId: number;
            etapaNombre: string;
            cantidad: number;
        }[];
	total: number;
}

export interface DashboardEventosPorTipo {
	tipos: {
            tipoCodigo: string;
            tipoDescripcion: string;
            cantidad: number;
        }[];
	total: number;
}

export interface DashboardEventosPorCliente {
	clientes: {
            clienteId: number;
            clienteNombre: string;
            cantidad: number;
        }[];
	total: number;
}
