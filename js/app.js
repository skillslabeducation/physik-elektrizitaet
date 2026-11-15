/* Start und Hash-Routing. */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var A = function () { return W.ansichten; };

  function render() {
    var teile = (location.hash || '#/').replace(/^#\/?/, '').split('/');
    if (!W.state.data.begruesst) { A().willkommen(); return; }
    switch (teile[0]) {
      case 'st': A().stadtteil(teile[1], teile[2]); break;
      case 'ueb': A().uebung(teile[1], teile[2]); break;
      case 'baukasten': A().baukasten(); break;
      case 'blitz': A().blitz(); break;
      case 'stoerungen': A().stoerungen(); break;
      case 'pruefung': A().pruefung(); break;
      case 'urkunde': A().urkunde(); break;
      case 'spick': A().spick(); break;
      case 'plan': A().plan(); break;
      case 'geheimnisse': A().geheimnisse(); break;
      case 'einstellungen': A().einstellungen(); break;
      default: A().start();
    }
  }

  W.app = { render: render, warnen: null };
  var letzterHash = location.hash;
  var ignorieren = false;

  W.state.load();
  W.state.on(function () { A().kopfNeu(); });
  window.addEventListener('hashchange', function () {
    if (ignorieren) { ignorieren = false; return; }
    if (W.app.warnen && !window.confirm(W.app.warnen)) { ignorieren = true; location.hash = letzterHash; return; }
    W.app.warnen = null;
    letzterHash = location.hash;
    render();
    window.scrollTo(0, 0);
  });
  render();
})();
