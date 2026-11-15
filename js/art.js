/* Grafiken: nächtliche Hafenstadt (Fortschritt), Leitstellen-Avatar, Schaubilder für Aufgaben. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var s = function () { return W.s.apply(null, arguments); };
  var h = function () { return W.h.apply(null, arguments); };

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var SIL = '#0c1230';   // Silhouetten
  var SIL2 = '#111a40';

  /* ---------- Stadt ---------- */

  function fensterRaster(g, liste, x, y, spalten, zeilen, w, hh, dx, dy) {
    for (var r = 0; r < zeilen; r++) for (var c = 0; c < spalten; c++) {
      var f = s('rect', { class: 'fenster', x: x + c * dx, y: y + r * dy, width: w, height: hh, rx: 1 });
      g.appendChild(f); liste.push(f);
    }
  }

  var VIERTEL = {
    ladung: function (g, f) {
      g.appendChild(s('path', { d: 'M0 360 C 30 320 60 296 95 296 C 120 296 135 320 150 360 Z', fill: SIL2 }));
      g.appendChild(s('rect', { x: 60, y: 206, width: 24, height: 96, fill: SIL }));
      g.appendChild(s('path', { d: 'M56 208 h32 a16 16 0 0 0 -32 0 z', fill: SIL }));
      g.appendChild(s('path', { d: 'M72 192 v-22 M60 172 h24 M62 166 a4 4 0 1 0 0.1 0 M82 166 a4 4 0 1 0 0.1 0', stroke: SIL, 'stroke-width': 3, fill: 'none' }));
      fensterRaster(g, f, 67, 222, 1, 4, 10, 9, 0, 19);
      g.appendChild(s('rect', { x: 104, y: 318, width: 34, height: 42, fill: SIL }));
      g.appendChild(s('path', { d: 'M100 320 l21 -16 l21 16 z', fill: SIL }));
      fensterRaster(g, f, 110, 328, 2, 2, 8, 8, 14, 14);
    },
    stromkreis: function (g, f) {
      [[150, 44, 96], [196, 50, 124], [248, 42, 104]].forEach(function (hs, i) {
        var x = hs[0], w = hs[1], hh = hs[2], top = 360 - hh;
        g.appendChild(s('rect', { x: x, y: top, width: w, height: hh, fill: i === 1 ? SIL2 : SIL }));
        // Treppengiebel
        var st = w / 6;
        g.appendChild(s('path', { d: 'M' + x + ' ' + top + ' v-8 h' + st + ' v-8 h' + st + ' v-8 h' + (2 * st) + ' v8 h' + st + ' v8 h' + st + ' v8 z', fill: i === 1 ? SIL2 : SIL }));
        fensterRaster(g, f, x + 7, top + 10, 3, Math.floor((hh - 20) / 22), 8, 11, (w - 22) / 2, 22);
      });
    },
    reihe: function (g, f) {
      // Kran
      g.appendChild(s('path', { d: 'M332 360 V214 M346 360 V214 M332 214 H346 M332 250 L346 280 M346 250 L332 280 M332 300 L346 330 M346 300 L332 330', stroke: SIL, 'stroke-width': 4, fill: 'none' }));
      g.appendChild(s('path', { d: 'M296 214 H440 M300 206 L339 196 L440 206', stroke: SIL, 'stroke-width': 4, fill: 'none' }));
      g.appendChild(s('path', { d: 'M412 214 V292', stroke: SIL, 'stroke-width': 1.5 }));
      g.appendChild(s('rect', { x: 398, y: 292, width: 28, height: 14, fill: SIL }));
      [300, 340, 380, 420, 438].forEach(function (x) {
        var c = s('circle', { class: 'fenster', cx: x, cy: 218, r: 3 }); g.appendChild(c); f.push(c);
      });
      // Container
      [[360, 330, 34], [396, 330, 40], [372, 314, 44]].forEach(function (c) {
        g.appendChild(s('rect', { x: c[0], y: c[1], width: c[2], height: 15, fill: SIL2, stroke: SIL, 'stroke-width': 1 }));
      });
      // Schiff
      g.appendChild(s('path', { d: 'M296 368 H430 L418 392 H306 Z', fill: SIL }));
      g.appendChild(s('rect', { x: 312, y: 350, width: 40, height: 18, fill: SIL }));
      fensterRaster(g, f, 316, 355, 4, 1, 6, 6, 9, 0);
      fensterRaster(g, f, 320, 376, 6, 1, 5, 5, 16, 0);
    },
    sinnvoll: function (g, f) {
      [[446, 50, 150], [500, 40, 108], [544, 38, 176]].forEach(function (b, i) {
        var top = 360 - b[2];
        g.appendChild(s('rect', { x: b[0], y: top, width: b[1], height: b[2], fill: i === 1 ? SIL2 : SIL }));
        var sp = Math.floor((b[1] - 6) / 11);
        fensterRaster(g, f, b[0] + 5, top + 8, sp, Math.floor((b[2] - 14) / 17), 7, 9, 11, 17);
      });
    },
    undoder: function (g, f) {
      g.appendChild(s('rect', { x: 664, y: 228, width: 14, height: 80, fill: SIL }));
      g.appendChild(s('path', { d: 'M586 360 V306 l18 -16 v16 l18 -16 v16 l18 -16 v16 l18 -16 v16 l18 -16 v16 l14 -12 V360 Z', fill: SIL }));
      fensterRaster(g, f, 592, 318, 6, 2, 9, 9, 16, 16);
      var rauch = s('path', { d: 'M671 222 c -6 -10 8 -14 2 -24 c -6 -10 8 -14 2 -22', stroke: '#2a3570', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round', class: 'rauch' });
      g.appendChild(rauch);
    },
    skizzen: function (g, f) {
      g.appendChild(s('path', { d: 'M700 372 C 712 340 788 338 800 372 Z', fill: SIL2 }));
      g.appendChild(s('path', { d: 'M736 350 L744 226 H756 L764 350 Z', fill: SIL }));
      g.appendChild(s('path', { d: 'M739 310 H761 M741 272 H759', stroke: '#2a1830', 'stroke-width': 7 }));
      g.appendChild(s('path', { d: 'M738 226 H762 V220 H738 Z M742 220 V204 H758 V220', fill: SIL }));
      g.appendChild(s('path', { d: 'M740 204 L750 194 L760 204 Z', fill: SIL }));
      var lampe = s('rect', { class: 'fenster', x: 744, y: 206, width: 12, height: 12 }); g.appendChild(lampe); f.push(lampe);
      fensterRaster(g, f, 747, 240, 1, 3, 6, 8, 0, 30);
    }
  };

  /**
   * Stadt zeichnen. fortschritt(st) -> {p, fertig}; stoer: {stadtteilId: anzahl}; onViertel(id)
   */
  function stadt(stadtteile, fortschritt, stoer, opts) {
    opts = opts || {};
    var svg = s('svg', { viewBox: '0 0 800 440', role: 'img', 'aria-label': 'Die Stadt bei Nacht. Erledigte Stadtteile leuchten.', preserveAspectRatio: 'xMidYMax slice' });
    svg.appendChild(s('defs', null,
      s('linearGradient', { id: 'himmel', x1: 0, y1: 0, x2: 0, y2: 1 },
        s('stop', { offset: '0', 'stop-color': '#0a1030' }), s('stop', { offset: '0.7', 'stop-color': '#1d2760' }), s('stop', { offset: '1', 'stop-color': '#2c3a7c' })),
      s('radialGradient', { id: 'laterne' }, s('stop', { offset: '0', 'stop-color': '#ffd85c', 'stop-opacity': '0.9' }), s('stop', { offset: '1', 'stop-color': '#ffd85c', 'stop-opacity': '0' })),
      s('linearGradient', { id: 'strahl', x1: 0, y1: 0, x2: 1, y2: 0 }, s('stop', { offset: '0', 'stop-color': '#ffe27a', 'stop-opacity': '0.6' }), s('stop', { offset: '1', 'stop-color': '#ffe27a', 'stop-opacity': '0' }))));
    svg.appendChild(s('rect', { x: 0, y: 0, width: 800, height: 440, fill: 'url(#himmel)' }));
    var r = rng(7);
    for (var i = 0; i < 46; i++) svg.appendChild(s('circle', { cx: (r() * 800).toFixed(1), cy: (r() * 180).toFixed(1), r: (0.6 + r() * 1.2).toFixed(2), fill: '#fff', opacity: (0.3 + r() * 0.6).toFixed(2) }));
    svg.appendChild(s('path', { d: 'M690 64 a26 26 0 1 0 22 40 a20 20 0 1 1 -22 -40 z', fill: '#f4ecd0', opacity: '0.9' }));

    var alleFertig = true;
    stadtteile.forEach(function (st, idx) {
      var fz = fortschritt(st);
      if (!fz.fertig) alleFertig = false;
      var g = s('g', { class: 'viertel' + (fz.fertig ? ' fertig' : ''), 'data-id': st.id, role: 'link', tabindex: '0', 'aria-label': st.name + ': ' + Math.round(fz.p * 100) + ' Prozent' });
      var fenster = [];
      VIERTEL[st.id](g, fenster);
      var reihenfolge = W.shuffle(fenster.map(function (_, k) { return k; }), rng(31 + idx));
      var an = Math.round(fz.p * fenster.length);
      reihenfolge.slice(0, an).forEach(function (k, j) { fenster[k].classList.add('an'); if (j % 3 === 0) fenster[k].classList.add('warm'); });
      if (stoer && stoer[st.id]) {
        var bb = { ladung: [72, 160], stromkreis: [220, 210], reihe: [370, 186], sinnvoll: [563, 160], undoder: [671, 166], skizzen: [750, 176] }[st.id];
        g.appendChild(s('g', { class: 'stoer-marker' }, s('circle', { cx: bb[0], cy: bb[1], r: 11, fill: '#d93a3a' }), s('text', { x: bb[0], y: bb[1] + 5, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: '#fff', 'font-family': 'Chakra Petch, sans-serif' }, '!')));
      }
      if (opts.onViertel) {
        g.style.cursor = 'pointer';
        g.addEventListener('click', function () { opts.onViertel(st.id); });
        g.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') opts.onViertel(st.id); });
      }
      svg.appendChild(g);
    });

    // Kaimauer, Laternen, Wasser
    svg.appendChild(s('rect', { x: 0, y: 358, width: 800, height: 8, fill: '#0a0f28' }));
    stadtteile.forEach(function (st, idx) {
      var x = [126, 286, 452, 586, 696, 708][idx];
      var g = s('g', { class: 'viertel' + (fortschritt(st).fertig ? ' fertig' : '') });
      g.appendChild(s('circle', { class: 'laterne-licht', cx: x, cy: 334, r: 18, fill: 'url(#laterne)' }));
      g.appendChild(s('path', { d: 'M' + x + ' 358 V336 h4', stroke: '#0a0f28', 'stroke-width': 2.5, fill: 'none' }));
      svg.appendChild(g);
    });
    svg.appendChild(s('rect', { x: 0, y: 366, width: 800, height: 74, fill: '#0b1132' }));
    var wr = rng(3);
    for (var k = 0; k < 26; k++) {
      var wx = wr() * 780, wy = 376 + wr() * 56;
      svg.appendChild(s('path', { d: 'M' + wx.toFixed(0) + ' ' + wy.toFixed(0) + ' h' + (10 + wr() * 26).toFixed(0), stroke: '#2a3570', 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: '0.7' }));
    }
    svg.appendChild(s('path', { class: 'leuchtturm-strahl', d: 'M750 212 L520 170 L520 250 Z', fill: 'url(#strahl)', style: { transformOrigin: '750px 212px' } }));
    if (alleFertig && opts.urkunde) svg.classList.add('alles');
    return { svg: svg, alleFertig: alleFertig };
  }

  /* ---------- Leitstelle ---------- */
  function ida() {
    return W.frag('<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="17" r="9" fill="#f2c7a5"/><path d="M11 15c0-7 4-10 9-10s9 3 9 10c-2-3-5-5-9-5s-7 2-9 5z" fill="#6b3b2a"/><path d="M8 38c1-8 6-11 12-11s11 3 12 11z" fill="#2e64d8"/><path d="M10 17a10 10 0 0 1 20 0" fill="none" stroke="#1c2340" stroke-width="2.4"/><rect x="7.5" y="15" width="4" height="7" rx="2" fill="#ffc531"/><rect x="28.5" y="15" width="4" height="7" rx="2" fill="#ffc531"/><path d="M10 21c0 4 3 6 7 6" fill="none" stroke="#1c2340" stroke-width="1.8"/><circle cx="17.5" cy="27" r="1.6" fill="#1c2340"/></svg>');
  }

  /* ---------- Schaubilder ---------- */

  var LADUNG = { '+': ['#d93a3a', '+'], '-': ['#2e64d8', '−'], '?': ['#8790b3', '?'], '0': ['#fff', ''] };
  function kugel(g, x, y, q) {
    var l = LADUNG[q] || LADUNG['?'];
    g.appendChild(s('circle', { cx: x, cy: y, r: 15, fill: l[0], stroke: '#1c2340', 'stroke-width': 2.5 }));
    if (l[1]) g.appendChild(s('text', { x: x, y: y + 6, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 700, fill: q === '0' ? '#1c2340' : '#fff', 'font-family': 'Chakra Petch, sans-serif' }, l[1]));
  }

  /** Zwei Pendelkugeln: art 'ab' (abstoßen), 'an' (anziehen), 'ruhe'. */
  function pendel(links, rechts, art) {
    var svg = s('svg', { viewBox: '0 0 240 190', class: 'grafik', role: 'img', 'aria-label': 'Zwei Kugeln an Fäden' });
    svg.appendChild(s('rect', { x: 40, y: 14, width: 160, height: 8, rx: 2, fill: '#8790b3' }));
    var g = s('g');
    var winkel = art === 'ab' ? 17 : art === 'an' ? -9 : art === 'leicht' ? -4 : 0;
    [[95, links, -1], [145, rechts, 1]].forEach(function (k) {
      var a = winkel * Math.PI / 180 * k[2];
      var x = k[0] + Math.sin(a) * 140, y = 22 + Math.cos(a) * 140;
      g.appendChild(s('line', { x1: k[0], y1: 22, x2: x, y2: y, stroke: '#1c2340', 'stroke-width': 1.6 }));
      kugel(g, x, y, k[1]);
    });
    svg.appendChild(g);
    return svg;
  }

  /** Glimmlampe zwischen geladenem Körper und Hand. leuchtet: 'koerper' | 'hand' | null */
  function glimm(q, leuchtet) {
    var svg = s('svg', { viewBox: '0 0 300 130', class: 'grafik', role: 'img', 'aria-label': 'Glimmlampe zwischen geladener Kugel und Hand' });
    kugel(svg, 40, 65, q);
    svg.appendChild(s('text', { x: 40, y: 108, 'text-anchor': 'middle', 'font-size': 12, fill: '#4c5373', 'font-family': 'Lexend, sans-serif' }, 'Kugel'));
    svg.appendChild(s('line', { x1: 56, y1: 65, x2: 92, y2: 65, stroke: '#1c2340', 'stroke-width': 3 }));
    svg.appendChild(s('rect', { x: 92, y: 50, width: 116, height: 30, rx: 15, fill: '#eef1f8', stroke: '#1c2340', 'stroke-width': 2.5 }));
    if (leuchtet === 'koerper') svg.appendChild(s('ellipse', { cx: 118, cy: 65, rx: 20, ry: 11, fill: '#ff8a3d', opacity: '0.9', class: 'glimm-licht' }));
    if (leuchtet === 'hand') svg.appendChild(s('ellipse', { cx: 182, cy: 65, rx: 20, ry: 11, fill: '#ff8a3d', opacity: '0.9', class: 'glimm-licht' }));
    svg.appendChild(s('rect', { x: 104, y: 60, width: 28, height: 10, rx: 2, fill: '#8790b3' }));
    svg.appendChild(s('rect', { x: 168, y: 60, width: 28, height: 10, rx: 2, fill: '#8790b3' }));
    svg.appendChild(s('line', { x1: 208, y1: 65, x2: 236, y2: 65, stroke: '#1c2340', 'stroke-width': 3 }));
    svg.appendChild(s('path', { d: 'M236 50 h26 c14 0 14 30 0 30 h-26 z', fill: '#f2c7a5', stroke: '#1c2340', 'stroke-width': 2.5 }));
    svg.appendChild(s('text', { x: 254, y: 108, 'text-anchor': 'middle', 'font-size': 12, fill: '#4c5373', 'font-family': 'Lexend, sans-serif' }, 'Hand'));
    svg.appendChild(s('text', { x: 150, y: 36, 'text-anchor': 'middle', 'font-size': 12, fill: '#4c5373', 'font-family': 'Lexend, sans-serif' }, 'Glimmlampe'));
    return svg;
  }

  function schaltzeichenTafel() {
    var liste = [['leitung', 'Leitung'], ['schalter', 'Schalter'], ['anschluss', 'Anschlussstelle'], ['erdung', 'Erdung'], ['lampe', 'Glühlampe'], ['motor', 'Motor'],
      ['batterie', 'Batterie'], ['quelle', 'elektrische Quelle (allg.), z. B. Dynamo'], ['sicherung', 'Sicherung'], ['geraet', 'Gerät'], ['klingel', 'Klingel'], ['diode', 'Diode'], ['led', 'Leuchtdiode'], ['messgeraet', 'Messgerät']];
    return h('div', { class: 'spick-symbole' }, liste.map(function (x) {
      return h('figure', null, W.schaltbild.symbol(x[0], { label: x[1] }), h('figcaption', null, x[1]));
    }));
  }

  function wechselschaltung() {
    return W.frag('<svg class="grafik" viewBox="0 0 320 170" role="img" aria-label="Wechselschaltung mit zwei Wechselschaltern">' +
      '<g fill="none" stroke="#1c2340" stroke-width="3" stroke-linecap="round">' +
      '<path d="M30 60 V20 H140 M180 20 H290 V60"/>' +
      '<path d="M30 100 V140 H70"/><path d="M250 140 H290 V100"/>' +
      '<path d="M100 120 H220 M100 160 H220"/>' +
      '<line x1="70" y1="140" x2="96" y2="124"/><line x1="250" y1="140" x2="224" y2="156"/>' +
      '<path d="M100 120 v0 M100 160 v0"/></g>' +
      '<g fill="#1c2340"><circle cx="70" cy="140" r="3.5"/><circle cx="100" cy="120" r="3.5"/><circle cx="100" cy="160" r="3.5"/><circle cx="250" cy="140" r="3.5"/><circle cx="220" cy="120" r="3.5"/><circle cx="220" cy="160" r="3.5"/></g>' +
      '<line x1="30" y1="60" x2="30" y2="72" stroke="#1c2340" stroke-width="3"/><line x1="14" y1="72" x2="46" y2="72" stroke="#1c2340" stroke-width="3"/><line x1="22" y1="80" x2="38" y2="80" stroke="#1c2340" stroke-width="7"/><line x1="30" y1="80" x2="30" y2="100" stroke="#1c2340" stroke-width="3"/>' +
      '<circle cx="160" cy="20" r="13" fill="#fff" stroke="#1c2340" stroke-width="3"/><path d="M151 11 l18 18 M151 29 l18 -18" stroke="#1c2340" stroke-width="3"/>' +
      '<line x1="290" y1="60" x2="290" y2="100" stroke="#1c2340" stroke-width="3"/>' +
      '<text x="84" y="108" font-size="12" fill="#4c5373" font-family="Lexend, sans-serif">unten</text><text x="226" y="108" font-size="12" fill="#4c5373" font-family="Lexend, sans-serif">oben</text>' +
      '<text x="12" y="70" font-size="14" font-weight="700" fill="#d93a3a" font-family="Chakra Petch, sans-serif">+</text></svg>');
  }

  /** Grafik nach Namen: 'pendel:L:R:art', 'glimm:q[:koerper|hand]', 'schaltzeichen', 'wechselschaltung' */
  function grafik(name) {
    var p = String(name).split(':');
    switch (p[0]) {
      case 'pendel': return pendel(p[1], p[2], p[3]);
      case 'glimm': return glimm(p[1], p[2] || null);
      case 'schaltzeichen': return schaltzeichenTafel();
      case 'wechselschaltung': return wechselschaltung();
    }
    return h('span');
  }
  function hatGrafik(name) { return ['pendel', 'glimm', 'schaltzeichen', 'wechselschaltung'].indexOf(String(name).split(':')[0]) >= 0; }

  W.art = { stadt: stadt, ida: ida, grafik: grafik, hatGrafik: hatGrafik, pendel: pendel, glimm: glimm, kugel: kugel, rng: rng };
})();
