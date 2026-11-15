/* Schaltungsmodell und Simulation.
   Eine Schaltung ist ein Raster aus Knoten (cols x rows). Jede Kante zwischen zwei
   Nachbarknoten trägt höchstens ein Bauteil. Kantenschlüssel: 'h:c,r' verbindet (c,r)-(c+1,r),
   'v:c,r' verbindet (c,r)-(c,r+1).
   Simulation: Knotenpotenziale. Leitungen sind sehr kleine Widerstände, die Batterie ist eine
   Quelle mit sehr kleinem Innenwiderstand. So lassen sich auch Kurzschlüsse und Ströme in
   Leitungen berechnen. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});

  var U0 = 6;            // Spannung einer Batterie in V
  var R_LAST = 24;       // Widerstand von Lampe, Motor, Klingel in Ohm (6 V -> 0,25 A)
  var R_LEIT = 1e-6;     // Leitung, geschlossener Schalter
  var R_INNEN = 1e-2;    // Innenwiderstand der Batterie
  var KS_GRENZE = 50;    // ab dieser Stromstärke (A) gilt es als Kurzschluss
  var AN_GRENZE = 1e-3;  // ab dieser Stromstärke (A) gilt ein Teil als "an"
  var DURCH = 9;         // ab dieser Spannung (V) brennt eine 6-V-Lampe durch

  var CODES = { '-': 'leitung', B: 'batterie', G: 'generator', L: 'lampe', S: 'schalter', M: 'motor', K: 'klingel' };
  var QUELLE = { batterie: true, generator: true };
  var PREFIX = { lampe: 'L', schalter: 'S' };
  var LAST = { lampe: true, motor: true, klingel: true };
  var DIRS = { r: [1, 0], l: [-1, 0], u: [0, -1], d: [0, 1] };

  function neu(cols, rows) { return { cols: cols, rows: rows, teile: {} }; }

  function kopie(s) { return JSON.parse(JSON.stringify(s)); }

  /** Endpunkte einer Kante: [[c,r],[c2,r2]] */
  function enden(key) {
    var p = key.slice(2).split(',');
    var c = +p[0], r = +p[1];
    return key.charAt(0) === 'h' ? [[c, r], [c + 1, r]] : [[c, r], [c, r + 1]];
  }

  function kanten(cols, rows) {
    var out = [];
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols - 1; c++) out.push('h:' + c + ',' + r);
    for (var r2 = 0; r2 < rows - 1; r2++) for (var c2 = 0; c2 < cols; c2++) out.push('v:' + c2 + ',' + r2);
    return out;
  }

  function kanteZwischen(c1, r1, c2, r2) {
    if (r1 === r2) return 'h:' + Math.min(c1, c2) + ',' + r1;
    return 'v:' + c1 + ',' + Math.min(r1, r2);
  }

  function freierName(s, typ) {
    var pre = PREFIX[typ];
    if (!pre) return undefined;
    var used = {};
    Object.keys(s.teile).forEach(function (k) { if (s.teile[k].name) used[s.teile[k].name] = true; });
    var n = 1;
    while (used[pre + n]) n++;
    return pre + n;
  }

  /** Kurzschreibweise: Pfade getrennt durch '|', jeder Pfad 'c,r dir:code dir:code ...' */
  function parse(cols, rows, dsl) {
    var s = neu(cols, rows);
    var ohneName = [];
    String(dsl).split('|').forEach(function (pfad) {
      var tok = pfad.trim().split(/\s+/);
      if (!tok[0]) return;
      var st = tok[0].split(',');
      var c = +st[0], r = +st[1];
      if (!(c >= 0 && c < cols && r >= 0 && r < rows)) throw new Error('Startpunkt außerhalb vom Raster: ' + tok[0]);
      for (var i = 1; i < tok.length; i++) {
        var schritt = tok[i].split(':');
        var d = DIRS[schritt[0]];
        if (!d) throw new Error('Unbekannte Richtung: ' + tok[i]);
        var nc = c + d[0], nr = r + d[1];
        if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) throw new Error('Schritt verlässt das Raster: ' + tok[i] + ' ab ' + c + ',' + r);
        var m = /^([-BGLSMK])(\d*)([*x]?)$/.exec(schritt[1] || '');
        if (!m) throw new Error('Unbekanntes Bauteil: ' + tok[i]);
        var typ = CODES[m[1]];
        var key = kanteZwischen(c, r, nc, nr);
        var alt = s.teile[key];
        if (alt && alt.typ !== typ) throw new Error('Kante doppelt belegt: ' + key);
        if (!alt) {
          var t = { typ: typ };
          if (m[2] && PREFIX[typ]) t.name = PREFIX[typ] + m[2];
          if (typ === 'schalter') t.zu = m[3] === '*';
          if (typ === 'lampe' && m[3] === 'x') t.raus = true;
          s.teile[key] = t;
          if (!t.name && PREFIX[typ]) ohneName.push(key);
        }
        c = nc; r = nr;
      }
    });
    ohneName.forEach(function (k) { s.teile[k].name = freierName(s, s.teile[k].typ); });
    return s;
  }

  /** Bauteil setzen: gleiches Teil entfernt, anderes ersetzt, null entfernt. */
  function setzeTeil(s, key, typ) {
    var alt = s.teile[key];
    if (!typ || (alt && alt.typ === typ)) { delete s.teile[key]; return s; }
    delete s.teile[key];
    var t = { typ: typ };
    var n = freierName(s, typ);
    if (n) t.name = n;
    if (typ === 'schalter') t.zu = false;
    s.teile[key] = t;
    return s;
  }

  /** Schalter auf/zu, Lampe heraus/hinein, Batterie umdrehen. */
  function umschalten(s, key) {
    var t = s.teile[key];
    if (!t) return null;
    if (t.typ === 'schalter') t.zu = !t.zu;
    else if (t.typ === 'lampe') t.raus = !t.raus;
    else if (QUELLE[t.typ]) t.dreh = !t.dreh;
    return t;
  }

  function zaehle(s) {
    var n = { leitung: 0, batterie: 0, generator: 0, lampe: 0, schalter: 0, motor: 0, klingel: 0 };
    Object.keys(s.teile).forEach(function (k) { n[s.teile[k].typ]++; });
    return n;
  }

  /* Lineares Gleichungssystem lösen (Gauß mit Spaltenpivot). */
  function loese(A, b) {
    var n = b.length;
    for (var i = 0; i < n; i++) {
      var max = i;
      for (var j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[max][i])) max = j;
      var tmp = A[i]; A[i] = A[max]; A[max] = tmp;
      var tb = b[i]; b[i] = b[max]; b[max] = tb;
      var p = A[i][i];
      if (Math.abs(p) < 1e-14) continue;
      for (var k = i + 1; k < n; k++) {
        var f = A[k][i] / p;
        if (f === 0) continue;
        for (var c = i; c < n; c++) A[k][c] -= f * A[i][c];
        b[k] -= f * b[i];
      }
    }
    var x = new Array(n);
    for (var r = n - 1; r >= 0; r--) {
      var sum = b[r];
      for (var c2 = r + 1; c2 < n; c2++) sum -= A[r][c2] * x[c2];
      x[r] = Math.abs(A[r][r]) < 1e-14 ? 0 : sum / A[r][r];
    }
    return x;
  }

  function rechne(s, offen) {
    var cols = s.cols;
    var N = s.cols * s.rows;
    function id(p) { return p[1] * cols + p[0]; }

    var kant = [];
    var batt = [];
    Object.keys(s.teile).forEach(function (key) {
      var t = s.teile[key];
      var e = enden(key);
      var a = id(e[0]), b = id(e[1]);
      var g = 0;
      if (t.typ === 'leitung') g = 1 / R_LEIT;
      else if (t.typ === 'schalter') g = t.zu ? 1 / R_LEIT : 0;
      else if (t.typ === 'lampe') g = (t.raus || offen[key]) ? 0 : 1 / R_LAST;
      else if (LAST[t.typ]) g = 1 / R_LAST;
      else if (QUELLE[t.typ]) {
        g = 1 / R_INNEN;
        var plus = t.dreh ? b : a;
        batt.push({ key: key, plus: plus, minus: plus === a ? b : a, g: g });
      }
      kant.push({ key: key, a: a, b: b, g: g, typ: t.typ });
    });

    // Zusammenhang über leitende Kanten
    var par = [];
    for (var i = 0; i < N; i++) par[i] = i;
    function find(x) { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
    kant.forEach(function (e) { if (e.g > 0) par[find(e.a)] = find(e.b); });

    // Pro Komponente mit Batterie: Minuspol der ersten Batterie ist Masse
    var masse = {};
    batt.forEach(function (bt) { var root = find(bt.minus); if (masse[root] == null) masse[root] = bt.minus; });
    var idx = [];
    var m = 0;
    for (var n = 0; n < N; n++) {
      var root = find(n);
      idx[n] = (masse[root] != null && masse[root] !== n) ? m++ : -1;
    }

    var V = [];
    for (var v0 = 0; v0 < N; v0++) V[v0] = 0;
    if (m > 0) {
      var A = [];
      var rhs = [];
      for (var r = 0; r < m; r++) { A[r] = []; for (var c = 0; c < m; c++) A[r][c] = 0; rhs[r] = 0; }
      kant.forEach(function (e) {
        if (!(e.g > 0)) return;
        var ia = idx[e.a], ib = idx[e.b];
        if (ia >= 0) { A[ia][ia] += e.g; if (ib >= 0) A[ia][ib] -= e.g; }
        if (ib >= 0) { A[ib][ib] += e.g; if (ia >= 0) A[ib][ia] -= e.g; }
      });
      batt.forEach(function (bt) {
        var J = U0 * bt.g;
        if (idx[bt.plus] >= 0) rhs[idx[bt.plus]] += J;
        if (idx[bt.minus] >= 0) rhs[idx[bt.minus]] -= J;
      });
      var x = loese(A, rhs);
      for (var q = 0; q < N; q++) if (idx[q] >= 0) V[q] = x[idx[q]];
    }

    var res = {};
    var quelleI = 0;
    var kurz = false;
    kant.forEach(function (e) {
      var U = Math.abs(V[e.a] - V[e.b]);
      var I = Math.abs((V[e.a] - V[e.b]) * e.g);
      var r = { I: I, U: U, an: false, hell: 0 };
      if (QUELLE[e.typ]) {
        var bt = batt.filter(function (b) { return b.key === e.key; })[0];
        I = Math.abs(U0 * bt.g - (V[bt.plus] - V[bt.minus]) * bt.g);
        r.I = I;
        r.an = I > AN_GRENZE;
        quelleI = Math.max(quelleI, I);
        if (I > KS_GRENZE) kurz = true;
      } else {
        r.an = e.g > 0 && I > AN_GRENZE;
        if (LAST[e.typ] && r.an) r.hell = Math.pow(U / U0, 2);
        if (e.typ === 'lampe' && r.an && U > DURCH) r.zuViel = true;
      }
      res[e.key] = r;
    });

    return { kurzschluss: kurz, quelle: { I: quelleI, U: batt.length ? U0 : 0 }, teile: res, batterien: batt.length };
  }

  /** Simulation: durchgebrannte Lampen unterbrechen danach den Stromkreis; gegeneinander geschaltete Quellen werden erkannt. */
  function simuliere(s) {
    var offen = {};
    var sim = rechne(s, offen);
    for (var runde = 0; runde < 5; runde++) {
      var neu = Object.keys(sim.teile).filter(function (k) { return sim.teile[k].zuViel && !offen[k]; });
      if (!neu.length) break;
      neu.forEach(function (k) { offen[k] = true; });
      sim = rechne(s, offen);
    }
    Object.keys(offen).forEach(function (k) { var r = sim.teile[k]; r.zuViel = true; r.an = false; r.hell = 0; r.I = 0; });
    sim.gegeneinander = false;
    if (sim.batterien >= 2 && !sim.kurzschluss) {
      var lasten = Object.keys(s.teile).filter(function (k) { return LAST[s.teile[k].typ] && !s.teile[k].raus && !offen[k]; });
      var keinAn = lasten.every(function (k) { return !sim.teile[k].an; });
      if (lasten.length && keinAn) {
        var quellen = Object.keys(s.teile).filter(function (k) { return QUELLE[s.teile[k].typ]; });
        sim.gegeneinander = quellen.some(function (q) {
          var k2 = kopie(s);
          quellen.forEach(function (o) { if (o !== q) k2.teile[o] = { typ: 'leitung' }; });
          var r2 = rechne(k2, offen);
          return lasten.some(function (k) { return r2.teile[k].an; });
        });
      }
    }
    return sim;
  }

  function permutationen(n) {
    if (n === 0) return [[]];
    var out = [];
    permutationen(n - 1).forEach(function (p) {
      for (var i = 0; i <= p.length; i++) out.push(p.slice(0, i).concat([n - 1], p.slice(i)));
    });
    return out;
  }

  var WOERTER = {
    lampe: ['Lampe', 'Lampen'], schalter: ['Schalter', 'Schalter'], batterie: ['Batterie', 'Batterien'],
    motor: ['Motor', 'Motoren'], klingel: ['Klingel', 'Klingeln'], leitung: ['Leitung', 'Leitungen']
  };
  function wort(typ, n) { var w = WOERTER[typ] || [typ, typ]; return n === 1 ? w[0] : w[1]; }

  var KURZ_GRUND = 'Achtung, Kurzschluss! In mindestens einer Schalterstellung sind die Pole der Batterie nur über Leitungen und Schalter verbunden. Dann fließt ein riesiger Strom, die Leitungen werden heiß.';

  var GERAET = { lampe: 'die Lampe', motor: 'der Motor', klingel: 'die Klingel' };
  /** Beschreibt die erste Schalterstellung, in der ein Gerät falsch reagiert. */
  function hinweisText(s, schalter, f) {
    if (!f) return 'Die Geräte reagieren noch nicht so, wie es verlangt ist. Probiere mit der Hand alle Schalterstellungen aus.';
    var t = s.teile[f.last];
    var geraet = t.name || GERAET[t.typ] || 'das Gerät';
    var stellung = schalter.map(function (k, q) { return (s.teile[k].name || 'der Schalter') + ' ' + ((f.c & (1 << q)) ? 'geschlossen' : 'offen'); });
    var wenn = stellung.length ? 'Wenn ' + stellung.join(' und ') + (stellung.length > 1 ? ' sind' : ' ist') + ', soll ' : 'Hier soll ';
    return 'Teste mit der Hand: ' + wenn + geraet + (f.soll ? ' an' : ' aus') + ' sein. Bei dir ist ' + geraet + (f.ist ? ' an.' : ' aus.');
  }

  /** Prüft eine Schaltung gegen ein Missionsziel. */
  function pruefeZiel(s0, ziel) {
    var n = zaehle(s0);
    if (ziel.teile) {
      var typen = Object.keys(ziel.teile);
      for (var i = 0; i < typen.length; i++) {
        var soll = ziel.teile[typen[i]];
        if (n[typen[i]] !== soll) return { ok: false, grund: 'Benutze genau ' + soll + ' ' + wort(typen[i], soll) + '.' };
      }
    }
    if (n.batterie + n.generator === 0) return { ok: false, grund: 'Es fehlt noch die elektrische Quelle: Setze eine Batterie ein.' };

    var s = kopie(s0);
    var lasten = [];
    var schalter = [];
    Object.keys(s.teile).forEach(function (k) {
      var t = s.teile[k];
      if (t.typ === 'lampe') t.raus = false;
      if (LAST[t.typ]) lasten.push(k);
      if (t.typ === 'schalter') schalter.push(k);
    });
    var geraet = ziel.geraet || 'Lampe';
    if (ziel.lampen != null && lasten.length !== ziel.lampen) {
      return { ok: false, grund: 'Im Stromkreis sollen genau ' + ziel.lampen + ' ' + (ziel.lampen === 1 ? geraet : (ziel.geraete || geraet + 'n')) + ' sein.' };
    }
    if (ziel.schalter != null && schalter.length !== ziel.schalter) {
      return { ok: false, grund: 'Du brauchst genau ' + ziel.schalter + ' Schalter.' };
    }

    if (ziel.art === 'tabelle') {
      var mS = schalter.length;
      var tab = [];
      for (var combo = 0; combo < (1 << mS); combo++) {
        schalter.forEach(function (k, j) { s.teile[k].zu = !!(combo & (1 << j)); });
        var sim = simuliere(s);
        if (sim.kurzschluss) return { ok: false, grund: KURZ_GRUND };
        tab.push(lasten.map(function (k) { return { an: sim.teile[k].an, hell: sim.teile[k].hell }; }));
      }
      var pS = permutationen(mS);
      var pL = permutationen(lasten.length);
      var schaltetRichtig = false;
      var bester = null; // Zuordnung mit den wenigsten Abweichungen, für einen konkreten Hinweis
      for (var a = 0; a < pS.length; a++) {
        for (var b = 0; b < pL.length; b++) {
          if (ziel.typen && !ziel.typen.every(function (typ, j) { return s.teile[lasten[pL[b][j]]].typ === typ; })) continue;
          var fehler = 0, erster = null, hellGenug = true;
          for (var c = 0; c < tab.length; c++) {
            var x = pS[a].map(function (sIdx) { return !!(c & (1 << sIdx)); });
            var erwartet = ziel.regel(x);
            for (var j = 0; j < pL[b].length; j++) {
              var ist = tab[c][pL[b][j]];
              if (ist.an !== !!erwartet[j]) { fehler++; if (!erster) erster = { c: c, last: lasten[pL[b][j]], soll: !!erwartet[j], ist: ist.an }; }
              else if (ziel.voll && ist.an && ist.hell < 0.99) hellGenug = false;
            }
          }
          if (!fehler && hellGenug) return { ok: true, grund: '' };
          if (!fehler) schaltetRichtig = true;
          if (fehler && (!bester || fehler < bester.fehler)) bester = { fehler: fehler, erster: erster };
        }
      }
      if (schaltetRichtig) return { ok: false, grund: 'Das Schalten klappt, aber nicht jede Lampe leuchtet hell. Jede Lampe soll die volle Spannung der Quelle bekommen.' };
      return { ok: false, grund: hinweisText(s, schalter, bester ? bester.erster : null) + (ziel.hinweis ? ' ' + ziel.hinweis : '') };
    }

    if (ziel.art === 'reihe' || ziel.art === 'parallel') {
      schalter.forEach(function (k) { s.teile[k].zu = true; });
      var sim0 = simuliere(s);
      if (sim0.kurzschluss) return { ok: false, grund: KURZ_GRUND };
      if (!lasten.every(function (k) { return sim0.teile[k].an; })) {
        return { ok: false, grund: 'Noch leuchten nicht alle Lampen. Ist der Stromkreis geschlossen?' };
      }
      for (var li = 0; li < lasten.length; li++) {
        var s2 = kopie(s);
        delete s2.teile[lasten[li]];
        var sim2 = simuliere(s2);
        var andere = lasten.filter(function (k) { return k !== lasten[li]; });
        var alleAus = andere.every(function (k) { return !sim2.teile[k].an; });
        var alleAn = andere.every(function (k) { return sim2.teile[k].an; });
        if (ziel.art === 'reihe' && !alleAus) return { ok: false, grund: 'Dreh eine Lampe heraus: Die andere leuchtet weiter. Das ist noch keine Reihenschaltung.' };
        if (ziel.art === 'parallel' && !alleAn) return { ok: false, grund: 'Dreh eine Lampe heraus: Eine andere geht mit aus. Das ist noch keine Parallelschaltung.' };
      }
      return { ok: true, grund: '' };
    }

    return { ok: false, grund: 'Unbekanntes Ziel' };
  }

  W.schaltung = {
    U0: U0, R_LAST: R_LAST, LAST: LAST, QUELLE: QUELLE,
    neu: neu, kopie: kopie, parse: parse, enden: enden, kanten: kanten,
    setzeTeil: setzeTeil, umschalten: umschalten, zaehle: zaehle,
    simuliere: simuliere, pruefeZiel: pruefeZiel, permutationen: permutationen, wort: wort
  };
})();
