// Wuse (Web Using Shadow Elements) by j-a-s-d

import PartsHolder from './wuse.parts-holder.mjs';

export default class RulesHolder extends PartsHolder {

  #extractor = item => {};
  #on_locked_definition = id => {};
  #debug = () => {};

  constructor(owner, extractor, onLockedDefinition, debug) {
    super(owner);
    this.#extractor = extractor;
    this.#on_locked_definition = onLockedDefinition;
    this.#debug = debug;
  }

  getIndexOf = value => super.getIndexOf("selector", value);

  on_version_change = () => {
    if (this.last !== null) {
      this.last.version = this.version;
      this.last.replacements = this.#extractor(this.last);
    }
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `rules list version change: ${this.version}`);
  }

  on_forbidden_change = () => {
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `rules list is locked and can not be changed`);
    this.#on_locked_definition(this.owner.getMainAttribute("id"));
  }

}

