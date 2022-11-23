// Wuse (Web Using Shadow Elements) by j-a-s-d

import PartsHolder from './wuse.parts-holder.mjs';

export default class ChildrenHolder extends PartsHolder {

  #extractor = item => {};
  #updater = holder => {};
  #on_locked_definition = id => {};
  #debug = () => {};

  constructor(owner, extractor, recaller, updater, onLockedDefinition, debug) {
    super(owner);
    this.#extractor = extractor;
    this.on_recall_part = recaller;
    this.#updater = updater;
    this.#on_locked_definition = onLockedDefinition;
    this.#debug = debug;
  }

  getIndexOf = value => super.getIndexOf("id", value);

  on_version_change = () => {
    if (this.last !== null) {
      this.last.version = this.version;
      this.last.replacements = this.#extractor(this.last);
      let x = this.last;
      while (x.recursive) {
        x.content.replacements = this.#extractor(x.content);
        x = x.content;
      }
    }
    this.#updater(this);
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `children list version change: ${this.version}`);
  }

  on_forbidden_change = () => {
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `children list is locked and can not be changed`);
    this.#on_locked_definition(this.owner.getMainAttribute("id"));
  }

}

