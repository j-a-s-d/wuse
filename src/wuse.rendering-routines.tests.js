// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.rendering-routines.js"

  suite = (tester, module) => {
    tester.testClassModule(module, "RenderingRoutines", ["existence", "type:function"], this.RenderingRoutines);
  }

  RenderingRoutines = (tester, module, name) => {
    // NOTE: due to their high performance impact, some of
    // the following routines are not performing validation
    // checks, so the tests does not explore those options.
    var r = module.initialize() === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with no value: <i>${r}</i>`);
    r = module.initialize(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an invalid value (null): <i>${r}</i>`);
    r = module.initialize({}) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with a valid value (empty object): <i>${r}</i>`);
    const reps = { color: "orange" };
    const simpleReplacer = (text, rep) => text.replace(rep.find, reps[rep.field]);
    var flag = "";
    r = module.initialize({
      onFetchTemplate: () => { flag = "fetch"; return "hardcoded"; }
    }) === undefined;
    r = module.renderChild(simpleReplacer, { kind: "%templates%", id: "anything" }) === "hardcoded" && flag === "fetch";
    tester.testResult(r, `<u>${name}</u> got renderChild called with a valid value (template inclusion): <i>${r}</i>`);
    flag = "";
    r = module.renderChild(simpleReplacer, { tag: "^text^", content: "Hel&lo", replacements: { contents: [] }, encode: false });
    tester.testResult(r === "Hel&lo", `<u>${name}</u> got renderChild called with a valid value (non-encoded text node): <i>${r}</i>`);
    r = module.renderChild(simpleReplacer, { tag: "^text^", content: "Hel&lo", replacements: { contents: [] }, encode: true });
    tester.testResult(r === "Hel&amp;lo", `<u>${name}</u> got renderChild called with a valid value (encoded text node): <i>${r}</i>`);
    r = module.renderChild(simpleReplacer, {tag:"p",id:"test",classes:["class1", "class2"],attributes:{"data-attr":"'123'"},style:{"border-style":"solid"},content:"foo",replacements:{contents:[],classes:[],styles:[],attributes:[]}});
    tester.testResult(r === "<p id='test' class='class1 class2' style='border-style: solid; ' data-attr='123'>foo</p>", `<u>${name}</u> got renderChild called with a valid value (sample node): <i>${r.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</i>`);
    r = module.renderRule(simpleReplacer, { selector: null, properties: null, replacements: null });
    tester.testResult(r === null, `<u>${name}</u> got renderRule called with an invalid value (all null fields): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: "", properties: {}, replacements: [] });
    tester.testResult(r === null, `<u>${name}</u> got renderRule called with an invalid value (all empty fields): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: ".test", properties: {}, replacements: [] });
    tester.testResult(r === ".test{}", `<u>${name}</u> got renderRule called with a valid value (only selector): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: ".test", properties: { color: "red" }, replacements: [] });
    tester.testResult(r === ".test{color:red;}", `<u>${name}</u> got renderRule called with a valid value (selector and property): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: ".test2", properties: { margin: 0, color: "~{color}~" }, replacements: [{ find: "~{color}~", field: "color" }] });
    tester.testResult(r === ".test2{margin:0;color:orange;}", `<u>${name}</u> got renderRule called with a valid value (selector, property and replacement): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: "@keyframes test3", nested: { selector: "100%", properties: { color: "red" } }, replacements: [] });
    tester.testResult(r === null, `<u>${name}</u> got renderRule called with a invalid value (selector and invalid nested): <i>${r}</i>`);
    r = module.renderRule(simpleReplacer, { selector: "@keyframes test3", nested: [{ selector: "100%", properties: { color: "red" } }], replacements: [] });
    tester.testResult(r === "@keyframes test3{100%{color:red;}}", `<u>${name}</u> got renderRule called with a valid value (selector and nested): <i>${r}</i>`);
    const x = { cache: "blah", rendering: false };
    r = module.cacheInvalidator(x) === null && x.cache === null;
    tester.testResult(r, `<u>${name}</u> got cacheInvalidator called with a valid value (object with cache field): <i>${r}</i>`);
    r = module.renderingIncluder(x) === true && x.rendering === true;
    tester.testResult(r, `<u>${name}</u> got renderingIncluder called with a valid value (object with rendering field): <i>${r}</i>`);
    r = module.renderingExcluder(x) === false && x.rendering === false;
    tester.testResult(r, `<u>${name}</u> got renderingExcluder called with a valid value (object with rendering field): <i>${r}</i>`);
  }

}

