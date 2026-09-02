// App.tsx
import { useState } from "react";
import { mockStations } from "./mockData";

function App() {
  const [provinciaFiltro, setProvinciaFiltro] = useState<string>("");
  const [busqueda, setBusqueda] = useState<string>("");

  const provincias = [...new Set(mockStations.map((s) => s.provincia))];

  const stationsFiltradas = mockStations
    .filter((s) => (provinciaFiltro ? s.provincia === provinciaFiltro : true))
    .filter((s) =>
      busqueda
        ? s.rotulo.toLowerCase().includes(busqueda.toLowerCase()) ||
          s.direccion.toLowerCase().includes(busqueda.toLowerCase())
        : true,
    );

  return (
    <div>
      <h1>Precios Combustible España</h1>

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
            <tr key={station.id_estacion}>
              <td>{station.rotulo}</td>
              <td>{station.municipio}</td>
              <td>{station.provincia}</td>
              <td>{station.fuel_type}</td>
              <td>{station.price.toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
