// types.ts
export interface GasStation {
  fecha_dataset: string;
  fecha_ingestion: string;
  id_estacion: string;
  provincia: string;
  municipio: string;
  direccion: string;
  rotulo: string; // nombre de la marca/gasolinera
  latitud: number;
  longitud: number;
  fuel_type: string;
  price: number;
}
