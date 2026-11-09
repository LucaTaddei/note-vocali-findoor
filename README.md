# Rapportino Findoor

Ogni sera i collaboratori aprono l'app dal telefono, scrivono (o dettano) cosa hanno fatto e premono **Invia**.
Ogni rapportino finisce come riga in un **Google Sheet**; alle 20 ti arriva anche un'email di riepilogo con chi ha scritto e chi no.

## Messa in funzione (≈10 minuti, una volta sola)

1. **Crea il foglio**: su Google Sheets crea un foglio nuovo, chiamalo "Rapportini Findoor".
2. **Incolla il codice**: nel foglio vai su *Estensioni → Apps Script*, cancella tutto e incolla `apps-script/Code.gs`.
   Cambia `TOKEN` (una parola segreta tua), `EMAIL_RIEPILOGO` e l'elenco `COLLABORATORI`.
3. **Pubblica**: *Distribuisci → Nuova distribuzione → tipo "App web"* · Esegui come: **Me** · Chi ha accesso: **Chiunque**.
   Autorizza i permessi e copia l'**URL** che finisce con `/exec`.
4. **Configura l'app**: in `config.js` incolla l'URL in `SCRIPT_URL`, imposta lo stesso `TOKEN` e i nomi in `COLLABORATORI`.
5. **Riepilogo serale**: in Apps Script scegli la funzione `attivaRiepilogoSerale` e premi *Esegui* (una volta).
6. **Metti online l'app**: i file (`index.html`, `config.js`, `manifest.json`, `icon.svg`) vanno su un hosting statico.
   Il più semplice: GitHub Pages su questo repository (*Settings → Pages → branch → / root*).
7. **Mandi il link ai collaboratori** su WhatsApp. Dal telefono: *Aggiungi a schermata Home* → diventa un'icona "Rapportino".

## Come funziona
- Il collaboratore sceglie il nome (si ricorda da solo), cantiere, attività, eventuali problemi e ore.
- Pulsante 🎤 per dettare (Chrome/Android; su iPhone usa il microfono della tastiera).
- Se non c'è campo in cantiere, il rapportino resta salvato sul telefono e parte appena torna la rete.
- Nel foglio, tab **Rapportini**: una riga per rapportino. Filtra per data, persona o cantiere.

## Nota di sicurezza
Il `TOKEN` in `config.js` è visibile a chi apre l'app: serve solo a evitare invii casuali, non è una password.
Per un'app interna va bene; non mettere mai nel foglio dati sensibili dei clienti.
