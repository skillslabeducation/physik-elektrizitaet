/* Reine Rechenlogik: Funken, Lernplan. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});

  function funkenFuer(score) { return Math.round(Math.max(0, Math.min(1, score)) * 10); }

  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
    return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : NaN;
  }
  function isoAus(ms) { return new Date(ms).toISOString().slice(0, 10); }
  var TAG = 86400000;

  function tageBis(heuteISO, zielISO) {
    var a = parseISO(heuteISO), b = parseISO(zielISO);
    if (isNaN(a) || isNaN(b)) return NaN;
    return Math.round((b - a) / TAG);
  }

  var WIEDERHOLUNG = ['stoerungen', 'blitz', 'spick'];

  /** Verteilt Aufgaben auf die Tage vor der Arbeit. Letzter Tag = Wiederholung. */
  function lernplan(heuteISO, arbeitISO, aufgaben) {
    var d = tageBis(heuteISO, arbeitISO);
    if (!(d > 0)) return [];
    var start = parseISO(heuteISO);
    if (d === 1) return [{ datum: heuteISO, aufgaben: ['blitz', 'stoerungen', 'pruefung', 'spick'] }];
    var tage = d - 1;
    var n = aufgaben.length;
    var plan = [];
    for (var i = 0; i < tage; i++) {
      var teil = aufgaben.slice(Math.floor(i * n / tage), Math.floor((i + 1) * n / tage));
      plan.push({ datum: isoAus(start + i * TAG), aufgaben: teil.length ? teil : ['stoerungen', 'blitz'] });
    }
    plan.push({ datum: isoAus(start + tage * TAG), aufgaben: WIEDERHOLUNG.slice() });
    return plan;
  }

  function heuteISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /** Was noch zu lernen ist: offene Stadtteile, dann die Prüfung (falls noch keine Urkunde). */
  function planAufgaben(stadtteilIds, fertig, urkunde) {
    return stadtteilIds.filter(function (id) { return !fertig[id]; }).concat(urkunde ? [] : ['pruefung']);
  }

  W.logic = { funkenFuer: funkenFuer, lernplan: lernplan, planAufgaben: planAufgaben, tageBis: tageBis, heuteISO: heuteISO };
})();
