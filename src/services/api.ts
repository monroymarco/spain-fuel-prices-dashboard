import type { GasStation } from "../types";

type StationsResponse = {
  data: GasStation[];
  page: number;
  page_size: number;
  total: number;
};

type GetStationsParams = {
  page: number;
  pageSize: number;
  provincia?: string;
  municipio?: string;
  search?: string;
};

const API_URL = import.meta.env.VITE_API_URL;

export async function getStations({
  page,
  pageSize,
  provincia,
  municipio,
  search,
}: GetStationsParams): Promise<StationsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });

  if (provincia) {
    params.append("provincia", provincia);
  }

  if (municipio) {
    params.append("municipio", municipio);
  }

  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`${API_URL}/stations?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Error al cargar las gasolineras");
  }

  return await response.json();
}
