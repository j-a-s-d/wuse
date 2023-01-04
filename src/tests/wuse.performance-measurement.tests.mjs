// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.performance-measurement.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "PerformanceMeasurement", ["existence", "type:function"], this.PerformanceMeasurement);
    tester.testModuleClass(module, "DOMUpdate", ["existence"], this.DOMUpdate);
    tester.testModuleClass(module, "BrowserRender", ["existence"], this.BrowserRender);
    tester.testModuleClass(module, "StopWatch", ["existence"], this.StopWatch);
  }

  PerformanceMeasurement = (tester, module, name) => {
    var r = module.initialize(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an invalid callback: <i>${r}</i>`);
    r = module.initialize(() => {}) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an valid callback: <i>${r}</i>`);
  }

  DOMUpdate = (tester, module, name) => {
    tester.testClassProperty(module, name, "check", ["existence", "type:boolean"]);
    tester.testClassProperty(module, name, "overall", ["existence", "type:object"]);
  }

  BrowserRender = (tester, module, name) => {
    tester.testClassProperty(module, name, "check", ["existence", "type:boolean"]);
    tester.testClassProperty(module, name, "overall", ["existence", "type:object"]);
  }

  StopWatch = (tester, module, name) => {
    const instance = new module[name]();
    var r = instance !== undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated: <i>${r}</i>`);
    r = instance.rounds === 0;
    tester.testResult(r, `<u>${name}</u> has zero rounds performed: <i>${r}</i>`);
    r = instance.start() === undefined;
    tester.testResult(r, `<u>${name}</u> got start() invoked: <i>${r}</i>`);
    r = instance.stop() === undefined;
    tester.testResult(r, `<u>${name}</u> got stop() invoked: <i>${r}</i>`);
    r = instance.rounds === 1;
    tester.testResult(r, `<u>${name}</u> has one round performed: <i>${r}</i>`);
    r = typeof instance.last === "object";
    tester.testResult(r, `<u>${name}</u> provides last round info: <i>${r}</i>`);
    r = typeof instance.best === "object";
    tester.testResult(r, `<u>${name}</u> provides best round info: <i>${r}</i>`);
    r = typeof instance.averages === "object";
    tester.testResult(r, `<u>${name}</u> provides averages info for all rounds: <i>${r}</i>`);
  }

}

