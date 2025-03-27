import { Usuario } from "../interfaces/usuario";

export const USUARIOS_DB: Usuario[] = [
    {
        email: 'admin1@reto.com',
        nombre: 'Admin',
        apellidos: 'Sistema',
        password: '{noop}admin1',
        enabled: 1,
        fecha_Registro: new Date('2024-01-01'),
        rol: 'ADMON'
    },
    {
        email: 'empresa1@reto.com',
        nombre: 'Tech',
        apellidos: 'Solutions S.L.',
        password: '{noop}empresa1',
        enabled: 1,
        fecha_Registro: new Date('2024-02-15'),
        rol: 'EMPRESA'
    },
    {
        email: 'usuario1@reto.com',
        nombre: 'Ana',
        apellidos: 'Pérez Luna',
        password: '{noop}usuario1',
        enabled: 1,
        fecha_Registro: new Date('2024-04-05'),
        rol: 'CLIENTE'
    }
];