<div align="center">

<img src="images/masaphone_header.png" alt="MasaPhone Money Management" width="480" />

<br/>

**Ecosistema completo per la gestione, simulazione e calcolo avanzato del Money Management Masaniello e Multi-Masaniello.**

[![Web App](https://img.shields.io/badge/Web_App-Live_PWA-38B2AC?style=for-the-badge&logo=pwa&logoColor=white)](https://relizard.github.io/MasaPhone/)
[![Download APK](https://img.shields.io/badge/Android_APK-v1.0.2-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/ReLizard/MasaPhone/releases/latest)

<br/>

[![Build & Release APK](https://github.com/ReLizard/MasaPhone/actions/workflows/build-apk.yml/badge.svg)](https://github.com/ReLizard/MasaPhone/actions/workflows/build-apk.yml)
[![Deploy Web App](https://github.com/ReLizard/MasaPhone/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/ReLizard/MasaPhone/actions/workflows/deploy-pages.yml)
[![Version](https://img.shields.io/badge/Version-1.0.2-brightgreen.svg)](https://github.com/ReLizard/MasaPhone/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

<br/>

### 🌐 [👉 APRI LA WEB APP ONLINE (PWA)](https://relizard.github.io/MasaPhone/) &nbsp;•&nbsp; 📥 [SCARICA L'APK ANDROID](https://github.com/ReLizard/MasaPhone/releases/latest)

---

</div>

## 📖 Panoramica

**MasaPhone** è una suite moderna e reattiva ideata per gestire con precisione matematica il sistema di money management **Masaniello** e **Multi-Masaniello**.

Il progetto è disponibile in due modalità integrate:
1. **🌐 Web App (Progressive Web App - PWA)**: Utilizzabile istantaneamente via browser su **qualsiasi piattaforma** (iPhone/iPad/iOS, Android, macOS, Windows, Linux) e installabile sulla schermata Home come una vera app nativa con supporto offline completo.
2. **📱 Applicazione Android Nativa**: Pacchetto APK sviluppato in **Kotlin & Jetpack Compose** con persistenza locale integrata.

Entrambe le versioni condividono la stessa logica di calcolo ad altissima precisione (30 cifre decimali) corrispondente al 100% ai modelli matematici ufficiali.

---

## ⚖️ Confronto: Versione Web (PWA) vs Android Nativo

| Caratteristica | 🌐 MasaPhone Web (PWA) | 📱 MasaPhone Android Nativo |
| :--- | :--- | :--- |
| **Dispositivi Supportati** | **Tutti** (iOS / iPhone / iPad, Android, macOS, Windows, Linux) | Solo smartphone e tablet **Android 8.0+** |
| **Installazione** | Istantanea via browser (*Aggiungi a Schermata Home* / PWA) | Download manuale ed installazione file `.apk` |
| **Funzionamento Offline** | ✅ Sì, 100% offline tramite Service Worker | ✅ Sì, 100% offline nativo |
| **Aggiornamenti** | ⚡ Immediati e automatici ad ogni ricaricamento | Manuali tramite download del nuovo APK |
| **Motore Matematico** | `Decimal.js` (30 cifre, arrotondamento `ROUND_HALF_UP`) | `BigDecimal` (30 cifre, arrotondamento `HALF_UP`) |
| **Precisione Calcoli** | 🎯 Centesimo di euro (100% conforme a Excel) | 🎯 Centesimo di euro (100% conforme a Excel) |
| **Slot Multi-Masaniello** | 6 Slot indipendenti + Tab Bilancio Globale | 6 Slot indipendenti + Tab Bilancio Globale |
| **Modifica Quota & Puntata Reale** | ✅ Sì, con ricalcolo dinamico istantaneo | ✅ Sì, con ricalcolo dinamico istantaneo |
| **Annullamento / Rollback Esito** | ✅ Sì (Pulsante Annulla ultimo esito) | ✅ Sì (Pulsante Reset/Rollback) |
| **Note per Singolo Evento** | ✅ Sì (Pronostico / note testuali per evento) | In sviluppo |
| **Backup & Ripristino** | ✅ Esportazione / Importazione JSON con un click | Backup locale database |
| **Stack Tecnologico** | React 18, TypeScript, TailwindCSS, Vite | Kotlin 2.0, Jetpack Compose, Material 3 |

---

## 📸 Anteprime & Screenshot

### 🌐 Versione Web (PWA & Desktop)
<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="images/screenshot_web_mobile.png" alt="MasaPhone Web Mobile" width="220" /><br/>
        <b>📱 Web Mobile (Progressione)</b>
      </td>
      <td align="center" width="33%">
        <img src="images/screenshot_web_balance.png" alt="MasaPhone Web Bilancio" width="220" /><br/>
        <b>📊 Web Mobile (Bilancio Globale)</b>
      </td>
      <td align="center" width="34%">
        <img src="images/screenshot_web_desktop.png" alt="MasaPhone Web Desktop" width="360" /><br/>
        <b>💻 Web Desktop / Tablet</b>
      </td>
    </tr>
  </table>
</div>

### 📱 Versione Android Nativa (APK)
<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <img src="images/screenshot_1.png" alt="Panoramica Progressioni" width="200" /><br/>
        <b>Panoramica Slot</b>
      </td>
      <td align="center" width="25%">
        <img src="images/screenshot_2.png" alt="Configurazione Masaniello" width="200" /><br/>
        <b>Configurazione</b>
      </td>
      <td align="center" width="25%">
        <img src="images/screenshot_3.png" alt="Eventi e Quote" width="200" /><br/>
        <b>Eventi & Quote</b>
      </td>
      <td align="center" width="25%">
        <img src="images/screenshot_4.png" alt="Bilancio Globale" width="200" /><br/>
        <b>Bilancio Globale</b>
      </td>
    </tr>
  </table>
</div>

---

## 📲 Come Installare la Versione Web su Smartphone e Computer

La versione Web è una **Progressive Web App (PWA)**: puoi usarla sia dal browser che installarla come app autonoma senza passare dagli store.

### 🍏 Su iPhone / iPad (iOS Safari)
1. Apri **[relizard.github.io/MasaPhone](https://relizard.github.io/MasaPhone/)** in **Safari**.
2. Tocca l'icona di **Condivisione** (il quadrato con la freccia rivolta verso l'alto in basso).
3. Scorri l'elenco delle opzioni e tocca **"Aggiungi alla schermata Home"**.
4. Tocca **Aggiungi** in alto a destra: l'icona MasaPhone apparirà nella schermata Home del tuo iPhone/iPad e si aprirà a schermo intero come una normale app nativa.

### 🤖 Su Smartphone e Tablet Android (Chrome)
1. Apri **[relizard.github.io/MasaPhone](https://relizard.github.io/MasaPhone/)** in **Google Chrome**.
2. Tocca l'icona dei tre puntini in alto a destra.
3. Seleziona **"Installa app"** o **"Aggiungi a schermata Home"**.

### 💻 Su PC / Mac / Linux (Chrome, Edge, Safari)
1. Apri la pagina nel browser.
2. Clicca sull'icona **"Installa MasaPhone"** (o l'icona computer/più) situata a destra nella barra degli indirizzi.
3. L'app si aprirà in una finestra dedicata e sarà avviabile dal menu Start, Spotlight o Launchpad.

---

## 📥 Download APK Android Nativo

Se preferisci l'applicazione Android nativa:
1. Accedi alla sezione [**Releases**](https://github.com/ReLizard/MasaPhone/releases/latest).
2. Scarica il file `app-debug.apk` (o `MasaPhone.apk`).
3. Avvia il file scaricato sul dispositivo Android e autorizza l'installazione da origini sconosciute se richiesto.

---

## 📂 Struttura del Repository

```
MasaPhone/
├── app/                        # Applicazione nativa Android (Kotlin / Jetpack Compose)
│   ├── src/main/java/          # Sorgenti Kotlin (UI, ViewModel, Engine)
│   └── src/main/res/           # Risorse grafiche, icone e layout Android
├── web/                        # Web App PWA (React 18 / TypeScript / Vite / Tailwind)
│   ├── src/core/               # Motore matematico Decimal.js e gestione Storage
│   ├── src/components/         # Componenti UI (Progression, Balance, Config, Modals)
│   └── public/                 # Icone PWA, apple-touch-icon, manifest
├── images/                     # Screenshot e asset grafici del progetto
└── .github/workflows/
    ├── build-apk.yml           # CI/CD: Compilazione automatica dell'APK Android
    └── deploy-pages.yml        # CI/CD: Deploy automatico della Web App su GitHub Pages
```

---

## 💻 Compilazione e Sviluppo Locale

### 🌐 Sviluppo Web (PWA)
```bash
cd web
npm install
npm run dev        # Avvia il server di sviluppo su http://localhost:5173
npm run build      # Compila la build di produzione in web/dist/
```

### 📱 Sviluppo Android
```bash
./gradlew assembleDebug   # Compila l'APK di debug in app/build/outputs/apk/debug/
./gradlew test            # Esegue i test unitari del motore matematico
```

---

## 🍻 Supporta il Progetto

Se trovi utile **MasaPhone** e desideri supportare lo sviluppo con una birra:

<div align="center">

<a href="https://paypal.me/ReLizard" target="_blank">
  <img src="images/beer.png" alt="Offrimi una birra" width="200" />
</a>

<p><em>Grazie di cuore per il tuo supporto!</em> 🍻</p>

</div>

---

## 📄 Autore & Licenza

Sviluppato con passione da **[@ReLizard](https://github.com/ReLizard)**.  
Rilasciato sotto licenza MIT.
