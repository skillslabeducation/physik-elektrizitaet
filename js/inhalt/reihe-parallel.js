/* Stadtteil 3: Hafen – Reihen- und Parallelschaltung, Stromstärke und Spannung (Buch S. 118/119/122) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  var REIHE2 = '0,1 u:B r:L1 r:L2 d:- l:- l:-';
  var PAR2 = '0,1 u:B r:- d:L1 l:- | 1,0 r:- d:L2 l:-';
  var R = 'Reihenschaltung', P = 'Parallelschaltung';

  W.stadtteile.push({
    id: 'reihe', nr: 3, name: 'Hafen', thema: 'Reihen- und Parallelschaltung',
    ziel: 'Ich kenne den Unterschied zwischen einer Parallel- und einer Reihenschaltung von Glühlampen und kann Aussagen über die Spannung und Stromstärke machen.',
    buch: 'Buch S. 118/119/122',
    funk: 'Am Hafen hängen Lichterketten an den Kränen. Fällt ein Lämpchen aus, wird es dunkel – oder auch nicht. Das hängt davon ab, wie die Lampen geschaltet sind.',
    karten: [
      {
        titel: 'Die Reihenschaltung',
        text: '<p>Bei einer <strong>Reihenschaltung</strong> liegen alle Geräte hintereinander in <strong>einem</strong> Zweig. Für den Strom gibt es nur einen Weg von der Quelle durch alle Geräte zurück zur Quelle.</p><p>Probiere es aus: Dreh mit einem Fingertipp eine Lampe heraus.</p>',
        baukasten: { cols: 3, rows: 2, dsl: REIHE2 },
        merk: 'Eine Schaltung mit mehreren Geräten in einem Zweig heißt Reihenschaltung. Schon eine Unterbrechung an einer Stelle löscht alle Lampen aus.'
      },
      {
        titel: 'Die Parallelschaltung',
        text: '<p>Bei einer <strong>Parallelschaltung</strong> verzweigt sich der Stromkreis. Jedes Gerät liegt in einem eigenen <strong>Zweig</strong>. Die Ladung kann auf verschiedenen Wegen zur Quelle zurück.</p><p>Dreh auch hier eine Lampe heraus:</p>',
        baukasten: { cols: 3, rows: 2, dsl: PAR2 },
        merk: 'Eine Schaltung mit mehreren Zweigen heißt Parallelschaltung. Die Geräte lassen sich unabhängig voneinander ein- und ausschalten. Wird ein Zweig unterbrochen, bleibt der Stromkreis über die anderen Zweige geschlossen.'
      },
      {
        titel: 'Beispiel Fahrrad',
        text: '<p>Am Fahrrad sind Scheinwerfer und Rücklicht <strong>parallel</strong> geschaltet. Jede Lampe ist nur über ein Kabel mit dem Dynamo verbunden. Die zweite Verbindung bildet der <strong>Rahmen</strong> des Fahrrads, er ist für beide Lampen ein gemeinsamer Teil des Stromkreises.</p><p>Fällt der Scheinwerfer aus, leuchtet das Rücklicht trotzdem weiter.</p>',
        bild: { cols: 3, rows: 2, dsl: '0,1 u:G r:- d:L1 l:- | 1,0 r:- d:L2 l:-', label: 'Fahrradbeleuchtung: Dynamo (Zeichen für eine elektrische Quelle), Scheinwerfer L1, Rücklicht L2' }
      },
      {
        titel: 'Reihe oder parallel? So erkennst du es',
        text: '<p><strong>Finger-Test:</strong> Fahre im Schaltplan mit dem Finger vom Pluspol los. Kommst du auf <strong>einem einzigen Weg</strong> durch alle Lampen nacheinander zum Minuspol, ist es eine Reihenschaltung. Teilt sich der Weg an einem <strong>Verzweigungspunkt</strong>, ist es eine Parallelschaltung.</p><p><strong>Herausdreh-Test:</strong> Gehen beim Herausdrehen einer Lampe alle anderen aus, ist es eine Reihenschaltung.</p>',
        bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:- d:L1 d:L2 l:- l:-' },
        achtung: '<strong>Aufgepasst</strong>Nicht das Aussehen entscheidet. Diese beiden Lampen sind untereinander gezeichnet, aber trotzdem in Reihe geschaltet: Es gibt nur einen Weg.'
      },
      {
        titel: 'Stromstärke in der Reihenschaltung',
        text: '<p>Die <strong>Stromstärke</strong> <em>I</em> gibt an, wie viel Ladung in einer Sekunde an einer Stelle des Stromkreises vorbeifließt. Ihre Einheit ist <strong>Ampere (A)</strong>. Gemessen wird sie mit einem Strommesser.</p><p>Misst man an verschiedenen Stellen einer Reihenschaltung, findet man überall denselben Wert. Schalte die Messwerte ein:</p>',
        baukasten: { cols: 3, rows: 2, dsl: REIHE2, messwerte: true },
        merk: 'Die Stromstärke in einer Reihenschaltung ist überall gleich: I = I₁ = I₂ = I₃',
        achtung: '<strong>Häufiger Denkfehler</strong>Der Strom wird in der ersten Lampe nicht „verbraucht“. Hinter der ersten Lampe ist die Stromstärke genauso groß wie davor.'
      },
      {
        titel: 'Stromstärke in der Parallelschaltung: die Knotenregel',
        text: '<p>In der Parallelschaltung teilt sich die Ladung an den Verzweigungspunkten vollständig auf die Zweige auf, wie ein Fluss, der sich teilt und wieder zusammenfließt. In den gemeinsamen Teilen des Stromkreises ist die Stromstärke so groß wie alle Zweigstromstärken zusammen.</p>',
        baukasten: { cols: 3, rows: 2, dsl: PAR2, messwerte: true },
        merk: 'Die Stromstärke in den gemeinsamen Teilen einer Parallelschaltung ist gleich der Summe der Stromstärken in den Zweigen: I = I₁ + I₂ + I₃ … (Knotenregel)'
      },
      {
        titel: 'Spannung in der Reihenschaltung: die Maschenregel',
        text: '<p>Die <strong>Spannung</strong> <em>U</em> wird in <strong>Volt (V)</strong> gemessen. Die Quelle hat die Spannung <em>U</em><sub>Q</sub>.</p><p>In der Reihenschaltung misst man an den Lampen <strong>Teilspannungen</strong> <em>U</em>₁ und <em>U</em>₂, die kleiner sind als <em>U</em><sub>Q</sub>. Zusammen ergeben sie die Spannung der Quelle. Bei zwei gleichen Lampen bekommt jede die Hälfte, deshalb leuchten sie schwächer als eine Lampe allein. Bei unterschiedlichen Lampen sind die Teilspannungen nicht gleich groß.</p>',
        merk: 'In einer Reihenschaltung ist die Summe der Teilspannungen gleich der Spannung an der Quelle: U<sub>Q</sub> = U₁ + U₂ … (Maschenregel)'
      },
      {
        titel: 'Spannung in der Parallelschaltung',
        text: '<p>In der Parallelschaltung bildet jeder Zweig mit der Quelle einen eigenen Stromkreis. Deshalb misst man an jedem Zweig dieselbe Spannung wie an der Quelle, egal ob die Lampen gleich oder verschieden sind.</p><p>Darum funktionieren im Haushalt alle Geräte an jeder Steckdose gleich: Alle Steckdosen sind parallel geschaltet, an jeder liegen 230 V.</p>',
        merk: 'In einer Parallelschaltung sind die Spannungen an den Geräten gleich der Spannung an der Quelle: U<sub>Q</sub> = U₁ = U₂'
      },
      {
        titel: 'Die Lichterkette',
        text: '<p>Eine Lampe mit der Aufschrift 6 V brennt an einer 12-V-Quelle durch. Schaltet man aber zwei solche Lampen in Reihe, bekommt jede nur 6 V – sie halten.</p><p>Eine Lichterkette mit 17 Kerzen zu je 15 V hängt an der Steckdose (230 V). Die Kerzen sind in Reihe geschaltet, jede bekommt</p><p class="formel">230 V : 17 ≈ 13,5 V</p><p>Das ist weniger als 15 V, also brennt keine durch. Aber: Fällt eine Kerze aus, ist die ganze Kette dunkel.</p>'
      },
      {
        titel: 'Alles auf einen Blick',
        text: '<table class="tabelle"><thead><tr><th></th><th>Reihenschaltung</th><th>Parallelschaltung</th></tr></thead><tbody>' +
          '<tr><th>Wege</th><td>nur ein Weg</td><td>mehrere Zweige</td></tr>' +
          '<tr><th>Stromstärke</th><td>überall gleich<br>I = I₁ = I₂</td><td>teilt sich auf<br>I = I₁ + I₂</td></tr>' +
          '<tr><th>Spannung</th><td>teilt sich auf<br>U<sub>Q</sub> = U₁ + U₂</td><td>überall gleich<br>U<sub>Q</sub> = U₁ = U₂</td></tr>' +
          '<tr><th>Gleiche Lampen</th><td>leuchten schwächer</td><td>so hell wie eine Lampe allein</td></tr>' +
          '<tr><th>Eine Lampe fällt aus</th><td>alle aus</td><td>andere leuchten weiter</td></tr>' +
          '<tr><th>Beispiel</th><td>Lichterkette</td><td>Haushalt, Fahrrad</td></tr></tbody></table>'
      },
      {
        titel: 'Messgeräte richtig anschließen',
        zusatz: true,
        text: '<p>Ein <strong>Strommesser</strong> (Amperemeter) wird <strong>in Reihe</strong> in den Stromkreis eingebaut: Die Ladung muss durch ihn hindurch. Ein <strong>Spannungsmesser</strong> (Voltmeter) wird <strong>parallel</strong> zum Gerät angeschlossen, also an seine beiden Anschlüsse.</p><p>Im Schaltplan zeichnet man ein Messgerät als Kreis mit schrägem Pfeil.</p>'
      }
    ],
    uebungen: [
      {
        id: 'rp-erkennen', titel: 'Reihe oder parallel?',
        items: [
          { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet?', bild: { cols: 3, rows: 2, dsl: REIHE2 }, optionen: [R, P], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet?', bild: { cols: 3, rows: 2, dsl: PAR2 }, optionen: [R, P], richtig: 1, fest: true },
          { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet? Vorsicht, Falle!', bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:- d:L1 d:L2 l:- l:-' }, optionen: [R, P], richtig: 0, fest: true, erkl: 'Es gibt nur einen Weg und keinen Verzweigungspunkt. Die Lampen sind nur untereinander gezeichnet.' },
          { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:- r:- r:- d:L3 l:- l:- l:- | 1,0 d:L1 | 2,0 d:L2' }, optionen: [R, P], richtig: 1, fest: true, erkl: 'Drei Zweige mit je einer Lampe.' },
          { typ: 'wahl', frage: 'Wie sind die Lampen geschaltet?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:L1 r:- d:L2 l:- l:-' }, optionen: [R, P], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Woran erkennt man eine Parallelschaltung im Schaltplan sicher?', optionen: ['An Verzweigungspunkten: Der Weg teilt sich in mehrere Zweige.', 'Die Lampen sind nebeneinander gezeichnet.', 'Es gibt mehr als eine Lampe.'], richtig: 0 }
        ]
      },
      {
        id: 'rp-leuchtet', titel: 'Welche Lampen leuchten?',
        items: [
          { typ: 'leuchtet', frage: 'Welche Lampen leuchten?', bild: { cols: 4, rows: 2, dsl: '0,1 u:B r:S1 r:L1 r:L2 d:- l:- l:- l:-' }, erkl: 'Reihenschaltung mit offenem Schalter: Der einzige Weg ist unterbrochen.' },
          { typ: 'leuchtet', frage: 'Welche Lampen leuchten?', bild: { cols: 3, rows: 3, dsl: '0,2 u:B u:- r:- r:- | 1,0 d:S1 d:L1 | 2,0 d:- d:L2 | 0,2 r:- r:-' }, erkl: 'Nur der Zweig von L1 ist unterbrochen. L2 hat einen eigenen Zweig.' },
          { typ: 'leuchtet', frage: 'Welche Lampen leuchten?', bild: { cols: 4, rows: 3, dsl: '0,2 u:B u:- r:S1 r:- r:- | 2,0 d:L1 d:- | 3,0 d:L2 d:- | 0,2 r:- r:- r:-' }, erkl: 'S1 sitzt in der gemeinsamen Leitung. Ist er offen, sind alle Zweige unterbrochen.' },
          { typ: 'leuchtet', frage: 'L1 ist herausgedreht (gestrichelt). Welche Lampen leuchten?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:L1x r:L2 d:- l:- l:-' }, erkl: 'In der Reihenschaltung unterbricht die fehlende Lampe den einzigen Weg.' },
          { typ: 'leuchtet', frage: 'L1 ist herausgedreht (gestrichelt). Welche Lampen leuchten?', bild: { cols: 3, rows: 2, dsl: '0,1 u:B r:- d:L1x l:- | 1,0 r:- d:L2 l:-' }, erkl: 'L2 hat einen eigenen Zweig und leuchtet weiter.' }
        ]
      },
      {
        id: 'rp-strom', titel: 'Stromstärke berechnen',
        items: [
          { typ: 'zahl', frage: 'Zwei Lampen sind in Reihe geschaltet. Durch L1 fließen 0,2 A. Wie groß ist die Stromstärke I₂ in L2?', vor: 'I₂ =', antwort: 0.2, einheit: 'A', erkl: 'In der Reihenschaltung ist die Stromstärke überall gleich.' },
          { typ: 'zahl', frage: 'Zwei Lampen sind parallel geschaltet. I₁ = 0,3 A, I₂ = 0,2 A. Wie groß ist die Stromstärke I in der gemeinsamen Leitung?', vor: 'I =', antwort: 0.5, einheit: 'A', erkl: 'Knotenregel: I = I₁ + I₂ = 0,3 A + 0,2 A = 0,5 A' },
          { typ: 'zahl', frage: 'Parallelschaltung: Die Quelle liefert I = 0,8 A. Durch L1 fließen 0,5 A. Wie groß ist I₂?', vor: 'I₂ =', antwort: 0.3, einheit: 'A', erkl: 'I₂ = I − I₁ = 0,8 A − 0,5 A = 0,3 A' },
          { typ: 'zahl', frage: 'Drei Lampen parallel: I₁ = 0,25 A, I₂ = 0,25 A, I₃ = 0,1 A. Wie groß ist I?', vor: 'I =', antwort: 0.6, einheit: 'A', erkl: 'I = 0,25 A + 0,25 A + 0,1 A = 0,6 A' },
          { typ: 'zahl', frage: 'Drei Lampen in Reihe. Die Quelle liefert 0,15 A. Wie groß ist die Stromstärke I₃ in der dritten Lampe?', vor: 'I₃ =', antwort: 0.15, einheit: 'A' }
        ]
      },
      {
        id: 'rp-spannung', titel: 'Spannung berechnen',
        items: [
          { typ: 'zahl', frage: 'Reihenschaltung: U<sub>Q</sub> = 12 V, U₁ = 7 V. Wie groß ist U₂?', vor: 'U₂ =', antwort: 5, einheit: 'V', erkl: 'Maschenregel: U₂ = U<sub>Q</sub> − U₁ = 12 V − 7 V = 5 V' },
          { typ: 'zahl', frage: 'Zwei gleiche Lampen sind in Reihe an eine 9-V-Batterie angeschlossen. Welche Spannung liegt an jeder Lampe?', antwort: 4.5, einheit: 'V', erkl: 'Gleiche Lampen teilen sich die Spannung gleichmäßig: 9 V : 2 = 4,5 V' },
          { typ: 'zahl', frage: 'Zwei Lampen sind parallel an eine 6-V-Batterie angeschlossen. Wie groß ist U₂?', vor: 'U₂ =', antwort: 6, einheit: 'V', erkl: 'In der Parallelschaltung liegt an jedem Zweig die volle Spannung der Quelle.' },
          { typ: 'zahl', frage: 'Eine Lichterkette hat 10 gleiche Lampen in Reihe an 230 V. Welche Spannung liegt an jeder Lampe?', antwort: 23, einheit: 'V', erkl: '230 V : 10 = 23 V' },
          { typ: 'zahl', frage: 'Drei Lampen in Reihe: U₁ = 2 V, U₂ = 3 V, U₃ = 4 V. Wie groß ist die Spannung der Quelle?', vor: 'U<sub>Q</sub> =', antwort: 9, einheit: 'V', erkl: 'U<sub>Q</sub> = 2 V + 3 V + 4 V = 9 V' }
        ]
      },
      {
        id: 'rp-regeln', titel: 'Die Regeln',
        items: [
          { typ: 'luecke', text: 'In einer Reihenschaltung ist die Stromstärke {überall gleich|in jeder Lampe anders}. Die Spannung der Quelle {teilt sich auf die Geräte auf|liegt an jedem Gerät voll an}.' },
          { typ: 'luecke', text: 'In einer Parallelschaltung liegt an jedem Zweig {die volle Spannung der Quelle|nur ein Teil der Spannung}. Die Stromstärke {teilt sich auf die Zweige auf|ist in jedem Zweig so groß wie in der gemeinsamen Leitung}.' },
          { typ: 'luecke', text: 'Die Regel I = I₁ + I₂ heißt {Knotenregel|Maschenregel}. Die Regel U<sub>Q</sub> = U₁ + U₂ heißt {Maschenregel|Knotenregel}.' },
          { typ: 'luecke', text: 'Die Stromstärke wird in {Ampere|Volt} gemessen, die Spannung in {Volt|Ampere}.' }
        ]
      },
      {
        id: 'rp-fehler', titel: 'Fehler finden',
        items: [
          { typ: 'wahl', frage: 'In einer Parallelschaltung mit zwei gleichen Lampen wurde gemessen: I₁ = 0,25 A, I₂ = 0,25 A, I = 0,25 A. Was stimmt nicht?', optionen: ['I müsste 0,50 A sein, denn I = I₁ + I₂.', 'In der Parallelschaltung ist die Stromstärke überall gleich, also stimmt alles.', 'I müsste 0 A sein.'], richtig: 0, erkl: 'Knotenregel: I = I₁ + I₂ = 0,25 A + 0,25 A = 0,50 A. Begründe in der Arbeit immer mit der Regel. Kleine Abweichungen wie 0,27 A + 0,07 A = 0,34 A statt gemessener 0,35 A sind normale Messungenauigkeit.' },
          { typ: 'wahl', frage: 'Max sagt: „In einer Reihenschaltung wird Strom in der ersten Lampe verbraucht. Deshalb ist die Stromstärke hinter der Lampe kleiner.“', optionen: ['Falsch. Die Stromstärke ist in der Reihenschaltung überall gleich.', 'Richtig.'], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'An einer Reihenschaltung wurde gemessen: U<sub>Q</sub> = 6 V, U₁ = 6 V, U₂ = 6 V. Was stimmt nicht?', optionen: ['U₁ und U₂ müssen zusammen 6 V ergeben.', 'U<sub>Q</sub> müsste 18 V sein.', 'Alles stimmt.'], richtig: 0, erkl: 'Maschenregel: U<sub>Q</sub> = U₁ + U₂. Gleiche Werte an allen Geräten gibt es in der Parallelschaltung.' },
          { typ: 'wahl', frage: 'Lena sagt: „In meiner Lichterkette ist eine Kerze kaputt, deshalb leuchtet keine mehr. Also ist die Kette parallel geschaltet.“', optionen: ['Falsch. Gehen alle aus, ist es eine Reihenschaltung.', 'Richtig.'], richtig: 0, fest: true }
        ]
      },
      {
        id: 'rp-messung', titel: 'Messwerte auswerten',
        items: [
          { typ: 'wahl', frage: 'In einer Schaltung mit zwei Lampen wurde gemessen: I = 0,3 A, I₁ = 0,3 A, I₂ = 0,3 A. Wie sind die Lampen geschaltet?', optionen: [R, P], richtig: 0, fest: true, erkl: 'Die Stromstärke ist überall gleich. In einer Parallelschaltung müsste I = I₁ + I₂ = 0,6 A sein.' },
          { typ: 'wahl', frage: 'Gemessen wurde: I = 0,5 A, I₁ = 0,3 A, I₂ = 0,2 A. Wie sind die Lampen geschaltet?', optionen: [R, P], richtig: 1, fest: true, erkl: 'Die Stromstärke teilt sich auf: 0,3 A + 0,2 A = 0,5 A (Knotenregel).' },
          { typ: 'wahl', frage: 'Gemessen wurde: U<sub>Q</sub> = 6 V, U₁ = 6 V, U₂ = 6 V. Wie sind die Lampen geschaltet?', optionen: [R, P], richtig: 1, fest: true, erkl: 'An jedem Gerät liegt die volle Spannung der Quelle.' },
          { typ: 'zahl', frage: 'Fahrradbeleuchtung (Buch S. 119): In der gemeinsamen Leitung misst man I = 0,6 A, im Scheinwerfer I₁ = 0,5 A. Wie groß ist die Stromstärke I₂ im Rücklicht?', vor: 'I₂ =', antwort: 0.1, einheit: 'A', erkl: 'I₂ = I − I₁ = 0,6 A − 0,5 A = 0,1 A' },
          { typ: 'zahl', frage: 'Reihenschaltung: Vor der ersten Lampe misst man 0,25 A. Was zeigt ein Strommesser zwischen der ersten und der zweiten Lampe an?', antwort: 0.25, einheit: 'A', erkl: 'In der Reihenschaltung ist die Stromstärke an jeder Stelle gleich.' }
        ]
      },
      {
        id: 'rp-mission', titel: 'Mission: Lichter am Kran',
        items: [
          { typ: 'mission', frage: 'Häng zwei Lampen als Lichterkette in Reihe an die Batterie.', tipp: 'Teste mit der Hand: Dreh eine Lampe heraus. Die andere muss ausgehen.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 2 }, ziel: { art: 'reihe', lampen: 2, lob: 'Reihenschaltung steht! Siehst du, dass beide Lampen schwächer leuchten?' }, loesung: '0,2 u:B u:- r:L1 r:L2 r:- d:- d:- l:- l:- l:-' },
          { typ: 'mission', frage: 'Schließ zwei Hafenlaternen parallel an: Fällt eine aus, soll die andere weiterleuchten.', tipp: 'Jede Lampe braucht einen eigenen Zweig.', cols: 4, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 2 }, ziel: { art: 'parallel', lampen: 2, lob: 'Parallelschaltung steht! Beide Lampen leuchten hell.' }, loesung: '0,2 u:B u:- r:- r:- | 1,0 d:L1 d:- | 2,0 d:L2 d:- | 0,2 r:- r:-' },
          { typ: 'mission', frage: 'Profi: Drei Lampen sollen alle hell leuchten und unabhängig voneinander weiterleuchten, wenn eine ausfällt.', cols: 5, rows: 3, palette: { leitung: Infinity, batterie: 1, lampe: 3 }, ziel: { art: 'parallel', lampen: 3 }, loesung: '0,2 u:B u:- r:- r:- r:- | 1,0 d:L1 d:- | 2,0 d:L2 d:- | 3,0 d:L3 d:- | 0,2 r:- r:- r:-' }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'rp-e1',
        frage: 'Bei einer Lichterkette ist eine Kerze kaputt, jetzt leuchtet keine mehr. Erkläre, wie die Kerzen geschaltet sind und warum alle ausgehen.',
        punkte: [
          'Die Kerzen sind in Reihe geschaltet.',
          'In einer Reihenschaltung gibt es nur einen Weg für den Strom.',
          'Die kaputte Kerze unterbricht diesen einzigen Weg.',
          'Der Stromkreis ist offen, deshalb leuchtet keine Kerze mehr.'
        ],
        muster: 'Die Kerzen der Lichterkette sind in Reihe geschaltet. In einer Reihenschaltung gibt es nur einen einzigen Weg von der Quelle durch alle Kerzen zurück zur Quelle. Ist eine Kerze kaputt, ist dieser Weg an einer Stelle unterbrochen. Der Stromkreis ist nicht mehr geschlossen, deshalb leuchtet keine der Kerzen.'
      },
      {
        id: 'rp-e2',
        frage: 'Erkläre mithilfe der Spannung, warum zwei gleiche Lampen in Reihe schwächer leuchten als eine Lampe allein an derselben Batterie.',
        punkte: [
          'In der Reihenschaltung teilt sich die Spannung der Quelle auf: U<sub>Q</sub> = U₁ + U₂.',
          'Bei gleichen Lampen bekommt jede nur die Hälfte der Spannung.',
          'Mit weniger Spannung leuchtet eine Lampe schwächer.',
          'Eine Lampe allein bekommt die volle Spannung der Quelle.'
        ],
        muster: 'Eine Lampe allein bekommt die volle Spannung der Batterie. In der Reihenschaltung teilt sich die Spannung der Quelle auf die beiden Lampen auf (Maschenregel U<sub>Q</sub> = U₁ + U₂). Weil die Lampen gleich sind, bekommt jede nur die Hälfte. Mit der halben Spannung leuchten die Lampen deutlich schwächer.'
      }
    ]
  });
})();
