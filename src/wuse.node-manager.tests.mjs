// Wuse (Web Using Shadow Elements) by j-a-s-d

export default new class {

  file = "./wuse.node-manager.mjs"

  suite = (tester, module) => {
    tester.testClassModule(module, "NodeManager", ["existence", "type:function"], this.NodeManager);
  }

  NodeManager = (tester, module, name) => {
    let instance = undefined;
    var r = false;
    try {
      instance = new module(undefined, undefined);
    } catch (e) {
      r = instance === undefined && e.message == "[WUSE:ERROR] Wrong arguments supplied.";
    }
    tester.testResult(r, `<u>${name}</u> failed to get instantiated with invalid nodes: <i>${r}</i>`);
    var fragment = window.document.createDocumentFragment();
    var element = window.document.createElement('div');
    instance = new module(fragment, element);
    r = instance !== undefined;
    tester.testResult(r, `<u>${name}</u> got instantiated with valid nodes: <i>${r}</i>`);
    r = instance.element === element;
    tester.testResult(r, `<u>${name}</u> got the element property called and retrieves the element supplied in the constructor: <i>${r}</i>`);
    instance.affiliate();
    r = !!fragment.children.length;
    tester.testResult(r, `<u>${name}</u> got affiliate() called and the element was appended to the fragment: <i>${r}</i>`);
    instance.promote("text");
    r = fragment.children[0].innerHTML === "text";
    tester.testResult(r, `<u>${name}</u> got promote() called and the content supplied was promoted correctly: <i>${r}</i>`);
    instance.disaffiliate();
    r = !fragment.children.length;
    tester.testResult(r, `<u>${name}</u> got disaffiliate() called and the element was removed to the fragment: <i>${r}</i>`);
  }

}

