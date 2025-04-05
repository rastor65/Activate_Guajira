export interface Medicion {
    id: number;
    imc: number;
    icc: number;
    fecha: string; // Puede ser Date si deseas manejarlo como objeto de fecha
    talla: number;
    peso: number;
    perimetro_cintura: number;
    perimetro_cadera: number;
    pliegue_pectoral: number | null;
    pliegue_abdominal: number | null;
    pliegue_antemuslo: number | null;
    pliegue_tricipal: number | null;
    pliegue_iliocrestal: number | null;
    fuerza_manoderecha: number;
    fuerza_manoizquierda: number;
    equilibrio: string;
    resistencia_abdominal: string;
    fuerza_explosiva_i: string;
    fuerza_explosiva_f: string;
    resistencia_cardiorespiratoria: string;
    tiempo_resistencia_cardiorespiratoria: number;
    frecuencia_cardiaca: string;
    volumen_max_oxigeno: string;
    flexibilidad: string;
    caff: string;
    status: boolean;
    usuario: number;
  }