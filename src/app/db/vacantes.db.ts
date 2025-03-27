import { Vacante } from "../interfaces/vacante";

export const VACANTES_DB: Vacante[] = [
    {
        id_vacante: 1,
        nombre: 'Desarrollador Full Stack',
        descripcion: 'Buscamos desarrollador con experiencia en Spring Boot y Angular',
        fecha: new Date('2025-05-01'),
        salario: 45000,
        estatus: 'CREADA',
        destacado: true,
        imagen: 'images/vacante.jpg',
        detalles: 'Experiencia mínima de 3 años en proyectos similares',
        id_Categoria: 1,
        id_empresa: 1
    },
    {
        id_vacante: 2,
        nombre: 'Especialista en Marketing Digital',
        descripcion: 'Gestión de campañas en redes sociales y SEO',
        fecha: new Date('2025-06-10'),
        salario: 35000,
        estatus: 'CREADA',
        destacado: false,
        imagen: 'images/vacante.jpg',
        detalles: 'Conocimientos avanzados en Google Analytics y Ads',
        id_Categoria: 2,
        id_empresa: 2
    },
    {
        id_vacante: 3,
        nombre: 'Diseñador UX/UI',
        descripcion: 'Diseño de interfaces y experiencia de usuario para aplicaciones móviles',
        fecha: new Date('2025-08-01'),
        salario: 38000,
        estatus: 'CREADA',
        destacado: true,
        imagen: 'images/vacante.jpg',
        detalles: 'Portafolio obligatorio que demuestre:\n- Procesos de diseño\n- Trabajo con prototipos\n- Pruebas con usuarios',
        id_Categoria: 3,
        id_empresa: 2
    }
];