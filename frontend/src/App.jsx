import { useState } from "react";
import { jsPDF } from "jspdf";

export default function App() {
  const [gatti, setGatti] = useState([]);
  const [selectedGattoIndex, setSelectedGattoIndex] = useState(-1);

  const [nome, setNome] = useState("");
  const [microchip, setMicrochip] = useState("");
  const [razza, setRazza] = useState("");
  const [eta, setEta] = useState("");
  const [condizioniNote, setCondizioniNote] = useState("");
  const [alimentazione, setAlimentazione] = useState("");
  // Nuovi campi anagrafica estesa
  const [sesso, setSesso] = useState("");
  const [colore, setColore] = useState("");
  const [dataArrivo, setDataArrivo] = useState("");
  const [dataUscita, setDataUscita] = useState("");
  const [provenienza, setProvenienza] = useState("");
  const [destinazione, setDestinazione] = useState("");
  const [vaccini, setVaccini] = useState([]);
  const [vaccinoNome, setVaccinoNome] = useState("");
  const [vaccinoData, setVaccinoData] = useState("");
  const [sintomi, setSintomi] = useState("");
  const [descrizioneAI, setDescrizioneAI] = useState("");
  const [rispostaAI, setRispostaAI] = useState("");
  const [consiglio, setConsiglio] = useState("");
  const [loading, setLoading] = useState(false);
  const [diario, setDiario] = useState([]);
  const [storicoAI, setStoricoAI] = useState([]);
  const [storicoConsigli, setStoricoConsigli] = useState([]);
  const [showAllDiario, setShowAllDiario] = useState(false);
  const [showAllAI, setShowAllAI] = useState(false);
  const [showAllConsigli, setShowAllConsigli] = useState(false);

  // Funzione per aggiornare lo stato del gatto selezionato (sostituita per aggiornamento reale)
  const aggiornaGattoSelezionato = (key, value) => {
    setGatti(prev => {
      const nuovi = [...prev];
      if (selectedGattoIndex >= 0 && selectedGattoIndex < nuovi.length) {
        nuovi[selectedGattoIndex] = { ...nuovi[selectedGattoIndex], [key]: value };
      }
      return nuovi;
    });
  };

  // Quando cambia il gatto selezionato, aggiorna gli stati con i suoi dati
  const selezionaGatto = (index) => {
    setSelectedGattoIndex(index);
    if (index < 0) {
      setNome("");
      setMicrochip("");
      setRazza("");
      setEta("");
      setCondizioniNote("");
      setAlimentazione("");
      setSesso("");
      setColore("");
      setDataArrivo("");
      setDataUscita("");
      setProvenienza("");
      setDestinazione("");
      setVaccini([]);
      setDiario([]);
      setStoricoAI([]);
      setStoricoConsigli([]);
      setRispostaAI("");
    } else {
      const gatto = gatti[index];
      setNome(gatto.nome || "");
      setMicrochip(gatto.microchip || "");
      setRazza(gatto.razza || "");
      setEta(gatto.eta || "");
      setCondizioniNote(gatto.condizioniNote || "");
      setAlimentazione(gatto.alimentazione || "");
      setSesso(gatto.sesso || "");
      setColore(gatto.colore || "");
      setDataArrivo(gatto.dataArrivo || "");
      setDataUscita(gatto.dataUscita || "");
      setProvenienza(gatto.provenienza || "");
      setDestinazione(gatto.destinazione || "");
      setVaccini(gatto.vaccini ? [...gatto.vaccini] : []);
      setDiario(gatto.diario ? [...gatto.diario] : []);
      setStoricoAI(gatto.storicoAI ? [...gatto.storicoAI] : []);
      setStoricoConsigli(gatto.storicoConsigli ? [...gatto.storicoConsigli] : []);
      setRispostaAI("");
    }
  };

  const aggiungiGatto = () => {
    if (!nome.trim() || !microchip.trim()) return;
    const nuovoGatto = {
      nome,
      microchip,
      razza,
      eta,
      condizioniNote,
      alimentazione,
      sesso,
      colore,
      dataArrivo,
      dataUscita,
      provenienza,
      destinazione,
      interventi,
      esami,
      testDiagnostici,
      adozioneNote,
      firmaAdottante,
      vaccini,
      diario,
      storicoAI,
      storicoConsigli
    };

    const esiste = gatti.findIndex(g => g.microchip === microchip);
    let nuoviGatti;

    if (esiste !== -1) {
      // Modifica il gatto esistente
      nuoviGatti = [...gatti];
      nuoviGatti[esiste] = nuovoGatto;
      setGatti(nuoviGatti);
      setSelectedGattoIndex(esiste);
    } else {
      // Aggiungi nuovo gatto
      nuoviGatti = [...gatti, nuovoGatto];
      setGatti(nuoviGatti);
      setSelectedGattoIndex(nuoviGatti.length - 1);
    }
  };

  const aggiungiVaccino = () => {
    if (vaccinoNome && vaccinoData) {
      const nuoviVaccini = [...vaccini, { nome: vaccinoNome, data: vaccinoData }];
      setVaccini(nuoviVaccini);
      aggiornaGattoSelezionato("vaccini", nuoviVaccini);
      setVaccinoNome("");
      setVaccinoData("");
    }
  };

  const aggiungiAlDiario = () => {
    if (!sintomi.trim()) return;
    const nuovoDiario = [...diario, { data: new Date().toLocaleDateString(), sintomi }];
    setDiario(nuovoDiario);
    aggiornaGattoSelezionato("diario", nuovoDiario);
    setSintomi("");
  };

  const inviaAnalisiAI = async () => {
    if (!descrizioneAI) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/ai/analizza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descrizione: descrizioneAI, tipo: "diagnosi" })
      });
      const data = await res.json();
      const risultato = data.risultato || "Nessuna risposta";
      const flagServer = data.flag || "Lieve";

      // Trasforma il flag in una stringa con emoji
      const flagVisual =
        flagServer === "Grave"
          ? "🔴 Grave"
          : flagServer === "Moderato"
          ? "🟡 Moderato"
          : "🟢 Lieve";

      // Semplice messaggio in base al flag ricevuto
      const consigli =
        flagServer === "Grave"
          ? "Rischio elevato: si consiglia una visita veterinaria urgente."
          : flagServer === "Moderato"
          ? "Sintomi da monitorare. Consulta il veterinario se persistono."
          : "Monitoraggio domestico. Nessun rischio immediato apparente.";

      setRispostaAI(risultato);
      const analisiDettagliata = {
        data: new Date().toLocaleDateString(),
        sintomi: descrizioneAI,
        flag: flagVisual,
        probabilita: flagVisual,
        diagnosi: risultato,
        consigli
      };
      const nuovoStoricoAI = [...storicoAI, analisiDettagliata];
      setStoricoAI(nuovoStoricoAI);
      aggiornaGattoSelezionato("storicoAI", nuovoStoricoAI);
    } catch {
      setRispostaAI("Errore con l'AI");
    } finally {
      setDescrizioneAI("");
      setLoading(false);
    }
  };

  const inviaConsiglio = async () => {
    if (!consiglio) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/ai/analizza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descrizione: consiglio, tipo: "consiglio" })
      });
      const data = await res.json();
      const risposta = data.risultato || "Nessuna risposta AI";
      const nuovoStoricoConsigli = [...storicoConsigli, {
        domanda: consiglio,
        risposta,
        data: new Date().toLocaleDateString()
      }];
      setStoricoConsigli(nuovoStoricoConsigli);
      aggiornaGattoSelezionato("storicoConsigli", nuovoStoricoConsigli);
      setConsiglio("");
    } catch {
      const nuovoStoricoConsigli = [...storicoConsigli, {
        domanda: consiglio,
        risposta: "Errore AI",
        data: new Date().toLocaleDateString()
      }];
      setStoricoConsigli(nuovoStoricoConsigli);
      aggiornaGattoSelezionato("storicoConsigli", nuovoStoricoConsigli);
    } finally {
      setLoading(false);
    }
  };

  const scaricaPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const titoloLines = doc.splitTextToSize("FelinIA – Diario Clinico", 180);
    doc.text(titoloLines, 10, y);
    y += titoloLines.length * 6;
    doc.setFontSize(12);
    const nomeLines = doc.splitTextToSize(`Nome: ${nome}`, 180);
    doc.text(nomeLines, 10, y);
    y += nomeLines.length * 6;
    const microchipLines = doc.splitTextToSize(`Microchip: ${microchip || "-"}`, 180);
    doc.text(microchipLines, 10, y);
    y += microchipLines.length * 6;

    // Nuove sezioni anagrafica estesa
    const sessoLines = doc.splitTextToSize(`Sesso: ${sesso}`, 180);
    doc.text(sessoLines, 10, y);
    y += sessoLines.length * 6;

    const coloreLines = doc.splitTextToSize(`Colore: ${colore}`, 180);
    doc.text(coloreLines, 10, y);
    y += coloreLines.length * 6;

    const arrivoLines = doc.splitTextToSize(`Data di arrivo: ${dataArrivo}`, 180);
    doc.text(arrivoLines, 10, y);
    y += arrivoLines.length * 6;

    const uscitaLines = doc.splitTextToSize(`Data di uscita: ${dataUscita}`, 180);
    doc.text(uscitaLines, 10, y);
    y += uscitaLines.length * 6;

    const provenienzaLines = doc.splitTextToSize(`Provenienza: ${provenienza}`, 180);
    doc.text(provenienzaLines, 10, y);
    y += provenienzaLines.length * 6;

    const destinazioneLines = doc.splitTextToSize(`Destinazione: ${destinazione}`, 180);
    doc.text(destinazioneLines, 10, y);
    y += destinazioneLines.length * 6;

    // Vecchie sezioni anagrafica
    const razzaLines = doc.splitTextToSize(`Razza: ${razza}`, 180);
    doc.text(razzaLines, 10, y);
    y += razzaLines.length * 6;

    const etaLines = doc.splitTextToSize(`Età: ${eta}`, 180);
    doc.text(etaLines, 10, y);
    y += etaLines.length * 6;

    const condLines = doc.splitTextToSize(`Condizioni note: ${condizioniNote}`, 180);
    doc.text(condLines, 10, y);
    y += condLines.length * 6;

    const alimLines = doc.splitTextToSize(`Alimentazione: ${alimentazione}`, 180);
    doc.text(alimLines, 10, y);
    y += alimLines.length * 6;

    if (vaccini.length) {
      const vacciniHeaderLines = doc.splitTextToSize("Vaccini:", 180);
      doc.text(vacciniHeaderLines, 10, y);
      y += vacciniHeaderLines.length * 6;
      vaccini.forEach(v => {
        if (y > 270) { doc.addPage(); y = 20; }
        const vaccinoLines = doc.splitTextToSize(`- ${v.nome} (${v.data})`, 180);
        doc.text(vaccinoLines, 12, y);
        y += vaccinoLines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    }

    // Placeholder per esami, interventi, test diagnostici e allegati
    y += 6;
    doc.setFontSize(14);
    doc.text("📋 Esami: (da implementare)", 10, y);
    y += 8;
    doc.text("🩺 Interventi: (da implementare)", 10, y);
    y += 8;
    doc.text("🧪 Test diagnostici: (da implementare)", 10, y);
    y += 8;
    doc.text("📎 Allegati: (da implementare)", 10, y);
    y += 10;
    doc.setFontSize(12);

    if (diario.length) {
      y += 6;
      doc.setFontSize(14);
      const diarioHeaderLines = doc.splitTextToSize("📝 Diario:", 180);
      doc.text(diarioHeaderLines, 10, y);
      y += diarioHeaderLines.length * 6;
      doc.setFontSize(12);
      diario.forEach(r => {
        if (y > 270) { doc.addPage(); y = 20; }
        // Limita la lunghezza del testo multilinea a 250 caratteri
        const testoSintomi = r.sintomi.length > 250 ? r.sintomi.slice(0, 247) + "..." : r.sintomi;
        const lines = doc.splitTextToSize(`${r.data}: ${testoSintomi}`, 180);
        doc.text(lines, 10, y);
        y += lines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    }

    if (storicoAI.length) {
      y += 6;
      doc.setFontSize(14);
      const aiHeaderLines = doc.splitTextToSize("🤖 Analisi AI:", 180);
      doc.text(aiHeaderLines, 10, y);
      y += aiHeaderLines.length * 6;
      doc.setFontSize(12);
      storicoAI.forEach(e => {
        if (y > 270) { doc.addPage(); y = 20; }
        // Flag: riduci larghezza a 160
        const dataFlagLines = doc.splitTextToSize(`${e.data} – ${e.flag || ""}`, 160);
        doc.text(dataFlagLines, 10, y);
        y += dataFlagLines.length * 6;
        // Sintomi multilinea (limite 250)
        const sintomiTesto = e.sintomi && e.sintomi.length > 250 ? e.sintomi.slice(0,247)+"..." : e.sintomi;
        const sintomiLines = doc.splitTextToSize(`Sintomi: ${sintomiTesto}`, 160);
        doc.text(sintomiLines, 12, y);
        y += sintomiLines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
        // Diagnosi multilinea (se esiste, limite 250)
        if (e.diagnosi) {
          const diagnosiTesto = e.diagnosi.length > 250 ? e.diagnosi.slice(0,247)+"..." : e.diagnosi;
          const diagnosiLines = doc.splitTextToSize(`Diagnosi: ${diagnosiTesto}`, 160);
          doc.text(diagnosiLines, 12, y);
          y += diagnosiLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Probabilità multilinea (se esiste)
        if (e.probabilita) {
          const probLines = doc.splitTextToSize(`Probabilità: ${e.probabilita}`, 160);
          doc.text(probLines, 12, y);
          y += probLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Consigli multilinea (se esiste, limite 250)
        if (e.consigli) {
          const consTesto = e.consigli.length > 250 ? e.consigli.slice(0,247)+"..." : e.consigli;
          const consLines = doc.splitTextToSize(`Consigli: ${consTesto}`, 160);
          doc.text(consLines, 12, y);
          y += consLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Risposta multilinea (per compatibilità, anche se e.risultato può essere duplicato con diagnosi)
        if (e.risultato) {
          const rispTesto = e.risultato.length > 250 ? e.risultato.slice(0,247)+"..." : e.risultato;
          const rispLines = doc.splitTextToSize(`Risposta: ${rispTesto}`, 160);
          doc.text(rispLines, 12, y);
          y += rispLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    }

    if (storicoConsigli.length) {
      y += 6;
      doc.setFontSize(14);
      const consHeaderLines = doc.splitTextToSize("🍽️ Consigli Alimentari AI:", 180);
      doc.text(consHeaderLines, 10, y);
      y += consHeaderLines.length * 6;
      doc.setFontSize(12);
      storicoConsigli.forEach(e => {
        if (y > 270) { doc.addPage(); y = 20; }
        // Domanda multilinea (limite 250)
        const domandaTesto = e.domanda.length > 250 ? e.domanda.slice(0,247)+"..." : e.domanda;
        const domandaLines = doc.splitTextToSize(`${e.data}: ${domandaTesto}`, 160);
        doc.text(domandaLines, 10, y);
        y += domandaLines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
        // Risposta multilinea (limite 250)
        const rispostaTesto = e.risposta.length > 250 ? e.risposta.slice(0,247)+"..." : e.risposta;
        const lines = doc.splitTextToSize(`Risposta: ${rispostaTesto}`, 160);
        doc.text(lines, 12, y);
        y += lines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    }

    doc.save("felinia_diario.pdf");
  };

  // Nuova funzione per scaricare solo il PDF del diario
  const scaricaPDFDiario = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const titoloLines = doc.splitTextToSize("FelinIA – Diario Giornaliero", 180);
    doc.text(titoloLines, 10, y);
    y += titoloLines.length * 6;
    doc.setFontSize(12);
    const nomeLines = doc.splitTextToSize(`Nome: ${nome}`, 180);
    doc.text(nomeLines, 10, y);
    y += nomeLines.length * 6;
    const microchipLines = doc.splitTextToSize(`Microchip: ${microchip || "-"}`, 180);
    doc.text(microchipLines, 10, y);
    y += microchipLines.length * 6;

    if (diario.length) {
      doc.setFontSize(14);
      const diarioHeaderLines = doc.splitTextToSize("📝 Diario:", 180);
      doc.text(diarioHeaderLines, 10, y);
      y += diarioHeaderLines.length * 6;
      doc.setFontSize(12);
      diario.forEach(r => {
        if (y > 270) { doc.addPage(); y = 20; }
        const lines = doc.splitTextToSize(`${r.data}: ${r.sintomi}`, 180);
        doc.text(lines, 10, y);
        y += lines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      const lines = doc.splitTextToSize("Nessun dato nel diario.", 180);
      doc.text(lines, 10, y);
      y += lines.length * 6;
    }

    doc.save("felinia_diario_giornaliero.pdf");
  };

  // Nuova funzione per scaricare solo il PDF delle analisi AI
  const scaricaPDFAI = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const titoloLines = doc.splitTextToSize("FelinIA – Analisi AI", 180);
    doc.text(titoloLines, 10, y);
    y += titoloLines.length * 6;
    doc.setFontSize(12);
    const nomeLines = doc.splitTextToSize(`Nome: ${nome}`, 180);
    doc.text(nomeLines, 10, y);
    y += nomeLines.length * 6;

    if (storicoAI.length) {
      storicoAI.forEach(e => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        const dataFlagLines = doc.splitTextToSize(`${e.data} – ${e.flag || ""}`, 180);
        doc.text(dataFlagLines, 10, y);
        y += dataFlagLines.length * 6;
        doc.setFontSize(12);
        // Sintomi multilinea
        const sintomiLines = doc.splitTextToSize(`Sintomi: ${e.sintomi}`, 180);
        doc.text(sintomiLines, 10, y);
        y += sintomiLines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
        // Diagnosi multilinea (se esiste)
        if (e.diagnosi) {
          const diagnosiLines = doc.splitTextToSize(`Diagnosi: ${e.diagnosi}`, 180);
          doc.text(diagnosiLines, 10, y);
          y += diagnosiLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Probabilità multilinea (se esiste)
        if (e.probabilita) {
          const probLines = doc.splitTextToSize(`Probabilità: ${e.probabilita}`, 180);
          doc.text(probLines, 10, y);
          y += probLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Consigli multilinea (se esiste)
        if (e.consigli) {
          const consLines = doc.splitTextToSize(`Consigli: ${e.consigli}`, 180);
          doc.text(consLines, 10, y);
          y += consLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        // Risposta multilinea (per compatibilità, anche se e.risultato può essere duplicato con diagnosi)
        if (e.risultato) {
          const rispLines = doc.splitTextToSize(`Risposta: ${e.risultato}`, 180);
          doc.text(rispLines, 10, y);
          y += rispLines.length * 6;
          if (y > 270) { doc.addPage(); y = 20; }
        }
        y += 4;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      const lines = doc.splitTextToSize("Nessuna analisi AI disponibile.", 180);
      doc.text(lines, 10, y);
      y += lines.length * 6;
    }

    doc.save("felinia_analisi_ai.pdf");
  };

  // Nuova funzione per scaricare solo il PDF dei consigli alimentari AI
  const scaricaPDFConsigli = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(16);
    const titoloLines = doc.splitTextToSize("FelinIA – Consigli Alimentari AI", 180);
    doc.text(titoloLines, 10, y);
    y += titoloLines.length * 6;
    doc.setFontSize(12);

    if (storicoConsigli.length) {
      storicoConsigli.forEach(e => {
        if (y > 270) { doc.addPage(); y = 20; }
        // Domanda multilinea
        const domandaLines = doc.splitTextToSize(`${e.data}: ${e.domanda}`, 180);
        doc.text(domandaLines, 10, y);
        y += domandaLines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
        // Risposta multilinea
        const lines = doc.splitTextToSize(`Risposta: ${e.risposta}`, 180);
        doc.text(lines, 10, y);
        y += lines.length * 6;
        if (y > 270) { doc.addPage(); y = 20; }
      });
    } else {
      const lines = doc.splitTextToSize("Nessun consiglio alimentare disponibile.", 180);
      doc.text(lines, 10, y);
      y += lines.length * 6;
    }

    doc.save("felinia_consigli_alimentari.pdf");
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-700">FelinIA – Diario Salute Gatto</h1>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🐱 Seleziona Gatto</h2>
        <select
          className="w-full p-2 border rounded mb-4"
          value={selectedGattoIndex}
          onChange={(e) => selezionaGatto(Number(e.target.value))}
        >
          <option value={-1}>-- Nuovo Gatto --</option>
          {gatti.map((gatto, idx) => (
            <option key={idx} value={idx}>
              {gatto.nome} ({gatto.microchip})
            </option>
          ))}
        </select>

      <h2 className="text-xl font-semibold mb-2">🐱 Registrazione / Modifica Gatto</h2>
      <input placeholder="Nome" className="w-full p-2 border rounded mb-2" value={nome} onChange={(e) => setNome(e.target.value)} />
      <input placeholder="Microchip" className="w-full p-2 border rounded mb-2" value={microchip} onChange={(e) => setMicrochip(e.target.value)} />
      <input placeholder="Razza" className="w-full p-2 border rounded mb-2" value={razza} onChange={(e) => setRazza(e.target.value)} />
      <input placeholder="Età" className="w-full p-2 border rounded mb-2" value={eta} onChange={(e) => setEta(e.target.value)} />
      <input placeholder="Sesso" className="w-full p-2 border rounded mb-2" value={sesso} onChange={(e) => setSesso(e.target.value)} />
      <input placeholder="Colore" className="w-full p-2 border rounded mb-2" value={colore} onChange={(e) => setColore(e.target.value)} />
      <input type="date" placeholder="Data di arrivo" className="w-full p-2 border rounded mb-2" value={dataArrivo} onChange={(e) => setDataArrivo(e.target.value)} />
      <input type="date" placeholder="Data di uscita" className="w-full p-2 border rounded mb-2" value={dataUscita} onChange={(e) => setDataUscita(e.target.value)} />
      <input placeholder="Provenienza" className="w-full p-2 border rounded mb-2" value={provenienza} onChange={(e) => setProvenienza(e.target.value)} />
      <input placeholder="Destinazione" className="w-full p-2 border rounded mb-2" value={destinazione} onChange={(e) => setDestinazione(e.target.value)} />
      <input placeholder="Condizioni note" className="w-full p-2 border rounded mb-2" value={condizioniNote} onChange={(e) => setCondizioniNote(e.target.value)} />
      <textarea placeholder="Alimentazione" className="w-full p-2 border rounded mb-2" value={alimentazione} onChange={(e) => setAlimentazione(e.target.value)} />
      <div className="flex gap-2 mb-2">
        <input placeholder="Nome vaccino" className="p-2 border rounded w-1/2" value={vaccinoNome} onChange={(e) => setVaccinoNome(e.target.value)} />
        <input type="date" className="p-2 border rounded w-1/2" value={vaccinoData} onChange={(e) => setVaccinoData(e.target.value)} />
      </div>
      <button onClick={aggiungiVaccino} className="bg-gray-200 px-3 py-1 rounded mb-2">Aggiungi Vaccino</button>
      <button onClick={aggiungiGatto} className="bg-blue-600 text-white px-4 py-2 rounded">Salva Gatto</button>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">📝 Diario Giornaliero</h2>
        <textarea className="w-full p-2 border rounded mb-2" value={sintomi} onChange={(e) => setSintomi(e.target.value)} placeholder="Inserisci sintomi del giorno" />
        <button onClick={aggiungiAlDiario} className="bg-indigo-600 text-white px-4 py-2 rounded">Aggiungi al Diario</button>
        <button onClick={scaricaPDFDiario} className="bg-green-500 text-white px-4 py-2 rounded mt-2">📄 Scarica Diario PDF</button>
        {diario.length > 3 && (
          <button
            className="text-blue-600 text-xs underline mt-2"
            onClick={() => setShowAllDiario(v => !v)}
          >
            {showAllDiario ? "Nascondi" : "Vedi tutto"}
          </button>
        )}
        <ul className="list-disc pl-5 mt-4 text-sm text-gray-700">
          {(showAllDiario ? diario : diario.slice(-3)).map((entry, idx) => (
            <li key={idx}>
              {entry.data}: {entry.sintomi}
              <button
                className="ml-2 text-xs text-red-600 hover:underline"
                onClick={() => {
                  const nuovoDiario = diario.filter((_, i) => i !== idx);
                  setDiario(nuovoDiario);
                  aggiornaGattoSelezionato("diario", nuovoDiario);
                }}
                title="Elimina voce"
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🤖 Analisi AI</h2>
        <textarea className="w-full p-2 border rounded mb-2" value={descrizioneAI} onChange={(e) => setDescrizioneAI(e.target.value)} placeholder="Descrizione sintomi per l'AI" />
        <button onClick={inviaAnalisiAI} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? "Analisi in corso..." : "Analizza con FelinIA"}
        </button>
        {rispostaAI && <p className="mt-2 bg-gray-100 p-2 rounded">{rispostaAI}</p>}
        {storicoAI.length > 3 && (
          <button
            className="text-blue-600 text-xs underline mt-2"
            onClick={() => setShowAllAI(v => !v)}
          >
            {showAllAI ? "Nascondi" : "Vedi tutto"}
          </button>
        )}
        <ul className="list-disc pl-5 mt-4 text-sm text-gray-700">
          {(showAllAI ? storicoAI : storicoAI.slice(-3)).map((e, idx) => (
            <li key={idx} className="mb-2">
              <p><strong>{e.data}</strong> – {e.flag}
                <button
                  className="ml-2 text-xs text-red-600 hover:underline"
                  onClick={() => {
                    const nuovoStoricoAI = storicoAI.filter((_, i) => i !== idx);
                    setStoricoAI(nuovoStoricoAI);
                    aggiornaGattoSelezionato("storicoAI", nuovoStoricoAI);
                  }}
                  title="Elimina analisi"
                >
                  Elimina
                </button>
              </p>
              {e.probabilita && <p className="text-sm"><strong>Probabilità:</strong> {e.probabilita}</p>}
              {e.diagnosi && <p className="text-sm"><strong>Diagnosi:</strong> {e.diagnosi}</p>}
              {e.flag && (
                <div className="text-sm space-y-1">
                  <p><strong>🔍 Interpretazione:</strong> {e.flag.includes('Grave') ? 'Possibile emergenza veterinaria, attenzione alta.' : e.flag.includes('Moderato') ? 'Condizione da monitorare con attenzione.' : 'Nessuna urgenza apparente, ma continuare l’osservazione.'}</p>
                  {e.consigli && <p><strong>📌 Azione consigliata:</strong> {e.consigli}</p>}
                  <p><strong>📞 Nota:</strong> Se i sintomi persistono o peggiorano, si consiglia vivamente di consultare un medico veterinario.</p>
                </div>
              )}
            </li>
          ))}
        </ul>
        <button onClick={scaricaPDFAI} className="bg-purple-600 text-white px-4 py-2 rounded mt-2">📄 Scarica Analisi AI PDF</button>
      </section>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">🍽️ Consigli Alimentari AI</h2>
        <input className="w-full p-2 border rounded mb-2" value={consiglio} onChange={(e) => setConsiglio(e.target.value)} placeholder="Domanda nutrizionale per FelinIA" />
        <button onClick={inviaConsiglio} className="bg-yellow-600 text-white px-4 py-2 rounded">Ottieni Consiglio</button>
        <button onClick={scaricaPDFConsigli} className="bg-orange-500 text-white px-4 py-2 rounded mt-2">📄 Scarica Consigli PDF</button>
        {storicoConsigli.length > 3 && (
          <button
            className="text-blue-600 text-xs underline mt-2"
            onClick={() => setShowAllConsigli(v => !v)}
          >
            {showAllConsigli ? "Nascondi" : "Vedi tutto"}
          </button>
        )}
        <ul className="list-disc pl-5 mt-4 text-sm text-gray-700">
          {(showAllConsigli ? storicoConsigli : storicoConsigli.slice(-3)).map((e, i) => (
            <li key={i}>
              <strong>{e.data}</strong>: {e.domanda} – <em>{e.risposta}</em>
              <button
                className="ml-2 text-xs text-red-600 hover:underline"
                onClick={() => {
                  const nuovoStoricoConsigli = storicoConsigli.filter((_, j) => j !== i);
                  setStoricoConsigli(nuovoStoricoConsigli);
                  aggiornaGattoSelezionato("storicoConsigli", nuovoStoricoConsigli);
                }}
                title="Elimina consiglio"
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </section>

      <div className="text-center">
        <button onClick={scaricaPDF} className="bg-green-600 text-white px-4 py-2 rounded">📄 Scarica PDF Completo</button>
      </div>
    </div>
  );
}