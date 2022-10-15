// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.reactive-field.js"

  suite = (tester, module) => {
    tester.testModuleFunction(module, "createReactiveField", ["existence", "type:object"], this.createReactiveField);
  }

  createReactiveField = (tester, module, fn) => {
    const noop = () => {};
    var r = module[fn]() === null;
    tester.testResult(r, `<u>${fn}</u> called with no arguments: <i>${r}</i>`);
    let o = {};
    r = module[fn](o) === null;
    tester.testResult(r, `<u>${fn}</u> called with no name: <i>${r}</i>`);
    r = module[fn](o, 0, 123, noop, noop) === null;
    tester.testResult(r, `<u>${fn}</u> called with an invalid name: <i>${r}</i>`);
    r = module[fn](o, "test", undefined, noop, noop) === undefined && o.hasOwnProperty("test") === true;
    tester.testResult(r, `<u>${fn}</u> called with an undefined value: <i>${r}</i>`);
    r = module[fn](o, "test", 123, noop, noop) === undefined && o.test === 123;
    tester.testResult(r, `<u>${fn}</u> called with valid values: <i>${r}</i>`);
    o.test = 456;
    r = o.test === 456;
    tester.testResult(r, `<u>${fn}</u> called with valid values and then changed value successfully: <i>${r}</i>`);
    var handled = false;
    r = module[fn](o, "test", 123, () => handled = true, noop) === undefined && o.test === 123;
    o.test = 456;
    r = r && handled === true;
    tester.testResult(r, `<u>${fn}</u> called with valid values and then changed value and the handler callback was called successfully: <i>${r}</i>`);
  }

}

