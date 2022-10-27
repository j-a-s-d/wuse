// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.parts-holder.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "PartsHolder", ["existence", "type:function"], this.PartsHolder);
  }

  PartsHolder = (tester, module, name) => {
    var instance = new module(null);
    var r = instance !== undefined && instance.owner == null;
    tester.testResult(r, `<u>${name}</u> got instantiated with a null owner: <i>${r}</i>`);
    var o = { dummy: true };
    instance = new module(o);
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
    r = instance.restore(o, r) === undefined && instance.length === 3;
    tester.testResult(r, `<u>${name}</u> got restore called: <i>${r}</i>`);
    r = instance.remove(0) === undefined && instance.length === 2;
    tester.testResult(r, `<u>${name}</u> got remove called with a valid index: <i>${r}</i>`);
    r = instance.remove(10) === undefined && instance.length === 2;
    tester.testResult(r, `<u>${name}</u> got remove called with an invalid index: <i>${r}</i>`);
    r = instance.clear() === true && instance.length === 0;
    tester.testResult(r, `<u>${name}</u> clear called: <i>${r}</i>`);
    r = instance.prepare();
    tester.testResult(r === true, `<u>${name}</u> prepare called when locked: <i>${r}</i>`);
    var x = false;
    instance.on_forbidden_change = () => x = true;
    instance.locked = true;
    r = instance.append({ number: 789 }) === undefined && instance.length === 0 && x === true;
    tester.testResult(r, `<u>${name}</u> prevented modification after been locked: <i>${r}</i>`);
    r = instance.prepare();
    tester.testResult(r === false, `<u>${name}</u> prepare called when locked: <i>${r}</i>`);
  }

}

