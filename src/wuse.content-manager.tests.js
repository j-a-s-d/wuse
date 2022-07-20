// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.content-manager.js"

  suite = (tester, module) => {
    tester.testClassModule(module, "ContentManager", ["existence", "type:function"], this.ContentManager);
  }

  ContentManager = (tester, module, name) => {
    var instance = new module(null);
    var r = instance !== undefined && instance.owner == null;
    tester.testResult(r, `<u>${name}</u> got instantiated with a null owner: <i>${r}</i>`);
    instance = new module({ dummy: true });
    r = instance !== undefined && typeof instance.owner === "object";
    tester.testResult(r, `<u>${name}</u> got instantiated with an object owner: <i>${r}</i>`);
    r = !instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content not invalidated yet: <i>${r}</i>`);
    instance.append("test");
    instance.verify(content => content == "test");
    r = instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content, verified and invalidated: <i>${r}</i>`);
    instance.on_content_invalidation = content => r = content == "test";
    instance.process();
    tester.testResult(r, `<u>${name}</u> got content processed: <i>${r}</i>`);
    instance.reset("");
    r = !instance.invalidated;
    tester.testResult(r, `<u>${name}</u> got content reseted: <i>${r}</i>`);
  }

}

