# Masaniello Android v1.0

Versione candidata al collaudo finale.

## Funzioni
- 6 progressioni indipendenti
- configurazione della progressione
- nuova progressione / azzeramento protetto
- quota corrente modificabile
- quote storiche conservate
- WIN / LOSS
- giocata consigliata
- giocata effettiva opzionale
- bankroll aggiornato sulla giocata effettiva
- storico
- importi monetari a 2 decimali
- calcolo interno ad alta precisione

## Verifica Excel
Scenari di riferimento:
1. 10 eventi / 7 vittorie / €35 / quote 2,00
2. 10 eventi / 7 vittorie / €35 / evento 5 quota 1,97 / evento 6 quota 1,80

I contatori WIN/LOSS dell'app derivano dagli esiti registrati e non dai valori cached
I/J dei vecchi workbook.

## Ultimo passaggio
La sorgente è pronta per il collaudo con Android Studio e per la successiva build
dell'APK release su ambiente Android SDK/Gradle.
