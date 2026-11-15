/* Tests für die reinen Hilfsfunktionen der Übungs-Engine. node tests/uebung.test.js */
const laden = require('./laden');
const { test, ok, eq, fertig } = require('./mini');

const W = laden(['js/util.js', 'js/logic.js', 'js/state.js', 'js/schaltung.js', 'js/uebungen.js']);
const U = W.uebung;

test('parseZahl: Komma und Punkt', () => {
  eq(U.parseZahl('0,5'), 0.5);
  eq(U.parseZahl('0.25'), 0.25);
  eq(U.parseZahl(' 12 '), 12);
  eq(U.parseZahl('1.000'), 1);
});

test('parseZahl: Einheit und Leerzeichen werden ignoriert', () => {
  eq(U.parseZahl('0,25 A'), 0.25);
  eq(U.parseZahl('6V'), 6);
});

test('parseZahl: Unsinn ergibt NaN', () => {
  eq(Number.isNaN(U.parseZahl('')), true);
  eq(Number.isNaN(U.parseZahl('abc')), true);
});

test('parseLuecke: Text und Lücken, erste Option ist richtig', () => {
  const t = U.parseLuecke('Gleich geladene Körper {stoßen sich ab|ziehen sich an}.');
  eq(t.length, 3);
  eq(t[0], { text: 'Gleich geladene Körper ' });
  eq(t[1], { optionen: ['stoßen sich ab', 'ziehen sich an'] });
  eq(t[2], { text: '.' });
});

test('parseLuecke: mehrere Lücken', () => {
  const t = U.parseLuecke('{A|B} und {C|D|E}');
  eq(t.filter((x) => x.optionen).length, 2);
});

test('pruefeItem: wahl, mehrfach, zahl', () => {
  eq(U.pruefeItem({ typ: 'wahl', richtig: 1 }, 1), true);
  eq(U.pruefeItem({ typ: 'wahl', richtig: 1 }, 0), false);
  eq(U.pruefeItem({ typ: 'mehrfach', richtig: [0, 2] }, [2, 0]), true);
  eq(U.pruefeItem({ typ: 'mehrfach', richtig: [0, 2] }, [0]), false);
  eq(U.pruefeItem({ typ: 'zahl', antwort: 0.5 }, '0,5'), true);
  eq(U.pruefeItem({ typ: 'zahl', antwort: 0.5 }, '0,6'), false);
  eq(U.pruefeItem({ typ: 'zahl', antwort: 13.5, tol: 0.05 }, '13,5'), true);
});

test('loesungLeuchtet: Simulation bestimmt leuchtende Lampen', () => {
  const item = { typ: 'leuchtet', bild: { cols: 4, rows: 3, dsl: '0,1 u:B r:S1 r:L1 d:- l:- l:- | 0,0 u:-' } };
  // S1 offen: nichts leuchtet
  eq(U.loesungLeuchtet({ typ: 'leuchtet', bild: { cols: 4, rows: 3, dsl: '0,1 u:B r:S1 r:L1 d:- l:- l:-' } }), []);
  eq(U.loesungLeuchtet({ typ: 'leuchtet', bild: { cols: 4, rows: 3, dsl: '0,1 u:B r:S1* r:L1 d:- l:- l:-' } }), ['L1']);
});

/* Technik-Review */
test('K3: loesungText für Auswahl, Mehrfach, Lücke, Sortieren', () => {
  eq(U.loesungText({ typ: 'wahl', optionen: ['A <strong>x</strong>', 'B'], richtig: 0 }), 'A x');
  eq(U.loesungText({ typ: 'mehrfach', optionen: ['A', 'B', 'C'], richtig: [0, 2] }), 'A; C');
  eq(U.loesungText({ typ: 'luecke', text: 'Gleich {stoßen|ziehen} sich ab.<br>Ja.' }), 'Gleich stoßen sich ab. Ja.');
  eq(U.loesungText({ typ: 'sortieren', kategorien: ['Leiter', 'Nichtleiter'], items: [['Kupfer', 0], ['Glas', 1], ['Eisen', 0]] }), 'Leiter: Kupfer, Eisen. Nichtleiter: Glas.');
  eq(U.loesungText({ typ: 'zahl', antwort: 0.5, einheit: 'A' }), '0,5 A');
});

test('K3: loesungText für Zuordnen nennt Bauteilnamen statt Schlüssel', () => {
  const W2 = laden(['js/util.js', 'js/logic.js', 'js/state.js', 'js/schaltung.js', 'js/schaltbild.js', 'js/uebungen.js']);
  const t = W2.uebung.loesungText({ typ: 'zuordnen', paare: [[{ sym: 'quelle' }, 'elektrische Quelle'], [{ sym: 'led' }, 'Leuchtdiode']] });
  ok(!/quelle –|led –/.test(t), t);
});

fertig('uebung');
