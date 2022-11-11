// Wuse (Web Using Shadow Elements) by j-a-s-d

import PartsHolder from './wuse.parts-holder.mjs';

export default class FieldsHolder extends PartsHolder {

  #on_locked_definition = id => {};
  #debug = () => {};

  constructor(owner, onLockedDefinition, debug) {
    super(owner);
    this.#on_locked_definition = onLockedDefinition;
    this.#debug = debug;
  }

  establish = (name, value) => {
    if (this.prepare()) {
      const idx = super.getIndexOf("name", name);
      idx > -1 ? this[idx].value = value : this.append({ name, value });
      return true;
    }
    return false;
  }

  snapshot = () => buildArray(instance => this.persist().forEach(
    item => instance.push({ name: item.name, value: item.value })
  ));

  getIndexOf = value => super.getIndexOf("name", value);

  on_version_change = () => {
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `fields list version change: ${this.version}`);
  }

  on_forbidden_change = () => {
    window.Wuse.DEBUG && this.owner.isMainIdentified() && this.#debug(this.owner, `fields list is locked and can not be changed`);
    this.#on_locked_definition(this.owner.getMainAttribute("id"));
  }

  on_snapshot_part = part => part.value = this.owner[part.name];

  on_recall_part = part => this.owner[part.name] = part.value;

}

