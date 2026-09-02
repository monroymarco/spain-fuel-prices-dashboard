import { useState, useEffect } from "react";
import type { GasStation } from "./types";
import "./App.css";

function App() {
  const [stations, setStations] = useState<GasStation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [provinciaFiltro, setProvinciaFiltro] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8000/stations")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los datos");
        return res.json();
      })
      .then((data) => {
        setStations(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const provincias = [...new Set(stations.map((s) => s.provincia))];

  const stationsFiltradas = stations
    .filter((s) => (provinciaFiltro ? s.provincia === provinciaFiltro : true))
    .filter((s) =>
      busqueda
        ? s.rotulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          s.direccion.toLowerCase().includes(busqueda.toLowerCase())
        : true,
    );

  if (loading) return <p className="status-message">Cargando gasolineras...</p>;
  if (error) return <p className="status-message error">Error: {error}</p>;

  return (
    <div className="app">
      <h1>Precios Combustible España</h1>

      <div className="controls">
        <select
          value={provinciaFiltro}
          onChange={(e) => setProvinciaFiltro(e.target.value)}
        >
          <option value="">Todas las provincias</option>
          {provincias.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Buscar por nombre o dirección"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <p className="result-count">
        {stationsFiltradas.length} gasolineras encontradas
      </p>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Gasolinera</th>
              <th>Municipio</th>
              <th>Provincia</th>
              <th>Combustible</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {stationsFiltradas.map((station) => (
              <tr key={`${station.id_estacion}-${station.fuel_type}`}>
                <td>{station.rotulo}</td>
                <td>{station.municipio}</td>
                <td>{station.provincia}</td>
                <td>{station.fuel_type}</td>
                <td className="price">{station.price.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
