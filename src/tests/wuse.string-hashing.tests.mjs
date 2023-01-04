// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.string-hashing.mjs"

  suite = (tester, module) => {
    tester.testModuleFunction(module, "defaultRoutine", ["existence", "type:number"], this.defaultRoutine);
  }

  defaultRoutine = (tester, module, fn) => {
    var r = module[fn]() === 0;
    tester.testResult(r, `<u>${fn}</u> called with no arguments: <i>${r}</i>`);
    r = module[fn]("test") === 3556498;
    tester.testResult(r, `<u>${fn}</u> called with a string: <i>${r}</i>`);
    r = module[fn]("test") === 3556498;
    tester.testResult(r, `<u>${fn}</u> called with the same string: <i>${r}</i>`);
    r = module[fn]("testing") === -1422446064;
    tester.testResult(r, `<u>${fn}</u> called with another string: <i>${r}</i>`);
  }

}

