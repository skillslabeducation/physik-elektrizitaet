/* Abschlussprüfung „Das große Einschalten“: eigener Fragenpool je Stadtteil, Ziehung, Item-Suche. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var R = 'Reihenschaltung', P = 'Parallelschaltung', U = 'UND-Schaltung', O = 'ODER-Schaltung';
  var ODER = '0,2 u:B u:- r:S1 r:- d:- d:L1 l:- l:- | 0,1 r:S2 r:-';
  var UND = '0,1 u:B r:S1 r:S2 r:L1 d:- l:- l:- l:-';

  W.PRUEFUNG = {
    ladung: [
      { typ: 'wahl', frage: 'Ein Glasstab wird mit einem Ledertuch gerieben. Wie ist der Glasstab danach geladen?', optionen: ['positiv', 'negativ', 'ungeladen'], richtig: 0, erkl: 'Glas gibt beim Reiben mit Leder negative Ladung ab, ihm fehlt dann negative Ladung.' },
      { typ: 'luecke', text: 'Ein Körper mit einem Überschuss an negativer Ladung ist {negativ|positiv} geladen. Ein Körper mit einem Mangel an negativer Ladung ist {positiv|negativ} geladen.' },
      { typ: 'wahl', frage: 'Zwei Kugeln wurden mit demselben geriebenen Glasstab berührt. Was passiert, wenn man sie nahe zusammenbringt?', optionen: ['Sie stoßen sich ab.', 'Sie ziehen sich an.', 'Nichts.'], richtig: 0 },
      { typ: 'mehrfach', frage: 'Welche Aussagen über das Elektroskop stimmen?', optionen: ['Es zeigt an, ob ein Körper geladen ist.', 'Bei mehr Ladung schlägt der Zeiger weiter aus.', 'Es zeigt an, ob die Ladung positiv ist.', 'Der Zeiger wird vom Stab angezogen.'], richtig: [0, 1] },
      { typ: 'wahl', frage: 'Eine positiv und eine gleich stark negativ geladene Metallkugel berühren sich. Wie sind sie danach geladen?', optionen: ['Beide sind ungeladen.', 'Beide sind positiv.', 'Beide sind negativ.'], richtig: 0, erkl: 'Positive und negative Ladung neutralisieren sich.' },
      { typ: 'wahl', frage: 'Du berührst eine positiv geladene Kugel mit einer Glimmlampe, die du in der Hand hältst. Wo leuchtet die Glimmlampe?', optionen: ['An der Seite, die von der Kugel weg zur Hand zeigt', 'An der Seite zur Kugel hin', 'Gar nicht'], richtig: 0, erkl: 'So steht es im Buch: Bei einer positiv geladenen Kugel leuchtet die Glimmlampe an der Seite, die von der Kugel abgewandt ist. Bei einer negativ geladenen leuchtet die Seite zur Kugel.' }
    ],
    stromkreis: [
      { typ: 'leuchtet', frage: 'Welche Lampe leuchtet?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1 r:L1 d:- l:S2* l:-' }, erkl: 'S1 ist offen. Ein offener Schalter genügt, um den einzigen Weg zu unterbrechen.' },
      { typ: 'wahl', frage: 'Welcher Stoff ist ein Leiter?', optionen: ['Graphit (Bleistiftmine)', 'Glas', 'Gummi', 'Porzellan'], richtig: 0 },
      { typ: 'zuordnen', frage: 'Ordne die Schaltzeichen zu.', paare: [[{ sym: 'batterie' }, 'Batterie'], [{ sym: 'lampe' }, 'Glühlampe'], [{ sym: 'motor' }, 'Motor'], [{ sym: 'sicherung' }, 'Sicherung']] },
      { typ: 'wahl', frage: 'Wann ist ein Stromkreis geschlossen?', optionen: ['Wenn es einen durchgehenden Weg aus Leitern vom einen Pol durch das Gerät zum anderen Pol gibt', 'Wenn die Batterie neu ist', 'Wenn der Schalter offen ist'], richtig: 0 },
      { typ: 'mehrfach', frage: 'Welche Dinge sind elektrische Quellen?', optionen: ['Batterie', 'Beleuchtete Solarzelle', 'Dynamo', 'Glühlampe', 'Schalter'], richtig: [0, 1, 2] },
      { typ: 'wahl', frage: 'Was ist ein Kurzschluss?', optionen: ['Die Pole der Quelle sind direkt durch eine Leitung verbunden, ohne Gerät dazwischen.', 'Ein besonders kurzes Kabel', 'Ein Stromkreis mit nur einer Lampe'], richtig: 0 }
    ],
    reihe: [
      { typ: 'zahl', frage: 'Parallelschaltung: I₁ = 0,4 A und I₂ = 0,4 A. Wie groß ist die Stromstärke I in der gemeinsamen Leitung?', vor: 'I =', antwort: 0.8, einheit: 'A', erkl: 'Knotenregel: I = I₁ + I₂' },
      { typ: 'zahl', frage: 'Reihenschaltung: Drei gleiche Lampen hängen an einer 4,5-V-Batterie. Welche Spannung liegt an jeder Lampe?', antwort: 1.5, einheit: 'V', erkl: '4,5 V : 3 = 1,5 V' },
      { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:L1 r:- r:- d:L2 l:L3 l:- l:-' }, optionen: [R, P], richtig: 0, fest: true },
      { typ: 'luecke', text: 'In einer Parallelschaltung ist die Spannung an jedem Gerät {genauso groß wie|kleiner als} die Spannung der Quelle. In einer Reihenschaltung ist sie {kleiner als|genauso groß wie} die Spannung der Quelle.' },
      { typ: 'wahl', frage: 'Zwei gleiche Lampen sind in Reihe an 6 V geschaltet. Welche Spannung liegt an jeder Lampe?', optionen: ['3 V', '6 V', '12 V'], richtig: 0 },
      { typ: 'wahl', frage: 'Was gilt für die Stromstärke in einer Reihenschaltung?', optionen: ['Sie ist überall gleich.', 'Sie nimmt hinter jeder Lampe ab.', 'Sie teilt sich auf die Lampen auf.'], richtig: 0 },
      { typ: 'leuchtet', frage: 'L2 ist herausgedreht. Welche Lampen leuchten?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:- d:L1 l:- | 1,0 r:- d:L2x l:-' } }
    ],
    sinnvoll: [
      { typ: 'wahl', frage: 'Warum sind Steckdosen im Haus parallel geschaltet?', optionen: ['Jede Steckdose bekommt die volle Netzspannung, und die Geräte arbeiten unabhängig voneinander.', 'Damit sich die Spannung auf alle Geräte aufteilt.', 'Weil man dann weniger Kabel braucht.'], richtig: 0 },
      { typ: 'wahl', frage: 'Eine Lichterkette mit 16 Kerzen zu je 15 V soll an der Steckdose (230 V) leuchten.', optionen: [R, P], richtig: 0, fest: true, erkl: 'In Reihe bekommt jede Kerze 230 V : 16 ≈ 14,4 V, das ist weniger als 15 V. Parallel bekäme jede 230 V und würde durchbrennen.' },
      { typ: 'wahl', frage: 'Welchen Nachteil hat die Parallelschaltung?', optionen: ['Mit jedem Gerät wird die Stromstärke in der gemeinsamen Leitung größer.', 'Fällt ein Gerät aus, sind alle aus.', 'Die Lampen leuchten schwächer.'], richtig: 0 },
      { typ: 'wahl', frage: 'Ein Schalter soll nur Lampe L2 einer Parallelschaltung schalten. Wo sitzt er?', optionen: ['Im Zweig von L2', 'In der gemeinsamen Leitung', 'Im Zweig von L1'], richtig: 0 },
      { typ: 'wahl', frage: 'Zwei 6-V-Lampen sollen an einer 6-V-Batterie normal hell leuchten.', optionen: [R, P], richtig: 1, fest: true, erkl: 'Nur parallel bekommt jede Lampe die vollen 6 V.' }
    ],
    undoder: [
      { typ: 'wahl', frage: 'Eine Kaffeemaschine läuft nur, wenn der Wassertank eingesetzt ist und die Starttaste gedrückt wird.', optionen: [U, O], richtig: 0, fest: true },
      { typ: 'wahl', frage: 'Das Treppenlicht soll sich mit einem Taster auf jeder Etage einschalten lassen.', optionen: [U, O], richtig: 1, fest: true },
      { typ: 'leuchtet', frage: 'Beide Schalter sind geschlossen. Leuchtet die Lampe?', bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:S1* r:- d:- d:L1 l:- l:- | 0,1 r:S2* r:-' } },
      { typ: 'luecke', text: 'Bei einer UND-Schaltung leuchtet die Lampe nur, wenn {alle Schalter geschlossen sind|ein Schalter geschlossen ist}. Bei einer ODER-Schaltung reicht es, wenn {ein Schalter geschlossen ist|alle Schalter offen sind}.' },
      { typ: 'wahl', frage: 'Welche Schaltung zeigt der Plan?', bild: { cols: 3, rows: 3, dsl: ODER }, optionen: [U, O], richtig: 1, fest: true },
      { typ: 'wahl', frage: 'UND-Schaltung: S1 ist geschlossen, S2 offen. Leuchtet die Lampe?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1* r:S2 r:L1 d:- l:- l:- l:-' }, optionen: ['Nein', 'Ja'], richtig: 0, fest: true }
    ],
    skizzen: [
      { typ: 'wahl', frage: 'Eine Lampe soll mit Schalter S1 oder mit Schalter S2 einschaltbar sein. Welcher Plan passt?', optionen: [{ bild: { cols: 4, rows: 2, dsl: UND } }, { bild: { cols: 3, rows: 3, dsl: ODER } }], richtig: 1 },
      { typ: 'wahl', frage: 'Wie sind Scheinwerfer und Rücklicht beim Fahrrad geschaltet?', optionen: [P, R], richtig: 0, fest: true },
      { typ: 'wahl', frage: 'Wie kennzeichnet man im Schaltplan eine Stelle, an der sich Leitungen verzweigen?', optionen: ['Mit einem dicken Punkt', 'Mit einem Kreuz', 'Gar nicht'], richtig: 0 },
      { typ: 'leuchtet', frage: 'Der Hauptschalter ist geschlossen. Welche Lampen leuchten?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1* r:- r:- | 2,0 d:L1 d:- | 3,0 d:L2 d:- | 0,2 r:- r:- r:-' } },
      { typ: 'wahl', frage: 'Was ist an diesem Plan gefährlich?', bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:L1 d:- d:- l:- l:- | 1,0 d:S1 d:-' }, optionen: ['Wird S1 geschlossen, entsteht ein Kurzschluss.', 'Die Lampe ist falsch gezeichnet.', 'Nichts.'], richtig: 0 },
      { typ: 'mehrfach', frage: 'Was gehört zu einer sauberen Schaltskizze?', optionen: ['Gerade, rechtwinklige Linien', 'Genormte Schaltzeichen', 'Dicke Punkte an Verzweigungen', 'Möglichst echte Bilder der Bauteile'], richtig: [0, 1, 2] }
    ]
  };

  var QUOTE = { ladung: 4, stromkreis: 3, reihe: 4, sinnvoll: 3, undoder: 3, skizzen: 3 };
  var ERLAUBT = { wahl: 1, mehrfach: 1, luecke: 1, zahl: 1, leuchtet: 1, zuordnen: 1, sortieren: 1 };

  /** 20 gemischte Aufgaben: je Stadtteil vor allem aus dem Pool, ergänzt aus den Übungen. */
  W.pruefungZiehen = function (rnd) {
    var out = [];
    W.stadtteile.forEach(function (st) {
      var quote = QUOTE[st.id] || 3;
      var pool = W.shuffle(W.PRUEFUNG[st.id].map(function (it, i) { return { id: 'p.' + st.id + '.' + i, item: it, stadtteil: st.id }; }), rnd);
      var ausPool = pool.slice(0, Math.max(2, quote - 1));
      var aus = [];
      st.uebungen.forEach(function (u) {
        u.items.forEach(function (it, i) { if (ERLAUBT[it.typ]) aus.push({ id: u.id + '.' + i, item: it, stadtteil: st.id }); });
      });
      aus = W.shuffle(aus, rnd).slice(0, quote - ausPool.length);
      out = out.concat(ausPool, aus);
    });
    return out;
  };

  var index = null;
  var blitzCache = {};
  /** Findet ein Item über seine ID ('p.<stadtteil>.<i>' oder '<übungsId>.<i>'). */
  W.itemNachId = function (id) {
    if (/^blitz\.\d+$/.test(id)) {
      var b = W.BLITZ[+id.slice(6)];
      if (!b) return null;
      if (!blitzCache[id]) blitzCache[id] = { typ: 'wahl', frage: 'Stimmt das? ' + b[0], optionen: ['Stimmt', 'Stimmt nicht'], richtig: b[1] ? 0 : 1, fest: true, erkl: b[2] };
      return blitzCache[id];
    }
    if (!index) {
      index = {};
      W.stadtteile.forEach(function (st) {
        (W.PRUEFUNG[st.id] || []).forEach(function (it, i) { index['p.' + st.id + '.' + i] = { item: it, stadtteil: st.id }; });
        st.uebungen.forEach(function (u) { u.items.forEach(function (it, i) { index[u.id + '.' + i] = { item: it, stadtteil: st.id }; }); });
      });
    }
    var e = index[id];
    return e ? e.item : null;
  };
  W.stadtteilVonItem = function (id) {
    W.itemNachId(id);
    return index[id] ? index[id].stadtteil : null;
  };
})();
