import { useState, useEffect, useMemo } from "react";
import { Navigation } from "lucide-react";
import { getStations } from "./services/api";
import type { GasStation } from "./types";
import { LocationScreen } from "./LocationScreen";
import { calcularDistanciaKm, categoriaDistancia } from "./utils";
import "./App.css";

const RESULTADOS_POR_PAGINA = 50;

type OrdenTipo = "distancia" | "precio" | null;

type StationConDistancia = GasStation & { distanciaKm: number };

function App() {
  const [ubicacion, setUbicacion] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [provinciaFiltro, setProvinciaFiltro] = useState<string>("");
  const [municipioFiltro, setMunicipioFiltro] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [orden, setOrden] = useState<OrdenTipo>(null);

  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    async function loadStations() {
      try {
        setLoading(true);
        setError(null);

        const response = await getStations({
          page: paginaActual,
          pageSize: RESULTADOS_POR_PAGINA,
          provincia: provinciaFiltro,
          municipio: municipioFiltro,
          search: busqueda,
        });

        setStations(response.data);
        setTotal(response.total);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ha ocurrido un error inesperado.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadStations();
  }, [paginaActual, provinciaFiltro, municipioFiltro, busqueda]);

  const provincias = [...new Set(stations.map((s) => s.provincia))];

  const municipios = [...new Set(stations.map((s) => s.municipio))];

  const stationsConDistancia: StationConDistancia[] = useMemo(() => {
    if (!ubicacion) return [];

    return stations.map((s) => ({
      ...s,
      distanciaKm: calcularDistanciaKm(
        ubicacion.lat,
        ubicacion.lng,
        s.latitud,
        s.longitud,
      ),
    }));
  }, [stations, ubicacion]);

  const stationsOrdenadas = useMemo(() => {
    if (orden === "distancia") {
      return [...stationsConDistancia].sort(
        (a, b) => a.distanciaKm - b.distanciaKm,
      );
    }

    if (orden === "precio") {
      return [...stationsConDistancia].sort((a, b) => a.price - b.price);
    }

    return stationsConDistancia;
  }, [stationsConDistancia, orden]);

  const totalPaginas = Math.ceil(total / RESULTADOS_POR_PAGINA);

  if (!ubicacion) {
    return (
      <LocationScreen
        onLocationSet={(lat, lng) => setUbicacion({ lat, lng })}
      />
    );
  }

  if (loading) {
    return <p className="status-message">Cargando gasolineras...</p>;
  }

  if (error) {
    return <p className="status-message error">Error: {error}</p>;
  }

  return (
    <div className="app">
      <h1>Precios de Combustible en España</h1>

      <div className="controls">
        <select
          value={provinciaFiltro}
          onChange={(e) => {
            setProvinciaFiltro(e.target.value);
            setMunicipioFiltro("");
            setPaginaActual(1);
          }}
        >
          <option value="">Todas las provincias</option>

          {provincias.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select
          value={municipioFiltro}
          onChange={(e) => {
            setMunicipioFiltro(e.target.value);
            setPaginaActual(1);
          }}
        >
          <option value="">Todos los municipios</option>

          {municipios.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre o dirección"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1);
          }}
        />
      </div>

      <div className="sort-buttons">
        <button
          className={orden === "distancia" ? "sort-btn active" : "sort-btn"}
          onClick={() => {
            setOrden(orden === "distancia" ? null : "distancia");

            setPaginaActual(1);
          }}
        >
          Más cercana
        </button>

        <button
          className={orden === "precio" ? "sort-btn active" : "sort-btn"}
          onClick={() => {
            setOrden(orden === "precio" ? null : "precio");

            setPaginaActual(1);
          }}
        >
          Más barata
        </button>
      </div>

      <p className="result-count">
        {total} gasolineras encontradas — página {paginaActual} de{" "}
        {totalPaginas || 1}
      </p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Gasolinera</th>
              <th>Dirección</th>
              <th>Municipio</th>
              <th>Provincia</th>
              <th>Combustible</th>
              <th>Precio</th>
              <th>Distancia</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {stationsOrdenadas.map((station) => {
              const categoria = categoriaDistancia(station.distanciaKm);

              const urlDirecciones =
                `https://www.google.com/maps/dir/?api=1` +
                `&origin=${ubicacion.lat},${ubicacion.lng}` +
                `&destination=${station.latitud},${station.longitud}` +
                `&travelmode=driving`;

              return (
                <tr key={`${station.id_estacion}-${station.fuel_type}`}>
                  <td>{station.rotulo}</td>
                  <td>{station.direccion}</td>
                  <td>{station.municipio}</td>
                  <td>{station.provincia}</td>
                  <td>{station.fuel_type}</td>

                  <td className="price">{station.price.toFixed(2)} €</td>

                  <td>
                    <span className={`distancia distancia-${categoria}`}>
                      {station.distanciaKm.toFixed(1)} km
                    </span>
                  </td>

                  <td>
                    <a
                      href={urlDirecciones}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="como-llegar"
                      title="Cómo llegar"
                      aria-label="Cómo llegar"
                    >
                      <Navigation size={16} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
          disabled={paginaActual === 1}
        >
          ← Anterior
        </button>

        <span>
          Página {paginaActual} de {totalPaginas || 1}
        </span>

        <button
          onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
          disabled={paginaActual >= totalPaginas}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
}

export default App;
