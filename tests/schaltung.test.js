/* Tests für Schaltungsmodell, Simulation und Missionsprüfung. node tests/schaltung.test.js */
const laden = require('./laden');
const { test, ok, eq, near, fertig } = require('./mini');

const W = laden(['js/util.js', 'js/schaltung.js']);
const SC = W.schaltung;

function keyOf(s, name) {
  const k = Object.keys(s.teile).find((key) => s.teile[key].name === name);
  if (!k) throw new Error('Kein Teil ' + name);
  return k;
}
function teil(sim, s, name) { return sim.teile[keyOf(s, name)]; }

// Eine Lampe an der Batterie (Raster 4x3)
const EINE = '0,1 u:B r:L1 r:- d:- l:- l:-';
// Zwei Lampen in Reihe
const REIHE = '0,1 u:B r:L1 r:L2 d:- l:- l:-';
// Zwei Lampen parallel
const PARALLEL = '0,1 u:B r:- d:L1 l:- | 1,0 r:- d:L2 l:-';

test('parse: Kantenschlüssel und Typen', () => {
  const s = SC.parse(4, 3, EINE);
  eq(s.teile['v:0,0'].typ, 'batterie');
  eq(s.teile['h:0,0'].typ, 'lampe');
  eq(s.teile['h:0,0'].name, 'L1');
  eq(s.teile['h:1,0'].typ, 'leitung');
  eq(s.teile['v:2,0'].typ, 'leitung');
  eq(Object.keys(s.teile).length, 6);
});

test('parse: geschlossener Schalter mit *', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:S1* r:L1 d:- l:- l:-');
  eq(s.teile['h:0,0'].typ, 'schalter');
  eq(s.teile['h:0,0'].zu, true);
  eq(s.teile['h:0,0'].name, 'S1');
});

test('parse: Lampen ohne Nummer bekommen Namen L1, L2', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:L r:L d:- l:- l:-');
  const namen = Object.keys(s.teile).map((k) => s.teile[k].name).filter(Boolean).sort();
  eq(namen, ['L1', 'L2']);
});

test('parse: Schritt aus dem Raster heraus wirft Fehler', () => {
  let fehler = null;
  try { SC.parse(2, 2, '0,0 l:-'); } catch (e) { fehler = e; }
  ok(fehler && /Raster/.test(fehler.message), 'Fehler mit Hinweis auf Raster erwartet: ' + (fehler && fehler.message));
});

test('eine Lampe: 0,25 A, 6 V, volle Helligkeit', () => {
  const s = SC.parse(4, 3, EINE);
  const sim = SC.simuliere(s);
  const L = teil(sim, s, 'L1');
  near(L.I, 0.25, 1e-3);
  near(L.U, 6, 1e-2);
  near(L.hell, 1, 1e-2);
  eq(L.an, true);
  near(sim.quelle.I, 0.25, 1e-3);
  eq(sim.kurzschluss, false);
});

test('Reihe: je 3 V und 0,125 A, Helligkeit 0,25', () => {
  const s = SC.parse(4, 3, REIHE);
  const sim = SC.simuliere(s);
  ['L1', 'L2'].forEach((n) => {
    const L = teil(sim, s, n);
    near(L.U, 3, 1e-2, n + ' U');
    near(L.I, 0.125, 1e-3, n + ' I');
    near(L.hell, 0.25, 1e-2, n + ' hell');
  });
  near(sim.quelle.I, 0.125, 1e-3);
});

test('Parallel: je 6 V, Quelle 0,5 A', () => {
  const s = SC.parse(4, 3, PARALLEL);
  const sim = SC.simuliere(s);
  ['L1', 'L2'].forEach((n) => {
    const L = teil(sim, s, n);
    near(L.U, 6, 1e-2, n + ' U');
    near(L.I, 0.25, 1e-3, n + ' I');
  });
  near(sim.quelle.I, 0.5, 1e-3);
});

test('offener Schalter: alles aus, geschlossen: an', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:S1 r:L1 d:- l:- l:-');
  eq(teil(SC.simuliere(s), s, 'L1').an, false);
  SC.umschalten(s, keyOf(s, 'S1'));
  eq(s.teile[keyOf(s, 'S1')].zu, true);
  eq(teil(SC.simuliere(s), s, 'L1').an, true);
});

