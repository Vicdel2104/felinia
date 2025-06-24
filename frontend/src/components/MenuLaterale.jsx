import React from "react";

export default function MenuLaterale({ pagina, setPagina }) {
  return (
    <aside className="w-56 bg-gray-800 text-white min-h-screen p-4 space-y-2">
      <button
        className={`block w-full text-left p-2 rounded ${pagina === "gatti" ? "bg-gray-700" : ""}`}
        onClick={() => setPagina("gatti")}
      >
        Gestione Gatti
      </button>
      <button
        className={`block w-full text-left p-2 rounded ${pagina === "enti" ? "bg-gray-700" : ""}`}
        onClick={() => setPagina("enti")}
      >
        Enti
      </button>
    </aside>
  );
}

