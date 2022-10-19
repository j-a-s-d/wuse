// Wuse (Web Using Shadow Elements) by j-a-s-d

const childRemover = id => (el => el.parentElement.removeChild(el))(window.document.getElementById(id));

export default new class {

  file = "./wuse.template-importer.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "TemplateImporter", ["existence", "type:function"], this.TemplateImporter);
  }

  TemplateImporter = (tester, module, name) => {
    var r = module.initialize() === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with no value: <i>${r}</i>`);
    r = module.initialize(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an invalid value (null): <i>${r}</i>`);
    r = module.initialize({}) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with a valid value (empty object): <i>${r}</i>`);
    var flag = "";
    r = module.initialize({
      onExtinctTemplate: () => { flag = "extinct" },
      onInvalidTemplate: () => { flag = "invalid" }
    }) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an valid value: <i>${r}</i>`);
    r = module.fetch() === undefined && flag === "extinct";
    tester.testResult(r, `<u>${name}</u> got fetch called with no value: <i>${r}</i>`);
    flag = "";
    r = module.fetch(null) === undefined && flag === "extinct";
    tester.testResult(r, `<u>${name}</u> got fetch called with an invalid value (null): <i>${r}</i>`);
    flag = "";
    r = module.fetch("") === undefined && flag === "extinct";
    tester.testResult(r, `<u>${name}</u> got fetch called with an invalid value (string): <i>${r}</i>`);
    flag = "";
    window.document.body.innerHTML += "<div id='bad-template-test'>foo</div>";
    r = module.fetch("bad-template-test") === undefined && flag === "invalid";
    tester.testResult(r, `<u>${name}</u> got fetch called with an invalid value (string id of a non-template element): <i>${r}</i>`);
    childRemover("bad-template-test");
    flag = "";
    window.document.body.innerHTML += "<template id='good-template-test'>bar</template>";
    r = module.fetch("good-template-test") !== undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got fetch called with a valid value (string id of a template element): <i>${r}</i>`);
    childRemover("good-template-test");
  }

}

