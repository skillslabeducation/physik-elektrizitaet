/* Kurze Klänge mit WebAudio (abschaltbar in den Einstellungen). */
(function () {
  'use strict';
  var W = (window.W = window.W || {});
  var ctx = null;

  function an() { return !W.state || W.state.data.ton !== false; }
  function audio() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { ctx = null; }
    return ctx;
  }

  function piep(freq, dauer, typ, laut, start) {
    var c = audio();
    if (!c) return;
    if (c.state === 'suspended' && c.resume) c.resume();
    var t0 = c.currentTime + (start || 0);
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = typ || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(laut || 0.08, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dauer);
    o.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0 + dauer + 0.02);
  }

  W.ton = {
    klick: function () { if (an()) piep(1800, 0.04, 'square', 0.03); },
    richtig: function () { if (an()) { piep(660, 0.12, 'sine', 0.07); piep(990, 0.18, 'sine', 0.07, 0.1); } },
    falsch: function () { if (an()) piep(180, 0.22, 'triangle', 0.08); },
    bzzt: function () {
      if (!an()) return;
      piep(90, 0.35, 'sawtooth', 0.06);
      try { if (navigator.vibrate) navigator.vibrate(120); } catch (e) { /* egal */ }
    },
    an: function () { if (an()) { piep(520, 0.1, 'sine', 0.05); piep(780, 0.1, 'sine', 0.05, 0.08); piep(1040, 0.25, 'sine', 0.05, 0.16); } }
  };
})();
