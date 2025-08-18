import { VidaEvento } from "./evento";

export interface Notificacion {
	id?: number;
	usuarioId?: string;
	fecha: Date;
	asunto: string;
	mensaje: string;
	envMail: boolean;
	leida: boolean;

    icon?:string;
    // tipo?: VidaEvento;
}
