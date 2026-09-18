# Masaniello Android v1.0

Evoluzione della v0.6, con una configurazione più completa della singola progressione.

## Novità v1.0
- schermata **Configurazione** per ogni Masaniello;
- impostazione di bankroll iniziale, numero eventi (1-100), vittorie richieste e quota predefinita;
- **Azzera** per iniziare una nuova progressione in modo esplicito;
- protezione: bankroll/eventi/vittorie non possono essere modificati a progressione già avviata senza prima azzerarla;
- quota dell'evento corrente modificabile e ricalcolabile prima della registrazione;
- quote degli eventi già registrati conservate nello storico e non alterate dalle modifiche successive;
- giocata effettiva opzionale: se omessa viene usata quella consigliata;
- controllo che la giocata effettiva non sia negativa e non superi il bankroll disponibile;
- storico con quota, giocata consigliata, giocata effettiva e bankroll dopo l'evento;
- salvataggio locale e ricostruzione della progressione dopo la riapertura;
- 6 progressioni + Bilancio;
- importi in euro visualizzati a 2 decimali, con calcoli interni a precisione maggiore.

## Nota
La logica del motore resta quella sviluppata nelle versioni precedenti e usa BigDecimal. La v1.0 prepara il progetto a una successiva fase di confronto automatico evento-per-evento con i workbook Excel di test e, in seguito, a una persistenza più strutturata (Room).

Lo ZIP è un progetto sorgente Android Studio, non un APK.


### v1.0
Aggiunti i vettori di verifica per i due scenari Excel, separati dal motore di produzione. Il prossimo step implementerà il confronto automatico evento-per-evento nell'app.

## v1.0
- configurazione/reset resi più sicuri;
- richiesta di conferma prima di azzerare una progressione;
- mantenuta separata la matematica del motore dalla UI;
- mantenuti quote storiche, giocata consigliata/effettiva, storico e importi monetari a 2 decimali;
- preparazione per il passaggio successivo: gestione definitiva delle singole progressioni e verifica integrata.


## v1.0
Versione candidata al collaudo finale, con checklist di verifica Excel e versione identificata esplicitamente come 1.0.
