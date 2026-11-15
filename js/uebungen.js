/* Übungs-Engine: spielt eine Folge von Aufgaben (Items) ab, prüft, gibt Rückmeldung,
   meldet Fehler als Störungen. Item-Typen: wahl, mehrfach, zuordnen, luecke, sortieren,
   zahl, leuchtet, mission, papier. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var h = function () { return W.h.apply(null, arguments); };

  /* ---------- reine Hilfen (testbar) ---------- */

  function parseZahl(s) {
    var t = String(s == null ? '' : s).trim().replace(/[^\d,.\-]/g, '');
    if (!t) return NaN;
    // "1.000" als Tausender? In der Schule selten – Punkt und Komma gelten als Dezimaltrenner.
    t = t.replace(',', '.');
    var n = parseFloat(t);
    return isNaN(n) ? NaN : n;
  }

  function parseLuecke(text) {
    var out = [];
    var re = /\{([^}]+)\}/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) out.push({ text: text.slice(last, m.index) });
      out.push({ optionen: m[1].split('|') });
      last = re.lastIndex;
    }
    if (last < text.length) out.push({ text: text.slice(last) });
    return out;
  }

  function gleicheMenge(a, b) {
    if (a.length !== b.length) return false;
    var x = a.slice().sort(), y = b.slice().sort();
    return x.every(function (v, i) { return v === y[i]; });
  }

  function pruefeItem(item, antwort) {
    switch (item.typ) {
      case 'wahl': return antwort === item.richtig;
      case 'mehrfach': return gleicheMenge(antwort || [], item.richtig);
      case 'zahl':
        var z = parseZahl(antwort);
        return !isNaN(z) && Math.abs(z - item.antwort) <= (item.tol == null ? 0.01 : item.tol);
    }
    return false;
  }

  function schaltungAus(bild) { return W.schaltung.parse(bild.cols, bild.rows, bild.dsl); }

  function ohneTags(t) { return String(t).replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }

  /** Die richtige Lösung als Text (für Rückmeldung und Auswertung). */
  function loesungText(item) {
    switch (item.typ) {
      case 'wahl': {
        var o = item.optionen[item.richtig];
        return o && o.bild ? 'der Schaltplan unten' : ohneTags(o);
      }
      case 'mehrfach': return item.richtig.map(function (i) { return ohneTags(item.optionen[i]); }).join('; ');
      case 'luecke': return ohneTags(item.text.replace(/\{([^}|]+)[^}]*\}/g, '$1'));
      case 'sortieren': return item.kategorien.map(function (k, ki) {
        return k + ': ' + item.items.filter(function (x) { return x[1] === ki; }).map(function (x) { return x[0]; }).join(', ') + '.';
      }).join(' ');
      case 'zahl': return String(item.antwort).replace('.', ',') + ' ' + (item.einheit || '');
      case 'zuordnen': return item.paare.map(function (p) {
        var links = p[0] && p[0].sym ? ((W.schaltbild && W.schaltbild.AUSSEHEN[p[0].sym]) || p[0].sym) : ohneTags(p[0]);
        return links + ' = ' + ohneTags(p[1]);
      }).join('; ');
      case 'leuchtet': { var s = loesungLeuchtet(item); return s.length ? 'Es leuchten: ' + s.join(', ') : 'Keine Lampe leuchtet.'; }
    }
    return '';
  }

  function loesungLeuchtet(item) {
    var sc = schaltungAus(item.bild);
    var sim = W.schaltung.simuliere(sc);
    return Object.keys(sc.teile)
      .filter(function (k) { return sc.teile[k].typ === 'lampe' && sim.teile[k].an; })
      .map(function (k) { return sc.teile[k].name; }).sort();
  }

  /* ---------- Darstellung ---------- */

  function bildEl(item) {
    if (item.bild) {
      var sc = schaltungAus(item.bild);
      return h('div', { class: 'bild bild--schmal' }, W.schaltbild.zeichne(sc, { zuschneiden: true, label: item.bild.label }));
    }
    if (item.grafik && W.art && W.art.grafik) return h('div', { class: 'bild' }, W.art.grafik(item.grafik));
    return null;
  }

  function frageEl(item, zusatz) {
    return h('div', { class: 'aufgabe__frage' }, h('div', { html: item.frage }), zusatz ? h('p', { class: 'leise', style: { fontWeight: '400', fontSize: '0.95rem' } }, zusatz) : null);
  }

  /* Jeder Renderer gibt {el, bereit(), auswerten() -> bool, loesung()} zurück. */
  var R = {};

  R.wahl = function (item, mehr) {
    var ord = item.fest ? item.optionen.map(function (_, i) { return i; }) : W.shuffle(item.optionen.map(function (_, i) { return i; }));
    var gewaehlt = [];
    var bilder = item.optionen.some(function (o) { return o && o.bild; });
    var liste = h('div', { class: 'optionen' + (bilder ? ' optionen--bilder' : '') });
    var knoepfe = [];
    ord.forEach(function (i, pos) {
      var o = item.optionen[i];
      var inhalt = o && o.bild ? W.schaltbild.zeichne(schaltungAus(o.bild), { zuschneiden: true }) : h('span', { html: o });
      var b = h('button', {
        type: 'button', class: 'option' + (mehr ? ' option--mehr' : '') + (o && o.bild ? ' option--bild' : ''), 'aria-pressed': 'false',
        onclick: function () {
          if (b.disabled) return;
          if (mehr) {
            var idx = gewaehlt.indexOf(i);
            if (idx >= 0) gewaehlt.splice(idx, 1); else gewaehlt.push(i);
          } else gewaehlt = [i];
          knoepfe.forEach(function (k) { k.el.setAttribute('aria-pressed', String(gewaehlt.indexOf(k.i) >= 0)); });
          W.ton.klick();
          api.onAenderung();
        }
      }, o && o.bild ? null : h('span', { class: 'option__marke', 'aria-hidden': 'true' }, String.fromCharCode(65 + pos)), inhalt);
      knoepfe.push({ el: b, i: i });
      liste.appendChild(b);
    });
    var api = {
      el: h('div', null, frageEl(item, mehr ? 'Mehrere Antworten können richtig sein.' : null), bildEl(item), liste),
      bereit: function () { return gewaehlt.length > 0; },
      auswerten: function () {
        var ok = pruefeItem(item, mehr ? gewaehlt : gewaehlt[0]);
        var richtige = mehr ? item.richtig : [item.richtig];
        knoepfe.forEach(function (k) {
          k.el.disabled = true;
          var sollte = richtige.indexOf(k.i) >= 0;
          var hat = gewaehlt.indexOf(k.i) >= 0;
          if (sollte && hat) k.el.classList.add('richtig');
          else if (hat) k.el.classList.add('falsch');
          else if (sollte) k.el.classList.add('verpasst');
        });
        return ok;
      },
      onAenderung: function () {}
    };
    return api;
  };
  R.mehrfach = function (item) { return R.wahl(item, true); };

  R.zuordnen = function (item) {
    var links = item.paare.map(function (p, i) { return { i: i, inhalt: p[0] }; });
    var rechts = W.shuffleNot(item.paare.map(function (p, i) { return { i: i, inhalt: p[1] }; }));
    var verb = {}; // linksIndex -> rechtsIndex
    var wahlL = null, wahlR = null;
    var elL = {}, elR = {};
    function inhalt(x) {
      if (x && x.sym) return W.schaltbild.symbol(x.sym, { label: 'Schaltzeichen' });
      return h('span', { html: x });
    }
    function nummer(li) { return Object.keys(verb).map(Number).sort().indexOf(li) + 1; }
    function zeichne() {
      Object.keys(elL).forEach(function (li) {
        li = +li;
        var e = elL[li];
        e.classList.toggle('gewaehlt', wahlL === li);
        e.classList.toggle('verbunden', verb[li] != null);
        var badge = e.querySelector('.zu-nr');
        if (badge) badge.remove();
        if (verb[li] != null) e.insertBefore(h('span', { class: 'zu-nr' }, String(nummer(li))), e.firstChild);
      });
      Object.keys(elR).forEach(function (ri) {
        ri = +ri;
        var e = elR[ri];
        var li = Object.keys(verb).filter(function (k) { return verb[k] === ri; })[0];
        e.classList.toggle('gewaehlt', wahlR === ri);
        e.classList.toggle('verbunden', li != null);
        var badge = e.querySelector('.zu-nr');
        if (badge) badge.remove();
        if (li != null) e.insertBefore(h('span', { class: 'zu-nr' }, String(nummer(+li))), e.firstChild);
      });
    }
    function verbinde() {
      if (wahlL == null || wahlR == null) return;
      Object.keys(verb).forEach(function (k) { if (verb[k] === wahlR) delete verb[k]; });
      verb[wahlL] = wahlR;
      wahlL = wahlR = null;
      W.ton.klick();
      api.onAenderung();
    }
    var spL = h('div', { class: 'zuordnen__spalte' });
    var spR = h('div', { class: 'zuordnen__spalte' });
    links.forEach(function (x) {
      var b = h('button', { type: 'button', class: 'zu-karte', onclick: function () {
        if (api.fertig) return;
        if (verb[x.i] != null) { delete verb[x.i]; wahlL = null; zeichne(); api.onAenderung(); return; }
        wahlL = wahlL === x.i ? null : x.i; verbinde(); zeichne();
      } }, inhalt(x.inhalt));
      elL[x.i] = b; spL.appendChild(b);
    });
    rechts.forEach(function (x) {
      var b = h('button', { type: 'button', class: 'zu-karte', onclick: function () {
        if (api.fertig) return;
        var li = Object.keys(verb).filter(function (k) { return verb[k] === x.i; })[0];
        if (li != null) { delete verb[li]; wahlR = null; zeichne(); api.onAenderung(); return; }
        wahlR = wahlR === x.i ? null : x.i; verbinde(); zeichne();
      } }, inhalt(x.inhalt));
      elR[x.i] = b; spR.appendChild(b);
    });
    var api = {
      el: h('div', null, frageEl(item, 'Tippe links und dann rechts, um ein Paar zu bilden. Nochmal tippen löst das Paar.'), h('div', { class: 'zuordnen' }, spL, spR)),
      bereit: function () { return Object.keys(verb).length === item.paare.length; },
      auswerten: function () {
        api.fertig = true;
        var ok = true;
        Object.keys(verb).forEach(function (li) {
          var r = verb[li] === +li;
          if (!r) ok = false;
          elL[li].classList.add(r ? 'richtig' : 'falsch');
          elR[verb[li]].classList.add(r ? 'richtig' : 'falsch');
          if (!r) elL[li].appendChild(h('span', { class: 'zu-soll', html: 'richtig: ' + item.paare[li][1] }));
        });
        return ok;
      },
      onAenderung: function () {}
    };
    zeichne();
    return api;
  };

  R.luecke = function (item) {
    var teile = parseLuecke(item.text);
    var felder = [];
    var p = h('p', { class: 'luecken-text' });
    teile.forEach(function (t) {
      if (t.text != null) { p.appendChild(h('span', { html: t.text })); return; }
      var ord = W.shuffle(t.optionen.map(function (_, i) { return i; }));
      var sel = h('select', { 'aria-label': 'Lücke ' + (felder.length + 1), onchange: function () { api.onAenderung(); } },
        h('option', { value: '' }, '…'),
        ord.map(function (i) { return h('option', { value: String(i) }, t.optionen[i]); }));
      var wrap = h('span', { class: 'luecke' }, sel);
      felder.push({ sel: sel, wrap: wrap, richtig: t.optionen[0] });
      p.appendChild(wrap);
    });
    var api = {
      el: h('div', null, item.frage ? frageEl(item) : h('div', { class: 'aufgabe__frage' }, 'Wähle in jeder Lücke das passende Wort.'), bildEl(item), p),
      bereit: function () { return felder.every(function (f) { return f.sel.value !== ''; }); },
      auswerten: function () {
        var ok = true;
        felder.forEach(function (f) {
          var r = f.sel.value === '0';
          if (!r) ok = false;
          f.sel.disabled = true;
          f.wrap.classList.add(r ? 'richtig' : 'falsch');
          if (!r) f.wrap.appendChild(h('span', { class: 'luecke__loesung' }, '→ ' + f.richtig));
        });
        return ok;
      },
      onAenderung: function () {}
    };
    return api;
  };

  R.sortieren = function (item) {
    var ort = {}; // index -> kiste (oder undefined = Vorrat)
    var gewaehlt = null;
    var vorrat = h('div', { class: 'sortieren__vorrat', 'aria-label': 'Noch nicht einsortiert' });
    var kisten = item.kategorien.map(function (name, k) {
      var inh = h('div', { class: 'kiste__inhalt' });
      var el = h('div', {
        class: 'kiste', role: 'button', tabindex: '0', 'aria-label': 'In ' + name + ' legen',
        onclick: function (ev) { if (ev.target.closest('.chip')) return; lege(k); },
        onkeydown: function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); lege(k); } }
      }, h('span', { class: 'kiste__name' }, name), inh);
      return { el: el, inh: inh };
    });
    var reihenfolge = W.shuffle(item.items.map(function (_, i) { return i; }));
    var chips = {};
    reihenfolge.forEach(function (i) {
      chips[i] = h('button', { type: 'button', class: 'chip', onclick: function () {
        if (api.fertig) return;
        if (gewaehlt != null && gewaehlt !== i && ort[i] != null) { lege(ort[i]); return; }
        gewaehlt = gewaehlt === i ? null : i;
        W.ton.klick();
        zeichne();
      } }, item.items[i][0]);
    });
    function lege(k) {
      if (gewaehlt == null || api.fertig) return;
      ort[gewaehlt] = k;
      gewaehlt = null;
      W.ton.klick();
      zeichne();
      api.onAenderung();
    }
    function zeichne() {
      vorrat.innerHTML = '';
      kisten.forEach(function (k) { k.inh.innerHTML = ''; k.el.classList.toggle('ziel', gewaehlt != null); });
      reihenfolge.forEach(function (i) {
        chips[i].classList.toggle('gewaehlt', gewaehlt === i);
        (ort[i] == null ? vorrat : kisten[ort[i]].inh).appendChild(chips[i]);
      });
      if (!vorrat.childNodes.length) vorrat.appendChild(h('span', { class: 'leise' }, 'Alles einsortiert.'));
    }
    var api = {
      el: h('div', null, frageEl(item, 'Tippe ein Kärtchen an und dann die passende Kiste. Ein Kärtchen in der Kiste kannst du neu antippen und umlegen.'), vorrat, h('div', { class: 'sortieren__kisten' }, kisten.map(function (k) { return k.el; }))),
      bereit: function () { return Object.keys(ort).length === item.items.length; },
      auswerten: function () {
        api.fertig = true;
        var ok = true;
        item.items.forEach(function (it, i) {
          var r = ort[i] === it[1];
          if (!r) ok = false;
          chips[i].classList.add(r ? 'richtig' : 'falsch');
          if (!r) chips[i].appendChild(h('span', { class: 'chip__soll' }, ' → ' + item.kategorien[it[1]]));
        });
        return ok;
      },
      onAenderung: function () {}
    };
    zeichne();
    return api;
  };

  R.zahl = function (item) {
    var inp = h('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', 'aria-label': 'Antwort in ' + (item.einheit || ''), oninput: function () { api.onAenderung(); },
      onkeydown: function (ev) { if (ev.key === 'Enter' && api.bereit()) { ev.preventDefault(); api.enter(); } } });
    var api = {
      el: h('div', null, frageEl(item), bildEl(item), h('div', { class: 'zahl-feld' }, item.vor ? h('span', { class: 'zahl-feld__einheit', html: item.vor }) : null, inp, h('span', { class: 'zahl-feld__einheit' }, item.einheit || ''))),
      bereit: function () { return !isNaN(parseZahl(inp.value)); },
      auswerten: function () {
        var ok = pruefeItem(item, inp.value);
        inp.disabled = true;
        inp.classList.add(ok ? 'richtig' : 'falsch');
        return ok;
      },
      loesungText: function () { return String(item.antwort).replace('.', ',') + ' ' + (item.einheit || ''); },
      onAenderung: function () {}, enter: function () {}
    };
    var feinerZeiger = false;
    try { feinerZeiger = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) { /* egal */ }
    if (feinerZeiger) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) { /* egal */ } }, 50);
    return api;
  };

  R.leuchtet = function (item) {
    var sc = schaltungAus(item.bild);
    var markiert = {};
    var fertig = false;
    var halter = h('div', { class: 'bild bild--schmal' });
    var lampen = {};
    Object.keys(sc.teile).forEach(function (k) { if (sc.teile[k].typ === 'lampe') lampen[k] = true; });
    var ruhe = { kurzschluss: false, quelle: { I: 0 }, teile: {} };
    Object.keys(sc.teile).forEach(function (k) { ruhe.teile[k] = { an: false }; });
    function zeichne(sim) {
      halter.innerHTML = '';
      halter.appendChild(W.schaltbild.zeichne(sc, {
        sim: sim || ruhe, zuschneiden: true, markiert: markiert, klickbar: lampen, nurTeile: true,
        onKante: function (k) { if (fertig) return; markiert[k] = !markiert[k]; W.ton.klick(); zeichne(); api.onAenderung(); }
      }));
    }
    zeichne();
    var api = {
      el: h('div', null, frageEl(item, 'Tippe die Lampen an, die leuchten. Leuchtet keine, markierst du keine.'), halter),
      bereit: function () { return true; },
      auswerten: function () {
        fertig = true;
        var soll = loesungLeuchtet(item);
        var ist = Object.keys(markiert).filter(function (k) { return markiert[k]; }).map(function (k) { return sc.teile[k].name; }).sort();
        zeichne(W.schaltung.simuliere(sc)); // jetzt geht das Licht wirklich an
        return gleicheMenge(soll, ist);
      },
      loesungText: function () { var s = loesungLeuchtet(item); return s.length ? 'Es leuchten: ' + s.join(', ') : 'Keine Lampe leuchtet.'; },
      onAenderung: function () {}
    };
    return api;
  };

  R.mission = function (item) {
    var geloest = null;
    var halter = h('div');
    var loesungHalter = h('div');
    var api = {
      el: h('div', null,
        h('div', { class: 'mission-ziel' }, h('span', { html: item.frage }), item.tipp ? h('small', { html: item.tipp }) : null),
        halter, loesungHalter),
      bereit: function () { return geloest !== null; },
      auswerten: function () { return geloest === true; },
      ohnePruefen: true,
      onAenderung: function () {}
    };
    W.baukasten.mount(halter, {
      cols: item.cols || 5, rows: item.rows || 4, dsl: item.start, palette: item.palette, ziel: item.ziel,
      fest: item.start ? festeKanten(item) : null,
      onGeloest: function () { if (geloest === null) { geloest = true; api.onAenderung(true); } }
    });
    api.aufgeben = function () {
      geloest = false;
      loesungHalter.innerHTML = '';
      loesungHalter.appendChild(h('div', { class: 'muster' }, h('strong', null, 'So könnte es aussehen:'),
        h('div', { class: 'bild bild--schmal' }, W.schaltbild.zeichne(W.schaltung.parse(item.cols || 5, item.rows || 4, item.loesung), { zuschneiden: true }))));
      api.onAenderung(true);
    };
    return api;
  };
  function festeKanten(item) {
    var f = {};
    if (!item.startFest) return f;
    var sc = W.schaltung.parse(item.cols || 5, item.rows || 4, item.start);
    Object.keys(sc.teile).forEach(function (k) { f[k] = true; });
    return f;
  }

  R.papier = function (item) {
    var phase = 0;
    var checks = [];
    var unten = h('div');
    var api = {
      el: h('div', null, frageEl(item, 'Zeichne die Schaltskizze mit Bleistift und Lineal auf ein Blatt. Danach vergleichst du mit der Lösung.'), bildEl(item), unten),
      bereit: function () { return phase === 1; },
      auswerten: function () {
        checks.forEach(function (c) { c.disabled = true; });
        return checks.every(function (c) { return c.checked; });
      },
      onAenderung: function () {}
    };
    unten.appendChild(h('button', { type: 'button', class: 'btn btn--tinte', onclick: function (ev) {
      ev.currentTarget.remove();
      phase = 1;
      var lsg = item.loesung;
      unten.appendChild(h('div', { class: 'muster' }, h('strong', null, 'Musterlösung'),
        h('div', { class: 'bild bild--schmal' }, W.schaltbild.zeichne(W.schaltung.parse(lsg.cols, lsg.rows, lsg.dsl), { zuschneiden: true })),
        item.hinweis ? h('p', { html: item.hinweis }) : null));
      unten.appendChild(h('p', { style: { marginTop: '12px', fontWeight: '700' } }, 'Hake ab, was bei deiner Skizze stimmt:'));
      var liste = h('ul', { class: 'check-liste' });
      (item.check || []).forEach(function (txt) {
        var cb = h('input', { type: 'checkbox' });
        checks.push(cb);
        liste.appendChild(h('li', null, h('label', null, cb, h('span', { html: txt }))));
      });
      unten.appendChild(liste);
      api.onAenderung();
    } }, 'Ich habe gezeichnet – Lösung zeigen'));
    return api;
  };

  /* ---------- Ablauf ---------- */

  /**
   * opts: modus ('ueben'|'pruefung'|'stoerung'), ids (Item-IDs), sofort (Rückmeldung je Aufgabe, Standard true),
   *       onFertig(score, ergebnisse), titel
   */
  function spiele(host, uebung, opts) {
    opts = opts || {};
    var items = uebung.items;
    var ids = opts.ids || items.map(function (_, i) { return uebung.id + '.' + i; });
    var sofort = opts.sofort !== false;
    var pos = 0;
    var ergebnisse = [];

    var blatt = h('div', { class: 'blatt aufgabe' });
    host.innerHTML = '';
    host.appendChild(blatt);

    function punkte() {
      return h('div', { class: 'punkte-reihe', 'aria-label': 'Aufgabe ' + (pos + 1) + ' von ' + items.length },
        items.map(function (_, i) {
          var e = ergebnisse[i];
          return h('span', { class: i === pos ? 'jetzt' : e == null ? '' : (sofort ? (e.richtig ? 'richtig' : 'falsch') : 'beantwortet') });
        }));
    }

    function zeige() {
      var item = items[pos];
      var r = R[item.typ];
      if (!r) throw new Error('Unbekannter Aufgabentyp: ' + item.typ);
      var api = r(item);
      blatt.innerHTML = '';
      blatt.appendChild(h('div', { class: 'aufgabe__kopf' }, h('span', { class: 'display', style: { fontSize: '0.95rem', color: 'var(--tinte-leise)' } }, 'Aufgabe ' + (pos + 1) + ' von ' + items.length), punkte()));
      blatt.appendChild(api.el);
      var unten = h('div', { class: 'knopfreihe' });
      var rueck = h('div', { 'aria-live': 'polite' });
      blatt.appendChild(rueck);
      blatt.appendChild(unten);

      var pruefKnopf = h('button', { type: 'button', class: 'btn btn--licht', disabled: !api.bereit(), onclick: auswerten }, sofort ? 'Prüfen' : 'Antwort speichern');
      if (!api.ohnePruefen) unten.appendChild(pruefKnopf);
      if (item.typ === 'mission') {
        unten.appendChild(h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', onclick: function () { api.aufgeben(); } }, 'Lösung zeigen'));
      }
      if (opts.onAbbrechen) {
        unten.appendChild(h('button', { type: 'button', class: 'btn btn--rahmen btn--klein', onclick: function () {
          if (window.confirm(opts.abbrechenFrage || 'Wirklich abbrechen?')) opts.onAbbrechen();
        } }, opts.abbrechenText || 'Abbrechen'));
      }
      api.onAenderung = function (sofortAuswerten) {
        pruefKnopf.disabled = !api.bereit();
        if (sofortAuswerten === true) auswerten();
      };
      api.enter = function () { if (!pruefKnopf.disabled) auswerten(); };

      var erledigt = false;
      function auswerten() {
        if (erledigt) return;
        erledigt = true;
        var ok = !!api.auswerten();
        ergebnisse[pos] = { id: ids[pos], richtig: ok, item: item, loesung: loesungText(item) };
        // Störungen: falsch legt eine an, richtig zählt gegen eine offene (nach 2x richtig behoben)
        if (ok) { if (W.state.stoerungRichtig(ids[pos])) W.toast('Störung behoben!', 'funken'); }
        else W.state.stoerungFalsch(ids[pos]);

        unten.innerHTML = '';
        if (sofort) {
          if (ok) W.ton.richtig(); else W.ton.falsch();
          rueck.appendChild(h('div', { class: 'rueck ' + (ok ? 'rueck--richtig' : 'rueck--falsch') },
            h('span', { class: 'rueck__titel' }, ok ? lob() : 'Nicht ganz.'),
            !ok && api.loesungText && item.typ !== 'mission' ? h('p', null, h('strong', null, 'Richtig wäre: '), api.loesungText()) : null,
            item.erkl ? h('p', { html: item.erkl, style: { marginBottom: '0' } }) : null));
        }
        var letzte = pos === items.length - 1;
        var weiter = h('button', { type: 'button', class: 'btn btn--licht', onclick: function () {
          if (letzte) fertig(); else { pos++; zeige(); blatt.scrollIntoView({ block: 'start', behavior: W.reducedMotion() ? 'auto' : 'smooth' }); }
        } }, letzte ? 'Auswertung' : 'Weiter');
        unten.appendChild(weiter);
        if (sofort) { try { weiter.focus({ preventScroll: true }); } catch (e) { /* egal */ } } else weiter.click();
      }
    }

    function fertig() {
      var richtig = ergebnisse.filter(function (e) { return e && e.richtig; }).length;
      var score = items.length ? richtig / items.length : 0;
      if (opts.onFertig) opts.onFertig(score, ergebnisse, richtig, items.length);
    }

    zeige();
  }

  var LOB = ['Richtig!', 'Genau!', 'Stimmt!', 'Sehr gut!', 'Super, richtig!'];
  function lob() { return LOB[Math.floor(Math.random() * LOB.length)]; }

  /** Glühbirne, deren Helligkeit den Anteil zeigt (0..1). */
  function birne(anteil, klasse) {
    var a = Math.max(0, Math.min(1, anteil));
    return W.frag('<svg class="' + (klasse || 'ergebnis__birne') + '" viewBox="0 0 64 64" aria-hidden="true">' +
      '<circle cx="32" cy="26" r="' + (14 + 16 * a) + '" fill="#ffc531" opacity="' + (0.15 + 0.5 * a) + '"/>' +
      '<path d="M32 6a18 18 0 0 0-10 33c2 2 3 4 3 7h14c0-3 1-5 3-7A18 18 0 0 0 32 6z" fill="' + (a > 0.05 ? '#ffc531' : '#fff') + '" fill-opacity="' + (0.25 + 0.75 * a) + '" stroke="#1c2340" stroke-width="3"/>' +
      '<path d="M25 50h14M26 55h12M29 60h6" stroke="#1c2340" stroke-width="3" stroke-linecap="round"/></svg>');
  }

  /** Auswertung einer Übung anzeigen. */
  function ergebnis(host, d) {
    host.innerHTML = '';
    var blatt = h('div', { class: 'blatt ergebnis' },
      birne(d.score),
      h('div', { class: 'ergebnis__zahl' }, d.richtig + ' / ' + d.n),
      h('p', null, d.text || ''),
      d.funken > 0 ? h('p', { class: 'display', style: { color: '#9a6b00' } }, '+' + d.funken + ' Funken') : null,
      d.extra || null,
      h('div', { class: 'knopfreihe', style: { justifyContent: 'center' } }, d.knoepfe || []));
    host.appendChild(blatt);
    if (d.fehler && d.fehler.length) {
      var liste = h('div', { class: 'blatt' }, h('h3', { style: { marginTop: '0' } }, 'Das solltest du dir nochmal ansehen'));
      d.fehler.forEach(function (e) {
        var it = e.item;
        var lsgBild = null;
        if (it.typ === 'wahl' && it.optionen[it.richtig] && it.optionen[it.richtig].bild) {
          lsgBild = h('div', { class: 'bild bild--schmal' }, W.schaltbild.zeichne(schaltungAus(it.optionen[it.richtig].bild), { zuschneiden: true }));
        }
        liste.appendChild(h('div', { class: 'achtung fehler-eintrag' },
          h('div', { html: it.frage || 'Lückentext' }),
          it.typ !== 'leuchtet' ? bildEl(it) : null,
          h('p', { style: { margin: '6px 0 0' } }, h('strong', null, 'Richtig: '), e.loesung || loesungText(it)),
          lsgBild,
          it.erkl ? h('p', { html: it.erkl, style: { margin: '6px 0 0' } }) : null));
      });
      host.appendChild(liste);
    }
  }

  /** Erklär-Aufgabe: eigener Text, dann Checkpunkte und Musterantwort. */
  function erklaeren(host, aufgabe, onGezeigt) {
    var st = W.state.erklaeren(aufgabe.id);
    var feld = h('textarea', { class: 'erklaer-feld', 'aria-label': 'Deine Erklärung', placeholder: 'Schreib deine Erklärung hier hin, in ganzen Sätzen.' });
    feld.value = st.text || '';
    var timer = null;
    feld.addEventListener('input', function () {
      clearTimeout(timer);
      timer = setTimeout(function () { W.state.saveErklaeren(aufgabe.id, { text: feld.value }); }, 400);
    });
    var unten = h('div');
    var blatt = h('div', { class: 'blatt' },
      h('h3', { style: { marginTop: '0' }, html: aufgabe.frage }),
      aufgabe.tipp ? h('p', { class: 'leise', html: aufgabe.tipp }) : null,
      feld, unten);
    function zeigeVergleich() {
      unten.innerHTML = '';
      var punkte = W.state.erklaeren(aufgabe.id).punkte || [];
      var liste = h('ul', { class: 'check-liste' });
      aufgabe.punkte.forEach(function (p, i) {
        var cb = h('input', { type: 'checkbox', onchange: function () {
          var neu = (W.state.erklaeren(aufgabe.id).punkte || []).slice();
          neu[i] = cb.checked;
          W.state.saveErklaeren(aufgabe.id, { punkte: neu });
        } });
        cb.checked = !!punkte[i];
        liste.appendChild(h('li', null, h('label', null, cb, h('span', { html: p }))));
      });
      unten.appendChild(h('p', { style: { marginTop: '14px', fontWeight: '700' } }, 'Kommt das in deiner Erklärung vor? Hake ab.'));
      unten.appendChild(liste);
      unten.appendChild(h('div', { class: 'muster' }, h('strong', null, 'So könnte eine gute Antwort lauten:'), h('p', { html: aufgabe.muster, style: { margin: '6px 0 0' } })));
    }
    if (st.gezeigt) zeigeVergleich();
    else {
      var hinweis = h('p', { class: 'leise', 'aria-live': 'polite', style: { marginTop: '8px' } });
      unten.appendChild(hinweis);
      unten.appendChild(h('div', { class: 'knopfreihe' }, h('button', { type: 'button', class: 'btn btn--tinte', onclick: function () {
        if (feld.value.trim().length < 20) { hinweis.textContent = 'Schreib zuerst mindestens einen ganzen Satz. Dann vergleichst du – so lernst du am meisten.'; feld.focus(); return; }
        W.state.saveErklaeren(aufgabe.id, { text: feld.value, gezeigt: true });
        zeigeVergleich();
        if (onGezeigt) onGezeigt();
      } }, 'Mit der Musterantwort vergleichen')));
    }
    host.appendChild(blatt);
  }

  W.uebung = {
    parseZahl: parseZahl, parseLuecke: parseLuecke, pruefeItem: pruefeItem, loesungLeuchtet: loesungLeuchtet, loesungText: loesungText,
    spiele: spiele, ergebnis: ergebnis, erklaeren: erklaeren, birne: birne, renderer: R
  };
})();
