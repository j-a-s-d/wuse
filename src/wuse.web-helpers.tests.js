// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.web-helpers.js"

  suite = (tester, module) => {
    tester.testModuleFunction(module, "onDOMContentLoaded", ["existence", "type:undefined"], this.onDOMContentLoaded);
    tester.testModuleFunction(module, "getUniqueId", ["existence", "type:string", "property:length"], this.getUniqueId);
    tester.testModuleFunction(module, "removeChildren", ["existence", "type:undefined"], this.removeChildren);
    tester.testModuleFunction(module, "htmlEncode", ["existence", "type:string"], this.htmlEncode);
    tester.testModuleFunction(module, "getCSSVendorPrefix", ["existence", "type:string"], this.getCSSVendorPrefix);
  }

  onDOMContentLoaded = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["test"], "invalid argument", result => typeof result === "undefined");
    tester.testInvokationWithArgsResult(module, fn, [()=>{}], "valid argument", result => typeof result === "undefined");
  }

  getUniqueId = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "id default prefix", result => result.startsWith("_WUSE_"));
    tester.testInvokationWithArgsResult(module, fn, ["test"], "id custom prefix", result => result.startsWith("_test_"));
    tester.testInvokationResult(module, fn, "valid result", result => document.getElementById(result) === null);
  }

  removeChildren = (tester, module, fn) => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createElement("div"));
    fragment.appendChild(document.createElement("div"));
    fragment.appendChild(document.createElement("div"));
    tester.testInvokationWithArgsResult(module, fn, [fragment], "wipe test fragment content", result => fragment.childElementCount === 0);
  }

  htmlEncode = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, [`&'<test>"`], "valid argument", result => result === "&amp;&#39;&lt;test&gt;&quot;");
    tester.testInvokationWithArgsResult(module, fn, [123], "invalid argument", result => result === null);
  }

  getCSSVendorPrefix = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "result in array", result => ["-moz-", "-webkit-", "-ms-", ""].includes(result));
  }

}

