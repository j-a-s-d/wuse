// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.core-class.mjs"

  suite = (tester, module) => {
    const name = "CoreClass";
    let k = module("1.0.0");
    let r = typeof k === "function";
    tester.testResult(r, `<u>${name}</u> got initialized: <i>${r}</i>`);
    tester.testModuleProperty(k, "VERSION", ["existence", "type:string"]);
    tester.testModuleProperty(k, "elementCount", ["existence", "type:number"]);
    tester.testModuleProperty(k, "DEBUG", ["existence"]);
    tester.testModuleProperty(k, "FATALS", ["existence"]);
    tester.testModuleProperty(k, "MEASURE", ["existence"]);
    tester.testModuleProperty(k, "RENDERING", ["existence"]);
    tester.testModuleProperty(k, "hashRoutine", ["existence", "type:function"]);
    tester.testModuleProperty(k, "elementsStorage", ["existence", "type:object"]);
    tester.testModuleProperty(k, "tmp", ["existence", "type:object"]);
    tester.testModuleProperty(k, "WebHelpers", ["existence", "type:function"]);
    tester.testModuleProperty(k, "JsHelpers", ["existence", "type:function"]);
    tester.testModuleProperty(k, "PerformanceMeasurement", ["existence", "type:function"]);
    tester.testModuleProperty(k, "NonShadowElement", ["existence", "type:function"]);
    tester.testModuleProperty(k, "OpenShadowElement", ["existence", "type:function"]);
    tester.testModuleProperty(k, "ClosedShadowElement", ["existence", "type:function"]);
    tester.testModuleProperty(k, "debug", ["existence", "type:function"]);
    tester.testModuleProperty(k, "blockUpdate", ["existence", "type:function"]);
    tester.testModuleProperty(k, "register", ["existence", "type:function"]);
    tester.testModuleProperty(k, "create", ["existence", "type:function"]);
    tester.testModuleProperty(k, "isShadowElement", ["existence", "type:function"]);
    tester.testModuleProperty(k, "htmlToShorthand", ["existence", "type:function"], this.htmlToShorthand);
  }

  htmlToShorthand = (tester, module, name) => {
    let r = module.htmlToShorthand("<p>123</p>") === "p=123";
    tester.testResult(r, `<u>${name}</u> got html translated to shorthand notation: <i>${r}</i>`);
  }

}
