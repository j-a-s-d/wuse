// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.content-manager.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "ContentManager", ["existence", "type:function"], this.ContentManager);
  }

  ContentManager = (tester, module, name) => {
    var instance = new module(null, null);
    var r = instance !== undefined && instance.on_content_verification !== null && instance.on_content_invalidation !== null;
    tester.testResult(r, `<u>${name}</u> got instantiated with a null values: <i>${r}</i>`);
    const data = "test";
    const promoter = content => r = content == data;
    const verifier = content => content == data;
    instance = new module(promoter, verifier);
    r = instance !== undefined && instance.on_content_invalidation === promoter;
    tester.testResult(r, `<u>${name}</u> got instantiated with a valid values: <i>${r}</i>`);
    r = !instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content not invalidated yet: <i>${r}</i>`);
    instance.append(data);
    instance.verify();
    r = instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content, verified and invalidated: <i>${r}</i>`);
    instance.process();
    tester.testResult(r, `<u>${name}</u> got content processed: <i>${r}</i>`);
    instance.reset("");
    r = !instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content reseted: <i>${r}</i>`);
  }

}

