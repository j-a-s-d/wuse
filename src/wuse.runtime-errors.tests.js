// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.runtime-errors.js"

  suite = (tester, module) => {
    tester.testModuleProperty(module, "UNKNOWN_ERROR", ["existence", "type:object"], this.UNKNOWN_ERROR);
    tester.testModuleProperty(module, "UNSUPPORTED_FEATURE", ["existence", "type:object"], this.UNSUPPORTED_FEATURE);
    tester.testModuleProperty(module, "UNREGISTERED_CLASS", ["existence", "type:object"], this.UNREGISTERED_CLASS);
    tester.testModuleProperty(module, "UNREGISTRABLE_CLASS", ["existence", "type:object"], this.UNREGISTRABLE_CLASS);
    tester.testModuleProperty(module, "INVALID_CLASS", ["existence", "type:object"], this.INVALID_CLASS);
    tester.testModuleProperty(module, "MISNAMED_CLASS", ["existence", "type:object"], this.MISNAMED_CLASS);
    tester.testModuleProperty(module, "INVALID_DEFINITION", ["existence", "type:object"], this.INVALID_DEFINITION);
    tester.testModuleProperty(module, "INVALID_ID", ["existence", "type:object"], this.INVALID_ID);
    tester.testModuleProperty(module, "INVALID_KEY", ["existence", "type:object"], this.INVALID_KEY);
    tester.testModuleProperty(module, "ALLOW_HTML", ["existence", "type:object"], this.ALLOW_HTML);
    tester.testModuleProperty(module, "INEXISTENT_TEMPLATE", ["existence", "type:object"], this.INEXISTENT_TEMPLATE);
    tester.testModuleProperty(module, "EXTINCT_TEMPLATE", ["existence", "type:object"], this.EXTINCT_TEMPLATE);
    tester.testModuleProperty(module, "INVALID_TEMPLATE", ["existence", "type:object"], this.INVALID_TEMPLATE);
    tester.testModuleProperty(module, "UNESPECIFIED_SLOT", ["existence", "type:object"], this.UNESPECIFIED_SLOT);
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

  INEXISTENT_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 20);

  EXTINCT_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 21);

  INVALID_TEMPLATE = (tester, module, mb) => this.testError(tester, module, mb, 22);

  UNESPECIFIED_SLOT = (tester, module, mb) => this.testError(tester, module, mb, 30);

}

