// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.element-events.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "ElementEvents", ["existence", "type:function"], this.ElementEvents);
  }

  ElementEvents = (tester, module, name) => {
    var instance = new module(null);
    var r = instance !== undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated with a null owner: <i>${r}</i>`);
    var flag = 0;
    instance = new module(new class {
      on_create(arg) { flag = arg; }
      on_repaint(arg) { if (arg === 456) console.log("ElementEvents.committedTrigger called successfully"); }
    });
    r = instance !== undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated with an object owner: <i>${r}</i>`);
    r = instance.detect() === undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated with an object owner: <i>${r}</i>`);
    r = instance.immediateTrigger("on_create", 123) === undefined && flag === 123;
    tester.testResult(r, `<u>${name}</u> got event called via an immediate invoker: <i>${r}</i>`);
    r = instance.committedTrigger("on_repaint", 456) === undefined;
    tester.testResult(r, `<u>${name}</u> got event called via an committed invoker: <i>${r}</i>`);
  }

}

