// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { noop, isOf, isNonEmptyString } = JsHelpers;

const isNotFunction = x => !isOf(x, window.Function);

const setReactiveField = (name, value, handler, renderizer, redefiner, recreator, dereactor, remover) =>
  redefiner(() => value, v => {
    recreator(v, handler);
    isNotFunction(handler) ? renderizer(name) : handler({
      renderize: label => renderizer(name, label), // manual render (accepting a debug label)
      automate: () => recreator(v, null), // converts the field into an automatic reactive field (autorenders)
      freeze: () => redefiner(() => v, noop), // freeze the field value until calling defreeze()
      defreeze: () => recreator(v, handler), // defreezes the field after the freeze action
      dereact: () => redefiner(() => v, dereactor), // disable reactiveness (convert into a simple field)
      remove: () => remover(name) // removes the field enterely
    });
  });

const makeReactiveField = (owner, name, value, handler, renderizer, dropper) => {
  const redefiner = (get, set) => {
    window.Object.defineProperty(owner, name, {
      get, set, enumerable: true, configurable: true
    });
  };
  const remover = isNotFunction(dropper) ? field => delete owner[field] : dropper;
  const dereactor = v => {
    remover(name);
    owner[name] = v;
  };
  const recreator = (v, maneuverer) => setReactiveField(
    name, v, maneuverer, renderizer, redefiner, recreator, dereactor, remover
  );
  return recreator(value, handler);
}

export default class ReactiveField {

  static createReactiveField(owner, name, value, handler, renderizer, dropper) {
    return owner && isNonEmptyString(name) && isOf(renderizer, window.Function) ? makeReactiveField(
      owner, name, value, handler, renderizer, dropper
    ) : null;
  }

}

