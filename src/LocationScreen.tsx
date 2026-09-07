import { useState } from "react";

interface LocationScreenProps {
  onLocationSet: (lat: number, lng: number) => void;
}

export function LocationScreen({ onLocationSet }: LocationScreenProps) {
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function solicitarUbicacion() {
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }

    setBuscando(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationSet(position.coords.latitude, position.coords.longitude);
        setBuscando(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Permiso de ubicación denegado. Actívalo en los ajustes del navegador para continuar."
            : "No se pudo obtener tu ubicación. Inténtalo de nuevo.",
        );
        setBuscando(false);
      },
    );
  }

  return (
    <div className="location-screen">
      <h1>Precios Combustible España</h1>
      <p>
        Necesitamos tu ubicación para mostrarte a qué distancia está cada
        gasolinera.
      </p>

      <button onClick={solicitarUbicacion} disabled={buscando}>
        {buscando ? "Obteniendo ubicación..." : "Usar mi ubicación actual"}
      </button>

      {error && <p className="status-message error">{error}</p>}
    </div>
  );
}
