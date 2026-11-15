/* Fortschritt: nur lokal im Browser gespeichert. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var KEY = 'lichter-an-v1';
  var GUT = 0.6; // ab diesem Anteil gilt eine Übung als geschafft

  function fresh() {
    return {
      v: 1, name: '', funken: 0, ueb: {}, erkl: {}, karten: {}, stoer: {},
      pruef: { best: 0, laeufe: [] }, blitz: { best: 0 }, datum: '', ton: true, urkunde: null, begruesst: false
    };
  }

  var listeners = [];
  function emit() { listeners.forEach(function (fn) { try { fn(S.data); } catch (e) { /* weiter */ } }); }

  var S = (W.state = {
    data: fresh(),
    on: function (fn) { listeners.push(fn); },

    load: function () {
      var d = W.store.get(KEY, null);
      S.data = d && d.v === 1 ? Object.assign(fresh(), d) : fresh();
      return S.data;
    },
    save: function () { W.store.set(KEY, S.data); emit(); },
    reset: function () { S.data = fresh(); W.store.remove(KEY); emit(); },

    setName: function (n) { S.data.name = String(n || '').trim().slice(0, 30); S.save(); },
    setDatum: function (iso) { S.data.datum = iso || ''; S.save(); },
    setTon: function (an) { S.data.ton = !!an; S.save(); },
    set: function (feld, wert) { S.data[feld] = wert; S.save(); },

    addFunken: function (n) {
      if (!(n > 0)) return 0;
      S.data.funken += n;
      S.save();
      return n;
    },

    /** Ergebnis einer Übung speichern; Funken gibt es nur für Verbesserungen. */
    recordUebung: function (id, score) {
      var prev = S.data.ueb[id];
      var vorher = prev ? W.logic.funkenFuer(prev.best) : 0;
      var best = prev ? Math.max(prev.best, score) : score;
      S.data.ueb[id] = { best: best, tries: (prev ? prev.tries : 0) + 1 };
      var gewinn = W.logic.funkenFuer(best) - vorher;
      if (gewinn > 0) S.data.funken += gewinn;
      S.save();
      return gewinn;
    },
    uebungBest: function (id) { return S.data.ueb[id] ? S.data.ueb[id].best : null; },

    /* Störungen: falsch beantwortete Aufgaben, behoben nach 2x richtig in Folge */
    stoerungFalsch: function (itemId) { S.data.stoer[itemId] = 0; S.save(); },
    stoerungRichtig: function (itemId) {
      if (!(itemId in S.data.stoer)) return false;
      S.data.stoer[itemId]++;
      var behoben = S.data.stoer[itemId] >= 2;
      if (behoben) delete S.data.stoer[itemId];
      S.save();
      return behoben;
    },
    stoerungen: function () { return Object.keys(S.data.stoer); },

    /* Verstehen-Karten: höchster gesehener Index je Stadtteil */
    markKarte: function (stId, idx) {
      if ((S.data.karten[stId] == null ? -1 : S.data.karten[stId]) < idx) { S.data.karten[stId] = idx; S.save(); }
    },
    karte: function (stId) { return S.data.karten[stId] == null ? -1 : S.data.karten[stId]; },

    erklaeren: function (id) { return S.data.erkl[id] || { text: '', punkte: [], gezeigt: false }; },
    saveErklaeren: function (id, patch) {
      S.data.erkl[id] = Object.assign({}, S.erklaeren(id), patch);
      S.save();
    },

    /** Fortschritt eines Stadtteils (0..1) und ob er "leuchtet" */
    stadtteilFortschritt: function (st) {
      var k = st.karten.length ? Math.min(1, (S.karte(st.id) + 1) / st.karten.length) : 1;
      var u = 0, alleGut = true;
      st.uebungen.forEach(function (ub) {
        var b = S.uebungBest(ub.id) || 0;
        u += b;
        if (b < GUT) alleGut = false;
      });
      u = st.uebungen.length ? u / st.uebungen.length : 1;
      var gez = st.erklaeren.filter(function (e) { return S.erklaeren(e.id).gezeigt; }).length;
      var e = st.erklaeren.length ? Math.min(1, gez) : 1;
      var fertig = k >= 1 && alleGut && e >= 1;
      // Ein fertiger Stadtteil leuchtet ganz, sonst höchstens 95 %
      var p = fertig ? 1 : Math.min(0.95, 0.2 * k + 0.6 * u + 0.2 * e);
      return { p: p, fertig: fertig, karten: k, uebungen: u };
    },

    recordPruefung: function (run) {
      S.data.pruef.laeufe.push(run);
      if (S.data.pruef.laeufe.length > 10) S.data.pruef.laeufe.shift();
      var q = run.n ? run.score / run.n : 0;
      S.data.pruef.best = Math.max(S.data.pruef.best || 0, q);
      if (q >= 0.8 && !S.data.urkunde) S.data.urkunde = run.datum;
      S.save();
    },

    /** Fortschritt als Text zum Sichern oder Übertragen auf ein anderes Gerät */
    exportCode: function () { return 'LICHTER-AN:' + JSON.stringify(S.data); },
    importCode: function (code) {
      var t = String(code || '').trim();
      if (t.indexOf('LICHTER-AN:') !== 0) return false;
      try {
        var d = JSON.parse(t.slice(11));
        if (!d || d.v !== 1) return false;
        S.data = Object.assign(fresh(), d);
        S.save();
        return true;
      } catch (e) { return false; }
    },

    recordBlitz: function (punkte) {
      var neu = punkte > (S.data.blitz.best || 0);
      if (neu) S.data.blitz.best = punkte;
      S.save();
      return neu;
    }
  });
})();
