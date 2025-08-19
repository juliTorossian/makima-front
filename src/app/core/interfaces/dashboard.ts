
export interface DashboardEventosPorEtapa {
	etapas: {
            etapaId: number;
            etapaNombre: string;
            cantidad: number;
        }[];
	total: number;
}
