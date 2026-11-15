/* Strom-Geheimnisse (mit Funken freischalten) und Funksprüche der Leitstelle. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});

  W.GEHEIMNISSE = [
    { ab: 15, titel: 'Woher das Wort kommt', text: 'Das Wort „Elektrizität“ kommt vom griechischen Wort „elektron“ für Bernstein. Schon vor über 2500 Jahren fiel auf, dass geriebener Bernstein leichte Teilchen anzieht.' },
    { ab: 40, titel: 'Vögel auf der Stromleitung', text: 'Ein Vogel, der auf einer einzigen Hochspannungsleitung sitzt, bekommt keinen Schlag. Zwischen seinen Füßen gibt es fast keine Spannung, durch seinen Körper führt kein Stromkreis. Gefährlich wird es erst, wenn er zwei Leitungen gleichzeitig berührt.' },
    { ab: 70, titel: 'Der Zitteraal', text: 'Der Zitteraal kann mit besonderen Zellen Stromschläge von mehreren hundert Volt erzeugen. Damit betäubt er seine Beute.' },
    { ab: 100, titel: 'Volt und Ampere', text: 'Die Einheit Volt ist nach Alessandro Volta benannt, der um 1800 die erste Batterie baute. Die Einheit Ampere ist nach dem Physiker André-Marie Ampère benannt.' },
    { ab: 140, titel: 'Wie heiß ist ein Glühfaden?', text: 'Der Wolframfaden einer Glühlampe wird über 2000 °C heiß, deshalb leuchtet er. Der Glaskolben sorgt dafür, dass kein Sauerstoff an den Faden kommt – sonst würde er sofort verbrennen.' },
    { ab: 180, titel: 'Spannungen im Alltag', text: 'Kleine Batterie: 1,5 V. Handy-Akku: etwa 3,7 V. Autobatterie: 12 V. Steckdose: 230 V. Oberleitung der Bahn: 15 000 V.' },
    { ab: 230, titel: 'Ein Blitz in Zahlen', text: 'Ein Blitz kann eine Spannung von vielen Millionen Volt haben, die Stromstärke liegt oft über 20 000 Ampere. Dafür dauert er nur einen Bruchteil einer Sekunde.' },
    { ab: 290, titel: 'Warum unser Körper leitet', text: 'Der menschliche Körper besteht zu einem großen Teil aus Wasser, in dem Salze gelöst sind. Deshalb ist er ein Leiter – und deshalb ist die Steckdose für uns so gefährlich.' },
    { ab: 350, titel: 'Sicher im Auto', text: 'Bei Gewitter ist man im Auto recht sicher. Schlägt ein Blitz ein, fließt die Ladung außen über die Metallkarosserie in den Boden.' },
    { ab: 420, titel: 'Die Suche in der Lichterkette', text: 'Bei alten Lichterketten musste man bei einer dunklen Kette jede Kerze einzeln prüfen, bis man die kaputte gefunden hatte. Typisch Reihenschaltung!' }
  ];

  W.LERNPLAN_AUFGABEN = ['ladung', 'stromkreis', 'reihe', 'sinnvoll', 'undoder', 'skizzen', 'pruefung'];

  /** Funkspruch der Leitstelle passend zum Stand. Gibt {text, ziel, knopf} zurück. */
  W.funkspruch = function (data, stadtteile, fortschritt) {
    var name = data.name ? data.name : 'Technikerin';
    var stoer = Object.keys(data.stoer || {}).length;
    var offen = stadtteile.filter(function (st) { return !fortschritt(st).fertig; });
    if (data.urkunde && !offen.length) {
      return { text: 'Die ganze Stadt leuchtet, ' + name + '. Du bist jetzt Netzmeisterin! Vor der Arbeit: Blitzrunde, Störungen und Spickzettel.', ziel: '#/blitz', knopf: 'Blitzrunde starten' };
    }
    if (stoer >= 3) {
      return { text: 'Achtung, ' + stoer + ' Störungen gemeldet! Das sind Aufgaben, die noch nicht sitzen. Behebe sie, bevor du weitermachst.', ziel: '#/stoerungen', knopf: 'Störungen beheben' };
    }
    if (!offen.length) {
      return { text: 'Alle Stadtteile leuchten! Jetzt fehlt nur noch das große Einschalten. Ab 80 % geht die ganze Stadt an.', ziel: '#/pruefung', knopf: 'Zum großen Einschalten' };
    }
    var naechster = offen[0];
    var angefangen = fortschritt(naechster).p > 0;
    if (data.urkunde) {
      return {
        text: 'Die Urkunde hast du schon, stark! Aber ' + (offen.length === 1 ? 'ein Stadtteil ist' : offen.length + ' Stadtteile sind') + ' noch dunkel. Weiter im Stadtteil ' + naechster.name + ': ' + naechster.thema + '.',
        ziel: '#/st/' + naechster.id + '/' + (fortschritt(naechster).karten >= 1 ? 'ueben' : 'verstehen'),
        knopf: 'Zum Stadtteil ' + naechster.name
      };
    }
    if (naechster.nr === 1 && !angefangen) {
      return { text: 'Leitstelle an ' + name + ': Die ganze Stadt ist dunkel. Wir fangen oben an der Wetterwarte an. Dort lernst du, was elektrische Ladung ist.', ziel: '#/st/' + naechster.id + '/verstehen', knopf: 'Zur Wetterwarte' };
    }
    return {
      text: (angefangen ? 'Weiter geht’s im Stadtteil ' + naechster.name + '.' : 'Gut gemacht! Als Nächstes ist der Stadtteil ' + naechster.name + ' dran.') + ' Thema: ' + naechster.thema + '.',
      ziel: '#/st/' + naechster.id + '/' + (fortschritt(naechster).karten >= 1 ? 'ueben' : 'verstehen'),
      knopf: 'Zum Stadtteil ' + naechster.name
    };
  };
})();
