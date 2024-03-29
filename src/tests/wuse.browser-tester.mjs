// Wuse (Web Using Shadow Elements) by j-a-s-d

const waitForImport = (file, success, failure) => (async () => await import(file).then(success).catch(failure))();

const present = (element =>
  (content, prepend) => prepend ? element.innerHTML = content + element.innerHTML : element.innerHTML += content
)(window.document.body);

!(() => present(`
  <style>
    body { font-family: monospace; font-size: 16px }
    b { padding: 4px 8px; border-radius: 4px; color: white }
    i { color: orange }
    u { color: purple }
    a { color: teal }
    .test { margin-left: 16px }
    .ok { background-color: green }
    .error { background-color: red }
    .total { background-color: navy }
    .top { float: right }
    .hidden { display: none }
  </style>
`))();

const GLYPHS = { ok: '\u2713', error: 'x', top: '\u2191' };

window.fileList = new window.Array();

const openModule = (file, result) => {
  window.fileList.push(file);
  addModuleDivision();
  present(`<h1 id="${file}" style="border-bottom: 2px dotted silver">${file}<a class="top" href="#">${GLYPHS.top}</a></h1>`);
  testResult(result, `module loaded @ ${new Date(Date.now()).toLocaleString()}`);
  addModuleDivision();
}
const closeModule = (file) => present(`<h2>${file} - tests: ${testCount.ok + testCount.error} (ok: ${testCount.ok}, error: ${testCount.error})</h2>`);
const addModuleDivision = () => present("<hr style='border: 2px solid black'/>");
const addMemberDivision = () => present("<hr style='border: 1px dashed black'/>");
const addCaseResult = (value, glyph, text) => present(`<h3 class='test'><b class='${value}'>${glyph}</b> ${text}</h3>`);

let testCount = { ok: 0, error: 0 };
export let totalTests = 0;
export let pendingTests = 0;
export let publishedTests = 0;
export let totals = { ok: 0, error: 0 };

const makeShuwdownResourceRequest = method => {
  let xhr = new XMLHttpRequest();
  xhr.open(method, window.location.origin + "/shutdown");
  return xhr;
}

window.shutdown = () => {
  window.document.body.innerHTML = "<h1>SHUTTING DOWN...</h1>";
  let xhr = makeShuwdownResourceRequest("GET");
  xhr.onreadystatechange = () => window.document.body.innerHTML = "<h1><u>DONE</u></h1><h2>You can close this browser window.<h2>";
  xhr.send();
}

let shutdownButton = "";

let xhr = makeShuwdownResourceRequest("HEAD");
xhr.onreadystatechange = () => { if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 404) shutdownButton = "<a href='javascript:shutdown()' class='top'>SHUTDOWN</a>"; };
xhr.send();

const presentResults = () => {
  var links = "";
  window.fileList.forEach(file => links += ` ${!!links.length ? "|" : ""} <a href="#${file}">${file.replace("./wuse.", "").replace(".mjs", "")}</a>`);
  present(`
    <h1><b class='total'>[WUSE:TESTS] Total: ${totals.ok + totals.error} (ok: ${totals.ok}, error: ${totals.error})</b>${shutdownButton}</h1>
    ${links}
  `, true);
};

export function publishResults() {
  const interval = setInterval(() => {
    if (totalTests === publishedTests) {
      clearInterval(interval);
      setTimeout(presentResults);
    }
  }, 1000);
}

export function testResult(result, text) {
  const value = result ? "ok" : "error";
  testCount[value]++;
  addCaseResult(value, GLYPHS[value], text);
}

export function testModules(modules) {
  totalTests = pendingTests = modules.length;
  modules.forEach(obj => {
    testModule.call(this, obj);
    pendingTests--;
  });
}

export function testModule(obj) {
  if (typeof obj === "object") {
    const info = typeof obj.default !== "undefined" ? obj.default : obj;
    if (typeof info === "object" && typeof info.file === "string" && typeof info.suite === "function") {
      waitForImport(info.file, module => performTests.call(this, module, info.file, info.suite), console.error);
    }
  }
}

function performTests(module, file, suite) {
  testCount = { ok: 0, error: 0 };
  openModule(file, typeof module === "object");
  suite(this, typeof module.default !== "undefined" ? module.default : module);
  closeModule(file);
  totals.ok += testCount.ok;
  totals.error += testCount.error;
  publishedTests++;
}

export function testClassModule(module, mn, checks, more) {
  (checks || new window.Array()).forEach(check => {
    if (check == "existence") {
      testClassModuleExistence(module, mn);
    } else if (check.startsWith("type:function")) {
      testIsResult(module, mn, `has type (function)`, result => typeof result === "function");
    }
  });
  if (typeof more === "function") try { more(this, module, mn); } catch (e) { present(e.stack) }
  addMemberDivision();
}

export function testModuleClass(module, cn, checks, more) {
  (checks || new window.Array()).forEach(check => {
    if (check == "existence") {
      testClassExistence(module, cn);
    } else {
      testResult(false, `<u>${cn}</u> unknown check: ${check}`);
    }
  });
  if (typeof more === "function") try { more(this, module, cn); } catch (e) { present(e.stack) }
  addMemberDivision();
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

export function testClassProperty(module, c, p, checks, more) {
  (checks || []).forEach(check => {
    if (check == "existence") {
      testMemberExistence(module[c], p,`${c}.${p}`);
    } else if (check.startsWith("type:")) {
      const x = check.replace("type:", "");
      testReadResult(module[c], p, `result has type (${x})`, result => typeof result === x);
    } else {
      testResult(false, `<u>${c}.${p}</u> unknown check: ${check}`);
    }
  });
  if (typeof more === "function") try { more(this, module[c], p); } catch (e) { present(e.stack) }
}

export function testClassModuleExistence(module, p) {
  const r = typeof module !== "undefined";
  testResult(r, `<u>${p}</u> class exists: <i>${r}</i>`);
}

export function testMemberExistence(module, p) {
  const r = typeof module[p] !== "undefined";
  testResult(r, `<u>${p}</u> member exists: <i>${r}</i>`);
}

export function testFunctionExistence(module, fn) {
  const r = typeof module[fn] === "function";
  testResult(r, `<u>${fn}</u> function exists: <i>${r}</i>`);
}

export function testClassExistence(module, cn) {
  const r = typeof module[cn] === "function" && /^\s*class\s+/.test(module[cn].toString());
  testResult(r, `<u>${cn}</u> class exists: <i>${r}</i>`);
}

export function testIsResult(module, p, text, cb) {
  if (typeof cb === "function") {
    testResult(cb(module), `<u>${p}</u> ${text}: <i>${typeof module}</i>`);
  }
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

