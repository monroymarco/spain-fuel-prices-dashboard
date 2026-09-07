/**
 * Calcula la distancia en km entre dos puntos geográficos
 * usando la fórmula de Haversine (distancia sobre una esfera).
 */
export function calcularDistanciaKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // radio de la Tierra en km
  const dLat = toRadianes(lat2 - lat1);
  const dLon = toRadianes(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadianes(lat1)) *
      Math.cos(toRadianes(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

/**
 * Devuelve una categoría de cercanía según los km,
 * usada para colorear el resultado en la interfaz.
 */
export function categoriaDistancia(km: number): "cerca" | "alejado" | "lejos" {
  if (km <= 10) return "cerca";
  if (km <= 30) return "alejado";
  return "lejos";
}
