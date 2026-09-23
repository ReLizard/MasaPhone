<div align="center">

<img src="public/masaphone_brand_hd.png" alt="MasaPhone Money Management" width="480" />

<br/>

**Progressive Web App (PWA) reattiva e moderna per la gestione, simulazione e calcolo avanzato delle progressioni Masaniello e Multi-Masaniello su iOS, Android e Desktop.**

<br/>

[![Apri Web App](https://img.shields.io/badge/🌐_Apri_Online-Live_PWA-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://relizard.github.io/MasaPhone/)

<br/>

[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple.svg?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

---

</div>

## 📖 Panoramica

**MasaPhone Web** è la trasposizione cross-platform di MasaPhone in formato Progressive Web App (PWA). Consente di utilizzare la potenza del money management matematico Masaniello su qualsiasi dispositivo (iPhone/iPad/iOS, Android, macOS, Windows, Linux) installandola direttamente sulla schermata Home come una vera app nativa, con funzionamento offline e persistenza locale.

Il motore matematico implementa la formula binomiale a ritroso con precisione decimale a 30 cifre (`Decimal.js`), garantendo perfetta corrispondenza al centesimo con il motore originale Kotlin/Java (`BigDecimal`) e con i fogli di calcolo ufficiali.

---

## ✨ Funzionalità Principali

- 📊 **Multi-Masaniello a 6 Slot Indipendenti**: Gestisci contemporaneamente fino a 6 progressioni parallele con tab dedicati.
- 🎯 **Configurazione Dinamica**:
  - Capitale Iniziale (Cassa).
  - Eventi Totali ($N$) ed Eventi Attesi ($K$).
  - Quota di default con calcolo istantaneo di Cassa Finale e Resa (%).
- ⚡ **Gestione Eventi in Tempo Reale**:
  - Esito **Vinto (W)**, **Perso (L)** o **In Attesa**.
  - Personalizzazione quota per singolo evento.
  - Modifica puntata effettiva (*Actual Stake*) con ricalcolo immediato dei passi successivi.
  - Inserimento note e pronostici per ogni evento.
- 🔄 **Rollback & Undo**: Annulla in qualsiasi momento l'ultimo esito registrato per correggere errori.
- 💰 **Bilancio Globale Aggregato**: Monitora in un unico pannello Cassa Totale, Utile/Perdita aggregato, ROI (%) e stato di avanzamento di tutti gli slot.
- 💾 **Backup & Ripristino JSON**: Esporta e importa configurazioni e progressioni attive con un click.
- 📱 **PWA Installabile & Offline**:
  - Supporto completo iOS (Aggiungi a Schermata Home / Safari).
  - Supporto Android (WebAPK / Chrome).
  - Supporto Desktop (Chrome, Edge, Safari).
  - Icona HD su misura con brand identity unificata.

---

## 🛠️ Stack Tecnologico

- **Framework**: React 18 + TypeScript
- **Bundler & Build Tool**: Vite 5
- **Styling**: Tailwind CSS v3.4 (Dark Mode nativa)
- **Icons**: Lucide React
- **Motore Matematico**: `decimal.js` (Precisione 30 cifre, arrotondamento `ROUND_HALF_UP`)
- **PWA**: `vite-plugin-pwa` + Workbox per caching offline e service worker
- **Persistenza**: LocalStorage con migrazione automatica di stato

---

## 🚀 Avvio & Sviluppo Locale

### Prerequisiti
- Node.js (v18+ raccomandato)
- npm

### Installazione ed Esecuzione

```bash
# Entra nella cartella del progetto
cd masaphone-web

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Per compilare per la produzione
npm run build

# Per avviare il preview server di produzione
npm run preview -- --host 0.0.0.0 --port 5173
```

---

## 📲 Installazione come App (PWA)

### Su iPhone / iPad (iOS Safari)
1. Apri l'indirizzo della web app in **Safari**.
2. Tocca l'icona di **Condivisione** (quadrato con freccia verso l'alto in basso).
3. Scorri e seleziona **"Aggiungi alla schermata Home"**.
4. Tocca **Aggiungi** in alto a destra: l'icona ufficiale MasaPhone apparirà nella tua Home come una vera app.

### Su Android (Chrome)
1. Apri la web app in **Chrome**.
2. Tocca i tre puntini in alto a destra.
3. Seleziona **"Installa app"** o **"Aggiungi a schermata Home"**.

### Su Desktop (Chrome / Edge / Safari macOS)
1. Clicca sull'icona di installazione nella barra degli indirizzi del browser (a destra).
2. Conferma l'installazione per aprirla in finestra dedicata standalone.

---

## 📜 Licenza

Distribuito sotto licenza MIT.
