/* Stadtteil 5: Fabrik – UND- und ODER-Schaltung (AB „Elektrische Schaltungen“, „Stationen zu elektrischen Schaltungen“) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  var UND = '0,1 u:B r:S1 r:S2 r:L1 d:- l:- l:- l:-';
  var ODER = '0,2 u:B u:- r:S1 r:- d:- d:L1 l:- l:- | 0,1 r:S2 r:-';
  var U = 'UND-Schaltung', O = 'ODER-Schaltung';
  function und(x) { return [x[0] && x[1]]; }
  function oder(x) { return [x[0] || x[1]]; }

  W.stadtteile.push({
    id: 'undoder', nr: 5, name: 'Fabrik', thema: 'UND- und ODER-Schaltung',
    ziel: 'Ich kenne die UND- und die ODER-Schaltung und kann bei gegebenen Problemen entscheiden, welche Schaltung sinnvoll ist.',
    buch: 'AB Elektrische Schaltungen, AB Stationen',
    funk: 'In der Fabrik steht die große Presse still. Aus Sicherheitsgründen darf sie nur unter ganz bestimmten Bedingungen laufen. Zeit für UND und ODER!',
    karten: [
      {
        titel: 'Die UND-Schaltung',
        text: '<p>Bei der <strong>UND-Schaltung</strong> liegen zwei Schalter <strong>in Reihe</strong>. Die Lampe leuchtet nur, wenn S1 <strong>und</strong> S2 geschlossen sind. Ist auch nur einer offen, ist der einzige Weg unterbrochen.</p><p>Probiere alle Stellungen aus:</p>',
        baukasten: { cols: 4, rows: 2, dsl: UND },
        merk: 'UND-Schaltung: Die Schalter liegen in Reihe. Das Gerät ist nur an, wenn alle Schalter geschlossen sind.'
      },
      {
        titel: 'UND im Alltag',
        text: '<ul><li><strong>Zweihandschaltung</strong> an einer Presse oder Papierschneidemaschine: Die Maschine läuft nur, wenn beide Hände je einen Taster drücken. So ist keine Hand unter dem Messer.</li><li><strong>Waschmaschine:</strong> Sie startet nur, wenn die Tür zu ist und die Starttaste gedrückt wird.</li><li><strong>Hauptschalter und Lichtschalter:</strong> Licht nur, wenn beide an sind.</li></ul>'
      },
      {
        titel: 'Die ODER-Schaltung',
        text: '<p>Bei der <strong>ODER-Schaltung</strong> liegen zwei Schalter <strong>parallel</strong>. Die Lampe leuchtet, wenn S1 <strong>oder</strong> S2 geschlossen ist – oder beide. Jeder geschlossene Schalter bildet einen eigenen Weg.</p>',
        baukasten: { cols: 3, rows: 3, dsl: ODER },
        merk: 'ODER-Schaltung: Die Schalter liegen parallel. Das Gerät ist an, wenn mindestens ein Schalter geschlossen ist.'
      },
      {
        titel: 'ODER im Alltag',
        text: '<ul><li><strong>Klingel</strong> mit einem Taster an der Haustür und einem am Gartentor.</li><li><strong>Innenlicht im Auto:</strong> Es geht an, wenn die Fahrertür oder die Beifahrertür offen ist.</li><li><strong>Haltewunsch im Bus:</strong> Viele Taster, jeder einzelne meldet den Halt.</li><li><strong>Alarmanlage:</strong> Alarm, wenn ein Fenster oder die Tür geöffnet wird.</li></ul>'
      },
      {
        titel: 'Die Wahrheitstabelle',
        text: '<p>In einer <strong>Wahrheitstabelle</strong> schreibt man für jede Schalterstellung auf, ob das Gerät an ist. Manchmal steht 0 für „offen/aus“ und 1 für „geschlossen/an“.</p><table class="tabelle"><thead><tr><th>S1</th><th>S2</th><th>UND</th><th>ODER</th></tr></thead><tbody>' +
          '<tr><td>offen</td><td>offen</td><td>aus</td><td>aus</td></tr>' +
          '<tr><td>geschlossen</td><td>offen</td><td>aus</td><td><strong>an</strong></td></tr>' +
          '<tr><td>offen</td><td>geschlossen</td><td>aus</td><td><strong>an</strong></td></tr>' +
          '<tr><td>geschlossen</td><td>geschlossen</td><td><strong>an</strong></td><td><strong>an</strong></td></tr></tbody></table>'
      },
      {
        titel: 'So findest du die richtige Schaltung',
        text: '<p>Frag dich: <strong>Müssen alle Bedingungen gleichzeitig erfüllt sein?</strong> Dann ist es eine UND-Schaltung, die Schalter kommen in Reihe.</p><p><strong>Reicht eine von mehreren Bedingungen?</strong> Dann ist es eine ODER-Schaltung, die Schalter kommen parallel.</p>',
        merk: 'Alle Bedingungen müssen erfüllt sein: UND, Schalter in Reihe. Eine Bedingung reicht: ODER, Schalter parallel.',
        achtung: '<strong>Aufgepasst</strong>„Ich klingle an der Haustür und am Gartentor“ klingt nach „und“. Gemeint ist aber: Die Klingel soll an der einen oder an der anderen Stelle gehen. Das ist eine ODER-Schaltung. Achte auf die Bedingung, nicht auf das Wort.'
      },
      {
        titel: 'Die Wechselschaltung',
        zusatz: true,
        text: '<p>Im Treppenhaus will man das Licht unten einschalten und oben wieder ausschalten, und umgekehrt. Dafür gibt es <strong>Wechselschalter</strong> mit drei Anschlüssen. Zwei Wechselschalter werden mit zwei Leitungen verbunden. Jeder Schalter kann das Licht an- oder ausschalten, egal wie der andere gerade steht.</p>',
        grafik: 'wechselschaltung'
      }
    ],
    uebungen: [
      {
        id: 'uo-welche', titel: 'UND oder ODER?',
        items: [
          { typ: 'wahl', frage: 'Eine Klingel soll mit einem Taster an der Haustür und einem an der Wohnungstür klingeln.', optionen: [U, O], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Eine Papierschneidemaschine darf nur schneiden, wenn beide Hände auf Tastern liegen.', optionen: [U, O], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Das Innenlicht im Auto geht an, wenn die Fahrertür oder die Beifahrertür offen ist.', optionen: [U, O], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Die Waschmaschine startet nur bei geschlossener Tür und gedrückter Starttaste.', optionen: [U, O], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Im Bus gibt es an jeder Tür einen Haltewunsch-Taster.', optionen: [U, O], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Ein Tresor öffnet sich nur, wenn zwei Mitarbeiter gleichzeitig ihren Schlüssel drehen.', optionen: [U, O], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Eine Alarmanlage soll losgehen, wenn das Fenster oder die Tür geöffnet wird.', optionen: [U, O], richtig: 1, fest: true }
        ]
      },
      {
        id: 'uo-tabelle', titel: 'Wahrheitstabelle',
        items: [
          { typ: 'luecke', frage: 'UND-Schaltung: Ergänze die Wahrheitstabelle.', text: 'S1 offen, S2 offen: Lampe {aus|an}<br>S1 geschlossen, S2 offen: Lampe {aus|an}<br>S1 offen, S2 geschlossen: Lampe {aus|an}<br>S1 geschlossen, S2 geschlossen: Lampe {an|aus}' },
          { typ: 'luecke', frage: 'ODER-Schaltung: Ergänze die Wahrheitstabelle.', text: 'S1 offen, S2 offen: Lampe {aus|an}<br>S1 geschlossen, S2 offen: Lampe {an|aus}<br>S1 offen, S2 geschlossen: Lampe {an|aus}<br>S1 geschlossen, S2 geschlossen: Lampe {an|aus}' },
          { typ: 'luecke', text: 'Bei der UND-Schaltung sind die Schalter {in Reihe|parallel} geschaltet. Bei der ODER-Schaltung sind sie {parallel|in Reihe} geschaltet.' }
        ]
      },
      {
        id: 'uo-leuchtet', titel: 'Leuchtet die Lampe?',
        items: [
          { typ: 'leuchtet', frage: 'UND-Schaltung: S1 ist geschlossen, S2 offen. Leuchtet die Lampe?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1* r:S2 r:L1 d:- l:- l:- l:-' } },
          { typ: 'leuchtet', frage: 'UND-Schaltung: Beide Schalter sind geschlossen.', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1* r:S2* r:L1 d:- l:- l:- l:-' } },
          { typ: 'leuchtet', frage: 'ODER-Schaltung: S1 offen, S2 geschlossen.', bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:S1 r:- d:- d:L1 l:- l:- | 0,1 r:S2* r:-' } },
          { typ: 'leuchtet', frage: 'ODER-Schaltung: Beide Schalter offen.', bild: { cols: 3, rows: 3, dsl: ODER } },
          { typ: 'leuchtet', frage: 'Was leuchtet hier?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1* r:- r:L1 d:- d:- l:- l:- l:- | 0,1 r:S2 | 1,0 d:-' }, erkl: 'S1 und S2 liegen parallel (ODER). S1 ist geschlossen, das reicht.' }
        ]
      },
      {
        id: 'uo-plan', titel: 'Welcher Schaltplan?',
        items: [
          { typ: 'wahl', frage: 'Welcher Schaltplan zeigt eine ODER-Schaltung?', optionen: [{ bild: { cols: 4, rows: 2, dsl: UND } }, { bild: { cols: 3, rows: 3, dsl: ODER } }, { bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1 r:L1 d:- l:- l:-' } }], richtig: 1 },
          { typ: 'wahl', frage: 'Welcher Schaltplan zeigt eine UND-Schaltung?', optionen: [{ bild: { cols: 3, rows: 3, dsl: ODER } }, { bild: { cols: 4, rows: 2, dsl: UND } }], richtig: 1 },
          { typ: 'wahl', frage: 'Welche Schaltung zeigt dieser Plan?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:L1 r:S1 r:S2 d:- l:- l:- l:-' }, optionen: [U, O], richtig: 0, fest: true, erkl: 'Die Schalter liegen in Reihe, nur eben hinter der Lampe. Die Reihenfolge im Kreis spielt keine Rolle.' }
        ]
      },
      {
        id: 'uo-mission', titel: 'Mission: Fabrik wieder starten',
        items: [
          { typ: 'mission', frage: 'Zweihandschaltung: Der Motor der Presse darf nur laufen, wenn S1 und S2 geschlossen sind.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, motor: 1, schalter: 2 }, ziel: { art: 'tabelle', lampen: 1, schalter: 2, geraet: 'Motor', geraete: 'Motoren', regel: und, lob: 'Die Presse läuft – aber nur mit beiden Händen an den Tastern. Sicher!' }, loesung: '0,2 u:B u:- r:S1 r:S2 r:M d:- d:- l:- l:- l:-' },
          { typ: 'mission', frage: 'Pförtnerhaus: Die Lampe soll angehen, wenn S1 oder S2 geschlossen ist.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, schalter: 2 }, ziel: { art: 'tabelle', lampen: 1, schalter: 2, regel: oder }, loesung: ODER },
          { typ: 'mission', frage: 'Die Klingel soll klingeln, wenn jemand am Tor S1 oder an der Tür S2 drückt.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, klingel: 1, schalter: 2 }, ziel: { art: 'tabelle', lampen: 1, schalter: 2, geraet: 'Klingel', geraete: 'Klingeln', regel: oder }, loesung: '0,2 u:B u:- r:S1 r:- d:- d:K l:- l:- | 0,1 r:S2 r:-' },
          { typ: 'mission', frage: 'Lager: Die Lampe darf nur leuchten, wenn der Hauptschalter S1 und der Bewegungsmelder S2 eingeschaltet sind.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, schalter: 2 }, ziel: { art: 'tabelle', lampen: 1, schalter: 2, regel: und }, loesung: '0,2 u:B u:- r:S1 r:S2 r:L1 d:- d:- l:- l:- l:-' }
        ]
      },
      {
        id: 'uo-papier', titel: 'Schaltplan zeichnen',
        items: [
          { typ: 'papier', frage: 'Zeichne den Schaltplan der Zweihand-Sicherheitsschaltung: Der Motor M einer Presse läuft nur, wenn Taster S1 und Taster S2 gedrückt sind.', loesung: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1 r:S2 r:M d:- l:- l:- l:-' }, check: ['Beide Taster liegen hintereinander (in Reihe)', 'Motor als Kreis mit M', 'Kein Verzweigungspunkt: nur ein Weg', 'Saubere, rechtwinklige Linien'] },
          { typ: 'papier', frage: 'Zeichne den Schaltplan einer Klingel, die mit einem Taster an der Haustür (S1) und einem am Gartentor (S2) klingeln soll.', loesung: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:S1 r:- d:- d:K l:- l:- | 0,1 r:S2 r:-' }, hinweis: 'Die Klingel zeichnet man als Halbkreis.', check: ['Die beiden Taster liegen parallel (zwei Wege)', 'Die Klingel liegt in der gemeinsamen Leitung', 'Verzweigungspunkte als dicke Punkte', 'Bauteile beschriftet'] },
          { typ: 'papier', frage: 'Zeichne den Schaltplan für das Innenlicht eines Autos: Die Lampe geht an, wenn die Fahrertür (Türkontakt S1) oder die Beifahrertür (Türkontakt S2) geöffnet wird. Ein Türkontakt ist ein Schalter, der sich schließt, sobald die Tür aufgeht.', loesung: { cols: 3, rows: 3, dsl: ODER }, check: ['ODER-Schaltung erkannt: S1 und S2 parallel', 'Lampe in Reihe zur Parallelschaltung der Schalter', 'Verzweigungspunkte eingezeichnet', 'Saubere, rechtwinklige Linien'] }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'uo-e1',
        frage: 'Erkläre, warum man für eine Papierschneidemaschine eine UND-Schaltung verwendet und wie die Schalter geschaltet sind.',
        punkte: [
          'Die Maschine soll nur schneiden, wenn beide Taster gedrückt sind.',
          'Dann sind beide Hände auf den Tastern und nicht unter dem Messer.',
          'Die beiden Taster liegen in Reihe.',
          'Ist auch nur ein Taster offen, ist der Stromkreis unterbrochen und der Motor steht.'
        ],
        muster: 'Die Papierschneidemaschine soll nur schneiden, wenn die Person beide Hände auf zwei Tastern hat, so kann keine Hand unter dem Messer sein. Dafür braucht man eine UND-Schaltung: Die beiden Taster liegen in Reihe zum Motor. Nur wenn beide Taster gedrückt sind, ist der Stromkreis geschlossen. Lässt man einen Taster los, ist der einzige Weg unterbrochen und die Maschine stoppt.'
      },
      {
        id: 'uo-e2',
        frage: 'Erkläre den Unterschied zwischen UND- und ODER-Schaltung. Nenne je ein Beispiel aus dem Alltag.',
        punkte: [
          'UND: Die Schalter liegen in Reihe, das Gerät läuft nur, wenn alle geschlossen sind.',
          'ODER: Die Schalter liegen parallel, das Gerät läuft, wenn mindestens einer geschlossen ist.',
          'Ein passendes Beispiel für UND, zum Beispiel die Zweihandschaltung einer Presse',
          'Ein passendes Beispiel für ODER, zum Beispiel die Klingel mit zwei Tastern'
        ],
        muster: 'Bei der UND-Schaltung liegen die Schalter in Reihe. Das Gerät ist nur an, wenn alle Schalter geschlossen sind, zum Beispiel bei der Zweihandschaltung einer Presse. Bei der ODER-Schaltung liegen die Schalter parallel. Das Gerät ist schon an, wenn ein Schalter geschlossen ist, zum Beispiel bei einer Klingel, die man an der Haustür oder am Gartentor drücken kann.'
      }
    ]
  });
})();
