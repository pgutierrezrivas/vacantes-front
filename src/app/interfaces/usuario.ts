export interface Usuario {
    email: string;
    nombre: string;
    apellidos: string;
    password: string;
    enabled: number;
    fecha_Registro: Date;
    rol: 'EMPRESA' | 'ADMON' | 'CLIENTE' | null;
}