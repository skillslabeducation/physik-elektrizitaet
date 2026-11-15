/* Prüft alle Inhalte auf Vollständigkeit und Lösbarkeit. node tests/inhalt.test.js */
const fs = require('fs');
const path = require('path');
const laden = require('./laden');
const { test, ok, eq, fertig } = require('./mini');

const W = laden();
const SC = W.schaltung;

function parseBild(b, wo) {
  ok(b && b.cols && b.rows && typeof b.dsl === 'string', wo + ': Bild unvollständig');
  try { return SC.parse(b.cols, b.rows, b.dsl); } catch (e) { throw new Error(wo + ': ' + e.message); }
}

function pruefeItem(item, wo) {
  ok(item && item.typ, wo + ': typ fehlt');
  if (item.typ !== 'luecke') ok(typeof item.frage === 'string' && item.frage.length > 5, wo + ': frage fehlt');
  if (item.bild) parseBild(item.bild, wo + ' bild');
  switch (item.typ) {
    case 'wahl':
      ok(Array.isArray(item.optionen) && item.optionen.length >= 2, wo + ': optionen');
      ok(Number.isInteger(item.richtig) && item.richtig >= 0 && item.richtig < item.optionen.length, wo + ': richtig außerhalb');
      item.optionen.forEach((o, i) => { if (o && o.bild) parseBild(o.bild, wo + ' option ' + i); });
      break;
    case 'mehrfach':
      ok(Array.isArray(item.richtig) && item.richtig.length >= 1, wo + ': richtig[]');
      item.richtig.forEach((r) => ok(r >= 0 && r < item.optionen.length, wo + ': richtig außerhalb'));
      break;
    case 'zuordnen':
      ok(item.paare && item.paare.length >= 3, wo + ': mindestens 3 Paare');
      break;
    case 'luecke': {
      const t = W.uebung.parseLuecke(item.text);
      const l = t.filter((x) => x.optionen);
      ok(l.length >= 1, wo + ': keine Lücke');
      l.forEach((x) => ok(x.optionen.length >= 2, wo + ': Lücke mit nur einer Option'));
      break;
    }
    case 'sortieren':
      eq(item.kategorien.length, 2, wo + ': 2 Kategorien');
      item.items.forEach((x) => ok(x[1] === 0 || x[1] === 1, wo + ': Kategorie-Index ' + x[0]));
      break;
    case 'zahl':
      ok(typeof item.antwort === 'number', wo + ': antwort');
      ok(typeof item.einheit === 'string', wo + ': einheit');
      break;
    case 'leuchtet': {
      const sc = parseBild(item.bild, wo);
      const n = SC.zaehle(sc);
      ok(n.batterie + n.generator >= 1, wo + ': keine Quelle');
      ok(n.lampe >= 1, wo + ': keine Lampe');
      ok(!SC.simuliere(sc).kurzschluss, wo + ': Kurzschluss im Bild');
      break;
    }
    case 'mission': {
      ok(item.ziel, wo + ': ziel');
      const lsg = SC.parse(item.cols || 5, item.rows || 4, item.loesung);
      const r = SC.pruefeZiel(lsg, item.ziel);
      ok(r.ok, wo + ': Musterlösung besteht nicht: ' + r.grund);
      const start = item.start ? SC.parse(item.cols || 5, item.rows || 4, item.start) : SC.neu(item.cols || 5, item.rows || 4);
      ok(!SC.pruefeZiel(start, item.ziel).ok, wo + ': schon die Startschaltung besteht');
      // Musterlösung hält die Palette ein
      const n = SC.zaehle(lsg);
      Object.keys(n).forEach((typ) => {
        if (!n[typ]) return;
        const max = item.palette ? item.palette[typ] : undefined;
        ok(max != null && (max === Infinity || n[typ] <= max), wo + ': Palette erlaubt ' + typ + ' nicht oft genug');
      });
      break;
    }
    case 'papier':
      parseBild(item.loesung, wo + ' loesung');
      ok(item.check && item.check.length >= 2, wo + ': check');
      break;
    default:
      throw new Error(wo + ': unbekannter typ ' + item.typ);
  }
}

test('sechs Stadtteile in Reihenfolge der Checkliste', () => {
  eq(W.stadtteile.map((s) => s.nr), [1, 2, 3, 4, 5, 6]);
  eq(new Set(W.stadtteile.map((s) => s.id)).size, 6);
});

test('jeder Stadtteil hat Karten, Übungen, Erklär-Aufgaben', () => {
  W.stadtteile.forEach((st) => {
    ok(st.name && st.thema && st.ziel && st.funk, st.id + ': Kopfdaten');
    ok(st.karten.length >= 4, st.id + ': zu wenige Karten');
    ok(st.uebungen.length >= 5, st.id + ': zu wenige Übungen');
    ok(st.erklaeren.length >= 2, st.id + ': zu wenige Erklär-Aufgaben');
  });
});

