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
  }

}