test('Kurzschluss: Pole direkt verbunden', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:- d:- l:-');
  eq(SC.simuliere(s).kurzschluss, true);
});

test('Kurzschluss: Leitung parallel zu einer Lampe, die direkt an der Batterie hängt', () => {
  const s = SC.parse(4, 3, PARALLEL + ' | 2,0 r:- d:- l:-');
  const sim = SC.simuliere(s);
  eq(sim.kurzschluss, true);
  eq(teil(sim, s, 'L1').an, false, 'Lampe im Kurzschluss muss aus sein');
  eq(teil(sim, s, 'L2').an, false, 'Lampe im Kurzschluss muss aus sein');
});

test('Reihe: Lampe herausgedreht, beide aus', () => {
  const s = SC.parse(4, 3, REIHE);
  SC.umschalten(s, keyOf(s, 'L1'));
  eq(s.teile[keyOf(s, 'L1')].raus, true);
  const sim = SC.simuliere(s);
  eq(teil(sim, s, 'L1').an, false);
  eq(teil(sim, s, 'L2').an, false);
});

test('Parallel: Lampe herausgedreht, die andere bleibt an', () => {
  const s = SC.parse(4, 3, PARALLEL);
  SC.umschalten(s, keyOf(s, 'L1'));
  const sim = SC.simuliere(s);
  eq(teil(sim, s, 'L1').an, false);
  eq(teil(sim, s, 'L2').an, true);
  near(teil(sim, s, 'L2').hell, 1, 1e-2);
});

test('überbrückte Lampe: aus, andere Lampe voll an, kein Kurzschluss', () => {
  const s = SC.parse(4, 3, '0,2 u:B r:L1 r:L2 d:- l:- l:- | 0,1 u:- r:- d:-');
  const sim = SC.simuliere(s);
  eq(sim.kurzschluss, false);
  eq(teil(sim, s, 'L1').an, false);
  eq(teil(sim, s, 'L2').an, true);
  near(teil(sim, s, 'L2').hell, 1, 1e-2);
});

test('keine Batterie: nichts leuchtet, kein Fehler', () => {
  const s = SC.parse(4, 3, '0,1 u:- r:L1 r:- d:- l:- l:-');
  const sim = SC.simuliere(s);
  eq(teil(sim, s, 'L1').an, false);
  eq(sim.batterien, 0);
});

test('zwei Batterien in Reihe: 12 V, Lampe brennt durch (zuViel)', () => {
  const s = SC.parse(4, 3, '0,2 u:B u:B r:L1 d:- d:- l:-');
  const sim = SC.simuliere(s);
  near(teil(sim, s, 'L1').U, 12, 0.05);
  eq(teil(sim, s, 'L1').zuViel, true);
});

test('Batterie umdrehen (umschalten) kehrt Pol um, Reihe hebt sich auf', () => {
  const s = SC.parse(4, 3, '0,2 u:B u:B r:L1 d:- d:- l:-');
  SC.umschalten(s, 'v:0,0');
  eq(s.teile['v:0,0'].dreh, true);
  const sim = SC.simuliere(s);
  eq(teil(sim, s, 'L1').an, false);
});

test('Leitungen mit Strom sind markiert, Sackgassen nicht', () => {
  const s = SC.parse(4, 3, EINE + ' | 2,1 d:-');
  const sim = SC.simuliere(s);
  ok(sim.teile['h:1,0'].an, 'Leitung im Kreis führt Strom');
  eq(sim.teile['v:2,1'].an, false, 'Sackgasse');
});

test('setzeTeil: setzen, ersetzen, entfernen', () => {
  const s = SC.neu(4, 3);
  SC.setzeTeil(s, 'h:0,0', 'lampe');
  eq(s.teile['h:0,0'].typ, 'lampe');
  SC.setzeTeil(s, 'h:0,0', 'schalter');
  eq(s.teile['h:0,0'].typ, 'schalter');
  eq(Object.keys(s.teile).length, 1);
  SC.setzeTeil(s, 'h:0,0', 'schalter');
  eq(s.teile['h:0,0'], undefined);
});

