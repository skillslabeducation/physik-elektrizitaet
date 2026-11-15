/* Winziges Test-Werkzeug ohne Abhängigkeiten. */
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    console.log('FAIL ' + name + '\n     ' + (e && e.message ? e.message : e));
  }
}

function ok(cond, msg) {
  if (!cond) throw new Error(msg || 'Bedingung nicht erfüllt');
}

function eq(a, b, msg) {
  const sa = JSON.stringify(a);
  const sb = JSON.stringify(b);
  if (sa !== sb) throw new Error((msg ? msg + ': ' : '') + 'erwartet ' + sb + ', bekommen ' + sa);
}

function near(a, b, tol, msg) {
  tol = tol == null ? 1e-3 : tol;
  if (typeof a !== 'number' || Math.abs(a - b) > tol) throw new Error((msg ? msg + ': ' : '') + 'erwartet ≈' + b + ', bekommen ' + a);
}

function fertig(label) {
  console.log((label ? label + ': ' : '') + passed + ' bestanden, ' + failed + ' fehlgeschlagen');
  if (failed) process.exitCode = 1;
}

module.exports = { test, ok, eq, near, fertig };
