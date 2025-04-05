
export interface Estado {
    id: number;
    nombre: string;
    descripcion: string;
    status: boolean;
}

export interface PasosResponse {
    pasos_seguimiento: Pasos[];
}

export interface Pasos {
    id: number;
    nivel: number;
    nombre: string;
    dias_programacion: string;
    status: boolean;
}

export interface Revistas {
    id: number;
    nombre: string;
    status: boolean;
}

export interface Seguimiento {
    id: number;
    solicitudId: number;
    pasos_seguimiento: number;
    fecha_asignacion: string;
    fecha_programacion: string;
    fecha_evaluacion: string;
    estado_seguimiento: number;
    responsableId: number;
    correciones: string;
    formato_evaluacion: string;
    status: boolean;
}

export interface Solicitud {
    id: number;
    titulo_articulo: string;
    autores?: number[]
    fecha_creacion: string;
    afiliacion: string;
    contenidoSolicitud: number;
    revista: number;
    status: boolean;
}

export interface Contenido {
    id: number;
    resumen: string;
    palabras_claves: string;
    abstract: string;
    Keywords: string;
    introduccion: string;
    materi_metodos: string;
    result_discu: string;
    agradecimientos: string;
    literact_citada: string;
    archivo_adjunto: string;
    status: boolean;
}

export interface Anexos {
    id: number;
    solicitud: number;
    status: boolean;
}

export interface Autor_Solicitud {
    id: number;
    RolAutor: number;
    solicitud: number;
    status: boolean;
}

export interface Rol_Autor {
    id: number;
    nombre: string;
    status: boolean;
}
