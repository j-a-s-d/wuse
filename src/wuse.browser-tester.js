// Wuse (Web Using Shadow Elements) by j-a-s-d

const present = (element =>
  (content, prepend) => prepend ? element.innerHTML = content + element.innerHTML : element.innerHTML += content
)(window.document.body);

!function () {
  present(`
    <style>
      body { font-family: monospace; font-size: 16px }
      b { padding: 4px 8px; border-radius: 4px; color: white }
      i { color: orange }
      u { color: purple }
      .test { margin-left: 16px }
      .ok { background-color: green }
      .error { background-color: red }
      .total { background-color: navy }
    </style>
  `);
}();

const openModule = (file, result) => {
  addModuleDivision();
  present(`<h1>${file}</h1>`);
  testResult(result, `module loaded @ ${new Date(Date.now()).toLocaleString()}`);
  addModuleDivision();
}
const closeModule = (file) => present(`<h2>${file} - tests: ${testCount.ok + testCount.error} (ok: ${testCount.ok}, error: ${testCount.error})</h2>`);
const addModuleDivision = () => present("<hr style='border: 2px solid black'/>");
const addMemberDivision = () => present("<hr style='border: 1px dashed black'/>");
const addCaseResult = (value, glyph, text) => present(`<h3 class='test'><b class='${value}'>${glyph}</b> ${text}</h3>`);

const testGlyph = { ok: '\u2713', error: 'x' };
let testCount = { ok: 0, error: 0 };
export let pendingTests = 0;
export let totals = { ok: 0, error: 0 };

export function publishResults() {
  var interval = setInterval(() => {
    if (pendingTests == 0) {
      present(`<h1><b class='total'>[WUSE:TESTS] Total: ${totals.ok + totals.error} (ok: ${totals.ok}, error: ${totals.error})</b></h1>`, true);
      clearInterval(interval);
    }
  }, 250);
}

export function testResult(result, text) {
  const value = result ? "ok" : "error";
  testCount[value]++;
  addCaseResult(value, testGlyph[value], text);
}

export function testModule(info) {
  if (typeof info === "object" && typeof info.file === "string" && typeof info.suite === "function") (
    async () => await import(info.file).then(module => {
      pendingTests++;
      testCount = { ok: 0, error: 0 };
      openModule(info.file, typeof module !== "undefined");
      info.suite(this, typeof module.default !== "undefined" ? module.default : module);
      closeModule(info.file);
      totals.ok += testCount.ok;
      totals.error += testCount.error;
      pendingTests--;
    }).catch(err => console.error(err.message))
  )();
}

export function testModuleFunction(module, fn, checks, more) {
  (checks || new window.Array()).forEach(check => {
    if (check == "existence") {
      testFunctionExistence(module, fn);
    } else if (check.startsWith("type:")) {
      const x = check.replace("type:", "");
      testInvokationResult(module, fn, `result has type (${x})`, result => typeof result === x);
    } else if (check.startsWith("property:")) {
      const x = check.replace("property:", "");
      testInvokationResult(module, fn, `result has property (${x})`, result => !!result[x]);
    } else {
      testResult(false, `<u>${fn}</u> unknown check: ${check}`);
    }
  });
  if (typeof more === "function") try { more(this, module, fn); } catch (e) { present(e.stack) }
  addMemberDivision();
}

export function testModuleProperty(module, p, checks, more) {
  (checks || []).forEach(check => {
    if (check == "existence") {
      testMemberExistence(module, p);
    } else if (check.startsWith("type:")) {
      const x = check.replace("type:", "");
      testReadResult(module, p, `result has type (${x})`, result => typeof result === x);
    } else {
      testResult(false, `<u>${p}</u> unknown check: ${check}`);
    }
  });
  if (typeof more === "function") try { more(this, module, p); } catch (e) { present(e.stack) }
  addMemberDivision();
}

export function testMemberExistence(module, p) {
  const r = typeof module[p] !== "undefined";
  testResult(r, `<u>${p}</u> member exists: <i>${r}</i>`);
}

export function testFunctionExistence(module, fn) {
  const r = typeof module[fn] === "function";
  testResult(r, `<u>${fn}</u> function exists: <i>${r}</i>`);
}

export function testReadResult(module, p, text, cb) {
  if (typeof cb === "function") {
    const r = module[p];
    testResult(cb(r), `<u>${p}</u> ${text}: <i>${r}</i>`);
  }
}

export function testInvokationResult(module, fn, text, cb) {
  if (typeof cb === "function") {
    const r = module[fn]();
    testResult(cb(r), `<u>${fn}</u> ${text}: <i>${r}</i>`);
  }
}

export function testInvokationWithArgsResult(module, fn, args, text, cb) {
  if (typeof cb === "function") {
    const r = module[fn](...args);
    testResult(cb(r), `<u>${fn}</u> ${text}: <i>${r}</i>`);
  }
}

