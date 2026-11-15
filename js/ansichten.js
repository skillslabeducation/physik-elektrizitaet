/* Ansichten der App. Jede Ansicht rendert in #inhalt und setzt die Kopfzeile. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var h = function () { return W.h.apply(null, arguments); };

  var ICON = {
    zurueck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    funke: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5" stroke-linecap="round"/></svg>',
    zahnrad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M10.3 2.8h3.4l.5 2.6 1.9.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.9 2.6.5v3.4l-2.6.5-.8 1.9 1.5 2.2-2.4 2.4-2.2-1.5-1.9.8-.5 2.6h-3.4l-.5-2.6-1.9-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.9-2.6-.5v-3.4l2.6-.5.8-1.9-1.5-2.2 2.4-2.4 2.2 1.5 1.9-.8z"/><circle cx="12" cy="12" r="3"/></svg>',
    schalter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M2 15h5M17 15h5"/><circle cx="7" cy="15" r="1.5" fill="currentColor"/><circle cx="17" cy="15" r="1.5" fill="currentColor"/><path d="M7 15l9-6"/></svg>',
    blitz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
    turm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M9 22l1.5-14h3L15 22zM9.5 8h5M10 5h4v3h-4zM12 2v3M2 6l6 2M22 6l-6 2"/></svg>',
    heft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h12a2 2 0 0 1 2 2v16H7a2 2 0 0 1-2-2z"/><path d="M5 19a2 2 0 0 1 2-2h12M9 7h6M9 11h6"/></svg>',
    kalender: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke-linecap="round"/></svg>',
    stern: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>'
  };
  function icon(n) { return W.frag(ICON[n]); }

  var root = function () { return document.getElementById('inhalt'); };
  function leeren() { var r = root(); r.innerHTML = ''; return r; }
  function fortschritt(st) { return W.state.stadtteilFortschritt(st); }
  function stadtteil(id) { return W.stadtteile.filter(function (s) { return s.id === id; })[0]; }
  function gehe(hash) { location.hash = hash; }

  /* ---------- Kopfzeile ---------- */
  var letzterKopf = ['Lichter an!', null];
  function kopf(titel, zurueck) {
    letzterKopf = [titel, zurueck];
    var k = document.getElementById('kopf');
    k.innerHTML = '';
    if (zurueck) k.appendChild(h('a', { class: 'kopf__zurueck', href: zurueck, 'aria-label': 'Zurück' }, icon('zurueck')));
    k.appendChild(h('div', { class: 'kopf__titel' }, titel));
    var d = W.state.data;
    var st = W.state.stoerungen().length;
    if (st) k.appendChild(h('a', { class: 'kopf__knopf zaehler zaehler--stoer', href: '#/stoerungen', 'aria-label': st + ' Störungen' }, icon('warn'), String(st)));
    k.appendChild(h('a', { class: 'kopf__knopf zaehler zaehler--funken', href: '#/geheimnisse', 'aria-label': d.funken + ' Funken' }, icon('funke'), String(d.funken)));
    k.appendChild(h('a', { class: 'kopf__knopf', href: '#/einstellungen', 'aria-label': 'Einstellungen' }, icon('zahnrad')));
  }

  function ring(p, inhalt, groesse) {
    var r = 22, u = 2 * Math.PI * r;
    return W.frag('<svg viewBox="0 0 54 54" width="' + (groesse || 54) + '" height="' + (groesse || 54) + '" aria-hidden="true"><circle class="ring-bg" cx="27" cy="27" r="' + r + '"/><circle class="ring" cx="27" cy="27" r="' + r + '" stroke-dasharray="' + u.toFixed(2) + '" stroke-dashoffset="' + (u * (1 - p)).toFixed(2) + '"/><text class="ring-zahl" x="27" y="34" text-anchor="middle">' + W.esc(inhalt) + '</text></svg>');
  }

  function stoerProStadtteil() {
    var m = {};
    W.state.stoerungen().forEach(function (id) {
      var st = id.indexOf('blitz.') === 0 ? null : W.stadtteilVonItem(id);
      if (st) m[st] = (m[st] || 0) + 1;
    });
    return m;
  }

  /* ---------- Startseite ---------- */
  function start() {
    kopf('');
    var r = leeren();
    var d = W.state.data;
    var stadt = W.art.stadt(W.stadtteile, fortschritt, stoerProStadtteil(), { urkunde: d.urkunde, onViertel: function (id) { gehe('#/st/' + id + '/verstehen'); } });
    var anzahlFertig = W.stadtteile.filter(function (st) { return fortschritt(st).fertig; }).length;
    r.appendChild(h('section', { class: 'stadt' + (stadt.alleFertig && d.urkunde ? ' alles' : '') }, stadt.svg,
      h('div', { class: 'stadt__kopf' }, h('h1', null, 'Lichter an!'), h('p', null, anzahlFertig + ' von 6 Stadtteilen leuchten'))));

    var f = W.funkspruch(d, W.stadtteile, fortschritt);
    r.appendChild(h('div', { class: 'funk' }, h('div', { class: 'funk__bild' }, W.art.ida()),
      h('div', { class: 'funk__text' }, h('span', { class: 'funk__wer' }, 'Ida aus der Leitstelle'), h('p', null, f.text),
        h('a', { class: 'btn btn--licht btn--klein', href: f.ziel }, f.knopf))));

    var liste = h('ol', { class: 'viertel-liste', 'aria-label': 'Stadtteile' });
    W.stadtteile.forEach(function (st) {
      var fz = fortschritt(st);
      liste.appendChild(h('li', null, h('a', { class: 'viertel-zeile' + (fz.fertig ? ' fertig' : ''), href: '#/st/' + st.id + '/verstehen' },
        h('span', { class: 'viertel-zeile__nr' }, ring(fz.p, String(st.nr))),
        h('span', null, h('span', { class: 'viertel-zeile__name' }, st.name), h('span', { class: 'viertel-zeile__thema' }, st.thema)),
        h('span', { class: 'viertel-zeile__status' }, fz.fertig ? 'leuchtet' : Math.round(fz.p * 100) + ' %'))));
    });
    r.appendChild(h('section', { class: 'abschnitt' }, h('h2', null, 'Die Stadtteile'), liste));

    var stoer = W.state.stoerungen().length;
    r.appendChild(h('section', { class: 'abschnitt' }, h('h2', null, 'Werkzeuge'), h('div', { class: 'werkzeuge' },
      werkzeug('#/pruefung', 'turm', 'Das große Einschalten', d.urkunde ? 'Geschafft! Bestes Ergebnis: ' + Math.round(d.pruef.best * 100) + ' %' : '20 gemischte Aufgaben wie in der Arbeit. Ab 80 % geht die ganze Stadt an.', 'gross'),
      werkzeug('#/stoerungen', 'warn', 'Störungen', stoer ? stoer + ' Aufgaben sitzen noch nicht' : 'Keine Störungen gemeldet', stoer ? 'warn' : ''),
      werkzeug('#/blitz', 'blitz', 'Blitzrunde', '60 Sekunden: stimmt oder stimmt nicht?' + (d.blitz.best ? ' Rekord: ' + d.blitz.best : '')),
      werkzeug('#/baukasten', 'schalter', 'Baukasten', 'Eigene Schaltungen bauen und testen'),
      werkzeug('#/spick', 'heft', 'Spickzettel', 'Alle Merksätze zum Ausdrucken'),
      werkzeug('#/plan', 'kalender', 'Lernplan', d.datum ? 'Arbeit am ' + datumText(d.datum) : 'Datum der Arbeit eintragen'),
      werkzeug('#/geheimnisse', 'stern', 'Strom-Geheimnisse', W.GEHEIMNISSE.filter(function (g) { return d.funken >= g.ab; }).length + ' von ' + W.GEHEIMNISSE.length + ' freigeschaltet'))));
  }
  function werkzeug(href, ic, name, info, art) {
    return h('a', { class: 'werkzeug' + (art ? ' werkzeug--' + art : ''), href: href }, icon(ic), h('span', null, h('span', { class: 'werkzeug__name' }, name), h('br'), h('span', { class: 'werkzeug__info' }, info)));
  }

  /* ---------- Stadtteil ---------- */
  function stadtteilAnsicht(id, tab) {
    var st = stadtteil(id);
    if (!st) return start();
    tab = tab || 'verstehen';
    kopf(st.name, '#/');
    var r = leeren();
    var fz = fortschritt(st);
    r.appendChild(h('div', { class: 'viertel-kopf' }, ring(fz.p, fz.fertig ? '✓' : Math.round(fz.p * 100) + '', 58),
      h('div', null, h('h1', { style: { fontSize: '1.5rem' } }, st.thema), h('div', { class: 'viertel-kopf__ziel' }, st.ziel), h('div', { class: 'viertel-kopf__ziel' }, 'Nachlesen: ' + st.buch))));
    var tabs = [['verstehen', 'Verstehen'], ['ueben', 'Üben'], ['erklaeren', 'Erklären']];
    r.appendChild(h('div', { class: 'reiter', role: 'tablist' }, tabs.map(function (t) {
      return h('button', { role: 'tab', 'aria-selected': String(t[0] === tab), onclick: function () { gehe('#/st/' + id + '/' + t[0]); } }, t[1]);
    })));
    var bereich = h('div');
    r.appendChild(bereich);
    if (tab === 'verstehen') verstehen(st, bereich);
    else if (tab === 'ueben') uebenListe(st, bereich);
    else erklaerenListe(st, bereich);
  }

  function karteEl(k) {
    var el = h('article', { class: 'karte' }, h('h2', null, k.titel, k.zusatz ? h('span', { class: 'zusatz-marke' }, 'Zusatz') : null), h('div', { html: k.text }));
    if (k.bild) el.appendChild(h('div', { class: 'bild bild--schmal' }, W.schaltbild.zeichne(W.schaltung.parse(k.bild.cols, k.bild.rows, k.bild.dsl), { zuschneiden: true, label: k.bild.label })));
    if (k.bild && k.bild.label) el.appendChild(h('p', { class: 'bildtext' }, k.bild.label));
    if (k.grafik) el.appendChild(h('div', { class: 'bild' }, W.art.grafik(k.grafik)));
    if (k.demo) { var dh = h('div'); el.appendChild(dh); W.demos[k.demo](dh); }
    if (k.baukasten) {
      var bh = h('div', { class: 'demo' });
      el.appendChild(bh);
      W.baukasten.mount(bh, { cols: k.baukasten.cols, rows: k.baukasten.rows, dsl: k.baukasten.dsl, nurTesten: true, messwerte: !!k.baukasten.messwerte });
    }
    if (k.merk) el.appendChild(h('div', { class: 'merk', html: k.merk }));
    if (k.achtung) el.appendChild(h('div', { class: 'achtung', html: k.achtung }));
    return el;
  }

  function verstehen(st, host) {
    var blatt = h('div', { class: 'blatt' });
    host.appendChild(blatt);
    var gesehen = Math.max(0, W.state.karte(st.id));
    if (W.state.karte(st.id) < 0) W.state.markKarte(st.id, 0);
    var stand = h('p', { class: 'karten-fortschritt' });
    var unten = h('div', { class: 'karte__weiter' });
    function zeige(bis) {
      for (var i = blatt.querySelectorAll('.karte').length; i <= bis; i++) blatt.insertBefore(karteEl(st.karten[i]), stand);
      stand.textContent = 'Karte ' + (bis + 1) + ' von ' + st.karten.length;
      unten.innerHTML = '';
      if (bis < st.karten.length - 1) {
        unten.appendChild(h('button', { type: 'button', class: 'btn btn--tinte', onclick: function () {
          W.state.markKarte(st.id, bis + 1);
          zeige(bis + 1);
          var neu = blatt.querySelectorAll('.karte')[bis + 1];
          if (neu) neu.scrollIntoView({ behavior: W.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
        } }, 'Weiter: ' + st.karten[bis + 1].titel));
      } else {
        unten.appendChild(h('a', { class: 'btn btn--licht', href: '#/st/' + st.id + '/ueben' }, 'Alles gelesen – jetzt üben'));
      }
    }
    blatt.appendChild(stand);
    blatt.appendChild(unten);
    zeige(Math.min(gesehen, st.karten.length - 1));
  }

  var ARTEN = { wahl: 'Auswahl', mehrfach: 'Auswahl', zuordnen: 'Zuordnen', luecke: 'Lückentext', sortieren: 'Sortieren', zahl: 'Rechnen', leuchtet: 'Schaltplan lesen', mission: 'Baukasten-Mission', papier: 'Auf Papier zeichnen' };
  function artText(u) {
    var a = [];
    u.items.forEach(function (it) { var t = ARTEN[it.typ]; if (a.indexOf(t) < 0) a.push(t); });
    return a.join(', ') + ' – ' + u.items.length + ' Aufgaben';
  }

  function uebenListe(st, host) {
    var blatt = h('div', { class: 'blatt' }, h('h2', null, 'Übungen'), h('p', { class: 'leise' }, 'Ab 60 % ist eine Übung geschafft. Sind alle geschafft, alle Karten gelesen und eine Erklär-Aufgabe verglichen, leuchtet der Stadtteil.'));
    var liste = h('ul', { class: 'ueb-liste' });
    st.uebungen.forEach(function (u) {
      var best = W.state.uebungBest(u.id);
      liste.appendChild(h('li', null, h('a', { class: 'ueb-zeile' + (best != null && best >= 0.6 ? ' gut' : ''), href: '#/ueb/' + st.id + '/' + u.id },
        h('span', null, h('span', { class: 'ueb-zeile__titel' }, u.titel), h('span', { class: 'ueb-zeile__art' }, artText(u))),
        h('span', { class: 'ueb-zeile__ergebnis' }, best == null ? W.uebung.birne(0, 'gluehbirne') : [W.uebung.birne(best, 'gluehbirne'), ' ' + Math.round(best * 100) + ' %']))));
    });
    blatt.appendChild(liste);
    host.appendChild(blatt);
  }

  function erklaerenListe(st, host) {
    host.appendChild(h('div', { class: 'blatt' }, h('h2', null, 'Erklären wie in der Arbeit'), h('p', null, 'In der Arbeit musst du Dinge in eigenen Worten erklären. Schreib zuerst deine Antwort, dann vergleiche mit den Checkpunkten. Dein Text bleibt auf diesem Gerät gespeichert.')));
    var warFertig = fortschritt(st).fertig;
    st.erklaeren.forEach(function (e) { W.uebung.erklaeren(host, e, function () { feiereWennFertig(st, warFertig); warFertig = fortschritt(st).fertig; }); });
  }

  /* Feiern, wenn ein Stadtteil durch die letzte Aktion fertig wurde */
  function feiereWennFertig(st, warVorher) {
    if (!warVorher && fortschritt(st).fertig) {
      W.ton.an();
      W.toast('Der Stadtteil ' + st.name + ' leuchtet wieder!', 'funken');
      feuerwerk(1400);
    }
  }

  /* ---------- Übung spielen ---------- */
  function uebungAnsicht(stId, uebId) {
    var st = stadtteil(stId);
    var u = st && st.uebungen.filter(function (x) { return x.id === uebId; })[0];
    if (!u) return start();
    kopf(u.titel, '#/st/' + stId + '/ueben');
    var r = leeren();
    var warFertig = fortschritt(st).fertig;
    W.uebung.spiele(r, u, {
      modus: 'ueben',
      onFertig: function (score, erg, richtig, n) {
        var gewinn = W.state.recordUebung(u.id, score);
        kopf(u.titel, '#/st/' + stId + '/ueben');
        var idx = st.uebungen.indexOf(u);
        var naechste = st.uebungen[idx + 1];
        W.uebung.ergebnis(r, {
          score: score, richtig: richtig, n: n, funken: gewinn,
          text: score >= 0.9 ? 'Hervorragend! Hier brennt jede Lampe.' : score >= 0.6 ? 'Geschafft! Die Übung zählt für deinen Stadtteil.' : 'Noch nicht ganz. Die falschen Aufgaben stehen jetzt auf deiner Störungsliste.',
          knoepfe: [
            h('button', { type: 'button', class: 'btn btn--rahmen', onclick: function () { uebungAnsicht(stId, uebId); } }, 'Nochmal'),
            naechste ? h('a', { class: 'btn btn--licht', href: '#/ueb/' + stId + '/' + naechste.id }, 'Nächste Übung') : h('a', { class: 'btn btn--licht', href: '#/st/' + stId + '/erklaeren' }, 'Zum Erklären'),
            h('a', { class: 'btn btn--rahmen', href: '#/st/' + stId + '/ueben' }, 'Alle Übungen')
          ]
        });
        if (gewinn > 0) W.toast('+' + gewinn + ' Funken', 'funken');
        feiereWennFertig(st, warFertig);
      }
    });
  }

  /* ---------- Baukasten ---------- */
  function baukastenAnsicht() {
    kopf('Baukasten', '#/');
    var r = leeren();
    var breit = window.innerWidth >= 700;
    var blatt = h('div', { class: 'blatt' }, h('h2', null, 'Freier Baukasten'), h('p', { class: 'leise' }, 'Baue, was du willst. Probier Reihen- und Parallelschaltungen, UND und ODER, und schau dir die Messwerte an. Was passiert bei zwei Batterien hintereinander?'));
    r.appendChild(blatt);
    W.baukasten.mount(blatt, { cols: breit ? 7 : 5, rows: breit ? 5 : 5, palette: { leitung: Infinity, batterie: 2, generator: 1, lampe: 4, schalter: 4, motor: 2, klingel: 1 } });
  }

  /* ---------- Blitzrunde ---------- */
  function blitzAnsicht() {
    kopf('Blitzrunde', '#/');
    var r = leeren();
    var best = W.state.data.blitz.best || 0;
    r.appendChild(h('div', { class: 'blatt zentriert' }, h('h2', null, 'Blitzrunde'), h('p', null, '60 Sekunden. Stimmt die Aussage oder nicht? Jede richtige Antwort bringt einen Funken. Was du falsch hast, landet auf der Störungsliste.'),
      best ? h('p', { class: 'display' }, 'Dein Rekord: ' + best) : null,
      h('button', { type: 'button', class: 'btn btn--licht', onclick: blitzSpiel }, 'Los!')));
  }
  function blitzSpiel() {
    var r = leeren();
    var reihen = W.shuffle(W.BLITZ.map(function (_, i) { return i; }));
    var pos = 0, punkte = 0, falsch = [], ende = Date.now() + 60000, gesperrt = false;
    var uhr = h('div', { class: 'uhr', 'aria-live': 'off' }, '60');
    var aussage = h('div', { class: 'blitz-karte__aussage', 'aria-live': 'polite' });
    var rueck = h('div', { style: { minHeight: '3.2em' } });
    var stand = h('div', { class: 'display' }, '0 richtig');
    var blatt = h('div', { class: 'blatt blitz-karte' }, h('div', { class: 'aufgabe__kopf' }, uhr, stand), aussage,
      h('div', { class: 'blitz-knoepfe' },
        h('button', { type: 'button', class: 'btn btn--stimmt', onclick: function () { antwort(true); } }, 'Stimmt'),
        h('button', { type: 'button', class: 'btn btn--falsch', onclick: function () { antwort(false); } }, 'Stimmt nicht')), rueck);
    r.appendChild(blatt);
    function zeige() { aussage.textContent = W.BLITZ[reihen[pos % reihen.length]][0]; }
    function antwort(wert) {
      if (gesperrt) return;
      var i = reihen[pos % reihen.length];
      var b = W.BLITZ[i];
      var ok = b[1] === wert;
      if (ok) { punkte++; W.ton.richtig(); } else { W.ton.falsch(); falsch.push(i); W.state.stoerungFalsch('blitz.' + i); }
      rueck.innerHTML = '';
      rueck.appendChild(h('div', { class: 'rueck ' + (ok ? 'rueck--richtig' : 'rueck--falsch') }, h('strong', null, ok ? 'Richtig. ' : 'Falsch. '), '„' + b[0] + '“ ' + (b[1] ? 'stimmt. ' : 'stimmt nicht. '), h('span', { html: b[2] })));
      if (ok) W.state.stoerungRichtig('blitz.' + i);
      stand.textContent = punkte + ' richtig';
      pos++;
      if (pos % reihen.length === 0) reihen = W.shuffle(reihen);
      gesperrt = true;
      setTimeout(function () { gesperrt = false; zeige(); }, ok ? 450 : 1300);
    }
    var timer = setInterval(function () {
      var rest = Math.max(0, Math.ceil((ende - Date.now()) / 1000));
      if (!document.body.contains(uhr)) { clearInterval(timer); return; }
      uhr.textContent = String(rest);
      uhr.classList.toggle('knapp', rest <= 10);
      if (rest <= 0) { clearInterval(timer); fertig(); }
    }, 250);
    function fertig() {
      var rekord = W.state.recordBlitz(punkte);
      W.state.addFunken(punkte);
      kopf('Blitzrunde', '#/');
      W.uebung.ergebnis(r, {
        score: pos ? punkte / pos : 0, richtig: punkte, n: pos, funken: punkte,
        text: rekord ? 'Neuer Rekord!' : 'Rekord: ' + W.state.data.blitz.best,
        extra: falsch.length ? h('div', { style: { textAlign: 'left' } }, h('h3', null, 'Das war falsch:'), falsch.map(function (i) { return h('div', { class: 'achtung' }, h('strong', null, W.BLITZ[i][0]), h('span', { html: (W.BLITZ[i][1] ? 'Das stimmt. ' : 'Das stimmt nicht. ') + W.BLITZ[i][2] })); })) : null,
        knoepfe: [h('button', { type: 'button', class: 'btn btn--licht', onclick: blitzSpiel }, 'Nochmal'), h('a', { class: 'btn btn--rahmen', href: '#/' }, 'Zur Stadt')]
      });
    }
    zeige();
  }

  /* ---------- Störungen ---------- */
  function stoerungenAnsicht() {
    kopf('Störungen', '#/');
    var r = leeren();
    var ids = W.state.stoerungen().filter(function (id) {
      if (W.itemNachId(id)) return true;
      delete W.state.data.stoer[id]; // veraltete Einträge aufräumen
      return false;
    });
    W.state.save();
    if (!ids.length) {
      r.appendChild(h('div', { class: 'blatt zentriert' }, W.uebung.birne(1), h('h2', null, 'Keine Störungen'), h('p', null, 'Alles läuft. Falsche Antworten aus Übungen, Blitzrunde und Prüfung landen hier, bis du sie zweimal hintereinander richtig hast.'), h('a', { class: 'btn btn--licht', href: '#/' }, 'Zur Stadt')));
      return;
    }
    var gruppen = {};
    ids.forEach(function (id) {
      var st = id.indexOf('blitz.') === 0 ? 'Blitzrunde' : (stadtteil(W.stadtteilVonItem(id)) || {}).name;
      gruppen[st] = (gruppen[st] || 0) + 1;
    });
    r.appendChild(h('div', { class: 'blatt' }, h('h2', null, ids.length + (ids.length === 1 ? ' Störung' : ' Störungen')),
      h('p', null, 'Diese Aufgaben sitzen noch nicht. Eine Störung ist behoben, wenn du die Aufgabe zweimal hintereinander richtig löst.'),
      h('ul', null, Object.keys(gruppen).map(function (g) { return h('li', null, g + ': ' + gruppen[g]); })),
      h('button', { type: 'button', class: 'btn btn--licht', onclick: function () { reparatur(ids); } }, 'Reparatur starten')));
  }
  function reparatur(ids) {
    var auswahl = W.shuffle(ids).slice(0, 8);
    var r = leeren();
    var vorher = W.state.stoerungen().length;
    W.uebung.spiele(r, { id: 'stoer', titel: 'Reparatur', items: auswahl.map(function (id) { return W.itemNachId(id); }) }, {
      modus: 'stoerung', ids: auswahl,
      onFertig: function (score, erg, richtig, n) {
        var behoben = vorher - W.state.stoerungen().length;
        if (behoben > 0) W.state.addFunken(behoben * 3);
        kopf('Störungen', '#/');
        W.uebung.ergebnis(r, {
          score: score, richtig: richtig, n: n, funken: behoben > 0 ? behoben * 3 : 0,
          text: behoben > 0 ? behoben + (behoben === 1 ? ' Störung behoben.' : ' Störungen behoben.') + ' Noch offen: ' + W.state.stoerungen().length : 'Noch offen: ' + W.state.stoerungen().length + '. Richtig beantwortete Aufgaben brauchen noch einen zweiten richtigen Durchgang.',
          knoepfe: [W.state.stoerungen().length ? h('button', { type: 'button', class: 'btn btn--licht', onclick: function () { stoerungenAnsicht(); } }, 'Weiter reparieren') : null, h('a', { class: 'btn btn--rahmen', href: '#/' }, 'Zur Stadt')]
        });
      }
    });
  }

  /* ---------- Prüfung ---------- */
  function pruefungAnsicht() {
    kopf('Das große Einschalten', '#/');
    var r = leeren();
    var d = W.state.data;
    r.appendChild(h('div', { class: 'blatt' }, h('h2', null, 'Das große Einschalten'),
      h('p', null, '20 gemischte Aufgaben aus allen Stadtteilen, wie in einer Klassenarbeit. Du bekommst die Rückmeldung erst am Ende. Nimm dir Zeit und lies jede Frage genau.'),
      h('p', null, 'Ab 80 % (16 von 20) geht die ganze Stadt an, und du bekommst deine Urkunde.'),
      d.pruef.laeufe.length ? h('p', { class: 'leise' }, 'Bisher bestes Ergebnis: ' + Math.round(d.pruef.best * 100) + ' %') : null,
      h('div', { class: 'knopfreihe' }, h('button', { type: 'button', class: 'btn btn--licht', onclick: pruefungStart }, 'Prüfung starten'),
        d.urkunde ? h('a', { class: 'btn btn--rahmen', href: '#/urkunde' }, 'Meine Urkunde') : null)));
  }
  function pruefungStart() {
    var r = leeren();
    var zug = W.pruefungZiehen();
    var start = Date.now();
    W.app.warnen = 'Prüfung abbrechen? Deine Antworten gehen verloren.';
    W.uebung.spiele(r, { id: 'pruefung', titel: 'Prüfung', items: zug.map(function (x) { return x.item; }) }, {
      modus: 'pruefung', sofort: false, ids: zug.map(function (x) { return x.id; }),
      onAbbrechen: function () { W.app.warnen = null; pruefungAnsicht(); }, abbrechenText: 'Prüfung abbrechen', abbrechenFrage: 'Prüfung abbrechen? Deine Antworten gehen verloren.',
      onFertig: function (score, erg, richtig, n) {
        W.app.warnen = null;
        var hatte = !!W.state.data.urkunde;
        W.state.recordPruefung({ score: richtig, n: n, datum: W.logic.heuteISO(), minuten: Math.round((Date.now() - start) / 60000) });
        var gewinn = W.state.addFunken(Math.round(score * 20));
        kopf('Das große Einschalten', '#/');
        var geschafft = score >= 0.8;
        if (geschafft) { W.ton.an(); feuerwerk(3200); }
        W.uebung.ergebnis(r, {
          score: score, richtig: richtig, n: n, funken: gewinn,
          text: geschafft ? (W.stadtteile.every(function (st) { return fortschritt(st).fertig; }) ? (hatte ? 'Wieder geschafft! Die Stadt leuchtet.' : 'Die ganze Stadt leuchtet! Du hast deine Urkunde.') : 'Geschafft, deine Urkunde! Jetzt noch die dunklen Stadtteile zum Leuchten bringen.') : 'Noch ' + (Math.ceil(0.8 * n) - richtig) + ' richtige Aufgaben bis zum großen Einschalten. Schau dir die Fehler unten an und behebe die Störungen.',
          fehler: erg.filter(function (e) { return e && !e.richtig; }),
          knoepfe: [geschafft ? h('a', { class: 'btn btn--licht', href: '#/urkunde' }, 'Urkunde ansehen') : h('a', { class: 'btn btn--licht', href: '#/stoerungen' }, 'Störungen beheben'),
            h('button', { type: 'button', class: 'btn btn--rahmen', onclick: pruefungAnsicht }, 'Nochmal'), h('a', { class: 'btn btn--rahmen', href: '#/' }, 'Zur Stadt')]
        });
      }
    });
  }
  function urkundeAnsicht() {
    kopf('Urkunde', '#/');
    var r = leeren();
    var d = W.state.data;
    if (!d.urkunde) { r.appendChild(h('div', { class: 'blatt' }, h('p', null, 'Die Urkunde gibt es ab 80 % im großen Einschalten.'), h('a', { class: 'btn btn--licht', href: '#/pruefung' }, 'Zur Prüfung'))); return; }
    r.appendChild(h('div', { class: 'blatt urkunde' }, W.uebung.birne(1), h('h2', null, 'Urkunde'), h('p', null, 'Hiermit wird bestätigt, dass'),
      h('div', { class: 'urkunde__name' }, d.name || 'unsere Technikerin'),
      h('p', null, 'die Stadt nach dem großen Stromausfall wieder zum Leuchten gebracht hat und damit den Titel'),
      h('p', { class: 'display', style: { fontSize: '1.6rem' } }, 'Netzmeisterin'),
      h('p', null, 'trägt. Bestes Ergebnis im großen Einschalten: ' + Math.round(d.pruef.best * 100) + ' %.'),
      h('p', { class: 'leise' }, 'Leitstelle, ' + datumText(d.urkunde)),
      h('div', { class: 'knopfreihe nicht-drucken', style: { justifyContent: 'center' } }, h('button', { type: 'button', class: 'btn btn--tinte', onclick: function () { window.print(); } }, 'Drucken'))));
  }

  /* ---------- Spickzettel ---------- */
  function spickAnsicht() {
    kopf('Spickzettel', '#/');
    var r = leeren();
    var blatt = h('div', { class: 'blatt spick' }, h('div', { class: 'spick-kopf' }, h('h2', null, 'Spickzettel Elektrizität'),
      h('button', { type: 'button', class: 'btn btn--tinte btn--klein nicht-drucken', onclick: function () { window.print(); } }, 'Drucken')),
      h('p', { class: 'leise' }, 'Alle Merksätze aus den sechs Stadtteilen. Lies sie dir am Tag vor der Arbeit laut vor.'));
    W.stadtteile.forEach(function (st) {
      blatt.appendChild(h('h3', null, st.nr + '. ' + st.thema));
      st.karten.forEach(function (k) { if (k.merk) blatt.appendChild(h('div', { class: 'merk', html: k.merk })); });
    });
    blatt.appendChild(h('h3', null, 'Formeln'));
    blatt.appendChild(h('table', { class: 'tabelle', html: '<thead><tr><th></th><th>Reihenschaltung</th><th>Parallelschaltung</th></tr></thead><tbody><tr><th>Stromstärke I (in A)</th><td>I = I₁ = I₂</td><td>I = I₁ + I₂ (Knotenregel)</td></tr><tr><th>Spannung U (in V)</th><td>U<sub>Q</sub> = U₁ + U₂ (Maschenregel)</td><td>U<sub>Q</sub> = U₁ = U₂</td></tr></tbody>' }));
    blatt.appendChild(h('h3', null, 'Schaltzeichen'));
    blatt.appendChild(W.art.grafik('schaltzeichen'));
    r.appendChild(blatt);
  }

  /* ---------- Lernplan ---------- */
  var PLAN_NAMEN = { pruefung: ['Das große Einschalten', '#/pruefung'], stoerungen: ['Störungen beheben', '#/stoerungen'], blitz: ['Blitzrunde', '#/blitz'], spick: ['Spickzettel durchlesen', '#/spick'] };
  function planAnsicht() {
    kopf('Lernplan', '#/');
    var r = leeren();
    var d = W.state.data;
    var heute = W.logic.heuteISO();
    var feld = h('input', { type: 'date', class: 'datum-feld', value: d.datum || '', min: heute, 'aria-label': 'Datum der Arbeit', onchange: function () {
      if (feld.value && !(/^\d{4}-\d{2}-\d{2}$/.test(feld.value) && +feld.value.slice(0, 4) >= 2020)) return; // noch beim Tippen
      W.state.setDatum(feld.value); planAnsicht();
    } });
    var blatt = h('div', { class: 'blatt' }, h('h2', null, 'Dein Lernplan'), h('p', null, 'Wann schreibst du die Arbeit?'), feld);
    r.appendChild(blatt);
    if (!d.datum) { blatt.appendChild(h('p', { class: 'leise', style: { marginTop: '12px' } }, 'Trag das Datum ein, dann verteile ich die Stadtteile auf die Tage bis dahin.')); return; }
    var tage = W.logic.tageBis(heute, d.datum);
    var fertigMap = {};
    W.stadtteile.forEach(function (st) { fertigMap[st.id] = fortschritt(st).fertig; });
    var plan = W.logic.lernplan(heute, d.datum, W.logic.planAufgaben(W.stadtteile.map(function (st) { return st.id; }), fertigMap, !!d.urkunde));
    if (tage <= 0) {
      blatt.appendChild(h('p', { style: { marginTop: '12px' } }, tage === 0 ? 'Heute ist die Arbeit. Viel Erfolg! Kurz vorher hilft ein Blick auf den Spickzettel.' : 'Die Arbeit ist vorbei. Trag ein neues Datum ein, wenn du wieder lernen willst.'));
      return;
    }
    blatt.appendChild(h('p', { class: 'display', style: { marginTop: '12px', fontSize: '1.2rem' } }, tage === 1 ? 'Morgen ist die Arbeit!' : 'Noch ' + tage + ' Tage bis zur Arbeit'));
    var liste = h('ol', { class: 'plan-liste' });
    plan.forEach(function (tag) {
      liste.appendChild(h('li', { class: 'plan-tag' + (tag.datum === heute ? ' heute' : '') }, h('span', { class: 'plan-tag__datum' }, (tag.datum === heute ? 'Heute, ' : '') + datumText(tag.datum)),
        h('ul', null, tag.aufgaben.map(function (a) {
          var st = stadtteil(a);
          var name = st ? st.nr + '. ' + st.name + ': ' + st.thema : PLAN_NAMEN[a][0];
          var href = st ? '#/st/' + st.id + '/verstehen' : PLAN_NAMEN[a][1];
          var erledigt = st ? fortschritt(st).fertig : a === 'pruefung' ? !!d.urkunde : false;
          return h('li', { class: erledigt ? 'erledigt' : '' }, h('a', { href: href }, name));
        }))));
    });
    blatt.appendChild(liste);
    blatt.appendChild(h('p', { class: 'leise', style: { marginTop: '12px' } }, 'Der Plan rechnet jeden Tag neu: Was du geschafft hast, fällt heraus, der Rest wird auf die übrigen Tage verteilt.'));
  }

  /* ---------- Geheimnisse ---------- */
  function geheimnisseAnsicht() {
    kopf('Strom-Geheimnisse', '#/');
    var r = leeren();
    var f = W.state.data.funken;
    var blatt = h('div', { class: 'blatt' }, h('h2', null, 'Strom-Geheimnisse'), h('p', null, 'Du hast ' + f + ' Funken. Funken gibt es für jede Verbesserung in einer Übung, in der Blitzrunde und für behobene Störungen.'));
    W.GEHEIMNISSE.forEach(function (g) {
      var offen = f >= g.ab;
      blatt.appendChild(h('div', { class: 'geheimnis' + (offen ? '' : ' zu') }, h('h3', null, offen ? g.titel : 'Geheimnis'), h('p', { style: { margin: '0' } }, offen ? g.text : 'Wird ab ' + g.ab + ' Funken freigeschaltet. Noch ' + (g.ab - f) + '.')));
    });
    r.appendChild(blatt);
  }

  /* ---------- Einstellungen ---------- */
  function einstellungenAnsicht() {
    kopf('Einstellungen', '#/');
    var r = leeren();
    var d = W.state.data;
    var name = h('input', { type: 'text', value: d.name, maxlength: '30', class: 'datum-feld', 'aria-label': 'Dein Name', onchange: function () { W.state.setName(name.value); W.toast('Name gespeichert'); } });
    var ton = h('input', { type: 'checkbox', checked: d.ton !== false, onchange: function () { W.state.setTon(ton.checked); } });
    r.appendChild(h('div', { class: 'blatt' }, h('h2', null, 'Einstellungen'),
      h('div', { class: 'einstellung' }, h('label', null, 'Dein Name'), name),
      h('div', { class: 'einstellung' }, h('label', null, ton, ' Töne an')),
      h('div', { class: 'einstellung' }, h('span', null, 'Datum der Arbeit'), h('a', { href: '#/plan' }, d.datum ? datumText(d.datum) : 'eintragen')),
      h('p', { class: 'leise', style: { marginTop: '14px' } }, 'Dein Fortschritt wird nur auf diesem Gerät gespeichert, nirgendwo sonst. Tipp fürs iPhone und iPad: Leg die Seite über „Teilen → Zum Home-Bildschirm“ ab und lerne immer über dieses Symbol. Dann bleibt dein Fortschritt sicher gespeichert.'),
      h('h3', null, 'Fortschritt sichern oder übertragen'),
      h('p', { class: 'leise' }, 'Kopiere den Code und heb ihn auf (zum Beispiel in einer Nachricht an dich selbst). Auf einem anderen Gerät oder nach dem Löschen fügst du ihn unten wieder ein.'),
      sicherung(),
      h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', style: { color: 'var(--rot)' }, onclick: function () {
        if (window.confirm('Wirklich alles zurücksetzen? Fortschritt, Funken und Störungen werden gelöscht.')) { W.state.reset(); gehe('#/'); }
      } }, 'Fortschritt zurücksetzen')));
  }

  function sicherung() {
    var feld = h('textarea', { class: 'erklaer-feld', style: { minHeight: '90px', fontSize: '16px' }, 'aria-label': 'Sicherungscode' });
    var meldung = h('p', { class: 'leise', 'aria-live': 'polite' });
    return h('div', null, feld, h('div', { class: 'knopfreihe' },
      h('button', { type: 'button', class: 'btn btn--tinte btn--klein', onclick: function () {
        feld.value = W.state.exportCode(); feld.select();
        try { navigator.clipboard.writeText(feld.value).then(function () { meldung.textContent = 'Code kopiert.'; }, function () { meldung.textContent = 'Code markiert – jetzt kopieren.'; }); } catch (e) { meldung.textContent = 'Code markiert – jetzt kopieren.'; }
      } }, 'Code erzeugen und kopieren'),
      h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', onclick: function () {
        if (!feld.value.trim()) { meldung.textContent = 'Füge zuerst einen Code ein.'; return; }
        if (!window.confirm('Fortschritt aus dem Code übernehmen? Der jetzige Stand auf diesem Gerät wird ersetzt.')) return;
        meldung.textContent = W.state.importCode(feld.value) ? 'Fortschritt übernommen.' : 'Der Code ist ungültig. Hast du ihn ganz kopiert?';
      } }, 'Code einfügen und übernehmen')), meldung);
  }

  /* ---------- Begrüßung ---------- */
  function willkommen() {
    kopf('');
    var r = leeren();
    var stadt = W.art.stadt(W.stadtteile, function () { return { p: 0, fertig: false }; }, {}, {});
    var name = h('input', { type: 'text', maxlength: '30', placeholder: 'Dein Vorname', 'aria-label': 'Dein Vorname', autocomplete: 'off' });
    var datum = h('input', { type: 'date', class: 'datum-feld', min: W.logic.heuteISO(), 'aria-label': 'Datum der Arbeit' });
    r.appendChild(h('section', { class: 'stadt' }, stadt.svg, h('div', { class: 'stadt__kopf' }, h('h1', null, 'Lichter an!'), h('p', null, 'Elektrizität, Klasse 7'))));
    r.appendChild(h('div', { class: 'blatt willkommen' },
      h('h2', null, 'Stromausfall!'),
      h('p', null, 'Die ganze Stadt ist dunkel. Du bist die neue Technikerin in der Leitstelle. In sechs Stadtteilen findest du heraus, wie Elektrizität funktioniert – genau die Themen deiner Physikarbeit.'),
      h('p', null, 'Mit jedem Stadtteil, den du schaffst, gehen dort die Lichter wieder an. Am Ende wartet das große Einschalten.'),
      h('label', { style: { display: 'block', fontWeight: '700', marginTop: '16px' } }, 'Wie heißt du?'), name,
      h('label', { style: { display: 'block', fontWeight: '700', marginTop: '14px' } }, 'Wann schreibst du die Arbeit? (kannst du auch später eintragen)'), datum,
      h('div', { class: 'knopfreihe' }, h('button', { type: 'button', class: 'btn btn--licht', onclick: function () {
        W.state.data.begruesst = true;
        W.state.data.name = String(name.value || '').trim().slice(0, 30);
        W.state.data.datum = datum.value || '';
        W.state.save();
        W.ton.an();
        gehe('#/');
        W.app.render();
      } }, 'Los geht’s')),
      h('p', { class: 'leise', style: { marginTop: '14px', fontSize: '0.88rem' } }, 'Alles, was du hier einträgst, bleibt nur auf diesem Gerät. Tipp: Leg die Seite auf dem Handy oder Tablet über „Teilen → Zum Home-Bildschirm“ ab, dann startet sie wie eine App.')));
  }

  /* ---------- Feuerwerk ---------- */
  function feuerwerk(dauer) {
    if (W.reducedMotion()) return;
    var c = document.createElement('canvas');
    c.className = 'feuerwerk';
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = window.innerWidth * dpr; c.height = window.innerHeight * dpr;
    document.body.appendChild(c);
    var ctx = c.getContext('2d');
    if (!ctx) { c.remove(); return; }
    ctx.scale(dpr, dpr);
    var teile = [];
    var farben = ['#ffc531', '#ffe27a', '#ff8a3d', '#7fb2ff', '#ffffff'];
    function knall() {
      var x = window.innerWidth * (0.2 + Math.random() * 0.6), y = window.innerHeight * (0.15 + Math.random() * 0.35);
      for (var i = 0; i < 46; i++) {
        var a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 3.5;
        teile.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, f: farben[i % farben.length] });
      }
    }
    var t0 = performance.now(), letzter = 0;
    function schritt(t) {
      if (t - letzter > 420 && t - t0 < dauer - 600) { knall(); letzter = t; }
      ctx.clearRect(0, 0, c.width, c.height);
      teile.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.l -= 0.013; ctx.globalAlpha = Math.max(0, p.l); ctx.fillStyle = p.f; ctx.fillRect(p.x, p.y, 3, 3); });
      teile = teile.filter(function (p) { return p.l > 0; });
      if (t - t0 < dauer || teile.length) requestAnimationFrame(schritt); else c.remove();
    }
    requestAnimationFrame(schritt);
  }

  function datumText(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    var tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return tage[d.getDay()] + ', ' + (+m[3]) + '.' + (+m[2]) + '.';
  }

  W.ansichten = {
    start: start, stadtteil: stadtteilAnsicht, uebung: uebungAnsicht, baukasten: baukastenAnsicht, blitz: blitzAnsicht,
    stoerungen: stoerungenAnsicht, pruefung: pruefungAnsicht, urkunde: urkundeAnsicht, spick: spickAnsicht, plan: planAnsicht,
    geheimnisse: geheimnisseAnsicht, einstellungen: einstellungenAnsicht, willkommen: willkommen, kopf: kopf, feuerwerk: feuerwerk,
    kopfNeu: function () { kopf(letzterKopf[0], letzterKopf[1]); }
  };
})();
