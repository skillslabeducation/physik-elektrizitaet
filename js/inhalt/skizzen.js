/* Stadtteil 6: Leuchtturm – Schaltskizzen zu gegebenen Problemen (AB „Verschiedene Schaltungen“) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  var FAHRRAD = '0,1 u:G r:- d:L1 l:- | 1,0 r:- d:L2 l:-';
  var ZWEI_EINZELN = '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:S2 d:L2 | 0,2 r:- r:-';
  var GARAGE = '0,2 u:B u:- r:S1 r:S2 r:- d:- d:L1 l:- l:- l:- | 1,0 d:- r:S3 u:-';
  var FEHLER_PARALLEL = '0,2 u:B u:- r:- r:L1 d:- d:- l:- l:- | 1,0 d:S1 d:-';

  W.stadtteile.push({
    id: 'skizzen', nr: 6, name: 'Leuchtturm', thema: 'Schaltskizzen zu Problemen',
    ziel: 'Ich kann eine Schaltskizze für ein gegebenes Problem erstellen.',
    buch: 'AB zu verschiedenen Schaltungen',
    funk: 'Letzte Station: der Leuchtturm. Hier zeichnest du selbst Schaltpläne für echte Probleme. Wer das kann, ist bereit für die Arbeit.',
    karten: [
      {
        titel: 'In fünf Schritten zur Schaltskizze',
        text: '<ol>' +
          '<li><strong>Bauteile sammeln:</strong> Welche Quelle, welche Geräte, wie viele Schalter?</li>' +
          '<li><strong>Geräte anordnen:</strong> Sollen sie unabhängig sein oder die volle Spannung bekommen? Dann bekommt jedes einen eigenen Zweig (parallel). Sollen sie sich die Spannung teilen? Dann kommen sie in Reihe.</li>' +
          '<li><strong>Schalter setzen:</strong> Ein Schalter liegt in Reihe zu dem, was er schalten soll. Müssen alle Bedingungen erfüllt sein, kommen die Schalter in Reihe (UND). Reicht eine Bedingung, kommen sie parallel (ODER). Ein Hauptschalter gehört in die gemeinsame Leitung.</li>' +
          '<li><strong>Sauber zeichnen:</strong> Lineal, nur waagerechte und senkrechte Linien, Schaltzeichen, dicke Punkte an Verzweigungen, Bauteile beschriften.</li>' +
          '<li><strong>Finger-Test:</strong> Fahre für jede Schalterstellung mit dem Finger vom Pluspol los. Kommst du nur durch die richtigen Geräte zum Minuspol? Gibt es einen Weg ganz ohne Gerät? Dann ist es ein Kurzschluss!</li></ol>',
        merk: 'Unabhängige Geräte bekommen eigene Zweige (parallel). Ein Schalter liegt in Reihe zu dem, was er schalten soll: UND heißt Schalter in Reihe, ODER heißt Schalter parallel, ein Hauptschalter sitzt in der gemeinsamen Leitung.'
      },
      {
        titel: 'Ein Beispiel',
        text: '<p><strong>Aufgabe:</strong> Im Kinderzimmer sollen Deckenlampe und Leselampe einzeln schaltbar sein.</p><p><strong>Überlegung:</strong> „Einzeln“ heißt unabhängig, also bekommt jede Lampe einen eigenen Zweig. Jeder Schalter soll nur seine Lampe schalten, also sitzt er in Reihe zu ihr im selben Zweig.</p>',
        bild: { cols: 3, rows: 3, dsl: ZWEI_EINZELN }
      },
      {
        titel: 'Typische Fehler',
        text: '<ul><li><strong>Schalter parallel zur Lampe:</strong> Wird er geschlossen, ist die Lampe überbrückt und geht aus. Ist sie das einzige Gerät, gibt es einen Weg ohne Gerät: einen Kurzschluss.</li><li>Lampen in Reihe, obwohl sie einzeln schaltbar sein sollen.</li><li>Hauptschalter in einem Zweig statt in der gemeinsamen Leitung.</li><li>Batterie mit zwei gleich langen Strichen, schräge Linien, fehlende Verzweigungspunkte.</li></ul>',
        bild: { cols: 3, rows: 3, dsl: FEHLER_PARALLEL },
        merk: 'Gibt es einen Weg vom Pluspol zum Minuspol ohne Gerät, entsteht ein Kurzschluss.',
        achtung: '<strong>Im Bild</strong>S1 liegt parallel zur Lampe. Solange er offen ist, leuchtet L1. Wird S1 geschlossen, entsteht ein Kurzschluss.'
      },
      {
        titel: 'Die Fahrradbeleuchtung',
        text: '<p>Buch S. 99 fragt: Zeichne einen Schaltplan für die Beleuchtungsanlage deines Fahrrades. Die Quelle ist der <strong>Dynamo</strong>, ein Generator. Im Buch (S. 119) wird er mit dem Zeichen für eine <strong>elektrische Quelle</strong> gezeichnet: zwei kleine Kreise. Scheinwerfer und Rücklicht sind <strong>parallel</strong> geschaltet. Die Rückleitung über den <strong>Rahmen</strong> zeichnet man im Schaltplan einfach als Leitung.</p>',
        bild: { cols: 3, rows: 2, dsl: FAHRRAD },
        merk: 'Fahrradbeleuchtung: Der Dynamo ist die Quelle, Scheinwerfer und Rücklicht sind parallel geschaltet, der Rahmen ist die gemeinsame Rückleitung.'
      }
    ],
    uebungen: [
      {
        id: 'sk-mission', titel: 'Werkstatt-Missionen',
        items: [
          { typ: 'mission', frage: 'Garten: Die Gartenlampe und die Brunnenpumpe (Motor) sollen getrennt schaltbar sein.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, motor: 1, schalter: 2 }, ziel: { art: 'tabelle', lampen: 2, schalter: 2, geraet: 'Gerät', geraete: 'Geräte', typen: ['lampe', 'motor'], regel: function (x) { return [x[0], x[1]]; } }, loesung: '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:S2 d:M | 0,2 r:- r:-' },
          { typ: 'mission', frage: 'Modellbahn: Lok-Motor und Bahnhofslampe sollen gemeinsam mit einem Schalter angehen und beide die volle Spannung bekommen.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, motor: 1, schalter: 1 }, ziel: { art: 'tabelle', lampen: 2, schalter: 1, voll: true, geraet: 'Gerät', geraete: 'Geräte', regel: function (x) { return [x[0], x[0]]; } }, loesung: '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:L1 d:- | 3,0 d:M d:- | 0,2 r:- r:- r:-' },
          { typ: 'mission', frage: 'Garage: Das Licht geht nur, wenn der Hauptschalter S1 an ist und dazu einer der beiden Taster S2 (innen) oder S3 (außen) gedrückt wird.', tipp: 'Kombiniere: Hauptschalter in Reihe (UND), die beiden Taster parallel (ODER).', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 1, schalter: 3 }, ziel: { art: 'tabelle', lampen: 1, schalter: 3, regel: function (x) { return [x[0] && (x[1] || x[2])]; } }, loesung: GARAGE },
          { typ: 'mission', frage: 'Profi-Werkstatt: Die Lampe hat ihren eigenen Schalter. Der Motor der Säge läuft nur, wenn zwei Taster gleichzeitig gedrückt sind.', cols: 4, rows: 4, palette: { leitung: Infinity, batterie: 1, lampe: 1, motor: 1, schalter: 3 }, ziel: { art: 'tabelle', lampen: 2, schalter: 3, geraet: 'Gerät', geraete: 'Geräte', typen: ['lampe', 'motor'], regel: function (x) { return [x[0], x[1] && x[2]]; } }, loesung: '0,3 u:B u:- u:- r:- r:- | 1,0 d:S1 d:L1 d:- | 2,0 d:S2 d:S3 d:M | 0,3 r:- r:-' }
        ]
      },
      {
        id: 'sk-papier', titel: 'Schaltskizzen auf Papier',
        items: [
          { typ: 'papier', frage: 'Zeichne einen Schaltplan für die Beleuchtungsanlage eines Fahrrades: Dynamo, Scheinwerfer und Rücklicht. (Buch S. 99, A1)', loesung: { cols: 3, rows: 2, dsl: FAHRRAD }, hinweis: 'Den Dynamo zeichnest du wie im Buch mit dem Zeichen für eine elektrische Quelle (zwei kleine Kreise).', check: ['Dynamo als elektrische Quelle gezeichnet', 'Scheinwerfer und Rücklicht parallel in eigenen Zweigen', 'Verzweigungspunkte als dicke Punkte', 'Lampen beschriftet', 'Saubere, rechtwinklige Linien'] },
          { typ: 'papier', frage: 'Klassenzimmer: Zwei Lampengruppen haben je einen eigenen Schalter. Zusätzlich gibt es einen Hauptschalter, der alles ausschaltet.', loesung: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:S2 d:L1 | 3,0 d:S3 d:L2 | 0,2 r:- r:- r:-' }, check: ['Die Lampen liegen parallel in zwei Zweigen', 'In jedem Zweig ein Einzelschalter', 'Der Hauptschalter sitzt in der gemeinsamen Leitung', 'Verzweigungspunkte eingezeichnet'] },
          { typ: 'papier', frage: 'Garage: Die Lampe soll nur leuchten, wenn der Hauptschalter S1 an ist und Taster S2 oder Taster S3 gedrückt wird.', loesung: { cols: 4, rows: 3, dsl: GARAGE }, check: ['S1 in Reihe mit der Lampe', 'S2 und S3 parallel zueinander', 'Verzweigungspunkte an den Enden der Parallelschaltung', 'Saubere Linien und Beschriftung'] }
        ]
      },
      {
        id: 'sk-fehler', titel: 'Fehler im Schaltplan',
        items: [
          { typ: 'wahl', frage: 'Was passiert, wenn S1 geschlossen wird?', bild: { cols: 3, rows: 3, dsl: FEHLER_PARALLEL }, optionen: ['Kurzschluss: Die Lampe geht aus, ein sehr großer Strom fließt.', 'Die Lampe leuchtet heller.', 'Nichts ändert sich.'], richtig: 0, erkl: 'Über S1 gibt es einen Weg vom Plus- zum Minuspol ohne Gerät.' },
          { typ: 'wahl', frage: 'Lukas will, dass S1 nur L1 schaltet und S2 nur L2. Er zeichnet diesen Plan. Was ist falsch?', bild: { cols: 5, rows: 2, dsl: '0,1 u:B r:S1 r:L1 r:S2 r:L2 d:- l:- l:- l:- l:-' }, optionen: ['Alles liegt in Reihe: Jeder Schalter schaltet beide Lampen.', 'Die Schalter müssten hinter den Lampen sitzen.', 'Nichts, der Plan ist richtig.'], richtig: 0, erkl: 'Für einzeln schaltbare Lampen braucht jede Lampe einen eigenen Zweig mit eigenem Schalter.' },
          { typ: 'wahl', frage: 'Welcher Plan erfüllt: „Zwei Lampen, jede einzeln schaltbar“?', optionen: [{ bild: { cols: 5, rows: 2, dsl: '0,1 u:B r:S1 r:L1 r:S2 r:L2 d:- l:- l:- l:- l:-' } }, { bild: { cols: 3, rows: 3, dsl: ZWEI_EINZELN } }, { bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1 r:S2 r:- | 2,0 d:L1 d:- | 3,0 d:L2 d:- | 0,2 r:- r:- r:-' } }], richtig: 1 },
          { typ: 'wahl', frage: 'Wie prüfst du eine fertige Schaltskizze auf Kurzschluss?', optionen: ['Mit dem Finger vom Pluspol zum Minuspol fahren: Gibt es bei irgendeiner Schalterstellung einen Weg ohne Gerät?', 'Ich zähle die Lampen.', 'Ich schaue, ob alle Linien gerade sind.'], richtig: 0 }
        ]
      },
      {
        id: 'sk-lesen', titel: 'Schaltpläne lesen',
        items: [
          { typ: 'leuchtet', frage: 'Hauptschalter S1 und S2 sind geschlossen, S3 ist offen. Welche Lampen leuchten?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1* r:- r:- | 2,0 d:S2* d:L1 | 3,0 d:S3 d:L2 | 0,2 r:- r:- r:-' } },
          { typ: 'leuchtet', frage: 'Jetzt ist der Hauptschalter offen. Welche Lampen leuchten?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:S2* d:L1 | 3,0 d:S3* d:L2 | 0,2 r:- r:- r:-' } },
          { typ: 'leuchtet', frage: 'Garage: S1 und S3 sind geschlossen. Leuchtet die Lampe?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1* r:S2 r:- d:- d:L1 l:- l:- l:- | 1,0 d:- r:S3* u:-' } },
          { typ: 'leuchtet', frage: 'Welche Lampen leuchten?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:L1 r:- r:- | 2,0 d:L2 d:- | 3,0 d:S1 d:L3 | 0,2 r:- r:- r:-' }, erkl: 'L1 liegt in der gemeinsamen Leitung, L2 in einem geschlossenen Zweig. Der Zweig von L3 ist durch S1 unterbrochen.' }
        ]
      },
      {
        id: 'sk-quiz', titel: 'Werkstatt-Quiz',
        items: [
          { typ: 'wahl', frage: 'Zwei Lampen sollen gemeinsam an- und ausgehen, aber beide hell leuchten. Was brauchst du?', optionen: ['Parallelschaltung mit einem Schalter in der gemeinsamen Leitung', 'Reihenschaltung mit einem Schalter', 'Parallelschaltung mit einem Schalter in einem der Zweige'], richtig: 0 },
          { typ: 'wahl', frage: 'Was zeichnet man an eine Stelle, an der sich Leitungen verzweigen?', optionen: ['Einen dicken Punkt', 'Ein Kreuz', 'Nichts'], richtig: 0 },
          { typ: 'wahl', frage: 'Ein Schalter soll nur eine von drei parallelen Lampen schalten. Wo sitzt er?', optionen: ['Im Zweig dieser Lampe, in Reihe zu ihr', 'In der gemeinsamen Leitung', 'Parallel zu dieser Lampe'], richtig: 0 },
          { typ: 'wahl', frage: 'Eine Klingel soll von drei Stellen aus läuten können. Wie schaltest du die drei Taster?', optionen: ['Parallel (ODER)', 'In Reihe (UND)'], richtig: 0, fest: true }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'sk-e1',
        frage: 'Beschreibe, wie du vorgehst, wenn du zu einem Problem eine Schaltskizze zeichnen sollst.',
        punkte: [
          'Zuerst die Bauteile bestimmen: Quelle, Geräte, Schalter.',
          'Entscheiden, ob die Geräte parallel (unabhängig, volle Spannung) oder in Reihe liegen.',
          'Schalter in Reihe zu dem setzen, was sie schalten sollen (UND in Reihe, ODER parallel).',
          'Sauber mit Lineal und Schaltzeichen zeichnen, Verzweigungspunkte und Beschriftung.',
          'Am Ende mit dem Finger-Test prüfen, auch auf Kurzschluss.'
        ],
        muster: 'Zuerst überlege ich, welche Bauteile ich brauche: eine Quelle, die Geräte und die Schalter. Dann entscheide ich, ob die Geräte unabhängig voneinander laufen sollen. Dann schalte ich sie parallel, sonst in Reihe. Danach setze ich die Schalter: Jeder Schalter liegt in Reihe zu dem Gerät, das er schalten soll. Müssen mehrere Bedingungen gleichzeitig erfüllt sein, kommen die Schalter in Reihe (UND), reicht eine, kommen sie parallel (ODER). Ich zeichne mit Lineal, nur mit geraden Linien und Schaltzeichen, setze dicke Punkte an Verzweigungen und beschrifte alles. Zum Schluss prüfe ich mit dem Finger für jede Schalterstellung, ob es funktioniert und ob es keinen Weg ohne Gerät gibt.'
      },
      {
        id: 'sk-e2',
        frage: 'Beschreibe den Stromkreis der Fahrradbeleuchtung: Welche Teile gehören dazu, wie sind die Lampen geschaltet und welche Rolle spielt der Rahmen? (Buch S. 98/119)',
        punkte: [
          'Der Dynamo ist die elektrische Quelle.',
          'Scheinwerfer und Rücklicht sind die Geräte, sie sind parallel geschaltet.',
          'Jede Lampe ist mit einem Kabel mit dem Dynamo verbunden.',
          'Der Metallrahmen bildet die zweite, gemeinsame Verbindung (Rückleitung).',
          'Fällt eine Lampe aus, leuchtet die andere weiter.'
        ],
        muster: 'Die Quelle der Fahrradbeleuchtung ist der Dynamo. Scheinwerfer und Rücklicht sind die Geräte. Jede Lampe ist über ein eigenes Kabel mit dem Dynamo verbunden. Die zweite Verbindung bildet der Metallrahmen des Fahrrads, er ist für beide Lampen eine gemeinsame Rückleitung zum Dynamo. Die beiden Lampen liegen also in zwei Zweigen und sind parallel geschaltet. Fällt der Scheinwerfer aus, leuchtet das Rücklicht weiter.'
      }
    ]
  });
})();
