# Compositore didattico

Versione essenziale con stile originale e un colore distinto per ogni categoria:
- Ritmo: rosso tenue
- Melodia: blu
- Armonia: verde
- Dinamica: viola

Include selezione sincronizzata degli elementi, modifica immediata delle regole, drag and drop con mouse/touch, frecce per riordinare, massimo 16 elementi e nessun salvataggio persistente.

## Personalizzare
Modifica `categories` all'inizio di `app.js`. I placeholder SVG sono in `assets/placeholders/`.

## GitHub Pages
Carica tutti i file nella radice del repository pubblico, poi vai in Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

## Modifica di un elemento esistente
1. Clicca un rettangolo della sequenza.
2. Le opzioni corrispondenti a ritmo, melodia, armonia e dinamica si evidenziano in alto.
3. Con il rettangolo ancora selezionato, clicca una nuova opzione: quel rettangolo viene aggiornato immediatamente, senza aggiungerne un altro e senza cambiarne la posizione.
4. Seleziona un altro rettangolo per modificarlo, oppure riclicca quello attivo / clicca nello spazio vuoto per deselezionarlo.


Aggiornamento: il pulsante “Rimuovi elemento selezionato” elimina l'elemento attivo, anche se non è l'ultimo. “Aggiungi elemento” inserisce sempre un nuovo elemento in fondo alla sequenza.


Comportamento aggiornato: quando si aggiunge un elemento, nessun elemento della sequenza rimane selezionato e le regole in alto tornano alle scelte iniziali.


Configurazione regole aggiornata: Armonia (5 scelte), Andamento (3 scelte), Voce (4 scelte). Le schede mostrano Armonia in alto a sinistra, Andamento in alto a destra e Voce in basso a tutta larghezza.
