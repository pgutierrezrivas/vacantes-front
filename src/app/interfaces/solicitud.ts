export interface Solicitud {
    id_solicitud: number;
    fecha: Date;
    archivo: string;
    comentarios?: string;
    estado: number; // 0: presentada, 1: adjudicada
    curriculum: string;
    id_Vacante: number;
    email: string;
}
