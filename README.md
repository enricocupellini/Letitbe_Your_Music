# Compositore didattico

Webapp statica in HTML, CSS e JavaScript puro. Nessun framework, server o database necessario.

## Avvio
Apri `index.html` nel browser.

## Funzioni
- Categorie con tre opzioni ciascuna, configurabili in `app.js`.
- Il pulsante `+` aggiunge un elemento con una copia delle scelte correnti.
- Il pulsante `−` rimuove l'ultimo elemento della sequenza corrente.
- Massimo 16 elementi.
- Riordino con drag and drop usando il mouse.
- Supporto touch tramite trascinamento su dispositivi compatibili.
- Pulsanti freccia su ogni elemento per spostarlo a sinistra/destra, utili anche su touchscreen.
- Frecce della tastiera quando un elemento ha il focus.
- Nessun salvataggio persistente: il refresh azzera la composizione.

## Personalizzare categorie e immagini
Modifica l'array `categories` all'inizio di `app.js`. Ogni categoria ha un `name` e tre `options` con `label` e `image`.
I segnaposto SVG sono in `assets/placeholders/`. Puoi sostituire i percorsi con file PNG, JPG o SVG, per esempio `assets/immagini/ritmo-a.png`. Aggiungi i tuoi file al repository.

## Pubblicare su GitHub Pages
1. Crea un repository pubblico su https://github.com/new.
2. Carica tutti i file e le cartelle nella radice del repository (mantieni `index.html` nella radice).
3. Vai in **Settings → Pages**.
4. Seleziona **Deploy from a branch**, branch `main`, cartella `/ (root)`, quindi salva.
5. Attendi il completamento della pubblicazione e apri l'URL indicato da GitHub Pages.

Guida ufficiale: https://docs.github.com/en/pages/quickstart
