import { useState } from "react";

function ProfiloGatto({ profilo, setProfilo }) {
  // Stato locale temporaneo per input
  const [nome, setNome] = useState(profilo.nome || "");
  const [microchip, setMicrochip] = useState(profilo.microchip || "");
  const [dataNascita, setDataNascita] = useState(profilo.dataNascita || "");
  const [vaccinoNome, setVaccinoNome] = useState("");
  const [vaccinoData, setVaccinoData] = useState("");
  const [vaccini, setVaccini] = useState(profilo.vaccini || []);

  const aggiungiVaccino = () => {
    if (!vaccinoNome || !vaccinoData) return;
    setVaccini([...vaccini, { nome: vaccinoNome, data: vaccinoData }]);
    setVaccinoNome("");
    setVaccinoData("");
  };

  const salvaProfilo = () => {
    setProfilo({ nome, microchip, dataNascita, vaccini });
    alert("Profilo salvato (simulazione)");
    // Qui in futuro chiamerai API per salvare su backend
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Profilo del Gatto</h2>

      <input
        type="text"
        placeholder="Nome del gatto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <input
        type="text"
        placeholder="Microchip"
        value={microchip}
        onChange={(e) => setMicrochip(e.target.value)}
        className="w-full p-2 mb-3 border rounded"
      />

      <label className="block mb-3">
        Data di nascita:
        <input
          type="date"
          value={dataNascita}
          onChange={(e) => setDataNascita(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </label>

      <div className="mb-3">
        <h3 className="font-semibold">Vaccinazioni</h3>
        <input
          type="text"
          placeholder="Nome vaccino"
          value={vaccinoNome}
          onChange={(e) => setVaccinoNome(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <input
          type="date"
          value={vaccinoData}
          onChange={(e) => setVaccinoData(e.target.value)}
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={aggiungiVaccino}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Aggiungi
        </button>

        <ul className="mt-2">
          {vaccini.map((v, i) => (
            <li key={i}>
              {v.nome} - {v.data}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={salvaProfilo}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Salva Profilo
      </button>
    </div>
  );
}

function DiarioSalute({ diario, setDiario }) {
  const [data, setData] = useState("");
  const [sintomi, setSintomi] = useState("");

  const aggiungiVoce = () => {
    if (!data || !sintomi) return;
    const nuovaVoce = { data, sintomi };
    setDiario([nuovaVoce, ...diario]);
    setData("");
    setSintomi("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Diario di Salute</h2>

      <label className="block mb-2">
        Data:
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </label>

      <textarea
        rows={4}
        placeholder="Descrivi i sintomi"
        value={sintomi}
        onChange={(e) => setSintomi(e.target.value)}
        className="w-full p-3 border rounded mb-3"
      />

      <button
        onClick={aggiungiVoce}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Aggiungi al diario
      </button>

      <div>
        {diario.length === 0 ? (
          <p>Nessuna voce nel diario.</p>
        ) : (
          diario.map((voce, i) => (
            <div key={i} className="border p-3 rounded mb-2 bg-gray-50">
              <strong>{voce.data}</strong>
              <p>{voce.sintomi}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [sezione, setSezione] = useState("profilo"); // 'profilo' o 'diario'
  const [profilo, setProfilo] = useState({});
  const [diario, setDiario] = useState([]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        FelinIA – Diario e Profilo Salute Felini
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setSezione("profilo")}
          className={`px-4 py-2 rounded ${
            sezione === "profilo" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Profilo Gatto
        </button>
        <button
          onClick={() => setSezione("diario")}
          className={`px-4 py-2 rounded ${
            sezione === "diario" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Diario Salute
        </button>
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        {sezione === "profilo" ? (
          <ProfiloGatto profilo={profilo} setProfilo={setProfilo} />
        ) : (
          <DiarioSalute diario={diario} setDiario={setDiario} />
        )}
      </div>
    </div>
  );
}
