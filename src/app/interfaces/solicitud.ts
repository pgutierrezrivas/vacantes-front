export interface Solicitud {
    idSolicitud: number;
    fecha: Date;
    archivo: string;
    comentarios?: string;
    estado: number; // 0: presentada, 1: adjudicada
    curriculum: string;
    idVacante: number;
    email: string;
}