test('Karten: Titel, Text, gültige Bilder und Baukästen', () => {
  W.stadtteile.forEach((st) => st.karten.forEach((k, i) => {
    const wo = st.id + ' Karte ' + i;
    ok(k.titel && k.text, wo + ': titel/text');
    if (k.bild) parseBild(k.bild, wo);
    if (k.baukasten) parseBild(k.baukasten, wo + ' baukasten');
    if (k.demo) ok(W.demos && typeof W.demos[k.demo] === 'function', wo + ': Demo ' + k.demo + ' fehlt');
    if (k.grafik) ok(W.art && W.art.hatGrafik(k.grafik), wo + ': Grafik ' + k.grafik + ' fehlt');
  }));
});

test('Übungen: eindeutige IDs, gültige Items', () => {
  const ids = new Set();
  W.stadtteile.forEach((st) => st.uebungen.forEach((u) => {
    ok(!ids.has(u.id), 'doppelte Übungs-ID ' + u.id);
    ids.add(u.id);
    ok(u.titel && u.items && u.items.length >= 3, u.id + ': titel/items');
    u.items.forEach((it, i) => pruefeItem(it, u.id + '.' + i));
    u.items.forEach((it, i) => { if (it.grafik) ok(W.art.hatGrafik(it.grafik), u.id + '.' + i + ': Grafik ' + it.grafik); });
  }));
});

test('Erklär-Aufgaben vollständig', () => {
  const ids = new Set();
  W.stadtteile.forEach((st) => st.erklaeren.forEach((e) => {
    ok(!ids.has(e.id), 'doppelte ID ' + e.id);
    ids.add(e.id);
    ok(e.frage && e.muster && e.punkte.length >= 3, e.id);
  }));
});

test('Prüfungs-Pool: mindestens 5 je Stadtteil, gültig', () => {
  W.stadtteile.forEach((st) => {
    const pool = W.PRUEFUNG[st.id] || [];
    ok(pool.length >= 5, st.id + ': Pool zu klein (' + pool.length + ')');
    pool.forEach((it, i) => pruefeItem(it, 'p.' + st.id + '.' + i));
  });
});

test('Prüfung ziehen: 20 Aufgaben, eindeutige IDs, alle Stadtteile', () => {
  for (let k = 0; k < 30; k++) {
    const p = W.pruefungZiehen();
    eq(p.length, 20);
    eq(new Set(p.map((x) => x.id)).size, 20);
    eq(new Set(p.map((x) => x.stadtteil)).size, 6);
    p.forEach((x) => ok(['mission', 'papier'].indexOf(x.item.typ) < 0, 'Mission/Papier in Prüfung'));
  }
});

test('Item-IDs der Prüfung lassen sich wiederfinden (Störungen)', () => {
  const p = W.pruefungZiehen();
  p.forEach((x) => ok(W.itemNachId(x.id) === x.item, 'itemNachId ' + x.id));
});

test('Blitzrunde: mindestens 40 Aussagen', () => {
  ok(W.BLITZ.length >= 40);
  W.BLITZ.forEach((b, i) => ok(typeof b[0] === 'string' && typeof b[1] === 'boolean' && typeof b[2] === 'string', 'Blitz ' + i));
  const wahr = W.BLITZ.filter((b) => b[1]).length;
  ok(wahr > 12 && wahr < W.BLITZ.length - 12, 'wahr/falsch ausgewogen');
});

test('Strom-Geheimnisse aufsteigend', () => {
  ok(W.GEHEIMNISSE.length >= 8);
  for (let i = 1; i < W.GEHEIMNISSE.length; i++) ok(W.GEHEIMNISSE[i].ab > W.GEHEIMNISSE[i - 1].ab, 'Reihenfolge ' + i);
});

/* Regressionen aus dem Fachreview */
function alleItems() {
  const out = [];
  W.stadtteile.forEach((st) => st.uebungen.forEach((u) => u.items.forEach((it) => out.push(it))));
  Object.keys(W.PRUEFUNG).forEach((k) => W.PRUEFUNG[k].forEach((it) => out.push(it)));
  return out;
}

test('Fachreview: Wollfaden ist Nichtleiter, kein Wolframfaden', () => {
  alleItems().filter((it) => it.typ === 'sortieren').forEach((it) => it.items.forEach((x) => {
    ok(!/Wolframfaden/.test(x[0]), 'Wolframfaden in Sortierung');
    if (/Wollfaden/.test(x[0])) eq(it.kategorien[x[1]], 'Nichtleiter');
  }));
});

