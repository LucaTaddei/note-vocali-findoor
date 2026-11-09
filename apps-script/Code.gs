/**
 * RAPPORTINO FINDOOR – lato Google (Apps Script collegato al foglio)
 * 1) Riceve i rapportini dall'app e li scrive nel foglio "Rapportini".
 * 2) Ogni sera manda a Luca un'email di riepilogo con chi ha scritto e chi no.
 */
const TOKEN = 'cambia-questa-parola';            // deve essere uguale a config.js
const EMAIL_RIEPILOGO = 'info@findoorsrl.it';    // dove arriva il riepilogo serale
const COLLABORATORI = ['Nome Cognome 1', 'Nome Cognome 2', 'Nome Cognome 3']; // come in config.js
const ORA_RIEPILOGO = 20;                        // ora (0-23) del riepilogo, fuso Europe/Rome
const INTESTAZIONI = ['Ricevuto il', 'Data', 'Collaboratore', 'Cantiere / cliente', 'Attività svolte', 'Problemi / note', 'Ore', 'ID'];

function foglio_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName('Rapportini');
  if (!sh) {
    sh = ss.insertSheet('Rapportini');
    sh.appendRow(INTESTAZIONI);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, INTESTAZIONI.length).setFontWeight('bold').setBackground('#c00000').setFontColor('#ffffff');
    sh.setColumnWidth(5, 420); sh.setColumnWidth(6, 300);
    sh.getRange('E:F').setWrap(true);
  }
  return sh;
}

function doPost(e) {
  try {
    const r = JSON.parse(e.postData.contents);
    if (r.token !== TOKEN) return risposta_({ ok: false, errore: 'token' });
    const lock = LockService.getScriptLock(); lock.waitLock(10000);
    try {
      const sh = foglio_();
      // evita duplicati se l'app rimanda lo stesso rapportino
      const last = sh.getLastRow();
      if (last > 1 && sh.getRange(2, 8, last - 1, 1).getValues().some(x => x[0] === r.id))
        return risposta_({ ok: true, duplicato: true });
      sh.appendRow([new Date(), r.data, r.nome, r.cantiere, r.attivita, r.problemi, r.ore, r.id]);
    } finally { lock.release(); }
    return risposta_({ ok: true });
  } catch (err) {
    return risposta_({ ok: false, errore: String(err) });
  }
}

function doGet() { return risposta_({ ok: true, servizio: 'Rapportino Findoor' }); }
function risposta_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/** Email serale: rapportini di oggi + chi manca. */
function inviaRiepilogo() {
  const tz = 'Europe/Rome';
  const oggi = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const sh = foglio_();
  const righe = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues() : [];
  const dioggi = righe.filter(r => {
    const d = r[1] instanceof Date ? Utilities.formatDate(r[1], tz, 'yyyy-MM-dd') : String(r[1]);
    return d === oggi;
  });
  const hanno = new Set(dioggi.map(r => r[2]));
  const mancano = COLLABORATORI.filter(n => !hanno.has(n));
  let corpo = 'Riepilogo del ' + oggi + '\n\n';
  dioggi.forEach(r => {
    corpo += '• ' + r[2] + ' – ' + r[3] + (r[6] ? ' (' + r[6] + ' h)' : '') + '\n  ' + r[4] + '\n' +
             (r[5] ? '  ⚠ ' + r[5] + '\n' : '') + '\n';
  });
  if (!dioggi.length) corpo += 'Nessun rapportino ricevuto.\n\n';
  if (mancano.length) corpo += 'NON hanno ancora scritto: ' + mancano.join(', ') + '\n\n';
  corpo += 'Foglio completo: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
  MailApp.sendEmail(EMAIL_RIEPILOGO, 'Rapportini Findoor ' + oggi + ' (' + dioggi.length + '/' + COLLABORATORI.length + ')', corpo);
}

/** Da eseguire UNA volta: attiva il riepilogo automatico ogni sera. */
function attivaRiepilogoSerale() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() === 'inviaRiepilogo').forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('inviaRiepilogo').timeBased().atHour(ORA_RIEPILOGO).everyDays(1).inTimezone('Europe/Rome').create();
}
