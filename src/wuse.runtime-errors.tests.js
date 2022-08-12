// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.runtime-errors.js"

  suite = (tester, module) => {
    [
      "UNKNOWN_ERROR",
      "UNSUPPORTED_FEATURE",
      "UNREGISTERED_CLASS",
      "UNREGISTRABLE_CLASS",
      "INVALID_CLASS",
      "MISNAMED_CLASS",
      "INVALID_DEFINITION",
      "INVALID_ID",
      "INVALID_KEY",
      "ALLOW_HTML",
      "INVALID_STATE",
      "INEXISTENT_TEMPLATE",
      "EXTINCT_TEMPLATE",
      "INVALID_TEMPLATE",
      "UNESPECIFIED_SLOT"
    ].forEach(name => tester.testModuleProperty(module, name, ["existence", "type:object"], this[name]));
  }

  testError = (tester, module, mb, code) => tester.testResult(module[mb].code === code, `<u>${mb}</u> code is: <i>${module[mb].code}</i>`);

  UNKNOWN_ERROR = (tester, module, mb) => this.testError(tester, module, mb, 0);

  UNSUPPORTED_FEATURE = (tester, module, mb) => this.testError(tester, module, mb, 1);

  UNREGISTERED_CLASS = (tester, module, mb) => this.testError(tester, module, mb, 2);

  UNREGISTRABLE_CLASS = (tester, module, mb) => this.testError(tester, module, mb, 3);

  INVALID_CLASS = (tester, module, mb) => this.testError(tester, module, mb, 4);

  MISNAMED_CLASS = (tester, module, mb) => this.testError(tester, module, mb, 5);

  INVALID_DEFINITION = (tester, module, mb) => this.testError(tester, module, mb, 10);

  INVALID_ID = (tester, module, mb) => this.testError(tester, module, mb, 11);

  INVALID_KEY = (tester, module, mb) => this.testError(tester, module, mb, 12);

  ALLOW_HTML = (tester, module, mb) => this.testError(tester, module, mb, 13);

  INVALID_STATE = (tester, module, mb) => this.testError(tester, module, mb, 14);

  INEXISTENT_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 20);

  EXTINCT_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 21);

  INVALID_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 22);

  UNESPECIFIED_SLOT = (tester, module, mb) => this.testError(tester, module, mb, 30);

}

