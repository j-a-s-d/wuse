// Wuse (Web Using Shadow Elements) by j-a-s-d

const WebHelpersTests = {
  file: "./wuse.web-helpers.js",
  suite: (tester, module) => {
    tester.testModuleFunction(module, "onDOMContentLoaded", ["existence", "type:undefined"], WebHelpersTests.onDOMContentLoaded);
    tester.testModuleFunction(module, "getUniqueId", ["existence", "type:string", "property:length"], WebHelpersTests.getUniqueId);
    tester.testModuleFunction(module, "getCSSVendorPrefix", ["existence", "type:string"], WebHelpersTests.getCSSVendorPrefix);
  },
  onDOMContentLoaded: (tester, module, fn) => {
    tester.testInvokationWithArgsResult(module, fn, ["test"], "invalid argument", result => typeof result === "undefined");
    tester.testInvokationWithArgsResult(module, fn, [()=>{}], "valid argument", result => typeof result === "undefined");
  },
  getUniqueId: (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "id default prefix", result => result.startsWith("_WUSE_"));
    tester.testInvokationWithArgsResult(module, fn, ["test"], "id custom prefix", result => result.startsWith("_test_"));
    tester.testInvokationResult(module, fn, "valid result", result => document.getElementById(result) === null);
  },
  getCSSVendorPrefix: (tester, module, fn) => {
    tester.testInvokationResult(module, fn, "result in array", result => ["-moz-", "-webkit-", "-ms-", ""].includes(result));
  }
}

export default WebHelpersTests;

