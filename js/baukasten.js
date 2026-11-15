/* Schaltungsbaukasten: Bauteile auf ein Raster setzen, live simulieren, Missionen prüfen. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var h = function () { return W.h.apply(null, arguments); };
  var SC = function () { return W.schaltung; };

  var REIHENFOLGE = ['leitung', 'batterie', 'generator', 'lampe', 'schalter', 'motor', 'klingel'];
  var LABEL = { leitung: 'Leitung', batterie: 'Batterie', generator: 'Dynamo', lampe: 'Lampe', schalter: 'Schalter', motor: 'Motor', klingel: 'Klingel', hand: 'Hand', radierer: 'Löschen' };

  function iconHand() {
    return W.frag('<svg viewBox="0 0 56 34" aria-hidden="true"><path d="M22 30c-4-3-8-8-9-11-1-2 1-3 3-2l3 3V7c0-2 3-2 3 0v9-12c0-2 3-2 3 0v12-10c0-2 3-2 3 0v10-7c0-2 3-2 3 0v13c0 6-3 9-6 9z" fill="#fff" stroke="#1c2340" stroke-width="2.2" stroke-linejoin="round"/></svg>');
  }
  function iconRadierer() {
    return W.frag('<svg viewBox="0 0 56 34" aria-hidden="true"><path d="M18 26l16-16 8 8-12 12h-8z" fill="#fbe7e5" stroke="#1c2340" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 20l8 8M14 30h28" stroke="#1c2340" stroke-width="2.2" stroke-linecap="round"/></svg>');
  }

  /**
   * opts: cols, rows, schaltung, dsl, palette {typ:anzahl}, ziel, onGeloest(sc), fest {key:true},
   *       nurTesten (nur Hand), messwerte (Startwert), tipp (Text)
   */
  function mount(host, opts) {
    opts = opts || {};
    var cols = opts.cols || 5, rows = opts.rows || 4;
    var sc;
    if (opts.schaltung) sc = SC().kopie(opts.schaltung);
    else if (opts.dsl) sc = SC().parse(cols, rows, opts.dsl);
    else sc = SC().neu(cols, rows);
    var start = SC().kopie(sc);
    var fest = opts.fest || {};
    if (opts.festAlles) Object.keys(sc.teile).forEach(function (k) { fest[k] = true; });
    var palette = opts.palette || { leitung: Infinity, batterie: 1, lampe: 3, schalter: 3, motor: 1, klingel: 1 };
    var werkzeug = opts.nurTesten ? 'hand' : 'leitung';
    var messwerte = !!opts.messwerte;
    var warKurz = false;
    var geloest = false;

    var wurzel = h('div', { class: 'bk' + (opts.nurTesten ? ' bk--test' : '') });
    var leiste = h('div', { class: 'bk__werkzeuge', role: 'toolbar', 'aria-label': 'Bauteile' });
    var feld = h('div', { class: 'bk__feld' });
    var status = h('div', { class: 'bk__status', 'aria-live': 'polite' });
    var mess = h('div', { class: 'bk__mess' });
    var knoepfe = h('div', { class: 'bk__leiste' });
    if (!opts.nurTesten) { wurzel.appendChild(leiste); wurzel.appendChild(status); }
    wurzel.appendChild(feld);
    wurzel.appendChild(mess);
    if (opts.nurTesten) wurzel.appendChild(status);
    wurzel.appendChild(knoepfe);
    if (opts.tipp !== false) {
      var hatSchalter = SC().zaehle(sc).schalter > 0;
      wurzel.appendChild(h('p', { class: 'bk__tipp' }, opts.tipp || (opts.nurTesten
        ? (hatSchalter ? 'Tippe auf einen Schalter, um ihn umzulegen. Tippe auf eine Lampe, um sie herauszudrehen.' : 'Tippe auf eine Lampe, um sie herauszudrehen oder wieder hineinzudrehen.')
        : 'Wähle oben ein Bauteil und tippe auf eine Linie zwischen zwei Punkten. Mit der Hand legst du Schalter um, drehst Lampen heraus und drehst Batterien um.')));
    }
    host.appendChild(wurzel);

    function uebrig(typ) {
      var max = palette[typ];
      if (max == null) return 0;
      if (max === Infinity) return Infinity;
      return max - SC().zaehle(sc)[typ];
    }

    function zeichneLeiste() {
      leiste.innerHTML = '';
      var typen = REIHENFOLGE.filter(function (t) { return palette[t] != null && palette[t] !== 0; }).concat(['hand', 'radierer']);
      typen.forEach(function (t) {
        var rest = (t === 'hand' || t === 'radierer') ? null : uebrig(t);
        var btn = h('button', {
          class: 'bk__wz', type: 'button', 'aria-pressed': String(werkzeug === t),
          onclick: function () { werkzeug = t; W.ton.klick(); zeichneLeiste(); }
        },
        t === 'hand' ? iconHand() : t === 'radierer' ? iconRadierer() : W.schaltbild.symbol(t),
        h('span', null, LABEL[t]),
        rest != null && rest !== Infinity ? h('span', { class: 'bk__wz-anzahl' }, 'noch ' + rest) : null);
        leiste.appendChild(btn);
      });
    }

    function tippe(k) {
      var t = sc.teile[k];
      if (werkzeug === 'hand') {
        if (!t) return;
        if (t.typ === 'schalter' || t.typ === 'lampe' || SC().QUELLE[t.typ]) { SC().umschalten(sc, k); W.ton.klick(); }
        else return;
      } else {
        if (fest[k]) { W.toast('Dieses Teil gehört zur Aufgabe. Mit der Hand kannst du es benutzen.'); return; }
        if (werkzeug === 'radierer') {
          if (!t) return;
          SC().setzeTeil(sc, k, null);
        } else if (t && t.typ === werkzeug && t.typ === 'schalter') {
          SC().umschalten(sc, k); // gleiches Werkzeug auf Schalter: umlegen
        } else if (t && t.typ === werkzeug) {
          SC().setzeTeil(sc, k, null);
        } else {
          if (uebrig(werkzeug) <= 0) {
            W.toast('Keine ' + (werkzeug === 'batterie' ? 'Batterie' : SC().wort(werkzeug, 2)) + ' mehr übrig.');
            return;
          }
          SC().setzeTeil(sc, k, werkzeug);
        }
        W.ton.klick();
        geloest = false;
        zeichneLeiste();
      }
      zeichne();
    }

    function zeichne() {
      var sim = SC().simuliere(sc);
      feld.innerHTML = '';
      feld.appendChild(W.schaltbild.zeichne(sc, {
        sim: sim, raster: !opts.nurTesten, zuschneiden: !!opts.nurTesten,
        onKante: tippe, nurTeile: !!opts.nurTesten, label: 'Baukasten'
      }));
      mess.innerHTML = '';
      if (messwerte) mess.appendChild(W.schaltbild.messTabelle(sc, sim));
      // Status
      status.className = 'bk__status';
      var n = SC().zaehle(sc);
      var lasten = Object.keys(sc.teile).filter(function (k) { return SC().LAST[sc.teile[k].typ]; });
      var an = lasten.filter(function (k) { return sim.teile[k].an; }).length;
      var kaputt = lasten.some(function (k) { return sim.teile[k].zuViel; });
      if (sim.kurzschluss) {
        status.className += ' warn';
        status.textContent = 'Kurzschluss! Die Pole der Batterie sind nur über Leitungen verbunden. Es fließt ein riesiger Strom, die Leitungen werden heiß.';
        if (!warKurz) W.ton.bzzt();
      } else if (sim.gegeneinander) {
        status.className += ' warn';
        status.textContent = 'Nichts leuchtet, obwohl der Stromkreis geschlossen ist: Die Quellen sind gegeneinander geschaltet, ihre Spannungen heben sich auf. Dreh eine Quelle mit der Hand um.';
      } else if (kaputt) {
        status.className += ' warn';
        status.textContent = 'Zu hohe Spannung: Eine Lampe ist durchgebrannt. Jetzt ist der Stromkreis dort unterbrochen. Jede Lampe verträgt nur 6 V.';
      } else if (n.batterie + n.generator === 0) {
        status.textContent = lasten.length ? 'Ohne elektrische Quelle leuchtet nichts. Setze eine Batterie ein.' : 'Baue einen Stromkreis: Batterie, Lampe und Leitungen.';
      } else if (!lasten.length) {
        status.textContent = 'Es fehlt noch ein Gerät, zum Beispiel eine Lampe.';
      } else {
        var wort = W.schaltung.wort('lampe', lasten.length);
        var geraete = lasten.every(function (k) { return sc.teile[k].typ === 'lampe'; }) ? wort : (lasten.length === 1 ? 'Gerät' : 'Geräten');
        status.textContent = an === 0
          ? 'Der Stromkreis ist nicht geschlossen. Nichts leuchtet.'
          : an + ' von ' + lasten.length + ' ' + geraete + ' ' + (an === 1 ? 'ist' : 'sind') + ' an.' + (messwerte ? ' Quelle: ' + W.schaltbild.fmtI(sim.quelle.I) + ' A.' : '');
        if (geloest) { status.className += ' gut'; }
      }
      warKurz = sim.kurzschluss;
    }

    function zeichneKnoepfe() {
      knoepfe.innerHTML = '';
      if (opts.ziel) {
        knoepfe.appendChild(h('button', { class: 'btn btn--licht', type: 'button', onclick: pruefen }, 'Schaltung prüfen'));
      }
      knoepfe.appendChild(h('button', {
        class: 'btn btn--rahmen btn--klein', type: 'button', 'aria-pressed': String(messwerte),
        onclick: function () { messwerte = !messwerte; zeichneKnoepfe(); zeichne(); }
      }, messwerte ? 'Messwerte ausblenden' : 'Messwerte zeigen'));
      if (!opts.nurTesten) {
        knoepfe.appendChild(h('button', {
          class: 'btn btn--rahmen btn--klein', type: 'button',
          onclick: function () { sc = SC().kopie(start); geloest = false; zeichneLeiste(); zeichne(); }
        }, 'Von vorn'));
      }
    }

    function pruefen() {
      var r = SC().pruefeZiel(sc, opts.ziel);
      if (r.ok) {
        geloest = true;
        W.ton.an();
        zeichne();
        status.className = 'bk__status gut';
        status.textContent = opts.ziel.lob || 'Geschafft! Die Schaltung macht genau, was verlangt ist.';
        if (opts.onGeloest) opts.onGeloest(sc);
      } else {
        W.ton.falsch();
        status.className = 'bk__status warn';
        status.textContent = r.grund;
        if (opts.onFehlversuch) opts.onFehlversuch(r.grund);
      }
    }

    zeichneLeiste();
    zeichneKnoepfe();
    zeichne();
    return {
      schaltung: function () { return sc; },
      pruefen: pruefen
    };
  }

  W.baukasten = { mount: mount };
})();
