import { useState } from "react";
import { jsPDF } from "jspdf";

export default function ConsigliAlimentari({ gatto }) {
  const [domanda, setDomanda] = useState("");
  const [risposta, setRisposta] = useState("");
  const [loading, setLoading] = useState(false);

  const chiediConsiglioAI = async () => {
    if (!domanda || !gatto) return;
    setLoading(true);
    setRisposta("");

    try {
      const res = await fetch("http://localhost:3001/api/ai/consiglio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: gatto.nome,
          domanda,
        }),
      });
      const data = await res.json();
      setRisposta(data.risultato || "Nessuna risposta AI.");
    } catch (error) {
      setRisposta("Errore nella comunicazione con l’AI.");
    } finally {
      setLoading(false);
    }
  };

  const scaricaPDFConsiglio = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`FelinIA – Consigli Alimentari AI`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Gatto: ${gatto?.nome || "-"}`, 10, 30);
    doc.text(`Domanda: ${domanda}`, 10, 40);
    doc.text(`Risposta AI:`, 10, 50);
    doc.text(risposta || "Nessuna risposta AI.", 10, 60, { maxWidth: 180 });
    doc.save(`${gatto?.nome || "gatto"}_consiglio_alimentare.pdf`);
  };

  return (
    <div className="bg-gray-50 p-4 mt-4 rounded shadow space-y-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-green-800">🍽️ FelinIA – Consigli Alimentari AI</h3>
      <input
        type="text"
        placeholder="Es. Quale dieta migliore per un gatto con problemi renali?"
        value={domanda}
        onChange={(e) => setDomanda(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button
        onClick={chiediConsiglioAI}
        disabled={loading || !domanda}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Analisi AI..." : "Ottieni Consiglio AI"}
      </button>

      <div className="bg-white p-3 border border-gray-300 rounded">
        <strong>Risposta AI:</strong>
        <p className="mt-2 text-gray-800 whitespace-pre-wrap">
          {risposta || "Nessuna risposta AI."}
        </p>
      </div>

      <button
        onClick={scaricaPDFConsiglio}
        disabled={!risposta}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
      >
        Scarica PDF Consigli
      </button>
    </div>
  );
}
