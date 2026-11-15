/* Stadtteil 1: Wetterwarte – elektrische Ladung (Buch S. 102/103) */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  W.stadtteile = W.stadtteile || [];

  W.stadtteile.push({
    id: 'ladung', nr: 1, name: 'Wetterwarte', thema: 'Elektrische Ladung',
    ziel: 'Ich kenne elektrische Ladungen und ihre Eigenschaften. Ich kann die Ladungstrennung durch Reibung erklären.',
    buch: 'Buch S. 102/103',
    funk: 'Hier oben auf der Wetterwarte knistert es. Bevor es blitzt, laden sich Gewitterwolken auf. Finde heraus, was elektrische Ladung ist – dann geht hier das Licht wieder an.',
    karten: [
      {
        titel: 'Es knistert',
        text: '<p>Wenn du im Winter einen Pullover ausziehst, knistert es oft und deine Haare stehen ab. Im Dunkeln siehst du manchmal sogar kleine Funken. Fasst du danach eine Türklinke an, bekommst du einen kleinen Schlag.</p><p>Man sagt dann: Du bist <strong>elektrisch geladen</strong>, du hast <strong>elektrische Ladung</strong> bekommen. Genauso wird ein Kunststoffstab geladen, wenn man ihn mit einem Tuch reibt.</p>'
      },
      {
        titel: 'Zwei Sorten Ladung',
        text: '<p>Lädt man eine Metallkugel am <strong>Pluspol</strong> einer elektrischen Quelle, ist sie <strong>positiv geladen</strong> (+). Lädt man sie am <strong>Minuspol</strong>, ist sie <strong>negativ geladen</strong> (−).</p><p>Die beiden Ladungen verhalten sich unterschiedlich. Das sieht man, wenn man die Kugel über eine Glimmlampe entlädt: Je nach Ladung leuchtet eine andere Seite der Glimmlampe auf.</p>',
        merk: 'Es gibt zwei Sorten von Ladung: positive Ladung (+) und negative Ladung (−).'
      },
      {
        titel: 'Kräfte zwischen geladenen Körpern',
        text: '<p>Geladene Körper üben Kräfte aufeinander aus. Man sieht das gut an zwei leichten Kugeln, die an Fäden hängen. Probiere es aus: Gib beiden Kugeln eine Ladung.</p>',
        demo: 'pendel',
        merk: 'Gleichartig geladene Körper stoßen sich ab. Verschiedenartig geladene Körper ziehen sich an.',
        achtung: '<strong>Merkhilfe</strong>Plus und Plus stoßen sich ab, Minus und Minus auch. Nur Plus und Minus ziehen sich an.'
      },
      {
        titel: 'Ladungstrennung durch Reibung',
        text: '<p>In <strong>allen</strong> Körpern gibt es positive und negative Ladung. Bei einem ungeladenen Körper ist von beiden <strong>gleich viel</strong> vorhanden. Ihre Wirkungen heben sich auf, der Körper ist <strong>neutral</strong>.</p><p>Reibt man zwei Körper aneinander, streift der eine vom anderen einen Teil der <strong>negativen Ladung</strong> ab. Reib selbst:</p>',
        demo: 'reiben',
        merk: 'Beim Reiben wird Ladung getrennt. Der eine Körper hat danach einen Überschuss an negativer Ladung: Er ist negativ geladen. Der andere hat einen Mangel an negativer Ladung: Er ist positiv geladen.',
        achtung: '<strong>Aufgepasst</strong>Beim Reiben entsteht keine neue Ladung, sie wird nur getrennt. Und es wandert nur negative Ladung. „Positiv geladen“ heißt: Hier fehlt negative Ladung.'
      },
      {
        titel: 'Wer wird wie geladen?',
        text: '<p>Das hängt von den Stoffen ab, die man aneinander reibt. Zwei Beispiele:</p><table class="tabelle"><thead><tr><th>Versuch</th><th>Stab</th><th>Tuch</th></tr></thead><tbody><tr><td>Kunststoffstab mit Tuch gerieben</td><td>negativ (−)</td><td>positiv (+)</td></tr><tr><td>Glasstab mit Ledertuch gerieben</td><td>positiv (+)</td><td>negativ (−)</td></tr></tbody></table><p>Ein Kunststoffstab (zum Beispiel aus Hartgummi) und ein Glasstab werden also verschiedenartig geladen. Berührt man mit ihnen je eine Kugel, ziehen sich die Kugeln an.</p><p>Besonders gut lassen sich <strong>Nichtleiter</strong> durch Reiben laden: Kunststoffe, Textilien, Papier, Glas, aber auch Wassertröpfchen in Wolken.</p>'
      },
      {
        titel: 'Laden durch Trennen',
        text: '<p>Nicht nur Reiben lädt, auch <strong>Trennen</strong>. Ein Versuch aus dem Buch: Man legt Aluminiumfolie unter die Kunststofffolie eines Schnellhefters, presst beide fest aufeinander und zieht dann die Kunststofffolie ab.</p><p>Berührt man die <strong>Kunststofffolie</strong> an verschiedenen Stellen mit einer Glimmlampe, leuchtet sie mehrmals auf. An der <strong>Aluminiumfolie</strong> leuchtet sie nur beim ersten Berühren – und zwar am anderen Ende als bei der Kunststofffolie. Beide Folien sind also verschiedenartig geladen.</p>',
        merk: 'Körper werden elektrisch geladen, wenn man sie aneinander reibt oder voneinander trennt.'
      },
      {
        titel: 'Neutralisation',
        text: '<p>Zwei gleiche Metallkugeln werden an den beiden Polen einer Quelle geladen, eine positiv, eine negativ. Berühren sich die Kugeln, sind danach beide <strong>ungeladen</strong>: Die positive und die negative Ladung heben sich in ihrer Wirkung auf.</p><p>Berührst du eine geladene Metallkugel mit der Hand, wird sie entladen: Die Ladung fließt über deinen Körper ab.</p>',
        merk: 'Positive und negative Ladung neutralisieren sich gegenseitig.'
      },
      {
        titel: 'Ladung nachweisen: die Glimmlampe',
        text: '<p>Eine <strong>Glimmlampe</strong> leuchtet kurz auf, wenn Ladung durch sie hindurchfließt. Sie zeigt sogar die Ladungsart an: Sie leuchtet an der Seite, die zum <strong>negativ</strong> geladenen Körper zeigt.</p>',
        demo: 'glimm',
        merk: 'Das Aufleuchten einer Glimmlampe weist Ladung nach. Sie leuchtet an der Seite, die zum negativ geladenen Körper zeigt: Ist der Körper negativ, leuchtet die Seite zum Körper. Ist er positiv, leuchtet die abgewandte Seite.'
      },
      {
        titel: 'Ladung messen: das Elektroskop',
        text: '<p>Ein <strong>Elektroskop</strong> besteht aus einem Metallstab mit einem leichten, drehbaren Zeiger aus Metall. Der Stab ist gegen das Gehäuse isoliert.</p><p>Gibt man Ladung auf die Platte, verteilt sie sich über alle Metallteile. Stab und Zeiger sind dann <strong>gleichartig</strong> geladen und stoßen sich ab: Der Zeiger schlägt aus. Je mehr Ladung, desto größer der Ausschlag.</p><p>Beim <strong>Blättchen-Elektroskop</strong> spreizen sich stattdessen zwei leichte Metallblättchen auseinander.</p>',
        demo: 'elektroskop',
        merk: 'Mit einem Elektroskop weist man Ladung nach: Gleichartig geladene Teile stoßen sich ab, der Zeiger schlägt aus. Ob die Ladung positiv oder negativ ist, zeigt es nicht.',
        achtung: '<strong>Aufgepasst</strong>Das Elektroskop zeigt nicht, ob die Ladung positiv oder negativ ist. Beide Ladungsarten ergeben denselben Ausschlag. Berührt man die Platte mit der Hand, geht der Ausschlag zurück.'
      },
      {
        titel: 'Kunststoff oder Metall?',
        text: '<p>Streicht man mit einer Glimmlampe an einem geriebenen <strong>Kunststoffstab</strong> entlang, leuchtet sie mehrmals auf. Die Ladung auf dem Kunststoff ist <strong>unbeweglich</strong>, er lässt sich nur stellenweise entladen. Kunststoff ist ein Nichtleiter.</p><p>Bei einer geladenen <strong>Metallkugel</strong> leuchtet die Glimmlampe nur <strong>einmal</strong>. Im Metall kann sich die Ladung bewegen. Sie fließt zur Berührungsstelle, eine einzige Berührung entlädt die Kugel ganz.</p>',
        merk: 'Durch Reiben lassen sich Nichtleiter elektrisch laden. Die Pole einer elektrischen Quelle können elektrische Ladung abgeben.'
      },
      {
        titel: 'Gewitter',
        text: '<p>In einer Gewitterwolke reiben Wassertröpfchen und Eiskörnchen aneinander. Dabei wird Ladung getrennt, im unteren Teil der Wolke sammelt sich meist negative Ladung. Wird die Ladung zu groß, entlädt sie sich in einem <strong>Blitz</strong>: einer riesigen Entladung zwischen Wolke und Erde oder zwischen zwei Wolken.</p>'
      },
      {
        titel: 'Elektronen',
        zusatz: true,
        text: '<p>Heute weiß man: Die negative Ladung sitzt auf winzigen Teilchen, den <strong>Elektronen</strong>. Sie sind beweglich. Die positive Ladung sitzt fest im Inneren der Atome.</p><p>Beim Reiben wandern Elektronen von einem Körper zum anderen. Wer Elektronen dazubekommt, ist negativ geladen. Wer Elektronen abgibt, ist positiv geladen.</p>'
      }
    ],
    uebungen: [
      {
        id: 'ladung-plusminus', titel: 'Plus und Minus',
        items: [
          { typ: 'wahl', frage: 'Zwei Kugeln sind beide <strong>negativ</strong> geladen. Was passiert?', optionen: ['Sie stoßen sich ab.', 'Sie ziehen sich an.', 'Es passiert nichts.'], richtig: 0, erkl: 'Gleichartig geladene Körper stoßen sich ab.' },
          { typ: 'wahl', frage: 'Kugel A ist positiv, Kugel B negativ geladen. Was passiert?', optionen: ['Sie ziehen sich an.', 'Sie stoßen sich ab.', 'Es passiert nichts.'], richtig: 0, erkl: 'Verschiedenartig geladene Körper ziehen sich an.' },
          { typ: 'wahl', frage: 'Ein Kunststoffstab wird mit einem Tuch gerieben. Wie sind Stab und Tuch danach geladen?', optionen: ['Stab negativ, Tuch positiv', 'Stab positiv, Tuch negativ', 'Beide negativ', 'Beide bleiben ungeladen'], richtig: 0, erkl: 'Der Stab streift negative Ladung vom Tuch ab. Er hat einen Überschuss, das Tuch einen Mangel an negativer Ladung.' },
          { typ: 'wahl', frage: 'Das Tuch ist nach dem Reiben positiv geladen. Was bedeutet das?', optionen: ['Dem Tuch fehlt negative Ladung (Mangel an negativer Ladung).', 'Das Tuch hat positive Ladung vom Stab bekommen.', 'Das Tuch hat überhaupt keine Ladung mehr.'], richtig: 0, erkl: 'Beim Reiben wandert nur negative Ladung. Positiv geladen heißt: Es fehlt negative Ladung.' },
          { typ: 'wahl', frage: 'Ein Körper ist ungeladen. Was stimmt?', optionen: ['Er enthält gleich viel positive wie negative Ladung.', 'Er enthält gar keine Ladung.', 'Er enthält nur positive Ladung.'], richtig: 0, erkl: 'In allen Körpern gibt es Ladung. Bei ungeladenen Körpern ist von beiden Sorten gleich viel da.' }
        ]
      },
      {
        id: 'ladung-luecke', titel: 'Lückentext Ladungstrennung',
        items: [
          { typ: 'luecke', text: 'Beim Reiben eines Kunststoffstabs mit einem Tuch wird {negative|positive} Ladung vom Tuch auf den Stab übertragen. Der Stab hat danach einen {Überschuss|Mangel} an negativer Ladung und ist {negativ|positiv} geladen. Das Tuch hat einen {Mangel|Überschuss} an negativer Ladung und ist {positiv|negativ} geladen.' },
          { typ: 'luecke', text: 'Gleichartig geladene Körper {stoßen sich ab|ziehen sich an}. Verschiedenartig geladene Körper {ziehen sich an|stoßen sich ab}. Berühren sich positive und negative Ladung, {neutralisieren|verstärken} sie sich.' },
          { typ: 'luecke', text: 'Eine Glimmlampe leuchtet an der Seite auf, die zum {negativ|positiv} geladenen Körper zeigt. Ein Elektroskop zeigt, {ob ein Körper geladen ist|ob die Ladung positiv ist}.' },
          { typ: 'luecke', text: 'Beim Reiben {entsteht keine neue Ladung|entsteht neue Ladung}. Die Ladung wird nur {getrennt|vernichtet}.' }
        ]
      },
      {
        id: 'ladung-pendel', titel: 'Kugel-Detektiv',
        items: [
          { typ: 'wahl', grafik: 'pendel:+:?:ab', frage: 'Die linke Kugel ist positiv geladen. Die Kugeln stoßen sich ab. Wie ist die rechte Kugel geladen?', optionen: ['positiv', 'negativ', 'ungeladen'], richtig: 0, erkl: 'Abstoßung gibt es nur bei gleichartiger Ladung.' },
          { typ: 'wahl', grafik: 'pendel:-:?:an', frage: 'Die linke Kugel ist negativ geladen. Die Kugeln ziehen sich an. Wie ist die rechte Kugel geladen, wenn sie überhaupt geladen ist?', optionen: ['positiv', 'negativ'], richtig: 0, erkl: 'Verschiedenartig geladene Körper ziehen sich an.' },
          { typ: 'wahl', grafik: 'pendel:?:?:ruhe', frage: 'Beide Kugeln wurden mit demselben geriebenen Kunststoffstab berührt. Was beobachtest du?', optionen: ['Sie stoßen sich ab.', 'Sie ziehen sich an.'], richtig: 0, fest: true, erkl: 'Beide bekommen dieselbe Ladung vom Stab (negativ), also stoßen sie sich ab.' },
          { typ: 'wahl', grafik: 'pendel:?:?:ruhe', frage: 'Eine Kugel wurde mit einem geriebenen Glasstab, die andere mit einem geriebenen Kunststoffstab berührt. Was beobachtest du?', optionen: ['Sie ziehen sich an.', 'Sie stoßen sich ab.'], richtig: 0, fest: true, erkl: 'Der Glasstab wird positiv, der Kunststoffstab negativ geladen. Verschiedene Ladungen ziehen sich an.' }
        ]
      },
      {
        id: 'ladung-nachweis', titel: 'Glimmlampe und Elektroskop',
        items: [
          { typ: 'mehrfach', frage: 'Ein Elektroskop zeigt einen Ausschlag. Was weißt du sicher?', optionen: ['Das Elektroskop ist geladen.', 'Man kann nicht sagen, ob die Ladung positiv oder negativ ist.', 'Es ist positiv geladen.', 'Es ist negativ geladen.'], richtig: [0, 1], erkl: 'Beide Ladungsarten ergeben denselben Ausschlag.' },
          { typ: 'wahl', frage: 'Warum schlägt der Zeiger eines geladenen Elektroskops aus?', optionen: ['Stab und Zeiger sind gleichartig geladen und stoßen sich ab.', 'Stab und Zeiger sind verschiedenartig geladen und ziehen sich an.', 'Die Ladung ist schwer und zieht den Zeiger nach unten.'], richtig: 0 },
          { typ: 'wahl', frage: 'Du berührst die Platte eines geladenen Elektroskops mit der Hand. Was passiert?', optionen: ['Der Ausschlag geht zurück, das Elektroskop wird entladen.', 'Der Ausschlag wird größer.', 'Nichts, die Hand ist ein Nichtleiter.'], richtig: 0, erkl: 'Über deinen Körper wird die Ladung abgeleitet.' },
          { typ: 'wahl', grafik: 'glimm:-', frage: 'Ein negativ geladener Stab wird mit einer Glimmlampe berührt. Welche Seite der Glimmlampe leuchtet?', optionen: ['Die Seite zum Stab hin', 'Die Seite zur Hand hin', 'Beide Seiten gleich'], richtig: 0, erkl: 'Die Glimmlampe leuchtet an der Seite, die zum negativ geladenen Körper zeigt.' },
          { typ: 'wahl', grafik: 'glimm:+', frage: 'Eine positiv geladene Kugel wird mit einer Glimmlampe berührt, die du in der Hand hältst. Welche Seite der Glimmlampe leuchtet?', optionen: ['Die Seite, die von der Kugel weg zur Hand zeigt', 'Die Seite zur Kugel hin', 'Gar keine'], richtig: 0, erkl: 'Bei einem positiv geladenen Körper leuchtet die abgewandte Seite.' },
          { typ: 'wahl', frage: 'Du streichst mit einer Glimmlampe an einem geriebenen Kunststoffstab entlang. Sie leuchtet mehrmals auf. Was folgt daraus?', optionen: ['Die Ladung auf dem Kunststoff ist unbeweglich. Er lässt sich nur stellenweise entladen.', 'Kunststoff ist ein guter Leiter.', 'Der Stab lädt sich beim Entlangstreichen immer wieder neu auf.'], richtig: 0 },
          { typ: 'wahl', frage: 'Man zieht die Kunststofffolie eines Schnellhefters von einer Aluminiumfolie ab. An der Aluminiumfolie leuchtet eine Glimmlampe nur beim ersten Berühren auf, an der Kunststofffolie mehrmals. Warum?', optionen: ['Im Metall ist die Ladung beweglich, eine Berührung entlädt alles. Auf dem Kunststoff ist sie unbeweglich.', 'Die Aluminiumfolie ist ungeladen.', 'Die Kunststofffolie ist ein Leiter.'], richtig: 0 },
          { typ: 'wahl', frage: 'Eine geladene Metallkugel wird mit einer Glimmlampe berührt. Wie oft leuchtet die Glimmlampe auf?', optionen: ['Nur einmal', 'Mehrmals', 'Gar nicht'], richtig: 0, erkl: 'Im Metall ist die Ladung beweglich. Eine Berührung entlädt die ganze Kugel.' }
        ]
      },
      {
        id: 'ladung-alltag', titel: 'Ladung im Alltag',
        items: [
          { typ: 'mehrfach', frage: 'Was hat mit elektrischer Ladung zu tun?', optionen: ['Haare stehen nach dem Kämmen ab.', 'Knistern beim Ausziehen eines Pullovers', 'Ein Blitz', 'Ein Magnet zieht einen Nagel an.', 'Eis schmilzt in der Sonne.'], richtig: [0, 1, 2], erkl: 'Der Magnet hat mit Magnetismus zu tun, nicht mit elektrischer Ladung. Das ist eine häufige Verwechslung!' },
          { typ: 'wahl', frage: 'Ein Luftballon wird an den Haaren gerieben. Danach stehen die Haare voneinander ab. Warum?', optionen: ['Die Haare sind gleichartig geladen und stoßen sich ab.', 'Die Haare sind verschiedenartig geladen.', 'Die Haare sind ungeladen.'], richtig: 0 },
          { typ: 'wahl', frage: 'Die Haare werden von dem Ballon angezogen, an dem sie gerieben wurden. Was schließt du daraus?', optionen: ['Ballon und Haare sind verschiedenartig geladen.', 'Ballon und Haare sind gleichartig geladen.', 'Der Ballon ist ein Magnet.'], richtig: 0 },
          { typ: 'wahl', frage: 'Was ist ein Blitz?', optionen: ['Eine riesige Entladung zwischen Wolke und Erde oder zwischen Wolken', 'Ein Lichtstrahl der Sonne', 'Brennendes Gas in der Wolke'], richtig: 0 }
        ]
      },
      {
        id: 'ladung-fehler', titel: 'Fehler finden',
        items: [
          { typ: 'wahl', frage: 'Tom sagt: „Beim Reiben entsteht neue Ladung.“ Hat Tom recht?', optionen: ['Nein. Die Ladung ist schon da und wird nur getrennt.', 'Ja. Reiben erzeugt Ladung.'], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Lisa sagt: „Das Tuch ist positiv geladen, weil positive Ladung vom Stab auf das Tuch gewandert ist.“ Was stimmt?', optionen: ['Falsch: Negative Ladung ist vom Tuch auf den Stab gewandert. Dem Tuch fehlt jetzt negative Ladung.', 'Richtig: Positive Ladung wandert beim Reiben.'], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Ben sagt: „Am Ausschlag des Elektroskops sehe ich, dass der Stab negativ geladen ist.“ Hat Ben recht?', optionen: ['Nein. Das Elektroskop zeigt nur, dass Ladung da ist, nicht welche.', 'Ja, der Zeiger schlägt nur bei negativer Ladung aus.'], richtig: 0, fest: true },
          { typ: 'wahl', frage: 'Mia sagt: „Ein ungeladener Körper hat gar keine Ladung.“ Was stimmt?', optionen: ['Falsch: Er hat gleich viel positive wie negative Ladung.', 'Richtig.'], richtig: 0, fest: true }
        ]
      }
    ],
    erklaeren: [
      {
        id: 'ladung-e1',
        frage: 'Erkläre, wie ein Kunststoffstab durch Reiben mit einem Tuch elektrisch geladen wird. Benutze das Modell der Ladungstrennung.',
        tipp: 'Beginne mit dem Zustand vor dem Reiben.',
        punkte: [
          'Vor dem Reiben haben Stab und Tuch gleich viel positive und negative Ladung, sie sind ungeladen.',
          'Beim Reiben streift der Stab negative Ladung vom Tuch ab.',
          'Der Stab hat danach einen Überschuss an negativer Ladung: Er ist negativ geladen.',
          'Das Tuch hat einen Mangel an negativer Ladung: Es ist positiv geladen.',
          'Es entsteht keine neue Ladung, sie wird nur getrennt.'
        ],
        muster: 'Vor dem Reiben enthalten Stab und Tuch gleich viel positive und negative Ladung, beide sind ungeladen. Beim Reiben streift der Kunststoffstab einen Teil der negativen Ladung vom Tuch ab. Der Stab hat jetzt einen Überschuss an negativer Ladung und ist negativ geladen. Dem Tuch fehlt negative Ladung, es hat einen Mangel an negativer Ladung und ist positiv geladen. Es entsteht keine neue Ladung, die vorhandene Ladung wird nur getrennt.'
      },
      {
        id: 'ladung-e2',
        frage: 'Erkläre, warum der Zeiger eines Elektroskops ausschlägt, wenn man die Platte mit einem geladenen Stab berührt.',
        punkte: [
          'Ladung geht vom Stab auf das Elektroskop über.',
          'Die Ladung verteilt sich über alle Metallteile, also auf Stab und Zeiger.',
          'Stab und Zeiger sind gleichartig geladen.',
          'Gleichartig geladene Körper stoßen sich ab, deshalb dreht sich der Zeiger weg.'
        ],
        muster: 'Berührt man die Platte mit dem geladenen Stab, geht ein Teil der Ladung auf das Elektroskop über. Sie verteilt sich auf alle Metallteile, die leitend verbunden sind, also auf den Metallstab und den Zeiger. Stab und Zeiger sind damit gleichartig geladen. Gleichartig geladene Körper stoßen sich ab, deshalb wird der drehbare Zeiger vom Stab weggedrückt und schlägt aus. Je mehr Ladung, desto größer der Ausschlag.'
      }
    ]
  });
})();
