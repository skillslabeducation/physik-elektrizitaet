/* Zeichnet Schaltungen als Schaltplan (SVG) mit genormten Schaltzeichen. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var s = function () { return W.s.apply(null, arguments); };
  var G = 80;   // Rasterabstand
  var M = 34;   // Rand
  var zaehler = 0;

  function fmt(x, stellen) { return x.toFixed(stellen).replace('.', ','); }
  /** Stromstärke: bis zu drei Nachkommastellen, mindestens zwei (0,25 / 0,125 / 0,50) */
  function fmtI(x) {
    var t = (Math.round(x * 1000) / 1000).toFixed(3);
    if (t.charAt(t.length - 1) === '0') t = t.slice(0, -1);
    return t.replace('.', ',');
  }

  /* Ein Schaltzeichen in lokalen Koordinaten: Leitung von (0,0) nach (G,0), Mitte bei G/2. */
  function symbolLokal(typ, t, r) {
    t = t || {};
    r = r || {};
    var c = G / 2;
    var g = s('g', { class: 'sb-sym sb-' + typ });
    function draht(x1, x2) { g.appendChild(s('line', { class: 'sb-draht', x1: x1, y1: 0, x2: x2, y2: 0 })); }
    switch (typ) {
      case 'leitung':
        draht(0, G);
        break;
      case 'lampe':
        draht(0, c - 13); draht(c + 13, G);
        if (t.raus) {
          g.appendChild(s('circle', { class: 'sb-fassung', cx: c, cy: 0, r: 13 }));
        } else {
          var hell = r.hell || 0;
          if (r.an) {
            var h1 = Math.min(1, hell);
            g.appendChild(s('circle', { class: 'sb-schein', cx: c, cy: 0, r: 16 + 18 * h1, style: { opacity: String(0.2 + 0.8 * h1) } }));
          }
          g.appendChild(s('circle', { class: 'sb-kolben' + (r.an ? ' an' : '') + (r.zuViel ? ' kaputt' : ''), cx: c, cy: 0, r: 13, style: r.an ? { fillOpacity: String(0.25 + 0.75 * Math.min(1, hell)) } : null }));
          var d = 9.2;
          g.appendChild(s('path', { class: 'sb-linie', d: 'M' + (c - d) + ' ' + (-d) + 'L' + (c + d) + ' ' + d + 'M' + (c - d) + ' ' + d + 'L' + (c + d) + ' ' + (-d) }));
        }
        break;
      case 'schalter':
        draht(0, c - 14); draht(c + 14, G);
        g.appendChild(s('circle', { class: 'sb-kontakt', cx: c - 14, cy: 0, r: 3 }));
        g.appendChild(s('circle', { class: 'sb-kontakt', cx: c + 14, cy: 0, r: 3 }));
        g.appendChild(s('line', { class: 'sb-hebel' + (t.zu ? ' zu' : ''), x1: c - 14, y1: 0, x2: t.zu ? c + 14 : c + 11, y2: t.zu ? 0 : -15 }));
        break;
      case 'batterie':
        var plusX = t.dreh ? c + 4 : c - 4;
        var minusX = t.dreh ? c - 4 : c + 4;
        draht(0, c - 4); draht(c + 4, G);
        g.appendChild(s('line', { class: 'sb-platte-lang', x1: plusX, y1: -17, x2: plusX, y2: 17 }));
        g.appendChild(s('line', { class: 'sb-platte-kurz', x1: minusX, y1: -8, x2: minusX, y2: 8 }));
        break;
      case 'motor':
        draht(0, c - 13); draht(c + 13, G);
        g.appendChild(s('circle', { class: 'sb-gehaeuse' + (r.an ? ' an' : ''), cx: c, cy: 0, r: 13 }));
        break;
      case 'klingel':
        draht(0, c - 12); draht(c + 12, G);
        g.appendChild(s('path', { class: 'sb-glocke' + (r.an ? ' an' : ''), d: 'M' + (c - 12) + ' 0 A12 12 0 0 1 ' + (c + 12) + ' 0 Z' }));
        break;
      /* Nur zum Anschauen (Schaltzeichen-Tafel) */
      case 'quelle':
      case 'generator': /* Dynamo: im Buch (S. 119) als elektrische Quelle gezeichnet */
        draht(0, c - 9); draht(c + 9, G);
        g.appendChild(s('circle', { class: 'sb-offen', cx: c - 6, cy: 0, r: 3.5 }));
        g.appendChild(s('circle', { class: 'sb-offen', cx: c + 6, cy: 0, r: 3.5 }));
        break;
      case 'sicherung':
        draht(0, G);
        g.appendChild(s('rect', { class: 'sb-kasten', x: c - 16, y: -7, width: 32, height: 14 }));
        break;
      case 'geraet':
        draht(0, c - 13); draht(c + 13, G);
        g.appendChild(s('rect', { class: 'sb-kasten', x: c - 13, y: -11, width: 26, height: 22 }));
        break;
      case 'diode':
      case 'led':
        draht(0, c - 9); draht(c + 9, G);
        g.appendChild(s('path', { class: 'sb-dreieck', d: 'M' + (c - 9) + ' -10 L' + (c + 9) + ' 0 L' + (c - 9) + ' 10 Z' }));
        g.appendChild(s('line', { class: 'sb-linie', x1: c + 9, y1: -10, x2: c + 9, y2: 10 }));
        if (typ === 'led') {
          g.appendChild(s('path', { class: 'sb-linie', d: 'M' + (c - 1) + ' -13 l7 -9 m-5 0 h5 v5 M' + (c + 6) + ' -11 l7 -9 m-5 0 h5 v5' }));
        }
        break;
      case 'messgeraet':
        draht(0, c - 13); draht(c + 13, G);
        g.appendChild(s('circle', { class: 'sb-gehaeuse', cx: c, cy: 0, r: 13 }));
        g.appendChild(s('path', { class: 'sb-linie', d: 'M' + (c - 8) + ' 8 L' + (c + 8) + ' -8 m-6 0 h6 v6' }));
        break;
      case 'anschluss':
        draht(0, G);
        g.appendChild(s('line', { class: 'sb-draht', x1: c, y1: 0, x2: c, y2: 18 }));
        g.appendChild(s('circle', { class: 'sb-punkt', cx: c, cy: 0, r: 4 }));
        break;
      case 'erdung':
        g.appendChild(s('line', { class: 'sb-draht', x1: c, y1: -16, x2: c, y2: 2 }));
        g.appendChild(s('path', { class: 'sb-linie', d: 'M' + (c - 13) + ' 2 h26 M' + (c - 8) + ' 8 h16 M' + (c - 3) + ' 14 h6' }));
        break;
    }
    return g;
  }

  /** Einzelnes Schaltzeichen als kleines SVG (Palette, Zuordnen, Tafel). */
  function symbol(typ, opts) {
    opts = opts || {};
    var t = { zu: !!opts.zu };
    var svg = s('svg', { class: 'sb sb-einzeln', viewBox: '-4 -26 ' + (G + 8) + ' 52', role: 'img', 'aria-label': opts.label || typ });
    svg.appendChild(symbolLokal(typ, t, {}));
    if (typ === 'motor') svg.appendChild(s('text', { class: 'sb-m', x: G / 2, y: 5.5 }, 'M'));
    if (typ === 'batterie') {
      svg.appendChild(s('text', { class: 'sb-pol', x: G / 2 - 12, y: -12 }, '+'));
      svg.appendChild(s('text', { class: 'sb-pol', x: G / 2 + 12, y: -12 }, '−'));
    }
    return svg;
  }

  function knoten(c, r) { return [M + c * G, M + r * G]; }

  /** Abstand eines Punktes von einer Strecke a-b */
  function abstand(px, py, a, b) {
    var dx = b[0] - a[0], dy = b[1] - a[1];
    var t = ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy);
    t = Math.max(0, Math.min(1, t));
    var x = a[0] + t * dx - px, y = a[1] + t * dy - py;
    return Math.sqrt(x * x + y * y);
  }

  /**
   * Schaltplan zeichnen.
   * opts: sim, raster, zuschneiden, messwerte, namen (default true), onKante(key), markiert {key:true}, klickbar {key:true}
   */
  function zeichne(sc, opts) {
    opts = opts || {};
    var sim = opts.sim || W.schaltung.simuliere(sc);
    var id = 'sb' + (++zaehler);
    var breite = 2 * M + (sc.cols - 1) * G;
    var hoehe = 2 * M + (sc.rows - 1) * G;
    var vb = [0, 0, breite, hoehe];

    if (opts.zuschneiden) {
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      Object.keys(sc.teile).forEach(function (k) {
        W.schaltung.enden(k).forEach(function (p) {
          var xy = knoten(p[0], p[1]);
          minX = Math.min(minX, xy[0]); maxX = Math.max(maxX, xy[0]);
          minY = Math.min(minY, xy[1]); maxY = Math.max(maxY, xy[1]);
        });
      });
      if (minX < Infinity) {
        var rand = 30;
        // rechts mehr Platz für Beschriftungen senkrechter Bauteile (L2, S1 …)
        vb = [minX - rand, minY - rand, maxX - minX + 2 * rand + 18, maxY - minY + 2 * rand];
      }
    }

    var svg = s('svg', {
      class: 'sb' + (sim.kurzschluss ? ' kurzschluss' : '') + (opts.raster ? ' mit-raster' : ''),
      viewBox: vb.join(' '), role: 'img',
      'aria-label': opts.label || 'Schaltplan'
    });
    svg.appendChild(s('defs', null,
      s('radialGradient', { id: id + 'g' },
        s('stop', { offset: '0%', 'stop-color': '#ffe27a', 'stop-opacity': '0.95' }),
        s('stop', { offset: '45%', 'stop-color': '#ffc531', 'stop-opacity': '0.45' }),
        s('stop', { offset: '100%', 'stop-color': '#ffc531', 'stop-opacity': '0' }))));

    // Rasterpunkte und freie Kanten
    if (opts.raster) {
      var rg = s('g', { class: 'sb-raster' });
      W.schaltung.kanten(sc.cols, sc.rows).forEach(function (k) {
        if (sc.teile[k]) return;
        var e = W.schaltung.enden(k);
        var a = knoten(e[0][0], e[0][1]), b = knoten(e[1][0], e[1][1]);
        rg.appendChild(s('line', { class: 'sb-frei', x1: a[0], y1: a[1], x2: b[0], y2: b[1], 'data-key': k }));
      });
      for (var r0 = 0; r0 < sc.rows; r0++) for (var c0 = 0; c0 < sc.cols; c0++) {
        var p0 = knoten(c0, r0);
        rg.appendChild(s('circle', { class: 'sb-knoten', cx: p0[0], cy: p0[1], r: 3.5 }));
      }
      svg.appendChild(rg);
    }

    // Leuchtspur unter stromführenden Leitungen
    var spur = s('g', { class: 'sb-spur' });
    svg.appendChild(spur);

    var teileG = s('g', { class: 'sb-teile' });
    var texte = s('g', { class: 'sb-texte' });
    var grad = {};

    Object.keys(sc.teile).forEach(function (k) {
      var t = sc.teile[k];
      var r = sim.teile[k] || {};
      var e = W.schaltung.enden(k);
      var a = knoten(e[0][0], e[0][1]);
      var vertikal = k.charAt(0) === 'v';
      grad[e[0].join(',')] = (grad[e[0].join(',')] || 0) + 1;
      grad[e[1].join(',')] = (grad[e[1].join(',')] || 0) + 1;

      var cx = a[0] + (vertikal ? 0 : G / 2);
      var cy = a[1] + (vertikal ? G / 2 : 0);
      var gruppe = s('g', {
        class: 'sb-teil sb-teil--' + t.typ + (r.an ? ' an' : '') + (opts.markiert && opts.markiert[k] ? ' markiert' : ''),
        transform: 'translate(' + a[0] + ' ' + a[1] + ')' + (vertikal ? ' rotate(90)' : ''),
        'data-key': k
      });
      var sym = symbolLokal(t.typ, t, r);
      sym.querySelectorAll('.sb-schein').forEach(function (el) { el.setAttribute('fill', 'url(#' + id + 'g)'); });
      gruppe.appendChild(sym);
      teileG.appendChild(gruppe);

      if (r.an && (t.typ === 'leitung' || t.typ === 'schalter' || W.schaltung.LAST[t.typ] || W.schaltung.QUELLE[t.typ])) {
        var b = knoten(e[1][0], e[1][1]);
        spur.appendChild(s('line', { class: 'sb-strom', x1: a[0], y1: a[1], x2: b[0], y2: b[1] }));
      }

      // Beschriftungen in absoluten Koordinaten (nicht mitgedreht)
      if (t.typ === 'motor') texte.appendChild(s('text', { class: 'sb-m', x: cx, y: cy + 5.5 }, 'M'));
      if (W.schaltung.QUELLE[t.typ]) {
        var links = t.dreh ? 1 : -1; // Pluspol: lange Platte
        var px = vertikal ? cx - 18 : cx + links * 13;
        var py = vertikal ? cy + links * 13 + 5 : cy - 18;
        var mx = vertikal ? cx - 18 : cx - links * 13;
        var my = vertikal ? cy - links * 13 + 5 : cy - 18;
        texte.appendChild(s('text', { class: 'sb-pol plus', x: px, y: py }, '+'));
        texte.appendChild(s('text', { class: 'sb-pol minus', x: mx, y: my }, '−'));
      }
      if (t.name && opts.namen !== false) {
        texte.appendChild(s('text', { class: 'sb-name', x: vertikal ? cx + 22 : cx, y: vertikal ? cy + 5 : cy + 32, 'text-anchor': vertikal ? 'start' : 'middle' }, t.name));
      }
      if (t.typ === 'lampe' && t.raus) {
        texte.appendChild(s('text', { class: 'sb-hinweis', x: vertikal ? cx - 20 : cx, y: vertikal ? cy + 4 : cy - 20, 'text-anchor': vertikal ? 'end' : 'middle' }, 'raus'));
      }
      if (t.typ === 'lampe' && r.zuViel) {
        texte.appendChild(s('text', { class: 'sb-hinweis warn', x: vertikal ? cx - 20 : cx, y: vertikal ? cy + 4 : cy - 22, 'text-anchor': vertikal ? 'end' : 'middle' }, 'durchgebrannt'));
      }
    });
    svg.appendChild(teileG);

    // Verzweigungspunkte
    var punkte = s('g', { class: 'sb-punkte' });
    Object.keys(grad).forEach(function (kk) {
      if (grad[kk] < 3) return;
      var p = kk.split(',');
      var xy = knoten(+p[0], +p[1]);
      punkte.appendChild(s('circle', { class: 'sb-punkt', cx: xy[0], cy: xy[1], r: 4.5 }));
    });
    svg.appendChild(punkte);
    svg.appendChild(texte);

    // Tippflächen
    if (opts.onKante) {
      var tg = s('g', { class: 'sb-treffer' });
      var keys = opts.nurTeile ? Object.keys(sc.teile) : W.schaltung.kanten(sc.cols, sc.rows);
      keys.forEach(function (k) {
        if (opts.klickbar && !opts.klickbar[k]) return;
        var e = W.schaltung.enden(k);
        var a = knoten(e[0][0], e[0][1]), b = knoten(e[1][0], e[1][1]);
        var inset = 12;
        var dx = Math.sign(b[0] - a[0]) * inset, dy = Math.sign(b[1] - a[1]) * inset;
        var hit = s('line', {
          class: 'sb-hit', x1: a[0] + dx, y1: a[1] + dy, x2: b[0] - dx, y2: b[1] - dy, 'data-key': k,
          tabindex: '0', role: 'button', 'aria-label': beschreibe(sc, k)
        });
        hit.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); opts.onKante(k); }
        });
        tg.appendChild(hit);
      });
      svg.appendChild(tg);
      var kandidaten = keys.filter(function (k) { return !opts.klickbar || opts.klickbar[k]; }).map(function (k) {
        var e = W.schaltung.enden(k);
        return { k: k, a: knoten(e[0][0], e[0][1]), b: knoten(e[1][0], e[1][1]) };
      });
      var flaeche = s('rect', { class: 'sb-flaeche', x: vb[0], y: vb[1], width: vb[2], height: vb[3], 'aria-hidden': 'true' });
      flaeche.addEventListener('click', function (ev) {
        var m = svg.getScreenCTM ? svg.getScreenCTM() : null;
        if (!m) return;
        var pt = svg.createSVGPoint();
        pt.x = ev.clientX; pt.y = ev.clientY;
        var q = pt.matrixTransform(m.inverse());
        var best = null, bd = Infinity;
        kandidaten.forEach(function (c) {
          var d = abstand(q.x, q.y, c.a, c.b);
          if (d < bd) { bd = d; best = c.k; }
        });
        if (best && bd <= G * 0.5) opts.onKante(best);
      });
      svg.appendChild(flaeche);
    }
    return svg;
  }

  var NAMEN = { leitung: 'Leitung', lampe: 'Lampe', schalter: 'Schalter', batterie: 'Batterie', generator: 'Dynamo', motor: 'Motor', klingel: 'Klingel',
    quelle: 'elektrische Quelle', sicherung: 'Sicherung', geraet: 'Gerät', diode: 'Diode', led: 'Leuchtdiode', messgeraet: 'Messgerät', anschluss: 'Anschlussstelle', erdung: 'Erdung' };
  /** Wie das Schaltzeichen aussieht (für Lösungstexte) */
  var AUSSEHEN = { leitung: 'gerade Linie', lampe: 'Kreis mit Kreuz', schalter: 'unterbrochene Linie mit schrägem Hebel', batterie: 'langer dünner und kurzer dicker Strich', generator: 'zwei kleine Kreise', motor: 'Kreis mit M', klingel: 'Halbkreis',
    quelle: 'zwei kleine Kreise', sicherung: 'Rechteck mit durchgehender Linie', geraet: 'leeres Rechteck', diode: 'Dreieck mit Querstrich', led: 'Dreieck mit Querstrich und zwei Pfeilen', messgeraet: 'Kreis mit schrägem Pfeil', anschluss: 'dicker Punkt mit Abzweig', erdung: 'drei kürzer werdende Striche' };
  function beschreibe(sc, k) {
    var t = sc.teile[k];
    if (!t) return 'Leerer Platz ' + k;
    var txt = (NAMEN[t.typ] || t.typ) + (t.name ? ' ' + t.name : '');
    if (t.typ === 'schalter') txt += t.zu ? ', geschlossen' : ', offen';
    if (t.typ === 'lampe' && t.raus) txt += ', herausgedreht';
    return txt;
  }

  /** Messwerte als Tabelle: Quelle und jedes Gerät mit Stromstärke und Spannung. */
  function messTabelle(sc, sim) {
    var h = W.h;
    var zeilen = [];
    var batt = Object.keys(sc.teile).filter(function (k) { return W.schaltung.QUELLE[sc.teile[k].typ]; });
    batt.forEach(function (k, i) {
      zeilen.push([(NAMEN[sc.teile[k].typ] || 'Quelle') + (batt.length > 1 ? ' ' + (i + 1) : ' (Quelle)'), sim.teile[k].I, sim.teile[k].U]);
    });
    Object.keys(sc.teile).filter(function (k) { return W.schaltung.LAST[sc.teile[k].typ]; })
      .sort(function (a, b) { return (sc.teile[a].name || sc.teile[a].typ).localeCompare(sc.teile[b].name || sc.teile[b].typ); })
      .forEach(function (k) {
        var t = sc.teile[k];
        zeilen.push([(NAMEN[t.typ] || t.typ) + (t.name ? ' ' + t.name : '') + (t.raus ? ' (raus)' : ''), sim.teile[k].I, sim.teile[k].U]);
      });
    return h('table', { class: 'tabelle messwerte' },
      h('thead', null, h('tr', null, h('th', null, 'Bauteil'), h('th', null, 'Stromstärke I'), h('th', null, 'Spannung U'))),
      h('tbody', null, zeilen.map(function (z) {
        return h('tr', null, h('td', null, z[0]), h('td', null, fmtI(z[1] || 0) + ' A'), h('td', null, z[2] == null ? '–' : fmt(z[2], 1) + ' V'));
      })));
  }

  W.schaltbild = { zeichne: zeichne, symbol: symbol, messTabelle: messTabelle, NAMEN: NAMEN, AUSSEHEN: AUSSEHEN, fmt: fmt, fmtI: fmtI };
})();
