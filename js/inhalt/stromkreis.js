/* Stadtteil 2: Altstadt – der elektrische Stromkreis (Buch S. 98/99) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  var EINFACH = '0,1 u:B r:S1 r:L1 d:- l:- l:-';

  W.stadtteile.push({
    id: 'stromkreis', nr: 2, name: 'Altstadt', thema: 'Der Stromkreis',
    ziel: 'Ich kenne die Bestandteile eines einfachen Stromkreises und kann eine Schaltskizze von einem elektrischen Stromkreis erstellen.',
    buch: 'Buch S. 98/99',
    funk: 'In der Altstadt brennt kein einziges Licht. Irgendwo ist der Stromkreis unterbrochen. Was braucht ein Gerät, damit es läuft?',
    karten: [
      {
        titel: 'Was ein Gerät braucht',
        text: '<p>Zum Betrieb eines elektrischen Gerätes braucht man eine <strong>elektrische Quelle</strong>, zum Beispiel eine Batterie, eine beleuchtete Solarzelle, ein Netzgerät, einen Dynamo oder eine Steckdose.</p><p>Gerät und Quelle haben jeweils <strong>zwei Anschlussstellen</strong>. Das Gerät funktioniert nur, wenn jede Anschlussstelle des Gerätes mit je einer Anschlussstelle der Quelle verbunden ist. Dann spricht man von einem <strong>geschlossenen Stromkreis</strong>.</p><p>Die Verbindungen heißen <strong>Leitungen</strong>. Die Anschlussstellen der Quelle heißen <strong>Pole</strong>: Pluspol und Minuspol. Leg den Schalter um:</p>',
        baukasten: { cols: 3, rows: 2, dsl: EINFACH },
        merk: 'Zum Betrieb eines elektrischen Gerätes sind eine Quelle und ein geschlossener Stromkreis erforderlich.'
      },
      {
        titel: 'Quelle und Gerät müssen zusammenpassen',
        text: '<p>Eine Batterie reicht nicht, um eine Waschmaschine zu betreiben. Und die kleine Glühlampe einer Taschenlampe wird zerstört, wenn man sie an die Steckdose anschließt.</p><p>Auf Quellen und Geräten steht deshalb eine <strong>Spannung</strong> in Volt (V): Eine kleine Batterie hat 1,5 V, eine Flachbatterie 4,5 V, die Steckdose 230 V.</p>',
        merk: 'Quellen und Geräte müssen zueinander passen.'
      },
      {
        titel: 'Leiter und Nichtleiter',
        text: '<p>Nicht jeder Stoff kann einen Stromkreis schließen. Teste es: Lege einen Gegenstand in die Lücke (die Prüfstrecke).</p>',
        demo: 'leitertest',
        merk: 'Stoffe, mit denen Stromkreise geschlossen werden können, heißen Leiter. Die anderen heißen Nichtleiter (Isolatoren). Man unterscheidet gute und schlechte Leiter.',
        achtung: '<strong>Gut zu wissen</strong>Metalle sind gute Leiter. Auch Graphit (Bleistiftmine) und wässrige Lösungen von Salzen, Säuren und Laugen leiten, zum Beispiel Salzwasser und Zitronensaft. Destilliertes Wasser leitet nicht. Gase wie Luft sind normalerweise Nichtleiter, beim Blitz oder in Neonröhren können sie aber leiten.'
      },
      {
        titel: 'Kabel und Isolierung',
        text: '<p>Schneidet man ein Elektrokabel auf, sieht man: Innen sind dünne <strong>Kupferdrähte</strong>, außen ist eine Hülle aus <strong>Kunststoff</strong>.</p><p>Kupfer ist ein sehr guter Leiter. Der Kunststoff ist ein Nichtleiter: Er <strong>isoliert</strong> die Leitung, damit man sie gefahrlos anfassen kann und sich zwei Leitungen nicht berühren.</p>'
      },
      {
        titel: 'Schalter',
        text: '<p>Mit einem <strong>Schalter</strong> kann man einen Stromkreis einfach öffnen (unterbrechen) und wieder schließen. Er wird in eine der Leitungen oder ins Gerät eingebaut.</p><p>Bei einem einfachen Stromkreis ist es egal, in welcher Leitung der Schalter sitzt. Probiere es: Öffne S1 oder S2.</p>',
        baukasten: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1* r:L1 d:- l:S2* l:-' },
        merk: 'Zum sicheren Öffnen oder Schließen von Stromkreisen verwendet man Schalter.',
        achtung: '<strong>Schalterarten (Buch S. 99)</strong>Je nach Bauart betätigt man einen Knopf, einen Hebel oder eine Platte. Ein <strong>Tastschalter</strong> (Taster) schließt nur, solange man drückt, zum Beispiel ein Klingelknopf. Ein <strong>Stellschalter</strong> (Kippschalter, Lichtschalter) bleibt in seiner Stellung. Beim <strong>Brückenschalter</strong> legt man einen Hebel um. Bei allen Schaltern berührt man nur isolierte Teile.'
      },
      {
        titel: 'Schaltzeichen',
        text: '<p>Würde man einen Stromkreis so zeichnen, wie er aussieht, wäre das sehr mühsam. Deshalb gibt es international genormte <strong>Schaltzeichen</strong>:</p>',
        grafik: 'schaltzeichen'
      },
      {
        titel: 'Der Schaltplan',
        text: '<p>Die Schaltzeichen werden durch <strong>gerade Linien</strong> verbunden, die parallel oder rechtwinklig zueinander verlaufen. Sie stellen die Leitungen dar. So eine Zeichnung heißt <strong>Schaltplan</strong> oder Schaltskizze.</p>',
        bild: { cols: 3, rows: 2, dsl: EINFACH },
        merk: 'Ein Schaltplan gibt eine Übersicht darüber, welche Bauteile in einer Schaltung verwendet werden und wie sie miteinander verbunden sind.',
        achtung: '<strong>So zeichnest du sauber</strong>Lineal benutzen, nur waagerechte und senkrechte Linien. Bei der Batterie ist der lange Strich der Pluspol. Schalter offen zeichnen. Wo sich Leitungen verzweigen, kommt ein dicker Punkt hin. Bauteile beschriften (L1, S1).'
      },
      {
        titel: 'Kurzschluss',
        zusatz: true,
        text: '<p>Werden die beiden Pole einer Quelle direkt durch eine Leitung verbunden, ohne dass ein Gerät dazwischen liegt, entsteht ein <strong>Kurzschluss</strong>. Es fließt ein sehr großer Strom, die Leitungen werden heiß, es kann brennen. Eine <strong>Sicherung</strong> unterbricht dann den Stromkreis. Schließe S1 und schau, was passiert:</p>',
        baukasten: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:L1 d:- d:- l:- l:- | 1,0 d:S1 d:-' }
      },
      {
        titel: 'Sicherheit',
        text: '<p>Elektrischer Strom kann gefährlich sein. Beachte beim Experimentieren immer:</p><ol><li>Experimentiere nie allein und folge genau den Anweisungen der Lehrkraft.</li><li>Benutze als Quelle nur Batterien oder die Stromversorgungsgeräte der Schule. Schalte am Ende die Quelle ab.</li><li>Vermeide blanke Leitungen und Stecker, berühre nur isolierte Teile.</li></ol>',
        merk: 'Mit der Steckdose wird nie experimentiert: Die 230 V der Steckdose sind lebensgefährlich.'
      }
    ],
    uebungen: [
      {
        id: 'kreis-leuchtet', titel: 'Leuchtet die Lampe?',
        items: [
          { typ: 'leuchtet', frage: 'Welche Lampe leuchtet?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1* r:L1 d:- l:- l:-' }, erkl: 'Der Schalter ist geschlossen, der Stromkreis auch.' },
          { typ: 'leuchtet', frage: 'Welche Lampe leuchtet?', bild: { cols: 3, rows: 2, dsl: EINFACH }, erkl: 'Der Schalter ist offen: Der Stromkreis ist unterbrochen.' },
          { typ: 'leuchtet', frage: 'Der Schalter sitzt diesmal in der unteren Leitung. Welche Lampe leuchtet?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:L1 r:- d:- l:S1* l:-' }, erkl: 'Es ist egal, in welcher Leitung der Schalter sitzt. Er ist geschlossen, also leuchtet L1.' },
          { typ: 'leuchtet', frage: 'Welche Lampe leuchtet?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:- r:L1 d:-' }, erkl: 'Die Lampe ist nur mit einem Pol verbunden. Der Stromkreis ist nicht geschlossen.' },
          { typ: 'leuchtet', frage: 'Über L1 liegt eine zusätzliche Leitung. Welche Lampen leuchten?', bild: { cols: 3, rows: 3, dsl: '0,2 u:B r:L1 r:L2 d:- l:- l:- | 0,1 u:- r:- d:-' }, erkl: 'Die Leitung überbrückt L1: Der Strom nimmt den Weg durch die Leitung, L1 bleibt dunkel. L2 leuchtet sogar heller als ohne die zusätzliche Leitung.' }
        ]
      },
      {
        id: 'kreis-leiter', titel: 'Leiter oder Nichtleiter?',
        items: [
          { typ: 'sortieren', frage: 'Sortiere: Schließt der Stoff den Stromkreis?', kategorien: ['Leiter', 'Nichtleiter'], items: [['Kupferdraht', 0], ['Eisennagel', 0], ['Bleistiftmine', 0], ['Salzwasser', 0], ['Alufolie', 0], ['Kunststofflineal', 1], ['Gummiband', 1], ['Glas', 1], ['trockenes Holz', 1], ['destilliertes Wasser', 1]] },
          { typ: 'sortieren', frage: 'Noch eine Runde: Leiter oder Nichtleiter?', kategorien: ['Leiter', 'Nichtleiter'], items: [['Zitronensaft', 0], ['Silberlöffel', 0], ['Metallschere', 0], ['Porzellantasse', 1], ['Papier', 1], ['Luft', 1], ['Kabelhülle', 1], ['Wollfaden', 1]] },
          { typ: 'wahl', frage: 'Warum ist die Hülle eines Kabels aus Kunststoff?', optionen: ['Kunststoff ist ein Nichtleiter und isoliert die Leitung.', 'Kunststoff leitet besonders gut.', 'Damit das Kabel bunt ist.'], richtig: 0 },
          { typ: 'wahl', frage: 'Im Versuch leuchtet die Lampe bei der Bleistiftmine. Woraus besteht die Mine?', optionen: ['Graphit, ein Leiter', 'Holz, ein Nichtleiter', 'Kunststoff'], richtig: 0 }
        ]
      },
      {
        id: 'kreis-zeichen', titel: 'Schaltzeichen',
        items: [
          { typ: 'zuordnen', frage: 'Ordne die Schaltzeichen den Bauteilen zu.', paare: [[{ sym: 'lampe' }, 'Glühlampe'], [{ sym: 'schalter' }, 'Schalter'], [{ sym: 'batterie' }, 'Batterie'], [{ sym: 'motor' }, 'Motor']] },
          { typ: 'zuordnen', frage: 'Weiter geht’s: Ordne zu.', paare: [[{ sym: 'quelle' }, 'elektrische Quelle (allgemein)'], [{ sym: 'sicherung' }, 'Sicherung'], [{ sym: 'led' }, 'Leuchtdiode'], [{ sym: 'geraet' }, 'Gerät (allgemein)']] },
          { typ: 'zuordnen', frage: 'Letzte Runde.', paare: [[{ sym: 'anschluss' }, 'Anschlussstelle'], [{ sym: 'erdung' }, 'Erdung'], [{ sym: 'diode' }, 'Diode'], [{ sym: 'leitung' }, 'Leitung']] },
          { typ: 'wahl', frage: 'Beim Schaltzeichen der Batterie: Welcher Strich ist der Pluspol?', optionen: ['Der lange, dünne Strich', 'Der kurze, dicke Strich', 'Das ist egal'], richtig: 0 }
        ]
      },
      {
        id: 'kreis-wissen', titel: 'Stromkreis-Wissen',
        items: [
          { typ: 'wahl', frage: 'Was braucht man mindestens, damit eine Lampe leuchtet?', optionen: ['Eine Quelle, die Lampe und Leitungen, die einen geschlossenen Stromkreis bilden', 'Nur eine Quelle und eine Lampe, die nebeneinander liegen', 'Eine Lampe und einen Schalter'], richtig: 0 },
          { typ: 'wahl', frage: 'Wie heißen die Anschlussstellen einer elektrischen Quelle?', optionen: ['Pole (Pluspol und Minuspol)', 'Leitungen', 'Schalter'], richtig: 0 },
          { typ: 'wahl', frage: 'Wo muss der Schalter in einem einfachen Stromkreis sitzen?', optionen: ['In einer der beiden Leitungen, egal in welcher', 'Nur direkt am Pluspol', 'Nur direkt an der Lampe'], richtig: 0 },
          { typ: 'wahl', frage: 'Welche Schalterart ist ein Klingelknopf?', optionen: ['Ein Tastschalter (Taster)', 'Ein Stellschalter', 'Ein Kippschalter'], richtig: 0, erkl: 'Ein Tastschalter schließt den Stromkreis nur, solange man drückt.' },
          { typ: 'wahl', frage: 'Was passiert, wenn man die Glühlampe einer Taschenlampe an die Steckdose (230 V) anschließt?', optionen: ['Sie wird zerstört, Quelle und Gerät passen nicht zusammen.', 'Sie leuchtet besonders hell und lange.', 'Nichts, sie leuchtet normal.'], richtig: 0, erkl: 'Und: Mit der Steckdose experimentiert man nie!' },
          { typ: 'mehrfach', frage: 'Welche Regeln gelten beim Experimentieren mit Strom?', optionen: ['Nie allein experimentieren', 'Nur Batterien oder Schulnetzgeräte als Quelle', 'Blanke Leitungen nicht berühren', 'Für mehr Spannung die Steckdose nehmen'], richtig: [0, 1, 2] }
        ]
      },
      {
        id: 'kreis-mission', titel: 'Mission: Licht in der Altstadt',
        items: [
          { typ: 'mission', frage: 'Baue einen Stromkreis, in dem die Lampe leuchtet.', tipp: 'Setze Batterie, Lampe und Leitungen so, dass ein geschlossener Kreis entsteht.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1 }, ziel: { art: 'tabelle', lampen: 1, schalter: 0, regel: function () { return [true]; } }, loesung: '0,2 u:B u:- r:L1 r:- d:- d:- l:- l:-' },
          { typ: 'mission', frage: 'Baue eine Taschenlampe: Die Lampe soll sich mit einem Schalter ein- und ausschalten lassen.', tipp: 'Probiere mit der Hand beide Schalterstellungen aus, bevor du prüfst.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, schalter: 1 }, ziel: { art: 'tabelle', lampen: 1, schalter: 1, regel: function (x) { return [x[0]]; } }, loesung: '0,2 u:B u:- r:S1 r:L1 r:- d:- d:- l:- l:- l:-' },
          { typ: 'mission', frage: 'Bring den Motor der Turmuhr zum Laufen. Ein Schalter soll ihn ein- und ausschalten.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, motor: 1, schalter: 1 }, ziel: { art: 'tabelle', lampen: 1, schalter: 1, geraet: 'Motor', geraete: 'Motoren', regel: function (x) { return [x[0]]; } }, loesung: '0,2 u:B u:- r:- r:M d:- d:S1 l:- l:-' }
        ]
      },
      {
        id: 'kreis-papier', titel: 'Schaltplan zeichnen',
        items: [
          { typ: 'papier', frage: 'Zeichne den Schaltplan einer Taschenlampe: Batterie, Schalter und Lampe.', loesung: { cols: 3, rows: 2, dsl: EINFACH }, check: ['Batterie mit langem Strich (Plus) und kurzem Strich (Minus)', 'Schalter offen gezeichnet', 'Lampe als Kreis mit Kreuz', 'Mit Lineal: nur waagerechte und senkrechte Linien', 'Der Stromkreis ist geschlossen (bis auf den Schalter)'] },
          { typ: 'papier', frage: 'Zeichne den Schaltplan für einen kleinen Ventilator: Batterie, Schalter und Motor.', loesung: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1 r:M d:- l:- l:-' }, check: ['Motor als Kreis mit M', 'Batterie und Schalter richtig gezeichnet', 'Saubere, rechtwinklige Linien', 'Bauteile beschriftet'] },
          { typ: 'wahl', frage: 'Welcher Schaltplan zeigt einen geschlossenen Stromkreis, in dem die Lampe leuchtet?', optionen: [{ bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1* r:L1 d:- l:- l:-' } }, { bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:S1 r:L1 d:- l:- l:-' } }, { bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:- r:L1 d:-' } }], richtig: 0 }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'kreis-e1',
        frage: 'Erkläre, was ein geschlossener Stromkreis ist und warum eine Lampe nur in einem geschlossenen Stromkreis leuchtet.',
        punkte: [
          'Eine elektrische Quelle hat zwei Pole, das Gerät zwei Anschlussstellen.',
          'Jede Anschlussstelle des Gerätes ist über eine Leitung mit je einem Pol verbunden.',
          'Es gibt einen durchgehenden Weg vom einen Pol durch das Gerät zum anderen Pol.',
          'Ist der Kreis irgendwo unterbrochen (zum Beispiel offener Schalter), leuchtet die Lampe nicht.'
        ],
        muster: 'Die elektrische Quelle hat zwei Anschlussstellen, den Plus- und den Minuspol. Auch die Lampe hat zwei Anschlussstellen. In einem geschlossenen Stromkreis ist jede Anschlussstelle der Lampe über eine Leitung mit je einem Pol der Quelle verbunden. So gibt es einen durchgehenden Weg von einem Pol durch die Lampe zum anderen Pol. Nur dann leuchtet die Lampe. Ist der Stromkreis irgendwo unterbrochen, zum Beispiel durch einen offenen Schalter, bleibt sie dunkel.'
      },
      {
        id: 'kreis-e2',
        frage: 'Ein Elektrokabel besteht aus Kupferdrähten mit einer Hülle aus Kunststoff. Erkläre, wozu man beide Stoffe braucht.',
        punkte: [
          'Kupfer ist ein Metall und ein sehr guter Leiter.',
          'Durch die Kupferdrähte wird der Stromkreis geschlossen.',
          'Kunststoff ist ein Nichtleiter (Isolator).',
          'Die Hülle isoliert: Man kann das Kabel gefahrlos anfassen und Leitungen berühren sich nicht.'
        ],
        muster: 'Die Kupferdrähte im Inneren sind aus Metall. Kupfer ist ein sehr guter Leiter, über die Drähte wird der Stromkreis zwischen Quelle und Gerät geschlossen. Die Hülle aus Kunststoff ist ein Nichtleiter. Sie isoliert die Leitung: Man kann das Kabel gefahrlos anfassen, und zwei Leitungen können sich nicht berühren. Sonst könnte ein Kurzschluss entstehen.'
      }
    ]
  });
})();
