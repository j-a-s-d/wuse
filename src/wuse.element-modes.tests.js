// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.element-modes.js"

  suite = (tester, module) => {
    tester.testModuleProperty(module, "REGULAR", ["existence", "type:string"], this.REGULAR);
    tester.testModuleProperty(module, "OPEN", ["existence", "type:string"], this.OPEN);
    tester.testModuleProperty(module, "CLOSED", ["existence", "type:string"], this.CLOSED);
    tester.testModuleFunction(module, "specializeClass", ["existence"], this.specializeClass);
  }

  REGULAR = (tester, module, name) => {
    let a = module[name];
    var r = a.constructor.name === "String" && a === "regular";
    tester.testResult(r, `<u>${name}</u> called: <i>${r}</i>`);
    try {
      module[name] = "blah";
    } catch {
    }
    let b = module[name];
    var r = b.constructor.name === "String" && b === "regular";
    tester.testResult(r, `<u>${name}</u> tryed to change denied: <i>${r}</i>`);
  }

  OPEN = (tester, module, name) => {
    let a = module[name];
    var r = a.constructor.name === "String" && a === "open";
    tester.testResult(r, `<u>${name}</u> called: <i>${r}</i>`);
    try {
      module[name] = "blah";
    } catch {
    }
    let b = module[name];
    var r = b.constructor.name === "String" && b === "open";
    tester.testResult(r, `<u>${name}</u> tryed to change denied: <i>${r}</i>`);
  }

  CLOSED = (tester, module, name) => {
    let a = module[name];
    var r = a.constructor.name === "String" && a === "closed";
    tester.testResult(r, `<u>${name}</u> called: <i>${r}</i>`);
    try {
      module[name] = "blah";
    } catch {
    }
    let b = module[name];
    var r = b.constructor.name === "String" && b === "closed";
    tester.testResult(r, `<u>${name}</u> tryed to change denied: <i>${r}</i>`);
  }

  specializeClass = (tester, module, name) => {
    var b = module[name](class { constructor(mode) { this.mode = module.REGULAR; } }, module.REGULAR);
    var r = new b();
    tester.testResult(typeof b === "function" && typeof r === "object" && r.mode === module.REGULAR, `<u>${name}</u> called with REGULAR: <i>${r}</i>`);
    b = module[name](class { constructor(mode) { this.mode = module.OPEN; } }, module.OPEN);
    r = new b();
    tester.testResult(typeof b === "function" && typeof r === "object" && r.mode === module.OPEN, `<u>${name}</u> called with OPEN: <i>${r}</i>`);
    b = module[name](class { constructor(mode) { this.mode = module.CLOSED; } }, module.CLOSED);
    r = new b();
    tester.testResult(typeof b === "function" && typeof r === "object" && r.mode === module.CLOSED, `<u>${name}</u> called with CLOSED: <i>${r}</i>`);
  }

}