test('setzeTeil: neue Lampe bekommt freien Namen', () => {
  const s = SC.neu(4, 3);
  SC.setzeTeil(s, 'h:0,0', 'lampe');
  SC.setzeTeil(s, 'h:1,0', 'lampe');
  eq([s.teile['h:0,0'].name, s.teile['h:1,0'].name], ['L1', 'L2']);
  SC.setzeTeil(s, 'h:0,0', null);
  SC.setzeTeil(s, 'h:2,0', 'lampe');
  eq(s.teile['h:2,0'].name, 'L1');
});

test('kanten: alle Kanten eines 4x3-Rasters', () => {
  eq(SC.kanten(4, 3).length, 3 * 3 + 4 * 2);
});

// Missionen
const UND = '0,1 u:B r:S1 r:S2 r:L1 d:- l:- l:- l:-';
const ODER = '0,2 u:B u:- r:S1 r:- d:- d:L1 l:- l:- | 0,1 r:S2 r:-';
const UNABH = '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:S2 d:L2 | 0,2 r:- r:-';
const ZIEL_UND = { art: 'tabelle', lampen: 1, schalter: 2, regel: (x) => [x[0] && x[1]] };
const ZIEL_ODER = { art: 'tabelle', lampen: 1, schalter: 2, regel: (x) => [x[0] || x[1]] };
const ZIEL_UNABH = { art: 'tabelle', lampen: 2, schalter: 2, regel: (x) => [x[0], x[1]] };

test('Mission UND besteht', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, UND), ZIEL_UND).ok, true);
});
test('UND-Schaltung besteht ODER-Ziel nicht', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, UND), ZIEL_ODER).ok, false);
});
test('Mission ODER besteht', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, ODER), ZIEL_ODER).ok, true);
});
test('Mission unabhängig besteht, auch mit vertauschten Namen', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, UNABH), ZIEL_UNABH).ok, true);
  const vertauscht = UNABH.replace('S1', 'SX').replace('S2', 'S1').replace('SX', 'S2');
  eq(SC.pruefeZiel(SC.parse(4, 3, vertauscht), ZIEL_UNABH).ok, true);
});
test('ODER mit Kurzschluss in einer Stellung scheitert mit Grund Kurzschluss', () => {
  // S2 liegt direkt über der Batterie
  const s = SC.parse(4, 3, '0,2 u:B u:- r:S1 r:L1 d:- d:- l:- l:- | 0,1 r:S2 r:-');
  const r = SC.pruefeZiel(s, ZIEL_ODER);
  eq(r.ok, false);
  ok(/Kurzschluss/.test(r.grund), r.grund);
});
test('falsche Anzahl Lampen scheitert', () => {
  const r = SC.pruefeZiel(SC.parse(4, 3, UND), { art: 'tabelle', lampen: 2, schalter: 2, regel: (x) => [x[0], x[1]] });
  eq(r.ok, false);
});
test('Ziel reihe / parallel', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, REIHE), { art: 'reihe', lampen: 2 }).ok, true);
  eq(SC.pruefeZiel(SC.parse(4, 3, REIHE), { art: 'parallel', lampen: 2 }).ok, false);
  eq(SC.pruefeZiel(SC.parse(4, 3, PARALLEL), { art: 'parallel', lampen: 2 }).ok, true);
  eq(SC.pruefeZiel(SC.parse(4, 3, PARALLEL), { art: 'reihe', lampen: 2 }).ok, false);
});
test('Ziel voll: Reihe ist nicht hell genug', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, REIHE), { art: 'tabelle', lampen: 2, schalter: 0, regel: () => [true, true], voll: true }).ok, false);
  eq(SC.pruefeZiel(SC.parse(4, 3, PARALLEL), { art: 'tabelle', lampen: 2, schalter: 0, regel: () => [true, true], voll: true }).ok, true);
});
test('Ziel teile: genaue Anzahl Bauteile', () => {
  eq(SC.pruefeZiel(SC.parse(4, 3, UND), Object.assign({ teile: { schalter: 2, lampe: 1 } }, ZIEL_UND)).ok, true);
  eq(SC.pruefeZiel(SC.parse(4, 3, UND), Object.assign({ teile: { motor: 1 } }, ZIEL_UND)).ok, false);
});
test('leere Schaltung scheitert', () => {
  eq(SC.pruefeZiel(SC.neu(4, 3), ZIEL_UND).ok, false);
});
test('Motor zählt als Gerät', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:S1 r:M d:- l:- l:-');
  const sim = SC.simuliere(s);
  ok(Object.keys(sim.teile).some((k) => s.teile[k].typ === 'motor' && !sim.teile[k].an));
  eq(SC.pruefeZiel(s, { art: 'tabelle', lampen: 1, schalter: 1, regel: (x) => [x[0]] }).ok, true);
});

