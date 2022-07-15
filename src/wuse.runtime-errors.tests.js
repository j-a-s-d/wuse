// Wuse (Web Using Shadow Elements) by j-a-s-d

const RuntimeErrorsTests = {
  file: "./wuse.runtime-errors.js",
  suite: (tester, module) => {
    tester.testModuleProperty(module, "UNKNOWN_ERROR", ["existence", "type:object"], RuntimeErrorsTests.UNKNOWN_ERROR);
    tester.testModuleProperty(module, "UNSUPPORTED_FEATURE", ["existence", "type:object"], RuntimeErrorsTests.UNSUPPORTED_FEATURE);
    tester.testModuleProperty(module, "UNREGISTERED_CLASS", ["existence", "type:object"], RuntimeErrorsTests.UNREGISTERED_CLASS);
    tester.testModuleProperty(module, "INVALID_CLASS", ["existence", "type:object"], RuntimeErrorsTests.INVALID_CLASS);
    tester.testModuleProperty(module, "MISNAMED_CLASS", ["existence", "type:object"], RuntimeErrorsTests.MISNAMED_CLASS);
    tester.testModuleProperty(module, "INVALID_DEFINITION", ["existence", "type:object"], RuntimeErrorsTests.INVALID_DEFINITION);
    tester.testModuleProperty(module, "INVALID_ID", ["existence", "type:object"], RuntimeErrorsTests.INVALID_ID);
    tester.testModuleProperty(module, "INVALID_KEY", ["existence", "type:object"], RuntimeErrorsTests.INVALID_KEY);
    tester.testModuleProperty(module, "ALLOW_HTML", ["existence", "type:object"], RuntimeErrorsTests.ALLOW_HTML);
    tester.testModuleProperty(module, "INEXISTENT_TEMPLATE", ["existence", "type:object"], RuntimeErrorsTests.INEXISTENT_TEMPLATE);
    tester.testModuleProperty(module, "EXTINCT_TEMPLATE", ["existence", "type:object"], RuntimeErrorsTests.EXTINCT_TEMPLATE);
    tester.testModuleProperty(module, "INVALID_TEMPLATE", ["existence", "type:object"], RuntimeErrorsTests.INVALID_TEMPLATE);
    tester.testModuleProperty(module, "UNESPECIFIED_SLOT", ["existence", "type:object"], RuntimeErrorsTests.UNESPECIFIED_SLOT);
  },
  UNKNOWN_ERROR: (tester, module, mb) => {
    tester.testResult(module[mb].code === 0, `<u>${mb}</u> code is: <i>0</i>`);
  },
  UNSUPPORTED_FEATURE: (tester, module, mb) => {
    tester.testResult(module[mb].code === 1, `<u>${mb}</u> code is: <i>1</i>`);
  },
  UNREGISTERED_CLASS: (tester, module, mb) => {
    tester.testResult(module[mb].code === 2, `<u>${mb}</u> code is: <i>2</i>`);
  },
  INVALID_CLASS: (tester, module, mb) => {
    tester.testResult(module[mb].code === 3, `<u>${mb}</u> code is: <i>3</i>`);
  },
  MISNAMED_CLASS: (tester, module, mb) => {
    tester.testResult(module[mb].code === 4, `<u>${mb}</u> code is: <i>4</i>`);
  },
  INVALID_DEFINITION: (tester, module, mb) => {
    tester.testResult(module[mb].code === 10, `<u>${mb}</u> code is: <i>10</i>`);
  },
  INVALID_ID: (tester, module, mb) => {
    tester.testResult(module[mb].code === 11, `<u>${mb}</u> code is: <i>11</i>`);
  },
  INVALID_KEY: (tester, module, mb) => {
    tester.testResult(module[mb].code === 12, `<u>${mb}</u> code is: <i>12</i>`);
  },
  ALLOW_HTML: (tester, module, mb) => {
    tester.testResult(module[mb].code === 13, `<u>${mb}</u> code is: <i>13</i>`);
  },
  INEXISTENT_TEMPLATE: (tester, module, mb) => {
    tester.testResult(module[mb].code === 20, `<u>${mb}</u> code is: <i>20</i>`);
  },
  EXTINCT_TEMPLATE: (tester, module, mb) => {
    tester.testResult(module[mb].code === 21, `<u>${mb}</u> code is: <i>21</i>`);
  },
  INVALID_TEMPLATE: (tester, module, mb) => {
    tester.testResult(module[mb].code === 22, `<u>${mb}</u> code is: <i>22</i>`);
  },
  UNESPECIFIED_SLOT: (tester, module, mb) => {
    tester.testResult(module[mb].code === 30, `<u>${mb}</u> code is: <i>30</i>`);
  }
}

export default RuntimeErrorsTests;