test('Fachreview: Pendelbilder verraten die Beobachtung nicht', () => {
  alleItems().filter((it) => it.grafik && /^pendel:\?:\?:/.test(it.grafik)).forEach((it) => {
    eq(it.grafik, 'pendel:?:?:ruhe', it.frage.slice(0, 40));
  });
});

test('Fachreview: Lichterketten-Aufgaben passen zur Nennspannung', () => {
  alleItems().forEach((it) => {
    const m = /(\d+) Kerzen zu je (\d+) V/.exec(it.frage || '');
    if (m && /230 V/.test(it.frage)) ok(230 / +m[1] <= +m[2], 'Kerze würde durchbrennen: ' + it.frage.slice(0, 50));
  });
});

test('Fachreview: Glimmlampen-Merksatz nennt positiven und negativen Fall', () => {
  const k = W.stadtteile[0].karten.filter((x) => /Glimmlampe/.test(x.titel))[0];
  ok(/negativ/.test(k.merk) && /positiv/.test(k.merk), k.merk);
});

test('Fachreview: Fehler-finden-Aufgabe zur Knotenregel ist eindeutig', () => {
  const it = alleItems().filter((x) => /I = 0,25 A\. Was stimmt nicht/.test(x.frage || ''))[0];
  ok(it, 'Aufgabe fehlt');
  ok(!it.optionen.some((o) => /müssten zusammen 0,25 A/.test(o)), 'zweite vertretbare Option noch da');
});

test('Spickzettel: jeder Stadtteil hat mindestens drei Merksätze', () => {
  W.stadtteile.forEach((st) => ok(st.karten.filter((k) => k.merk).length >= 3, st.id + ': ' + st.karten.filter((k) => k.merk).length));
});

test('Technik-Review: Urkunde, aber dunkle Stadtteile – Leitstelle schickt zu den Stadtteilen', () => {
  const data = { name: 'X', stoer: {}, urkunde: '2026-11-16' };
  const f = W.funkspruch(data, W.stadtteile, () => ({ p: 0, fertig: false, karten: 0 }));
  ok(!/ganze Stadt leuchtet/.test(f.text), f.text);
  ok(/#\/st\//.test(f.ziel), f.ziel);
});

function alleDateien(dir) {
  let out = [];
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) out = out.concat(alleDateien(p));
    else if (/\.(js|html|css|md|webmanifest)$/.test(d.name)) out.push(p);
  });
  return out;
}

/* Private Namen stehen nur lokal in tests/privat-namen.txt (per .gitignore nie im Repo). */
const NAMEN_DATEI = path.join(__dirname, 'privat-namen.txt');
test('kein privater Name im veröffentlichten Code', () => {
  if (!fs.existsSync(NAMEN_DATEI)) return; // nur auf dem Rechner prüfbar, auf dem die Datei liegt
  const namen = fs.readFileSync(NAMEN_DATEI, 'utf8').split(/\s+/).filter(Boolean);
  ok(namen.length > 0, 'Namensliste leer');
  const re = new RegExp(namen.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  const dateien = alleDateien(path.join(laden.ROOT, 'js'))
    .concat(alleDateien(path.join(laden.ROOT, 'tests')).filter((f) => f !== NAMEN_DATEI))
    .concat(alleDateien(path.join(laden.ROOT, 'css')))
    .concat([path.join(laden.ROOT, 'index.html'), path.join(laden.ROOT, 'manifest.webmanifest')]);
  if (fs.existsSync(path.join(laden.ROOT, 'README.md'))) dateien.push(path.join(laden.ROOT, 'README.md'));
  dateien.forEach((f) => {
    const t = fs.readFileSync(f, 'utf8');
    ok(!re.test(t), 'Privater Name in ' + f);
  });
});

test('keine Umlaut-Ersatzschreibungen in Inhalten', () => {
  const dateien = alleDateien(path.join(laden.ROOT, 'js'));
  const re = /\b(fuer|ueber|koennen|muessen|waehle|Uebung|Pruefung|Schluessel|Stoerung|naechste|groesser)\b/;
  dateien.forEach((f) => {
    const zeilen = fs.readFileSync(f, 'utf8').split('\n');
    zeilen.forEach((z, i) => {
      // Bezeichner im Code (z. B. W.uebung, stoerungFalsch) sind erlaubt – nur Text in Anführungszeichen prüfen
      const texte = z.match(/'[^']*'|"[^"]*"/g) || [];
      texte.forEach((t) => {
        if (/^['"][a-zA-Z_.#/:-]*['"]$/.test(t)) return; // reine Schlüssel/IDs
        const m = re.exec(t);
        if (m) throw new Error(f + ':' + (i + 1) + ' ' + m[1]);
      });
    });
  });
});

fertig('inhalt');
