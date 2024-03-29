// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.element-parts.mjs"

  suite = (tester, module) => {
    // NOTE: due to their high performance impact, some of
    // the following routines are not performing validation
    // checks, so the tests does not explore those options.
    tester.testClassModule(module, "ElementParts", ["existence", "type:function"], this.ElementParts);
    tester.testModuleFunction(module, "makeStyleNode", ["existence", "type:object"], this.makeStyleNode);
    tester.testModuleFunction(module, "newRule", ["existence", "type:object"], this.newRule);
    tester.testModuleFunction(module, "newNestedRule", ["existence", "type:object"], this.newNestedRule);
    tester.testModuleFunction(module, "tryToJoinRules", ["existence"], this.tryToJoinRules);
    tester.testModuleFunction(module, "tryToJoinNestedRules", ["existence"], this.tryToJoinNestedRules);
    tester.testModuleFunction(module, "performValidations", ["existence"], this.performValidations);
    tester.testModuleFunction(module, "makeMainNode", ["existence", "type:object"], this.makeMainNode);
    tester.testModuleFunction(module, "newChild", ["existence", "type:object"], this.newChild);
    tester.testModuleFunction(module, "newDefinition", ["existence", "type:object"], this.newDefinition);
    tester.testModuleFunction(module, "newEvent", ["existence", "type:object"], this.newEvent);
    tester.testModuleFunction(module, "newState", ["existence", "type:object"], this.newState);
    tester.testModuleFunction(module, "convertHTMLTagToShorthandNotation", ["existence", "type:object"], this.convertHTMLTagToShorthandNotation);
  }

  ElementParts = (tester, module, name) => {
    var r = module.initialize() === undefined;
    tester.testResult(r, `<u>${name}</u> initialized with an invalid value (undefined): <i>${r}</i>`);
    r = module.initialize({
      onInvalidDefinition: _ => null,
      onInexistentTemplate: _ => null,
      onUnespecifiedSlot: _ => null,
      onUnknownTag: _ => null,
      onInvalidId: _ => null
    }) === undefined;
    tester.testResult(r, `<u>${name}</u> initialized with a valid value (object): <i>${r}</i>`);
  }

  makeStyleNode = (tester, module, name) => {
    var r = module.makeStyleNode();
    tester.testResult(r instanceof window.HTMLElement, `<u>${name}</u> called with no values: <i>${r}</i>`);
    r = module.makeStyleNode("print, handheld", "text/css");
    tester.testResult(r instanceof window.HTMLElement && r.type === "text/css" && r.media === "print, handheld", `<u>${name}</u> called with no values: <i>${r}</i>`);
  }

  newRule = (tester, module, name) => {
    var r = module.newRule();
    tester.testResult(r === null, `<u>${name}</u> called with no values: <i>${r}</i>`);
    r = module.newRule("test");
    tester.testResult(typeof r === "object" && r.selector === "test", `<u>${name}</u> called with valid values (string selector): <i>${r}</i>`);
    r = module.newRule(["test1", "test2"]);
    tester.testResult(typeof r === "object" && r.selector === "test1,test2", `<u>${name}</u> called with valid values (array of strings selector): <i>${r}</i>`);
    r = module.newRule("test", { "background-color": "red" });
    tester.testResult(typeof r === "object" && r.selector === "test" && r.properties["background-color"] === "red", `<u>${name}</u> called with valid values (string selector): <i>${r}</i>`);
    r = module.newRule("test", "background-color: red");
    tester.testResult(typeof r === "object" && r.selector === "test" && r.properties["background-color"] === "red", `<u>${name}</u> called with valid values (string selector): <i>${r}</i>`);
  }

  newNestedRule = (tester, module, name) => {
    var r = module.newNestedRule();
    tester.testResult(r === null, `<u>${name}</u> called with no values: <i>${r}</i>`);
    r = module.newNestedRule("test", "100%");
    tester.testResult(typeof r === "object" && r.selector === "test" && r.nested[0].selector === "100%", `<u>${name}</u> called with valid values (string selectors): <i>${r}</i>`);
    r = module.newNestedRule(["test1", "test2"], ["0%", "100%"]);
    tester.testResult(typeof r === "object" && r.selector === "test1,test2" && r.nested[0].selector === "0%,100%", `<u>${name}</u> called with valid values (array of strings selectors): <i>${r}</i>`);
    r = module.newNestedRule("test", "100%", { "background-color": "red" });
    tester.testResult(typeof r === "object" && r.selector === "test" && r.nested[0].selector === "100%" && r.nested[0].properties["background-color"] === "red", `<u>${name}</u> called with valid values (string selector): <i>${r}</i>`);
    r = module.newNestedRule("test", "100%", "background-color: red");
    tester.testResult(typeof r === "object" && r.selector === "test" && r.nested[0].selector === "100%" && r.nested[0].properties["background-color"] === "red", `<u>${name}</u> called with valid values (string selector): <i>${r}</i>`);
  }

  tryToJoinRules = (tester, module, name) => {
    var x = { selector: "a", properties: { "color": "blue" }};
    var r = module.tryToJoinRules(x, { selector: "a", properties: { "background-color": "red" }});
    tester.testResult(r && typeof x === "object" && x.selector === "a" && x.properties["color"] === "blue" && x.properties["background-color"] === "red", `<u>${name}</u> called with no values: <i>${r}</i>`);
  }

  tryToJoinNestedRules = (tester, module, name) => {
    var x = { selector: "a", nested: [{ selector: "100%", properties: { "color": "blue" }}]};
    var r = module.tryToJoinNestedRules(x, { selector: "a", nested: [{ selector: "100%", properties: { "background-color": "red" }}]});
    tester.testResult(r && typeof x === "object" && x.selector === "a" && x.nested[0].selector === "100%" && x.nested[0].properties["color"] === "blue" && x.nested[0].properties["background-color"] === "red", `<u>${name}</u> called with no values: <i>${r}</i>`);
  }

  performValidations = (tester, module, name) => {
    var r = module.performValidations(null);
    tester.testResult(r === null, `<u>${name}</u> called with an invalid value (null): <i>${r}</i>`);
    r = module.performValidations({});
    tester.testResult(r === null, `<u>${name}</u> called with an invalid value (empty object): <i>${r}</i>`);
    r = module.performValidations({ kind: "%templates%", id: "test" });
    tester.testResult(r === null, `<u>${name}</u> called with an invalid value (non-existent template): <i>${r}</i>`);
    r = module.performValidations({ kind: "%slots%", attributes: { "slot": "test" }});
    tester.testResult(typeof r === "object" && r.kind === "%slots%", `<u>${name}</u> called with a valid value (non-empty slot): <i>${r}</i>`);
    r = module.performValidations({ tag: "invalid" });
    tester.testResult(r === null, `<u>${name}</u> called with a invalid value (non-existent tag): <i>${r}</i>`);
    r = module.performValidations({ tag: "invalid-custom" });
    tester.testResult(r === null, `<u>${name}</u> called with a invalid value (non-existent custom tag): <i>${r}</i>`);
    r = module.performValidations({ tag: "div", id: "" });
    tester.testResult(typeof r === "object" && r.id === "", `<u>${name}</u> called with a valid value (valid tag with empty id): <i>${r}</i>`);
    r = module.performValidations({ tag: "div", id: "test" });
    tester.testResult(typeof r === "object" && r.id === "test", `<u>${name}</u> called with a valid value (valid tag with non-existent id): <i>${r}</i>`);
  }

  makeMainNode = (tester, module, name) => {
    var r = module.makeMainNode(undefined);
    tester.testResult(r === null, `<u>${name}</u> called with an invalid value: <i>${r}</i>`);
    r = module.makeMainNode({ tag: "div", id: "test", classes: [], style: {}, attributes: {} });
    tester.testResult(r instanceof window.HTMLElement, `<u>${name}</u> called with a valid value: <i>${r}</i>`);
  }

  newChild = (tester, module, name) => {
    var r = module.newChild(undefined);
    tester.testResult(r === null, `<u>${name}</u> called with invalid values: <i>${r}</i>`);
    r = module.newChild("");
    tester.testResult(typeof r === "object" && r === null, `<u>${name}</u> called with an empty value: <i>${r}</i>`);
    r = module.newChild("#test");
    tester.testResult(typeof r === "object" && r.id === "test" && r.tag === "div", `<u>${name}</u> called with an only id value: <i>${r}</i>`);
    r = module.newChild("p#test.class1");
    tester.testResult(typeof r === "object" && r.id === "test" && r.classes.length === 1, `<u>${name}</u> called with valid values (tag and class): <i>${r}</i>`);
    r = module.newChild("p#test.class1[attribute1=test1|attribute2]");
    tester.testResult(typeof r === "object" && r.id === "test" && r.classes.length === 1 && Object.keys(r.attributes).length == 2, `<u>${name}</u> called with valid values (tag, class and attributes): <i>${r}</i>`);
    r = module.newChild("span=123");
    tester.testResult(typeof r === "object" && r.tag === "span" && !r.recursive && r.content === "123", `<u>${name}</u> called with valid values (tag and content): <i>${r}</i>`);
    r = module.newChild("div:=span=123");
    tester.testResult(typeof r === "object" && r.tag === "div" && r.recursive && typeof r.content === "object", `<u>${name}</u> called with a valid recursive value: <i>${r}</i>`);
    r = module.newChild("div:=p:=span=123");
    tester.testResult(typeof r === "object" && r.tag === "div" && r.recursive &&
      typeof r.content === "object" && r.content.tag === "p" && r.content.recursive &&
      typeof r.content.content === "object" && r.content.content.tag === "span" && r.content.content.content === "123",
      `<u>${name}</u> called with a valid recursive value: <i>${r}</i>`
    );
    r = module.newChild("svg");
    tester.testResult(typeof r === "object" && r.svg === true && r.tag === "svg", `<u>${name}</u> called with an svg value: <i>${r}</i>`);
  }

  newDefinition = (tester, module, name) => {
    var r = module.newDefinition();
    tester.testResult(typeof r === "object", `<u>${name}</u> called: <i>${r}</i>`);
  }

  newEvent = (tester, module, name) => {
    var r = module.newEvent(null, null);
    tester.testResult(r === null, `<u>${name}</u> called with invalid values: <i>${r}</i>`);
    r = module.newEvent("click", false);
    tester.testResult(typeof r === "object" && r.kind === "click" && typeof r.capture === "boolean", `<u>${name}</u> called with valid values: <i>${r}</i>`);
  }

  newState = (tester, module, name) => {
    var r = module.newState();
    tester.testResult(typeof r === "object" && r.generation === 0 && typeof r.persisted === "boolean", `<u>${name}</u> called: <i>${r}</i>`);
  }

  convertHTMLTagToShorthandNotation = (tester, module, name) => {
    var r = module.convertHTMLTagToShorthandNotation();
    tester.testResult(r === null, `<u>${name}</u> called with no value: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation(null);
    tester.testResult(r === null, `<u>${name}</u> called with null value: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("");
    tester.testResult(r === null, `<u>${name}</u> called with an empty string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<br/>");
    tester.testResult(r === "br", `<u>${name}</u> called with a BR tag html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<b>123</b>");
    tester.testResult(r === "b=123", `<u>${name}</u> called with a B tag with value html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<a href='#'>blah</a>");
    tester.testResult(r === "a[href='#']=blah", `<u>${name}</u> called with an A tag with attribute and value html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<div id='test'>blah</a>");
    tester.testResult(r === "div#test=blah", `<u>${name}</u> called with an DIV tag with id and value html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<pre class='class-a class-b'></pre>");
    tester.testResult(r === "pre.class-a.class-b", `<u>${name}</u> called with an empty PRE tag with classes html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<ul><li>1</li><li>2</li></ul>");
    tester.testResult(r === "ul=<li>1</li><li>2</li>", `<u>${name}</u> called with an UL tag with twp LI elements inside html string: <i>${r}</i>`);
    r = module.convertHTMLTagToShorthandNotation("<li>1</li><li>2</li>");
    tester.testResult(r === "li=1\nli=2", `<u>${name}</u> called with two LI tags with content html string: <i>${r}</i>`);
  }

}