test('Generator (Dynamo) arbeitet wie eine Quelle', () => {
  const s = SC.parse(4, 3, '0,1 u:G r:L1 r:- d:- l:- l:-');
  eq(s.teile['v:0,0'].typ, 'generator');
  const sim = SC.simuliere(s);
  near(teil(sim, s, 'L1').I, 0.25, 1e-3);
  eq(SC.pruefeZiel(s, { art: 'tabelle', lampen: 1, schalter: 0, regel: () => [true] }).ok, true);
});

test('Ziel typen: Lampe und Motor dürfen nicht vertauscht sein', () => {
  // Lampe L1 mit eigenem Schalter S1, Motor nur wenn S2 UND S3 geschlossen
  const s = SC.parse(4, 4, '0,3 u:B u:- u:- r:- r:- | 1,0 d:S1 d:L1 d:- | 2,0 d:S2 d:S3 d:M | 0,3 r:- r:-');
  const regel = (x) => [x[0], x[1] && x[2]];
  eq(SC.pruefeZiel(s, { art: 'tabelle', lampen: 2, schalter: 3, typen: ['lampe', 'motor'], regel }).ok, true);
  // ohne typen wäre auch "Motor mit einem Schalter, Lampe mit zwei" erlaubt
  eq(SC.pruefeZiel(s, { art: 'tabelle', lampen: 2, schalter: 3, regel }).ok, true);
  eq(SC.pruefeZiel(s, { art: 'tabelle', lampen: 2, schalter: 3, typen: ['motor', 'lampe'], regel }).ok, false);
});

test('parse: herausgedrehte Lampe mit x', () => {
  const s = SC.parse(4, 3, '0,1 u:B r:L1x r:L2 d:- l:- l:-');
  eq(s.teile['h:0,0'].raus, true);
  eq(teil(SC.simuliere(s), s, 'L2').an, false);
});

/* Technik-Review */
test('K1: zwei Batterien in Reihe, zwei Lampen: Quellenstrom = Lampenstrom', () => {
  const s = SC.parse(4, 3, '0,2 u:B u:B r:L1 r:L2 d:- d:- l:- l:-');
  const sim = SC.simuliere(s);
  near(teil(sim, s, 'L1').I, 0.25, 1e-3);
  near(sim.quelle.I, 0.25, 1e-3);
});

test('W1: durchgebrannte Lampe unterbricht den Stromkreis', () => {
  const s = SC.parse(4, 3, '0,2 u:B u:B r:L1 d:- d:- l:-');
  const sim = SC.simuliere(s);
  const L = teil(sim, s, 'L1');
  eq(L.zuViel, true);
  eq(L.an, false, 'Lampe darf nicht mehr leuchten');
  eq(sim.teile['v:1,0'].an, false, 'Leitung darf keinen Strom mehr führen');
});

test('W2: Dynamo lässt sich mit der Hand umdrehen', () => {
  const s = SC.parse(4, 3, '0,1 u:G r:L1 r:- d:- l:- l:-');
  SC.umschalten(s, 'v:0,0');
  eq(s.teile['v:0,0'].dreh, true);
});

test('W2: gegeneinander geschaltete Quellen werden erkannt', () => {
  const s = SC.parse(4, 3, '0,2 u:B u:B r:L1 d:- d:- l:-');
  SC.umschalten(s, 'v:0,0');
  const sim = SC.simuliere(s);
  eq(sim.gegeneinander, true);
});

test('W5: Missionshinweis nennt eine konkrete Schalterstellung', () => {
  const r = SC.pruefeZiel(SC.parse(4, 3, UND), ZIEL_ODER);
  eq(r.ok, false);
  ok(/geschlossen/.test(r.grund) && /offen/.test(r.grund) && /L1/.test(r.grund), r.grund);
});

fertig('schaltung');
