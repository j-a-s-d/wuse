// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.parts-holder.js"

  suite = (tester, module) => {
    tester.testClassModule(module, "PartsHolder", ["existence", "type:function"], this.PartsHolder);
  }

  PartsHolder = (tester, module, name) => {
    var instance = new module(null);
    var r = instance !== undefined && instance.owner == null;
    tester.testResult(r, `<u>${name}</u> got instantiated with a null owner: <i>${r}</i>`);
    instance = new module({ dummy: true });
    r = instance !== undefined && typeof instance.owner === "object";
    tester.testResult(r, `<u>${name}</u> got instantiated with an object owner: <i>${r}</i>`);
    r = instance.append(123) === undefined && instance.length === 0;
    tester.testResult(r, `<u>${name}</u> got append called with an non-object argument: <i>${r}</i>`);
    r = instance.append({ number: 123 }) === undefined && instance.length === 1 && instance.last && instance.last.number === 123 && instance[0].number === 123;
    tester.testResult(r, `<u>${name}</u> got append called with an object argument: <i>${r}</i>`);
    r = instance.prepend(123) === undefined && instance.length === 1;
    tester.testResult(r, `<u>${name}</u> got prepend called with an non-object argument: <i>${r}</i>`);
    r = instance.prepend({ number: 456 }) === undefined && instance.length === 2 && instance.last && instance.last.number === 456 && instance[0].number === 456;
    tester.testResult(r, `<u>${name}</u> got prepend called with an object argument: <i>${r}</i>`);
    r = instance.replace(0, 123) === undefined && instance.length === 2 && instance.last && instance.last.number === 456 && instance[0].number === 456;
    tester.testResult(r, `<u>${name}</u> got replace called with an non-object argument: <i>${r}</i>`);
    r = instance.replace(0, { number: 789 }) === undefined && instance.length === 2 && instance.last && instance.last.number === 789 && instance[0].number === 789;
    tester.testResult(r, `<u>${name}</u> got replace called with an object argument: <i>${r}</i>`);
    r = instance.persist();
    tester.testResult(r && typeof r === "object" && r.length === 2, `<u>${name}</u> got persist called: <i>${r}</i>`);
    r.push({ number: 0 });
    r = instance.restore(r) === undefined && instance.length === 5;
    tester.testResult(r, `<u>${name}</u> got restore called: <i>${r}</i>`);
  }

}
