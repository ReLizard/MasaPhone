# Masaniello v0.8 — verifica Excel

Questa cartella contiene i test di riferimento per confrontare l'engine Android
con i due workbook Excel analizzati.

## Scenario A
- Bankroll iniziale: €35,00
- Eventi: 10
- Vittorie richieste: 7
- Quote: 2,00 per tutti gli eventi
- Risultati: WIN, WIN, LOSS, WIN, WIN, LOSS, WIN, WIN, WIN, pending

## Scenario B
- Bankroll iniziale: €35,00
- Eventi: 10
- Vittorie richieste: 7
- Quote: 2,00 per gli eventi 1-4; 1,97 per evento 5; 1,80 per evento 6;
  2,00 per eventi 7-10
- Risultati: WIN, WIN, WIN, LOSS, WIN, LOSS, WIN, WIN, WIN, pending

## Regola di confronto
I contatori WIN/LOSS dell'app devono derivare dagli esiti registrati e non dalle
formule I/J cached dei vecchi workbook, che durante l'analisi sono risultate
incoerenti.

Per ogni evento vanno confrontati:
- quota utilizzata;
- giocata consigliata;
- giocata effettiva;
- bankroll dopo l'evento;
- WIN/LOSS accumulati;
- stato della progressione.

La precisione interna deve restare superiore a 2 decimali; i valori monetari mostrati
all'utente devono essere arrotondati a 2 decimali.
