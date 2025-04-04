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
        imagen: 'images/vacantes/vacante1.jpg',
        detalles: 'Experiencia mínima de 3 años en proyectos similares',
        id_Categoria: 1,
        id_empresa: 1
    },
    {
        id_vacante: 2,
        nombre: 'Especialista en Marketing Digital',
        descripcion: 'Conocimiento sobre gestión de campañas en redes sociales y SEO',
        fecha: new Date('2025-06-10'),
        salario: 35000,
        estatus: 'CREADA',
        destacado: false,
        imagen: 'images/vacantes/vacante2.jpg',
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
        imagen: 'images/vacantes/vacante3.jpg',
        detalles: 'Portafolio obligatorio que demuestre:\n- Procesos de diseño\n- Trabajo con prototipos\n- Pruebas con usuarios',
        id_Categoria: 3,
        id_empresa: 2
    },
    {
        id_vacante: 4,
        nombre: 'Analista de datos',
        descripcion: 'Conocimientos sobre los analisis exaustivos de los datos de blabla',
        fecha: new Date('2025-05-18'),
        salario: 70000,
        estatus: 'CREADA',
        destacado: false,
        imagen: 'images/vacantes/vacante4.jpg',
        detalles: 'Portafolio obligatorio que demuestre:\n- Procesos de diseño\n- Trabajo con prototipos\n- Pruebas con usuarios',
        id_Categoria: 1,
        id_empresa: 1
    },
    {
        id_vacante: 5,
        nombre: 'Mentor de alumnos',
        descripcion: 'Conocimiento requerido de gmail y basico a medio de llamadas telefonicas',
        fecha: new Date('2025-05-20'),
        salario: 10000,
        estatus: 'CREADA',
        destacado: false,
        imagen: 'images/vacantes/vacante5.jpg',
        detalles: 'Portafolio obligatorio que demuestre:\n- Procesos de diseño\n- Trabajo con prototipos\n- Pruebas con usuarios',
        id_Categoria: 1,
        id_empresa: 3
    },
    {
        id_vacante: 6,
        nombre: 'Desarrollador BackEnd',
        descripcion: 'Conocimiento requerido de herramientas varias enfocadas en el backend',
        fecha: new Date('2025-05-20'),
        salario: 39000,
        estatus: 'CREADA',
        destacado: true,
        imagen: 'images/vacantes/vacante6.jpg',
        detalles: 'Portafolio obligatorio que demuestre:\n- Procesos de diseño\n- Trabajo con prototipos\n- Pruebas con usuarios',
        id_Categoria: 2,
        id_empresa: 1
    }
];