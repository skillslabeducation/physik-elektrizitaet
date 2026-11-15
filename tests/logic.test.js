/* Tests für Fortschritt, Funken, Störungen und Lernplan. node tests/logic.test.js */
const laden = require('./laden');
const { test, ok, eq, fertig } = require('./mini');

function frisch() {
  const W = laden(['js/util.js', 'js/logic.js', 'js/state.js']);
  W.state.load();
  return W;
}

test('funkenFuer: 0..1 wird 0..10', () => {
  const W = frisch();
  eq(W.logic.funkenFuer(0), 0);
  eq(W.logic.funkenFuer(0.5), 5);
  eq(W.logic.funkenFuer(1), 10);
});

test('Funken nur für Verbesserungen', () => {
  const W = frisch();
  eq(W.state.recordUebung('a', 0.5), 5);
  eq(W.state.recordUebung('a', 0.4), 0);
  eq(W.state.recordUebung('a', 1), 5);
  eq(W.state.data.funken, 10);
  eq(W.state.data.ueb.a.best, 1);
  eq(W.state.data.ueb.a.tries, 3);
});

test('Störung: erst nach zweimal richtig in Folge behoben', () => {
  const W = frisch();
  W.state.stoerungFalsch('x.1');
  eq(W.state.stoerungen(), ['x.1']);
  eq(W.state.stoerungRichtig('x.1'), false);
  eq(W.state.stoerungen(), ['x.1']);
  eq(W.state.stoerungRichtig('x.1'), true);
  eq(W.state.stoerungen(), []);
});

test('Störung: ein Fehler setzt den Zähler zurück', () => {
  const W = frisch();
  W.state.stoerungFalsch('x.1');
  W.state.stoerungRichtig('x.1');
  W.state.stoerungFalsch('x.1');
  eq(W.state.stoerungRichtig('x.1'), false);
  eq(W.state.stoerungen(), ['x.1']);
});

test('Störung: richtig ohne offene Störung ändert nichts', () => {
  const W = frisch();
  eq(W.state.stoerungRichtig('y'), false);
  eq(W.state.stoerungen(), []);
});

test('Zustand bleibt nach erneutem Laden erhalten', () => {
  const W = frisch();
  W.state.setName('Test');
  W.state.recordUebung('a', 1);
  W.state.load();
  eq(W.state.data.name, 'Test');
  eq(W.state.data.funken, 10);
});

test('Lernplan: 5 Tage Abstand ergibt 5 Einträge, letzter ist Wiederholung', () => {
  const W = frisch();
  const plan = W.logic.lernplan('2026-11-15', '2026-11-20', ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
  eq(plan.length, 5);
  eq(plan[0].datum, '2026-11-15');
  eq(plan[4].datum, '2026-11-19');
  eq(plan[4].aufgaben, ['stoerungen', 'blitz', 'spick']);
  const alle = plan.slice(0, 4).reduce((acc, t) => acc.concat(t.aufgaben), []);
  eq(alle, ['a', 'b', 'c', 'd', 'e', 'f', 'g']);
});

test('Lernplan: Arbeit heute oder vorbei ergibt leeren Plan', () => {
  const W = frisch();
  eq(W.logic.lernplan('2026-11-15', '2026-11-15', ['a']), []);
  eq(W.logic.lernplan('2026-11-15', '2026-11-10', ['a']), []);
  eq(W.logic.lernplan('2026-11-15', '', ['a']), []);
});

test('Lernplan: Arbeit morgen ergibt einen Kompakt-Tag', () => {
  const W = frisch();
  const plan = W.logic.lernplan('2026-11-15', '2026-11-16', ['a', 'b']);
  eq(plan.length, 1);
  ok(plan[0].aufgaben.indexOf('pruefung') >= 0);
});

test('Lernplan: mehr Tage als Aufgaben, Lücken werden Wiederholung', () => {
  const W = frisch();
  const plan = W.logic.lernplan('2026-11-01', '2026-11-11', ['a', 'b']);
  eq(plan.length, 10);
  ok(plan.every((t) => t.aufgaben.length > 0));
});

test('Lernplan: über Monatsgrenze und Zeitumstellung', () => {
  const W = frisch();
  const plan = W.logic.lernplan('2026-10-24', '2026-10-27', ['a', 'b']);
  eq(plan.map((t) => t.datum), ['2026-10-24', '2026-10-25', '2026-10-26']);
});

const ST = { id: 'st', karten: [{}, {}], uebungen: [{ id: 'u1' }, { id: 'u2' }], erklaeren: [{ id: 'e1' }] };

test('Stadtteil-Fortschritt: leer 0, alles erledigt fertig', () => {
  const W = frisch();
  eq(W.state.stadtteilFortschritt(ST).p, 0);
  eq(W.state.stadtteilFortschritt(ST).fertig, false);
  W.state.markKarte('st', 1);
  W.state.recordUebung('u1', 1);
  W.state.recordUebung('u2', 0.6);
  W.state.saveErklaeren('e1', { gezeigt: true });
  const f = W.state.stadtteilFortschritt(ST);
  eq(f.fertig, true);
  ok(f.p > 0.9 && f.p <= 1, 'p=' + f.p);
});

test('Stadtteil nicht fertig, wenn eine Übung unter 60 %', () => {
  const W = frisch();
  W.state.markKarte('st', 1);
  W.state.recordUebung('u1', 1);
  W.state.recordUebung('u2', 0.5);
  W.state.saveErklaeren('e1', { gezeigt: true });
  eq(W.state.stadtteilFortschritt(ST).fertig, false);
});

test('Prüfung: Urkunde ab 80 %', () => {
  const W = frisch();
  W.state.recordPruefung({ score: 15, n: 20, datum: '2026-11-15' });
  eq(W.state.data.urkunde, null);
  W.state.recordPruefung({ score: 16, n: 20, datum: '2026-11-16' });
  eq(W.state.data.urkunde, '2026-11-16');
  eq(W.state.data.pruef.best, 0.8);
});

test('Gesperrter Speicher: App arbeitet ohne Absturz weiter', () => {
  const W = laden(['js/util.js', 'js/logic.js', 'js/state.js']);
  W.store.get = () => null;
  W.store.set = () => false;
  W.state.load();
  eq(W.state.recordUebung('a', 1), 10);
});

/* Technik-Review */
test('K2: Lernplan verteilt nur offene Aufgaben', () => {
  const W = frisch();
  const a = W.logic.planAufgaben(['ladung', 'stromkreis', 'reihe'], { ladung: true }, false);
  eq(a, ['stromkreis', 'reihe', 'pruefung']);
  eq(W.logic.planAufgaben(['ladung'], { ladung: true }, true), []);
});

test('W11: Fortschritt exportieren und importieren', () => {
  const W = frisch();
  W.state.setName('Export');
  W.state.recordUebung('a', 1);
  const code = W.state.exportCode();
  ok(typeof code === 'string' && code.length > 10);
  W.state.reset();
  eq(W.state.data.funken, 0);
  eq(W.state.importCode(code), true);
  eq(W.state.data.name, 'Export');
  eq(W.state.data.funken, 10);
  eq(W.state.importCode('unsinn'), false);
  eq(W.state.data.name, 'Export', 'kaputter Code darf nichts überschreiben');
});

fertig('logic');
