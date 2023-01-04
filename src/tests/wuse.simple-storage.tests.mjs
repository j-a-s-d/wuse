// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "../wuse.simple-storage.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "SimpleStorage", ["existence", "type:function"], this.SimpleStorage);
  }

  SimpleStorage = (tester, module, name) => {
    const instance = new module();
    var r = instance !== undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 0, `<u>${name}</u> starts with no items: <i>${r}</i>`);
    r = instance.setItem(undefined, 123) === undefined;
    tester.testResult(r, `<u>${name}</u> got setItem() called with "undefined" as key value: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 1, `<u>${name}</u> has one item: <i>${r}</i>`);
    r = instance.setItem(null, 12) === undefined;
    tester.testResult(r, `<u>${name}</u> got setItem() called with "null" as key value: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 2, `<u>${name}</u> has two items: <i>${r}</i>`);
    r = instance.setItem("", 1) === undefined;
    tester.testResult(r, `<u>${name}</u> got setItem() called with "" as key value: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 3, `<u>${name}</u> has three items: <i>${r}</i>`);
    r = instance.clear() === undefined;
    tester.testResult(r, `<u>${name}</u> got clear() called: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 0, `<u>${name}</u> has zero items: <i>${r}</i>`);
    r = instance.setItem("foo", "bar") === undefined;
    tester.testResult(r, `<u>${name}</u> got setItem() called with "foo" as key value with "bar" as value: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 1, `<u>${name}</u> has one items: <i>${r}</i>`);
    r = instance.hasItem("foo");
    tester.testResult(r, `<u>${name}</u> got hasItem() called with "foo" as key value: <i>${r}</i>`);
    r = instance.getItem("foo");
    tester.testResult(r === "bar", `<u>${name}</u> got getItem() called with "foo" as key value: <i>${r}</i>`);
    r = instance.setItem("foo", "baz") === undefined;
    tester.testResult(r, `<u>${name}</u> got setItem() called with "foo" as key value with "baz" as value: <i>${r}</i>`);
    r = instance.getItem("foo");
    tester.testResult(r === "baz", `<u>${name}</u> got getItem() called with "foo" as key value: <i>${r}</i>`);
    r = instance.key(0);
    tester.testResult(r === "foo", `<u>${name}</u> got key() called with 0 as key value: <i>${r}</i>`);
    r = instance.key(1);
    tester.testResult(r === null, `<u>${name}</u> got key() called with 1 as key value: <i>${r}</i>`);
    r = instance.removeItem("foo") === undefined;
    tester.testResult(r, `<u>${name}</u> got removeItem() called with "foo" as key value: <i>${r}</i>`);
    r = instance.length;
    tester.testResult(r === 0, `<u>${name}</u> has zero items: <i>${r}</i>`);
  }

}

