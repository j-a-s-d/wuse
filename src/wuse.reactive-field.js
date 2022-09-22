// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { noop, isOf, isNonEmptyString } = JsHelpers;

function setReactiveField(redefiner, owner, name, value, handler, renderizer, remover) {
  const recreator = (v, maneuverer) => setReactiveField(redefiner, owner, name, v, maneuverer, renderizer, remover);
  redefiner(() => value, v => {
    recreator(v, handler);
    !isOf(handler, window.Function) ? renderizer(name) : handler({
      renderize: label => renderizer(name, label), // manual render
      automate: () => recreator(v, null), // converts the field into an automatic reactive field (autorenders)
      freeze: () => redefiner(() => v, noop), // freeze the field value until calling defreeze()
      defreeze: () => recreator(v, handler), // defreezes the field after the freeze action
      dereact: () => redefiner(() => v, (v) => { remover(name); owner[name] = v }), // disable reactiveness (convert into a simple field)
      remove: () => remover(name) // removes the field enterely
    });
  });
}

export default class ReactiveField {

  static createReactiveField(owner, name, value, handler, renderizer, dropper) {
    if (owner && isNonEmptyString(name) && isOf(renderizer, window.Function)) {
      const redefiner = (get, set) => window.Object.defineProperty(owner, name, {
        get, set, enumerable: true, configurable: true
      });
      const remover = isOf(dropper, window.Function) ? dropper : field => delete owner[field];
      return setReactiveField(redefiner, owner, name, value, handler, renderizer, remover);
    }
    return null;
  }

}

