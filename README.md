# 🐾 FelinIA – Piattaforma Intelligente per la Medicina Felina

FelinIA è una piattaforma healthtech dedicata alla salute dei gatti. Combina intelligenza artificiale e dati clinici per supportare proprietari e veterinari nella diagnosi precoce, prevenzione e gestione sanitaria dei felini.

---

## 🗂️ Struttura del progetto

- **frontend/** – Interfaccia React per pet owner e veterinari
- **server/** – Backend Node.js con API REST e integrazione AI (OpenAI)
- **docs/** – Documentazione tecnica e specifiche
- Database previsto: MongoDB (local o Atlas)

---

## 🚀 Avvio rapido

```bash
# Clona il repository
git clone https://github.com/Vicdel2104/felinia.git
cd felinia

# Installa le dipendenze nel backend
cd server && npm install

# In un altro terminale avvia il backend
npm run dev

# Per il frontend usa una nuova shell
cd ../frontend && npm install
npm run dev
```


Per maggiori dettagli sulle funzionalità destinate agli enti consulta [docs/gestionale-spec.md](docs/gestionale-spec.md).
