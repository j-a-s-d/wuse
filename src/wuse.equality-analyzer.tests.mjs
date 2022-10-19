// Wuse (Web Using Shadow Elements) by j-a-s-d

const byteXorHash = salt => str => {
  var idx = str.length, result = salt; // 'take it with a pinch of salt'
  while (idx--) result ^= str.charCodeAt(idx);
  return result;
}

const testInstanceCompute3Times = (tester, name, instance, setupArgs, callArgs, callResults) => {
  var r = null;
  r = instance !== undefined;
  tester.testResult(r, `<u>${name}</u> got instantiated with ${setupArgs}: <i>${r}</i>`);
  r = instance.compute(callArgs[0]);
  tester.testResult(r === callResults[0], `<u>${name}</u> got compute() called once with "${callArgs[0]}" (${callResults[0]}): <i>${r}</i>`);
  r = instance.compute(callArgs[1]);
  tester.testResult(r === callResults[1], `<u>${name}</u> got compute() called twice with "${callArgs[1]}" (${callResults[1]}): <i>${r}</i>`);
  r = instance.compute(callArgs[2]);
  tester.testResult(r === callResults[2], `<u>${name}</u> got compute() called thrice with "${callArgs[2]}" (${callResults[2]}): <i>${r}</i>`);
}

export default new class {

  file = "./wuse.equality-analyzer.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "EqualityAnalyzer", ["existence", "type:function"], this.EqualityAnalyzer);
  }

  EqualityAnalyzer = (tester, module, name) => {
    testInstanceCompute3Times(tester, name, new module(), "no arguments", ["", "", ""], [false, true, true]);
    testInstanceCompute3Times(tester, name, new module(null), "invalid argument", ["", "", ""], [false, true, true]);
    testInstanceCompute3Times(tester, name, new module(()=>{}), "valid argument", ["", "", ""], [false, true, true]);
    testInstanceCompute3Times(tester, name, new module(byteXorHash(0x42)), "a valid hash function", ["test", "test", "testing"], [false, true, false]);
    testInstanceCompute3Times(tester, name, new module(byteXorHash(0x00)), "another valid hash function", ["foo", "bar", "foo"], [false, false, false]);
  }

}

