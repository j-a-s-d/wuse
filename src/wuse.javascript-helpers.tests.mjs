// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.javascript-helpers.mjs"

  suite = (tester, module) => {
    tester.testModuleProperty(module, "EMPTY_STRING", ["existence", "type:string"], this.EMPTY_STRING);
    tester.testModuleProperty(module, "EMPTY_ARRAY", ["existence", "type:object"], this.EMPTY_ARRAY);
    tester.testModuleFunction(module, "noop", ["existence", "type:undefined"], this.noop);
    tester.testModuleFunction(module, "isNonEmptyString", ["existence", "type:boolean"], this.isNonEmptyString);
    tester.testModuleFunction(module, "forcedStringSplit", ["existence"], this.forcedStringSplit);
    tester.testModuleFunction(module, "buildArray", ["existence", "type:object"], this.buildArray);
    tester.testModuleFunction(module, "buildObject", ["existence", "type:object"], this.buildObject);
    tester.testModuleFunction(module, "ensureFunction", ["existence", "type:function"], this.ensureFunction);
    tester.testModuleFunction(module, "isOf", ["existence", "type:boolean"], this.isOf);
    tester.testModuleFunction(module, "areOf", ["existence", "type:boolean"], this.areOf);
    tester.testModuleFunction(module, "cloneObject", ["existence", "type:object"], this.cloneObject);
    tester.testModuleFunction(module, "forEachOwnProperty", ["existence", "type:undefined"], this.forEachOwnProperty);
    tester.testModuleFunction(module, "hasObjectKeys", ["existence", "type:boolean"], this.hasObjectKeys);
    tester.testModuleFunction(module, "isAssignedObject", ["existence", "type:boolean"], this.isAssignedObject);
    tester.testModuleFunction(module, "isAssignedArray", ["existence", "type:boolean"], this.isAssignedArray);
    tester.testModuleFunction(module, "isNonEmptyArray", ["existence", "type:boolean"], this.isNonEmptyArray);
    tester.testModuleFunction(module, "isIntegerNumber", ["existence", "type:boolean"], this.isIntegerNumber);
  }

  EMPTY_STRING = (tester, module, name) => {
    let a = module[name];
    var r = a.constructor.name === "String" && a.length === 0;
    tester.testResult(r, `<u>${name}</u> called: <i>${r}</i>`);
    try {
      module[name] = "blah";
    } catch {
    }
    let b = module[name];
    var r = b.length === 0;
    tester.testResult(r, `<u>${name}</u> tryed to change denied: <i>${r}</i>`);
  }

  EMPTY_ARRAY = (tester, module, name) => {
    let a = module[name];
    var r = a.constructor.name === "Array" && a.length === 0;
    tester.testResult(r, `<u>${name}</u> called: <i>${r}</i>`);
    try {
      module[name].push(1);
    } catch {
    }
    let b = module[name];
    var r = b.length === 0;
    tester.testResult(r, `<u>${name}</u> tryed to change denied: <i>${r}</i>`);
  }

  noop = (tester, module, fn) => {
    var r = module[fn]() === undefined;
    tester.testResult(r, `<u>${fn}</u> called: <i>${r}</i>`);
  }

  isOf = (tester, module, fn) => {
    const testValueAndType = (value, type, expected) => tester.testInvokationWithArgsResult(
      module, fn, [value, window[type]], `${type} (${value})`, result => result === expected
    );
    testValueAndType(undefined, "String", false);
    testValueAndType(null, "String", false);
    testValueAndType("", "String", true);
    testValueAndType("test", "String", true);
    testValueAndType(undefined, "Object", false);
    testValueAndType(null, "Object", false);
    testValueAndType({}, "Object", true);
    testValueAndType(new Object(), "Object", true);
    testValueAndType(undefined, "Array", false);
    testValueAndType(null, "Array", false);
    testValueAndType([], "Array", true);
    testValueAndType(new Array(), "Array", true);
    testValueAndType(undefined, "Function", false);
    testValueAndType(null, "Function", false);
    testValueAndType(()=>{}, "Function", true);
    testValueAndType(new Function(), "Function", true);
    window.TestClass = class {}
    testValueAndType(new TestClass(), "TestClass", true);
    testValueAndType(class {}, "Function", true);
    tester.testInvokationResult(module, fn, "without args", result => result === false);
  }

  areOf = (tester, module, fn) => {
    const testValueAndType = (value, type, expected) => tester.testInvokationWithArgsResult(
      module, fn, [value, window[type]], `${type} (${value})`, result => result === expected
    );
    testValueAndType(undefined, "Any", false);
    testValueAndType(null, "Any", false);
    testValueAndType(new Array(), "Any", false);
    testValueAndType([], "Any", false);
    testValueAndType([42], "String", false);
    testValueAndType(["foo", 42], "String", false);
    testValueAndType(["foo", null, "bar"], "String", false);
    testValueAndType(["foo", undefined, "bar"], "String", false);
    testValueAndType(["foo"], "String", true);
    testValueAndType(["foo", "bar"], "String", true);
  }

  hasObjectKeys = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [{}], `with empty object`, result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [{a:123}], `with object with keys`, result => result === true);
  }

  cloneObject = (tester, module, name) => {
    tester.testInvokationResult(module, name, "without args", result => window.Object.getOwnPropertyNames(result).length === 0);
    tester.testInvokationWithArgsResult(module, name, [{}], `with empty object`, result => window.Object.getOwnPropertyNames(result).length === 0);
    tester.testInvokationWithArgsResult(module, name, [{a:123}], `with object with keys`, result => window.Object.getOwnPropertyNames(result).length === 1 && result.a === 123);
  }

  forEachOwnProperty = (tester, module, name) => {
    var r = true;
    module[name]({}, _ => r = false);
    tester.testResult(r, `<u>${name}</u> got called with an empty object: <i>${r}</i>`);
    r = false;
    module[name]({a:123}, _ => r = true);
    tester.testResult(r, `<u>${name}</u> got called with an object with keys: <i>${r}</i>`);
  }

  isNonEmptyString = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [""], `with empty string`, result => result === false);
    tester.testInvokationWithArgsResult(module, fn, ["blah"], `with string with content`, result => result === true);
  }

  forcedStringSplit = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result && result.constructor.name === "Array" && result.length === 0);
    tester.testInvokationWithArgsResult(module, fn, [""], `with an empty string`, result => result && result.constructor.name === "Array" && result.length === 1);
    tester.testInvokationWithArgsResult(module, fn, ["", ""], `with two empty strings`, result => result && result.constructor.name === "Array" && result.length === 0);
    tester.testInvokationWithArgsResult(module, fn, ["1,2,3", ","], `with string with content and delimiter`, result => result && result.constructor.name === "Array" && result.length === 3);
  }

  buildArray = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result && result.constructor.name === "Array" && result.length === 0);
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid builder", result => result && result.constructor.name === "Array" && result.length === 0);
    tester.testInvokationWithArgsResult(module, fn, [instance => instance.push(123)], "with valid builder", result => result && result.constructor.name === "Array" && result.length === 1 && result[0] === 123);
  }

  buildObject = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result && result.constructor.name === "Object");
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid builder", result => result && result.constructor.name === "Object");
    tester.testInvokationWithArgsResult(module, fn, [instance => instance.key = 123], "with valid builder", result => result && result.constructor.name === "Object" && result.key === 123);
  }

  ensureFunction = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result && result.constructor.name === "Function");
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid argument", result => result && result.constructor.name === "Function");
    tester.testInvokationWithArgsResult(module, fn, [instance => 123], "with valid argument", result => result && result.constructor.name === "Function" && result() === 123);
  }

  isAssignedObject = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [{}], "with valid argument", result => result);
  }

  isAssignedArray = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [[]], "with valid argument", result => result);
  }

  isNonEmptyArray = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid argument (null)", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [[]], "with invalid argument (empty array)", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [[1,2,3]], "with valid argument (non-empty array)", result => result);
  }

  isIntegerNumber = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [null], "with null argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [{}], "with object argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [[]], "with array argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [true], "with true bool argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [false], "with false bool argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [NaN], "with literal not-a-number argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [1.2], "with literal float number argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [1], "with literal int number argument", result => result);
    tester.testInvokationWithArgsResult(module, fn, [0x7], "with literal hex int number argument", result => result);
    tester.testInvokationWithArgsResult(module, fn, ["0x123"], "with hex int number string argument", result => result);
    tester.testInvokationWithArgsResult(module, fn, ["456"], "with int number string argument", result => result);
    tester.testInvokationWithArgsResult(module, fn, ["text"], "with non-number string argument", result => !result);
    tester.testInvokationWithArgsResult(module, fn, [""], "with non-number empty string argument", result => !result);
  }

}
