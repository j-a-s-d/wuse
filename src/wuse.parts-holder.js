// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { isIntegerNumber, isAssignedObject, cloneObject, forEachOwnProperty, buildArray } = JsHelpers;

const partsLooper = (holder, partCallback, metaCallback) => forEachOwnProperty(holder, key => {
  switch (key) {
    case "owner":
    case "last":
    case "length":
      break;
    case "version":
    case "locked":
      metaCallback(key);
      break;
    default:
      if (isIntegerNumber(key)) partCallback(key);
  }
});

const partProcessor = (collection, part, event) => {
  event(part);
  const item = cloneObject(part);
  item.cache = null;
  collection.push(item);
}

export default class PartsHolder extends window.Array {

  owner = null;
  last = null;
  version = 0;
  locked = false;

  #roll(item)  {
    this.last = item;
    this.version++;
    this.on_version_change();
  }

  constructor(owner) {
    super();
    this.owner = owner;
  }

  append(item) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if (isAssignedObject(item)) {
      this.push(item);
      this.#roll(item);
    }
  }

  prepend(item) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if (isAssignedObject(item)) {
      this.unshift(item);
      this.#roll(item);
    }
  }

  replace(index, item) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if ((index > -1) && isAssignedObject(item)) {
      this.#roll(this[index] = item);
    }
  }

  remove(index) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if (index > -1) {
      const a = this.splice(index, 1);
      this.#roll(!!a.length ? a[0] : null);
    }
  }

  clear() {
    if (this.locked) {
      this.on_forbidden_change();
    } else {
      this.length = 0;
      this.#roll(null);
    }
  }

  persist() {
    return buildArray(result => partsLooper(this,
      key => partProcessor(result, this[key], this.on_snapshot_part),
      key => result[key] = this[key]
    ));
  }

  restore(owner, instance) {
    this.owner = owner;
    partsLooper(instance,
      key => partProcessor(this, instance[key], this.on_recall_part),
      key => this[key] = instance[key]
    );
  }

  getIndexOf(value) {}

  on_snapshot_part() {}

  on_recall_part() {}

  on_version_change() {}

  on_forbidden_change() {}

}

