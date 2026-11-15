/* Stadtteil 4: Wohnviertel – Wann ist eine Reihen-, wann eine Parallelschaltung sinnvoll? (AB „Mehrere Lampen an einer Spannungsquelle“) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  var R = 'Reihenschaltung', P = 'Parallelschaltung';
  var HAUPT = '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:L1 d:- | 3,0 d:L2 d:- | 0,2 r:- r:- r:-';
  var HAUPT_EINZEL = '0,2 u:B u:- r:S1* r:- r:- | 2,0 d:S2* d:L1 | 3,0 d:S3 d:L2 | 0,2 r:- r:- r:-';

  W.stadtteile.push({
    id: 'sinnvoll', nr: 4, name: 'Wohnviertel', thema: 'Welche Schaltung ist sinnvoll?',
    ziel: 'Ich kann entscheiden, wann eine Parallel- oder eine Reihenschaltung sinnvoll ist.',
    buch: 'AB Mehrere Lampen an einer Spannungsquelle',
    funk: 'Im Wohnviertel müssen wir neu verkabeln. Für jede Aufgabe brauchen wir die passende Schaltung – sonst geht beim ersten Defekt die ganze Straße aus.',
    karten: [
      {
        titel: 'Vorteile und Nachteile',
        text: '<table class="tabelle"><thead><tr><th></th><th>Vorteile</th><th>Nachteile</th></tr></thead><tbody>' +
          '<tr><th>Reihe</th><td>Die Spannung der Quelle teilt sich auf. So kann man Geräte mit kleiner Spannung an einer großen Quelle betreiben (Lichterkette).</td><td>Fällt ein Gerät aus, ist alles aus. Die Geräte lassen sich nicht einzeln schalten. Gleiche Lampen leuchten schwächer.</td></tr>' +
          '<tr><th>Parallel</th><td>Jedes Gerät bekommt die volle Spannung der Quelle. Die Geräte lassen sich unabhängig voneinander schalten. Fällt eins aus, laufen die anderen weiter.</td><td>Mit jedem weiteren Gerät wird die Stromstärke in der gemeinsamen Leitung größer (Knotenregel). Die Quelle muss mehr liefern, eine Batterie ist schneller leer.</td></tr>' +
          '</tbody></table>',
        merk: 'Reihenschaltung: Die Spannung teilt sich auf. Fällt ein Gerät aus, ist alles aus. Parallelschaltung: Jedes Gerät bekommt die volle Spannung und lässt sich einzeln schalten.'
      },
      {
        titel: 'Im Haushalt: alles parallel',
        text: '<p>Lampen, Kühlschrank, Fernseher und Steckdosen sind im Haus <strong>parallel</strong> geschaltet. So bekommt jedes Gerät die vollen 230 V. Jedes Gerät kann einzeln eingeschaltet werden, und wenn der Wasserkocher kaputtgeht, läuft der Kühlschrank weiter.</p><p>Auch die Steckdosen einer Verteilerleiste sind parallel geschaltet.</p>',
        merk: 'Im Haushalt sind alle Geräte parallel geschaltet.',
        achtung: '<strong>Aufgepasst</strong>Steckt man immer mehr Geräte an eine Verteilerleiste, wird die Stromstärke in ihrem Kabel immer größer: I = I₁ + I₂ + I₃ … Das kann gefährlich werden, deshalb gibt es Sicherungen.'
      },
      {
        titel: 'Schalter liegen in Reihe zu ihrem Gerät',
        text: '<p>Ein Schalter kann nur das ausschalten, was im selben Weg wie er liegt. Er muss also <strong>in Reihe</strong> zu dem Gerät geschaltet sein, das er schalten soll.</p><ul><li>Ein <strong>Einzelschalter</strong> sitzt im Zweig seiner Lampe.</li><li>Ein <strong>Hauptschalter</strong> sitzt in der gemeinsamen Leitung vor der Verzweigung. Er schaltet alles.</li></ul><p>Probiere es: S1 ist der Hauptschalter, S2 und S3 sind die Einzelschalter.</p>',
        baukasten: { cols: 4, rows: 3, dsl: HAUPT_EINZEL },
        merk: 'Ein Schalter liegt immer in Reihe zu den Geräten, die er schalten soll.'
      },
      {
        titel: 'Die Nennspannung',
        text: '<p>Auf jeder Lampe steht, für welche Spannung sie gebaut ist, zum Beispiel 6 V. Das ist ihre <strong>Nennspannung</strong>.</p><ul><li>Bekommt sie deutlich mehr Spannung, brennt sie durch.</li><li>Bekommt sie deutlich weniger, leuchtet sie nur schwach.</li></ul><p>Zwei gleiche 6-V-Lampen an einer 12-V-Quelle schaltet man deshalb in Reihe, dann bekommt jede 6 V. Hat die Quelle selbst 6 V, schaltet man sie parallel.</p>',
        merk: 'Jedes Gerät braucht seine Nennspannung. Ist die Quelle für ein Gerät zu stark, kann man gleiche Geräte in Reihe schalten.'
      },
      {
        titel: 'Deine Entscheidungshilfe',
        text: '<ol><li>Sollen die Geräte <strong>einzeln</strong> schaltbar sein oder <strong>weiterlaufen</strong>, wenn eins ausfällt? → <strong>parallel</strong></li><li>Braucht jedes Gerät die <strong>volle Spannung</strong> der Quelle? → <strong>parallel</strong></li><li>Ist die Spannung der Quelle für ein einzelnes Gerät <strong>zu groß</strong>? → <strong>Reihe</strong></li><li>Soll ein Schalter <strong>alles gemeinsam</strong> schalten? → Schalter in die gemeinsame Leitung (Hauptschalter). Die Geräte können trotzdem parallel sein.</li></ol>',
        merk: 'Einzeln schaltbar oder volle Spannung: parallel. Spannung der Quelle für ein Gerät zu groß: Reihe.'
      }
    ],
    uebungen: [
      {
        id: 'sv-was', titel: 'Was passt?',
        items: [
          { typ: 'wahl', frage: 'Im Klassenzimmer gibt es zwei Lampengruppen, die man einzeln einschalten kann.', optionen: [R, P], richtig: 1, fest: true, erkl: 'Einzeln schaltbar heißt: jede Lampengruppe in einem eigenen Zweig.' },
          { typ: 'wahl', frage: 'Scheinwerfer und Rücklicht am Fahrrad', optionen: [R, P], richtig: 1, fest: true, erkl: 'Fällt der Scheinwerfer aus, soll das Rücklicht weiterleuchten.' },
          { typ: 'wahl', frage: 'Eine Lichterkette mit 20 kleinen 12-V-Lämpchen soll an der Steckdose (230 V) leuchten.', optionen: [R, P], richtig: 0, fest: true, erkl: 'In Reihe bekommt jedes Lämpchen nur 230 V : 20 = 11,5 V. Parallel bekäme jedes 230 V und würde durchbrennen.' },
          { typ: 'wahl', frage: 'Die Steckdosen in der Küche', optionen: [R, P], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Zwei 6-V-Lampen sollen an einer 12-V-Batterie leuchten, ohne durchzubrennen.', optionen: [R, P], richtig: 0, fest: true, erkl: 'In Reihe bekommt jede Lampe 6 V.' },
          { typ: 'wahl', frage: 'Linker und rechter Scheinwerfer am Auto', optionen: [R, P], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Ein Lichtschalter und die Deckenlampe, die er schaltet', optionen: [R, P], richtig: 0, fest: true, erkl: 'Ein Schalter liegt immer in Reihe zu dem Gerät, das er schalten soll.' }
        ]
      },
      {
        id: 'sv-vornach', titel: 'Vorteile und Nachteile sortieren',
        items: [
          { typ: 'sortieren', frage: 'Gehört die Aussage zur Reihen- oder zur Parallelschaltung?', kategorien: [R, P], items: [['Fällt eine Lampe aus, gehen alle aus.', 0], ['Jedes Gerät bekommt die volle Spannung.', 1], ['Geräte lassen sich einzeln schalten.', 1], ['Die Spannung der Quelle teilt sich auf.', 0], ['Gleiche Lampen leuchten schwächer als allein.', 0], ['Die Stromstärke der Quelle ist die Summe der Zweigstromstärken.', 1], ['Es gibt nur einen Weg für den Strom.', 0], ['Es gibt Verzweigungspunkte.', 1]] },
          { typ: 'mehrfach', frage: 'Welche Aussagen sind Vorteile der Parallelschaltung?', optionen: ['Jedes Gerät bekommt die volle Spannung.', 'Die Geräte lassen sich einzeln schalten.', 'Fällt ein Gerät aus, laufen die anderen weiter.', 'Die Stromstärke in der gemeinsamen Leitung bleibt immer klein.'], richtig: [0, 1, 2], erkl: 'Die Stromstärke in der gemeinsamen Leitung wird mit jedem Gerät größer – das ist eher ein Nachteil.' },
          { typ: 'wahl', frage: 'Welcher Nachteil gehört zur Reihenschaltung?', optionen: ['Fällt ein Gerät aus, sind alle aus.', 'Jedes Gerät bekommt die volle Spannung.', 'Man braucht für jedes Gerät einen eigenen Zweig.'], richtig: 0 }
        ]
      },
      {
        id: 'sv-wenn', titel: 'Was passiert, wenn …?',
        items: [
          { typ: 'wahl', frage: 'In der Küche geht der Wasserkocher kaputt. Was passiert mit dem Kühlschrank?', optionen: ['Er läuft weiter, die Geräte sind parallel geschaltet.', 'Er geht auch aus, die Geräte sind in Reihe geschaltet.', 'Er läuft schneller.'], richtig: 0 },
          { typ: 'wahl', frage: 'Du steckst an eine Verteilerleiste immer mehr Geräte. Was wird größer?', optionen: ['Die Stromstärke im Kabel der Verteilerleiste', 'Die Spannung an jeder Steckdose', 'Nichts ändert sich'], richtig: 0, erkl: 'Knotenregel: I = I₁ + I₂ + I₃ … Die Spannung bleibt 230 V.' },
          { typ: 'wahl', frage: 'Warum kann man eine 6-V-Lampe nicht einfach an 12 V anschließen?', optionen: ['Die Spannung ist zu groß, die Lampe brennt durch.', 'Die Lampe leuchtet dann zu schwach.', 'Das geht problemlos.'], richtig: 0 },
          { typ: 'wahl', frage: 'Drei gleiche Lampen sind parallel an 6 V. Eine wird herausgedreht. Was passiert mit den anderen beiden?', optionen: ['Sie leuchten genauso hell weiter.', 'Sie gehen aus.', 'Sie leuchten heller.'], richtig: 0, erkl: 'Jeder Zweig hat weiterhin die volle Spannung von 6 V.' },
          { typ: 'wahl', frage: 'Wo muss der Hauptschalter sitzen, der alle Lampen einer Parallelschaltung ausschaltet?', optionen: ['In der gemeinsamen Leitung vor der Verzweigung', 'In einem der Zweige', 'Parallel zu den Lampen'], richtig: 0 }
        ]
      },
      {
        id: 'sv-mission', titel: 'Mission: Verkabelt das Wohnviertel',
        items: [
          { typ: 'mission', frage: 'Kinderzimmer: Deckenlampe und Leselampe sollen einzeln schaltbar sein und beide hell leuchten.', tipp: 'Jede Lampe bekommt einen eigenen Zweig mit eigenem Schalter.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 2, schalter: 2 }, ziel: { art: 'tabelle', lampen: 2, schalter: 2, voll: true, regel: function (x) { return [x[0], x[1]]; } }, loesung: '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:S2 d:L2 | 0,2 r:- r:-' },
          { typ: 'mission', frage: 'Flur: Zwei Lampen sollen gemeinsam mit einem Schalter eingeschaltet werden. Beide sollen hell leuchten.', tipp: 'Hell heißt: volle Spannung. Wo muss der Schalter dann sitzen?', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 2, schalter: 1 }, ziel: { art: 'tabelle', lampen: 2, schalter: 1, voll: true, regel: function (x) { return [x[0], x[0]]; } }, loesung: HAUPT },
          { typ: 'mission', frage: 'Profi: Wohnzimmer mit Hauptschalter S1 für alles und je einem Einzelschalter für zwei Lampen. Beide hell.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 2, schalter: 3 }, ziel: { art: 'tabelle', lampen: 2, schalter: 3, voll: true, regel: function (x) { return [x[0] && x[1], x[0] && x[2]]; } }, loesung: '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:S2 d:L1 | 3,0 d:S3 d:L2 | 0,2 r:- r:- r:-' }
        ]
      },
      {
        id: 'sv-papier', titel: 'Schaltplan zeichnen',
        items: [
          { typ: 'papier', frage: 'Zeichne den Schaltplan für den Flur: Zwei Lampen werden gemeinsam mit einem Schalter eingeschaltet und leuchten beide hell.', loesung: { cols: 4, rows: 3, dsl: HAUPT }, hinweis: 'Die Lampen sind parallel geschaltet (volle Spannung). Der Schalter sitzt in der gemeinsamen Leitung.', check: ['Lampen in zwei getrennten Zweigen (parallel)', 'Schalter in der gemeinsamen Leitung vor der Verzweigung', 'Verzweigungspunkte als dicke Punkte', 'Saubere, rechtwinklige Linien'] },
          { typ: 'papier', frage: 'Zeichne den Schaltplan: Zwei Lampen an einer Batterie, jede mit eigenem Schalter.', loesung: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:S2 d:L2 | 0,2 r:- r:-' }, check: ['Jede Lampe in einem eigenen Zweig', 'In jedem Zweig ein Schalter, in Reihe zur Lampe', 'Verzweigungspunkte eingezeichnet', 'Bauteile beschriftet (L1, L2, S1, S2)'] },
          { typ: 'wahl', frage: 'Welcher Plan passt zum Flur: Zwei Lampen gehen mit einem Schalter gemeinsam an und leuchten beide hell?', optionen: [{ bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1 r:L1 r:L2 d:- l:- l:- l:-' } }, { bild: { cols: 4, rows: 3, dsl: HAUPT } }, { bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:- d:L2 | 0,2 r:- r:-' } }], richtig: 1, erkl: 'Parallel, damit beide hell leuchten, und der Schalter in der gemeinsamen Leitung, damit er beide schaltet.' }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'sv-e1',
        frage: 'Erkläre, warum im Haushalt alle Geräte parallel geschaltet sind. Nenne mindestens zwei Gründe.',
        punkte: [
          'Jedes Gerät bekommt die volle Spannung von 230 V.',
          'Die Geräte lassen sich unabhängig voneinander ein- und ausschalten.',
          'Fällt ein Gerät aus, laufen die anderen weiter.',
          'Bei einer Reihenschaltung würde sich die Spannung aufteilen, und ein kaputtes Gerät würde alle anderen ausschalten.'
        ],
        muster: 'Im Haushalt sind alle Geräte parallel geschaltet, weil jedes Gerät dann die volle Netzspannung von 230 V bekommt, für die es gebaut ist. Außerdem kann man jedes Gerät einzeln ein- und ausschalten, und wenn ein Gerät kaputtgeht, laufen die anderen weiter. In einer Reihenschaltung würde sich die Spannung auf die Geräte aufteilen, und ein einziges kaputtes Gerät würde alle anderen ausschalten.'
      },
      {
        id: 'sv-e2',
        frage: 'Paul will zwei Lampen für sein Baumhaus an eine Batterie anschließen. Jede Lampe soll einzeln ein- und ausschaltbar sein. Begründe, welche Schaltung er wählen muss und wo die Schalter hingehören.',
        punkte: [
          'Er braucht eine Parallelschaltung.',
          'Jede Lampe bekommt einen eigenen Zweig.',
          'In jeden Zweig kommt ein Schalter, in Reihe zu seiner Lampe.',
          'So unterbricht jeder Schalter nur den Weg seiner eigenen Lampe.'
        ],
        muster: 'Paul muss die Lampen parallel schalten. Dann hat jede Lampe einen eigenen Zweig. In jeden Zweig baut er einen Schalter ein, in Reihe zu der Lampe. Öffnet er einen Schalter, ist nur der Weg durch diese eine Lampe unterbrochen. Die andere Lampe hat weiterhin einen geschlossenen Stromkreis über ihren eigenen Zweig und leuchtet weiter.'
      }
    ]
  });
})();
