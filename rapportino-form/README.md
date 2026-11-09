# Fine giornata Findoor (versione Google Form)

App a schermate, una domanda per volta, pensata per il telefono. I dati vanno in un **Google Form**: le risposte
finiscono da sole nel **Google Sheet** collegato. Nessun codice da pubblicare lato Google.

## Messa in funzione (≈10 minuti)

1. **Crea il Google Form** con questi 6 campi, in quest'ordine:
   Nome (risposta breve) · Data (risposta breve) · Cantiere (risposta breve) · Attività svolte (paragrafo) · Problemi (paragrafo) · Ore (risposta breve).
2. Nel form, scheda **Risposte → icona Fogli Google**: crea il foglio. Sempre in *Risposte* → ⋮ → **Ricevi notifiche via email** per avere un'email a ogni rapportino.
3. **FORM_ID**: apri il link di compilazione `https://docs.google.com/forms/d/e/XXXXXXXX/viewform`. La parte `XXXXXXXX` va in `CONFIG.FORM_ID` dentro `index.html`.
4. **Numeri dei campi**: nel form, ⋮ → **Ottieni link precompilato**, scrivi qualcosa in ogni campo (es. "a","b","c"…) e premi *Ottieni link*.
   Nel link compaiono `entry.123456=a`, `entry.234567=b`, … Copia ogni numero nel campo giusto di `CONFIG.ENTRY`.
5. Inserisci i nomi in `CONFIG.COLLABORATORI`.
6. Metti online la cartella (es. GitHub Pages) e manda il link ai collaboratori: dal telefono → *Aggiungi a schermata Home*.

## Note
- Il form non deve richiedere l'accesso Google né essere limitato a un'unica risposta.
- Se non c'è rete il rapportino resta nel telefono e parte appena torna il segnale.
- Dettatura vocale col pulsante 🎤 su Chrome/Android; su iPhone usa il microfono della tastiera.
