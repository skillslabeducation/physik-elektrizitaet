/* Kleine Experimente zum Ausprobieren in den Verstehen-Karten. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var h = function () { return W.h.apply(null, arguments); };
  var s = function () { return W.s.apply(null, arguments); };

  function wahl(optionen, start, onWahl, label) {
    var wert = start;
    var gruppe = h('div', { class: 'wahl-gruppe', role: 'group', 'aria-label': label });
    var knoepfe = optionen.map(function (o) {
      return h('button', { type: 'button', 'aria-pressed': String(o[0] === wert), 'aria-label': label + ': ' + o[2], onclick: function () {
        wert = o[0];
        knoepfe.forEach(function (b, i) { b.setAttribute('aria-pressed', String(optionen[i][0] === wert)); });
        W.ton.klick();
        onWahl(wert);
      } }, o[1]);
    });
    knoepfe.forEach(function (b) { gruppe.appendChild(b); });
    return gruppe;
  }

  var LADUNGEN = [['0', '0', 'ungeladen'], ['+', '+', 'positiv'], ['-', '−', 'negativ']];

  W.demos = {
    /** Zwei Pendelkugeln, Ladung wählbar */
    pendel: function (host) {
      var l = '0', r = '0';
      var bild = h('div');
      var text = h('p', { class: 'demo__text', 'aria-live': 'polite' });
      function zeichne() {
        var art, t;
        if (l === '0' && r === '0') { art = 'ruhe'; t = 'Beide Kugeln sind ungeladen. Sie hängen gerade nach unten.'; }
        else if (l === '0' || r === '0') { art = 'leicht'; t = 'Eine Kugel ist geladen, die andere nicht: Sie werden leicht angezogen. (Zusatz: Ein geladener Körper zieht auch leichte ungeladene Körper an, zum Beispiel Papierschnipsel.)'; }
        else if (l === r) { art = 'ab'; t = 'Gleichartig geladen: Die Kugeln stoßen sich ab.'; }
        else { art = 'an'; t = 'Verschiedenartig geladen: Die Kugeln ziehen sich an.'; }
        bild.innerHTML = '';
        bild.appendChild(W.art.pendel(l, r, art));
        text.textContent = t;
      }
      host.appendChild(h('div', { class: 'demo' }, bild,
        h('div', { class: 'demo__steuerung' }, h('span', null, 'Links:'), wahl(LADUNGEN, l, function (v) { l = v; zeichne(); }, 'Linke Kugel'),
          h('span', null, 'Rechts:'), wahl(LADUNGEN, r, function (v) { r = v; zeichne(); }, 'Rechte Kugel')),
        text));
      zeichne();
    },

    /** Kunststoffstab am Tuch reiben: negative Ladung wandert zum Stab */
    reiben: function (host) {
      var MAX = 4;
      var uebertragen = 0;
      var bild = h('div');
      var text = h('p', { class: 'demo__text', 'aria-live': 'polite' });
      function ladungen(g, x0, y0, plus, minus, breit) {
        var n = Math.max(plus, minus);
        for (var i = 0; i < plus; i++) {
          var x = x0 + (i % breit) * 26, y = y0 + Math.floor(i / breit) * 26;
          g.appendChild(s('circle', { class: 'demo-ladung-plus', cx: x, cy: y, r: 9 }));
          g.appendChild(s('text', { class: 'demo-zeichen', x: x, y: y }, '+'));
        }
        for (var j = 0; j < minus; j++) {
          var mx = x0 + 13 + (j % breit) * 26, my = y0 + 13 + Math.floor(j / breit) * 26;
          g.appendChild(s('circle', { class: 'demo-ladung-minus', cx: mx, cy: my, r: 9 }));
          g.appendChild(s('text', { class: 'demo-zeichen', x: mx, y: my }, '−'));
        }
        return n;
      }
      function zeichne() {
        var svg = s('svg', { viewBox: '0 0 320 170', role: 'img', 'aria-label': 'Stab und Tuch mit Ladungen' });
        // Tuch
        svg.appendChild(s('path', { d: 'M10 30 q20 -14 40 0 t40 0 t40 0 v110 q-20 14 -40 0 t-40 0 t-40 0 z', fill: '#bfe3d2', stroke: '#1c2340', 'stroke-width': 2 }));
        svg.appendChild(s('text', { x: 70, y: 162, 'text-anchor': 'middle', 'font-size': 13, fill: '#1c2340', 'font-family': 'Lexend, sans-serif' }, 'Tuch'));
        ladungen(svg, 26, 50, 6, 6 - uebertragen, 3);
        // Stab
        svg.appendChild(s('rect', { x: 170, y: 64, width: 140, height: 42, rx: 21, fill: '#f6d38a', stroke: '#1c2340', 'stroke-width': 2 }));
        svg.appendChild(s('text', { x: 240, y: 132, 'text-anchor': 'middle', 'font-size': 13, fill: '#1c2340', 'font-family': 'Lexend, sans-serif' }, 'Kunststoffstab'));
        var g = s('g');
        for (var i = 0; i < 4; i++) {
          g.appendChild(s('circle', { class: 'demo-ladung-plus', cx: 192 + i * 30, cy: 76, r: 8 }));
          g.appendChild(s('text', { class: 'demo-zeichen', x: 192 + i * 30, y: 76 }, '+'));
        }
        for (var k = 0; k < 4 + uebertragen; k++) {
          var x = 186 + (k % 8) * 16, y = 94;
          g.appendChild(s('circle', { class: 'demo-ladung-minus', cx: x, cy: y, r: 7.5, opacity: k >= 4 ? 1 : 0.9 }));
          g.appendChild(s('text', { class: 'demo-zeichen', x: x, y: y, 'font-size': 12 }, '−'));
        }
        svg.appendChild(g);
        bild.innerHTML = '';
        bild.appendChild(svg);
        if (uebertragen === 0) text.textContent = 'Vor dem Reiben: Stab und Tuch haben jeweils gleich viel positive und negative Ladung. Beide sind ungeladen.';
        else text.innerHTML = 'Der Stab hat <strong>' + uebertragen + '</strong> negative Ladung' + (uebertragen > 1 ? 'en' : '') + ' zu viel: Er ist <strong>negativ</strong> geladen. Dem Tuch fehlen genauso viele: Es ist <strong>positiv</strong> geladen.' + (uebertragen >= MAX ? ' Zusammen gibt es immer noch gleich viel + wie −. Die Ladung wurde nur getrennt.' : '');
      }
      var knopf = h('button', { type: 'button', class: 'btn btn--licht btn--klein', onclick: function () {
        if (uebertragen >= MAX) return;
        uebertragen++;
        W.ton.klick();
        zeichne();
        if (uebertragen >= MAX) knopf.disabled = true;
      } }, 'Reiben');
      host.appendChild(h('div', { class: 'demo' }, bild, h('div', { class: 'demo__steuerung' }, knopf,
        h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', onclick: function () { uebertragen = 0; knopf.disabled = false; zeichne(); } }, 'Neu')), text));
      zeichne();
    },

    /** Glimmlampe: Welche Seite leuchtet? */
    glimm: function (host) {
      var q = '-';
      var bild = h('div');
      var text = h('p', { class: 'demo__text', 'aria-live': 'polite' });
      function zeichne(leuchtet) {
        bild.innerHTML = '';
        bild.appendChild(W.art.glimm(q, leuchtet));
      }
      function beruehren() {
        var seite = q === '-' ? 'koerper' : 'hand';
        zeichne(seite);
        W.ton.klick();
        text.textContent = q === '-'
          ? 'Die Kugel ist negativ: Die Glimmlampe leuchtet auf der Seite zur Kugel.'
          : 'Die Kugel ist positiv: Die Glimmlampe leuchtet auf der Seite, die von der Kugel weg zur Hand zeigt.';
        setTimeout(function () { zeichne(null); }, W.reducedMotion() ? 2500 : 900);
      }
      host.appendChild(h('div', { class: 'demo' }, bild, h('div', { class: 'demo__steuerung' },
        h('span', null, 'Kugel:'), wahl(LADUNGEN.slice(1), q, function (v) { q = v; zeichne(null); text.textContent = ''; }, 'Ladung der Kugel'),
        h('button', { type: 'button', class: 'btn btn--licht btn--klein', onclick: beruehren }, 'Berühren')), text));
      zeichne(null);
    },

    /** Zeiger-Elektroskop */
    elektroskop: function (host) {
      var ladung = 0;
      var bild = h('div');
      var text = h('p', { class: 'demo__text', 'aria-live': 'polite' });
      function zeichne() {
        var winkel = Math.min(68, Math.abs(ladung) * 17);
        var svg = s('svg', { viewBox: '0 0 220 210', role: 'img', 'aria-label': 'Zeiger-Elektroskop, Ausschlag ' + Math.round(winkel) + ' Grad' });
        svg.appendChild(s('rect', { x: 30, y: 50, width: 160, height: 140, rx: 6, fill: '#eef1f8', stroke: '#1c2340', 'stroke-width': 2.5 }));
        svg.appendChild(s('path', { d: 'M60 170 A 60 60 0 0 1 160 110', fill: 'none', stroke: '#8790b3', 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }));
        svg.appendChild(s('ellipse', { cx: 110, cy: 22, rx: 40, ry: 7, fill: '#c9d0e0', stroke: '#1c2340', 'stroke-width': 2.5 }));
        svg.appendChild(s('line', { x1: 110, y1: 28, x2: 110, y2: 175, stroke: '#1c2340', 'stroke-width': 5 }));
        svg.appendChild(s('rect', { x: 100, y: 44, width: 20, height: 12, fill: '#ffc531', stroke: '#1c2340', 'stroke-width': 2 }));
        var zeiger = s('line', { x1: 110, y1: 70, x2: 110, y2: 170, stroke: '#d93a3a', 'stroke-width': 4, 'stroke-linecap': 'round', style: { transform: 'rotate(' + winkel + 'deg)', transformOrigin: '110px 120px', transition: 'transform 0.5s ease' } });
        svg.appendChild(zeiger);
        svg.appendChild(s('circle', { cx: 110, cy: 120, r: 4, fill: '#1c2340' }));
        bild.innerHTML = '';
        bild.appendChild(svg);
        text.textContent = ladung === 0
          ? 'Kein Ausschlag: Das Elektroskop ist ungeladen.'
          : 'Ausschlag! Stab und Zeiger sind gleichartig geladen und stoßen sich ab. Welche Ladung es ist, siehst du nicht.';
      }
      function knopf(label, d) {
        return h('button', { type: 'button', class: 'btn btn--nacht btn--klein', style: { color: '#fff' }, onclick: function () { ladung = Math.max(-4, Math.min(4, ladung + d)); W.ton.klick(); zeichne(); } }, label);
      }
      host.appendChild(h('div', { class: 'demo' }, bild, h('div', { class: 'demo__steuerung' },
        knopf('+ Ladung dazu', 1), knopf('− Ladung dazu', -1),
        h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', onclick: function () { ladung = 0; W.ton.klick(); zeichne(); } }, 'Mit der Hand berühren')),
        text, h('p', { class: 'leise', style: { fontSize: '0.88rem', margin: '4px 0 0' } }, 'Tipp: Gib erst positive, dann negative Ladung dazu. Was passiert mit dem Ausschlag?')));
      zeichne();
    },

    /** Leiter oder Nichtleiter in der Prüfstrecke */
    leitertest: function (host) {
      var STOFFE = [['Kupferdraht', true], ['Eisennagel', true], ['Bleistiftmine', true], ['Salzwasser', true], ['Zitronensaft', true], ['Alufolie', true],
        ['Kunststofflineal', false], ['Holzstift', false], ['Glasstab', false], ['Gummiband', false], ['destilliertes Wasser', false], ['Papier', false]];
      var gewaehlt = null;
      var bild = h('div', { class: 'bild bild--schmal' });
      var text = h('p', { class: 'demo__text', 'aria-live': 'polite' }, 'Tippe einen Gegenstand an.');
      var stoffText = h('p', { class: 'bildtext' });
      function zeichne() {
        var leitet = gewaehlt ? gewaehlt[1] : false;
        // Die Prüfstrecke ist die Lücke unten links; ein Leiter schließt sie.
        var sc = W.schaltung.parse(3, 2, '0,1 u:B r:L1 r:- d:- l:-' + (leitet ? ' l:-' : ''));
        bild.innerHTML = '';
        bild.appendChild(W.schaltbild.zeichne(sc, { zuschneiden: true, namen: false, label: 'Prüfstrecke' }));
        stoffText.textContent = gewaehlt ? 'In der Lücke: ' + gewaehlt[0] : 'Die Lücke unten links ist die Prüfstrecke.';
      }
      var chips = h('div', { class: 'demo__steuerung' }, STOFFE.map(function (st) {
        var c = h('button', { type: 'button', class: 'chip', onclick: function () {
          gewaehlt = st;
          chips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('gewaehlt'); });
          c.classList.add('gewaehlt');
          W.ton.klick();
          zeichne();
          text.innerHTML = '<strong>' + st[0] + '</strong>: ' + (st[1] ? 'Die Lampe leuchtet. Das ist ein <strong>Leiter</strong>.' : 'Die Lampe bleibt dunkel. Das ist ein <strong>Nichtleiter</strong>.');
        } }, st[0]);
        return c;
      }));
      host.appendChild(h('div', { class: 'demo' }, bild, stoffText, chips, text));
      zeichne();
    }
  };
})();
