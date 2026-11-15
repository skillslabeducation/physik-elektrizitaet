/* Lädt die Browser-Skripte in der Reihenfolge aus index.html (ohne app.js) in einen Node-Kontext. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');

function skripte() {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const out = [];
  html.replace(/<script src="([^"]+)"><\/script>/g, (m, src) => { out.push(src); return m; });
  return out.filter((f) => f !== 'js/app.js');
}

module.exports = function laden(nur) {
  const store = {};
  const ctx = {
    console,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; }
    },
    matchMedia: () => ({ matches: false }),
    setTimeout, clearTimeout
  };
  ctx.window = ctx;
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  const files = nur || skripte();
  files.forEach((f) => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f }));
  return ctx.W;
};

module.exports.skripte = skripte;
module.exports.ROOT = ROOT;
