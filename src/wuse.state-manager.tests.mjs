// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.state-manager.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "StateManager", ["existence", "type:function"], this.StateManager);
  }

  StateManager = (tester, module, name) => {
    var instance = new module(null, null, null, null);
    var r = instance !== undefined && typeof instance.getStore() === "object";
    tester.testResult(r, `<u>${name}</u> got instantiated with a null values: <i>${r}</i>`);
    var store1 = { hasItem: () => true, getItem: () => true, setItem: () => true };
    var store2 = { hasItem: () => false, getItem: () => false, setItem: () => false };
    var invalid_state = false;
    var invalid_key = false;
    instance = new module(() => { return { generation: -1, a: 123 }; }, null, null, store1, () => { invalid_state = true; }, () => { invalid_key = true; });
    r = instance !== undefined && instance.getStore() === store1;
    tester.testResult(r, `<u>${name}</u> got instantiated with a custom values: <i>${r}</i>`);
    instance.setStore(store2);
    r = instance.getStore() === store2;
    tester.testResult(r, `<u>${name}</u> got store changed: <i>${r}</i>`);
    r = instance.hasKey() === false;
    tester.testResult(r, `<u>${name}</u> got key tested and failed: <i>${r}</i>`);
    r = instance.validateKey() === false && invalid_key === true;
    tester.testResult(r, `<u>${name}</u> got key validated and failed: <i>${r}</i>`);
    instance.key = "test";
    r = instance.key === "test";
    tester.testResult(r, `<u>${name}</u> got key set: <i>${r}</i>`);
    r = instance.hasKey() === true;
    tester.testResult(r, `<u>${name}</u> got key tested and succeded: <i>${r}</i>`);
    invalid_key = false;
    r = instance.validateKey() === true && invalid_key === false;
    tester.testResult(r, `<u>${name}</u> got key validated and succeded: <i>${r}</i>`);
    r = instance.state === null;
    tester.testResult(r, `<u>${name}</u> got state uninitialized: <i>${r}</i>`);
    r = instance.writeState() === false;
    tester.testResult(r, `<u>${name}</u> got state write called and failed: <i>${r}</i>`);
    r = instance.readState() === false;
    tester.testResult(r, `<u>${name}</u> got state read called and failed: <i>${r}</i>`);
    r = instance.eraseState() === false;
    tester.testResult(r, `<u>${name}</u> got state erase called and failed: <i>${r}</i>`);
    instance.setStore(store1);
    x = instance.initializeState() === -1 && invalid_state;
    tester.testResult(r, `<u>${name}</u> got state failed to initialize: <i>${r}</i>`);
    instance.setStore(store2);
    var x = instance.initializeState();
    r = x > -1 && instance.state.a === 123;
    tester.testResult(r, `<u>${name}</u> got state initialized: <i>${r}</i>`);
    r = instance.nameFiliatedKey(1234567) === "test_1234567";
    tester.testResult(r, `<u>${name}</u> named a filiated key: <i>${r}</i>`);
    r = instance.hasFiliatedKey("test_1234567") === true;
    tester.testResult(r, `<u>${name}</u> remembered successfully a named filiated key: <i>${r}</i>`);
    r = instance.hasFiliatedKey("test_-987654") === false;
    tester.testResult(r, `<u>${name}</u> failed to remember an unknown filiated key: <i>${r}</i>`);
    r = instance.rememberFiliatedKey("test_-987654") === undefined && instance.hasFiliatedKey("test_-987654") === true;
    tester.testResult(r, `<u>${name}</u> remembered a filiated key: <i>${r}</i>`);
  }

}

