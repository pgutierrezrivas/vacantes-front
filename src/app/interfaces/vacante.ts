export type VacanteStatus = 'CREADA' | 'CUBIERTA' | 'CANCELADA';

export interface Vacante {
    idVacante: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    salario: number;
    estatus: VacanteStatus;
    destacado: boolean;
    imagen: string;
    detalles: string;
    id_Categoria: number;
    id_empresa: number;
}
