// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.web-helpers.mjs"

  suite = (tester, module) => {
    tester.testModuleFunction(module, "onDOMContentLoaded", ["existence", "type:undefined"], this.onDOMContentLoaded);
    tester.testModuleFunction(module, "buildDOMElement", ["existence", "type:object"], this.buildDOMElement);
    tester.testModuleFunction(module, "buildDOMFragment", ["existence", "type:object"], this.buildDOMFragment);
    tester.testModuleFunction(module, "getUniqueId", ["existence", "type:string", "property:length"], this.getUniqueId);
    tester.testModuleFunction(module, "removeChildren", ["existence", "type:undefined"], this.removeChildren);
    tester.testModuleFunction(module, "isHTMLTag", ["existence", "type:boolean"], this.isHTMLTag);
    tester.testModuleFunction(module, "isHTMLVoidTag", ["existence", "type:boolean"], this.isHTMLVoidTag);
    tester.testModuleFunction(module, "isHTMLAttribute", ["existence", "type:boolean"], this.isHTMLAttribute);
    tester.testModuleFunction(module, "htmlEncode", ["existence", "type:string"], this.htmlEncode);
    tester.testModuleFunction(module, "getCSSVendorPrefix", ["existence", "type:string"], this.getCSSVendorPrefix);
  }

  onDOMContentLoaded = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["test"], "invalid argument", result => typeof result === "undefined");
    tester.testInvokationWithArgsResult(module, fn, [()=>{}], "valid argument", result => typeof result === "undefined");
  }

  buildDOMElement = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result === null);
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid tag", result => result === null);
    tester.testInvokationWithArgsResult(module, fn, ["div", null], "with valid tag but invalid builder", result => result && result.constructor.name === "HTMLDivElement");
    tester.testInvokationWithArgsResult(module, fn, ["div", instance => instance.setAttribute("test", "123")], "with valid arguments", result => result && result.constructor.name === "HTMLDivElement" && result.getAttribute("test") === "123");
  }

  buildDOMFragment = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "without args", result => result && result.constructor.name === "DocumentFragment");
    tester.testInvokationWithArgsResult(module, fn, [null], "with invalid builder", result => result && result.constructor.name === "DocumentFragment");
    tester.testInvokationWithArgsResult(module, fn, [instance => instance.append(window.document.createElement("A"))], "with valid argument", result => result && result.constructor.name === "DocumentFragment" && result.firstElementChild.tagName === 'A');
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

  isHTMLTag = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["div"], "valid tag", result => result === true);
    tester.testInvokationWithArgsResult(module, fn, ["---"], "invalid tag", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [null], "null tag", result => result === false);
  }

  isHTMLVoidTag = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["hr"], "valid tag", result => result === true);
    tester.testInvokationWithArgsResult(module, fn, ["---"], "invalid tag", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [null], "null tag", result => result === false);
  }

  isHTMLAttribute = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["allow"], "valid tag", result => result === true);
    tester.testInvokationWithArgsResult(module, fn, ["---"], "invalid tag", result => result === false);
    tester.testInvokationWithArgsResult(module, fn, [null], "null tag", result => result === false);
  }

  htmlEncode = (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, [`&'<test>"`], "valid argument", result => result === "&amp;&#39;&lt;test&gt;&quot;");
    tester.testInvokationWithArgsResult(module, fn, [123], "invalid argument", result => result === null);
  }

  getCSSVendorPrefix = (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "result in array", result => ["-moz-", "-webkit-", "-ms-", ""].includes(result));
  }

}

