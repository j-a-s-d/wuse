// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.javascript-helpers.js"

  suite = (tester, module) => {
    tester.testModuleFunction(module, "isOf", ["existence", "type:boolean"], this.isOf);
    tester.testModuleFunction(module, "hasObjectKeys", ["existence", "type:boolean"], this.hasObjectKeys);
    tester.testModuleFunction(module, "isNonEmptyString", ["existence", "type:boolean"], this.isNonEmptyString);
    tester.testModuleFunction(module, "forcedStringSplit", ["existence"], this.forcedStringSplit);
    tester.testModuleFunction(module, "buildArray", ["existence"], this.buildArray);
    tester.testModuleFunction(module, "buildObject", ["existence", "type:object"], this.buildObject);
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

  hasObjectKeys = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [{}], `with empty object`, result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [{a:123}], `with object with keys`, result => result === true);
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

}

