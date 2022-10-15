// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.text-replacements.js"

  suite = (tester, module) => {
    tester.testClassModule(module, "TextReplacements", ["existence", "type:function"], this.TextReplacements);
  }

  TextReplacements = (tester, module, name) => {
    // NOTE: due to their high performance impact, some of
    // the following routines are not performing validation
    // checks, so the tests does not explore those options.
    var r = module.initialize() === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with no value: <i>${r}</i>`);
    r = module.initialize(null, null) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an invalid value (nulls): <i>${r}</i>`);
    r = module.initialize("~{", "}~") === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with a valid value (strings): <i>${r}</i>`);
    r = module.extractReplacementsFromRule({ selector: ".bgoldlace", properties: { color : 'oldlace' } });
    tester.testResult(
      typeof r === "object" && r.constructor.name === "Array" && r.length === 0,
      `<u>${name}</u> got extractReplacementsFromRule called with a valid value (rule without replacements): <i>${r}</i>`
    );
    r = module.extractReplacementsFromRule({ selector: ".bgoldlace", properties: { "~{colorselector}~" : 'oldlace' } });
    tester.testResult(
      typeof r === "object" && r.constructor.name === "Array" && r.length === 1 &&
        r[0].at === 'rules' && r[0].field === 'colorselector' && r[0].find === '~{colorselector}~',
      `<u>${name}</u> got extractReplacementsFromRule called with a valid value (rule with a replacement): <i>${r}</i>`
    );
    r = module.extractReplacementsFromChild({ tag: "span", id: "", style: {}, classes: [], attributes: [], content: "blah", rules: [] });
    tester.testResult(
      typeof r === "object",
      `<u>${name}</u> got extractReplacementsFromRule called with a valid value (child without a replacement): <i>${r}</i>`
    );
    r = module.extractReplacementsFromChild({ tag: "span", id: "", style: {}, classes: [], attributes: [], content: "~{blah}~", rules: [] });
    tester.testResult(
      typeof r === "object" && r.contents[0].at === "contents" && r.contents[0].field === "blah" && r.contents[0].find === "~{blah}~",
      `<u>${name}</u> got extractReplacementsFromRule called with a valid value (child with a replacement): <i>${r}</i>`
    );
    r = module.scanRulesForReplacements([{ selector: ".bgoldlace", properties: { "~{colorselector}~" : 'oldlace' }, replacements: [{at: 'rules', field: 'colorselector', find: '~{colorselector}~'}] }], "colorselector");
    tester.testResult(
      typeof r === "object" && r.constructor.name === "Array" && r.length === 1,
      `<u>${name}</u> got scanRulesForReplacements called with a valid value (array with a rule with a replacement): <i>${r}</i>`
    );
    r = module.scanChildrenForReplacements([{ included: false, tag: "span", id: "", style: {}, classes: [], attributes: [], content: "~{blah}~", rules: [], replacements: { contents: [{at: 'contents', field: 'blah', find: '~{blah}~'}], classes: [], styles: [], attributes: [] } }], "blah");
    tester.testResult(
      typeof r === "object" && r.constructor.name === "Array" && r.length === 0,
      `<u>${name}</u> got scanChildrenForReplacements called with a valid value (array with a child with a replacement and rendering flag off): <i>${r}</i>`
    );
    r = module.scanChildrenForReplacements([{ included: true, tag: "span", id: "", style: {}, classes: [], attributes: [], content: "~{blah}~", rules: [], replacements: { contents: [{at: 'contents', field: 'blah', find: '~{blah}~'}], classes: [], styles: [], attributes: [] } }], "blah");
    tester.testResult(
      typeof r === "object" && r.constructor.name === "Array" && r.length === 1,
      `<u>${name}</u> got scanChildrenForReplacements called with a valid value (array with a child with a replacement and rendering flag on): <i>${r}</i>`
    );
  }

}

