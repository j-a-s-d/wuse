// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.element-classes.js"

  suite = (tester, module) => {
    tester.testClassModule(module, "ElementClasses", ["existence", "type:function"], this.ElementClasses);
  }

  ElementClasses = (tester, module, name) => {
    var r = module.initialize() === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with no value: <i>${r}</i>`);
    r = module.initialize(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an invalid value (null): <i>${r}</i>`);
    r = module.initialize({}) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with a valid value (empty object): <i>${r}</i>`);
    var flag = "";
    r = module.initialize({
      onBadTarget: () => { flag = "untargeted" },
      onMisnamedClass: () => { flag = "misnamed" },
      onUnregistrableClass: () => { flag = "unregistrable" },
      onUnregisteredClass: () => { flag = "unregistered" },
      onAlreadyRegistered: () => { flag = "registered" },
      onInvalidClass: () => { flag = "invalid" },
      onDeferredInstantiation: () => { flag = "deferred" }
    }) === undefined;
    tester.testResult(r, `<u>${name}</u> got initialized with an valid value: <i>${r}</i>`);
    r = module.registerClasses() === undefined;
    tester.testResult(r, `<u>${name}</u> got registerClasses called with no value: <i>${r}</i>`);
    r = module.registerClasses(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (null): <i>${r}</i>`);
    r = module.registerClasses("") === undefined;
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (string): <i>${r}</i>`);
    r = module.registerClasses([]) === undefined;
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (empty array): <i>${r}</i>`);
    flag = "";
    r = module.registerClasses([""]) === undefined && flag === "invalid";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (array with a string): <i>${r}</i>`);
    flag = "";
    r = module.registerClasses([class Blah {}]) === undefined && flag === "misnamed";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (array with a class with name without minus): <i>${r}</i>`);
    flag = "";
    r = module.registerClasses([class A_A {}]) === undefined && flag === "unregistrable";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (array with a class without HTMLElement proto): <i>${r}</i>`);
    flag = "";
    class A_A extends HTMLElement {}
    r = module.registerClasses([A_A]) === undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with a valid value (array with a class with HTMLElement proto): <i>${r}</i>`);
    class B_B extends HTMLElement {}
    class C_C extends HTMLElement {}
    r = module.registerClasses([B_B, C_C]) === undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with a valid value (array with two classes with HTMLElement proto): <i>${r}</i>`);
    r = module.registerClasses([A_A]) === undefined && flag === "registered";
    tester.testResult(r, `<u>${name}</u> got registerClasses called with an invalid value (array with a class with HTMLElement proto but already registered): <i>${r}</i>`);
    flag = "";
    r = module.instantiateClasses() === undefined;
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with no value: <i>${r}</i>`);
    r = module.instantiateClasses(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with an invalid value (null): <i>${r}</i>`);
    r = module.instantiateClasses("") === undefined;
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with an invalid value (string): <i>${r}</i>`);
    r = module.instantiateClasses([]) === undefined;
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with an invalid value (empty array): <i>${r}</i>`);
    class X_X extends HTMLElement {}
    r = module.instantiateClasses([X_X]) === undefined && flag === "unregistered";
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with a valid value (array with a valid but unregistered class): <i>${r}</i>`);
    flag = "";
    r = module.instantiateClasses([A_A]) === undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with a valid value (array with a valid registered class): <i>${r}</i>`);
    r = module.instantiateClasses([B_B, C_C]) === undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with a valid value (array with two valid registered classes): <i>${r}</i>`);
    r = module.instantiateClasses([A_A], 123) === undefined && flag === "untargeted";
    tester.testResult(r, `<u>${name}</u> got instantiateClasses called with a valid value but a bad target: <i>${r}</i>`);
    flag = "";
    r = module.createInstance() === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with no value: <i>${r}</i>`);
    r = module.createInstance(123) === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (no object as element): <i>${r}</i>`);
    r = module.createInstance(null) === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (null element object): <i>${r}</i>`);
    r = module.createInstance({}) === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (empty element object): <i>${r}</i>`);
    r = module.createInstance({ type: null }) === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (null element type): <i>${r}</i>`);
    r = module.createInstance({ type: {} }) === undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (object with bad element type): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X }) === undefined && flag === "unregistered";
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (object with unregistered element type dont asking to register): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X, register: false }) === undefined && flag === "unregistered";
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (object with unregistered element type asking not to register): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X, register: true }) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (object with unregistered element type asking to register): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (object with a registered element type): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, 123) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (no object as target): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, null) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (null target object): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, {}) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (empty target object): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "" }) === undefined && flag === "untargeted";
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (empty target selector): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X }, { selector: "", on_bad_target: target => flag = "alerted" }) !== undefined && flag === "alerted";
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (bad target alerted): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X }, { selector: "", on_bad_target: target => { flag = "cancelled"; return false } }) === undefined && flag === "cancelled";
    tester.testResult(r, `<u>${name}</u> got createInstance called with an invalid value (bad target cancelled): <i>${r}</i>`);
    flag = "";
    r = module.createInstance({ type: X_X }, { selector: "body" }) !== undefined && flag === "";
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (body target selector): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, 123) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (no object as instance): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, null) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (null instance object): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, {}) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (empty instance object): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, { parameters: 123 }) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (no object as parameters): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, { parameters: null }) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (null instance parameters): <i>${r}</i>`);
    r = module.createInstance({ type: X_X }, { selector: "body" }, { parameters: {} }) !== undefined;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (empty instance parameters): <i>${r}</i>`);
    var l = module.createInstance({ type: X_X }, { selector: "body" }, { parameters: { test: 123 } });
    r = l !== undefined && l.parameters.test === 123;
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (instance parameters with a value): <i>${r}</i>`);
    l = module.createInstance({ type: X_X }, { selector: "body" }, { parameters: { test: 456 }, on_element_instantiated: el => flag = "instantiated" });
    r = l !== undefined && l.parameters.test === 456 && flag === "instantiated";
    tester.testResult(r, `<u>${name}</u> got createInstance called with a valid value (instance parameters with a value and hooked instantiation): <i>${r}</i>`);
  }

}

