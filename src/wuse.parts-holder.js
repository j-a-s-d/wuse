// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { isOf, cloneObject, forEachOwnProperty, buildArray } = JsHelpers;

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
    } else if (isOf(item, window.Object)) {
      this.push(item);
      this.#roll(item);
    }
  }

  prepend(item) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if (isOf(item, window.Object)) {
      this.unshift(item);
      this.#roll(item);
    }
  }

  replace(index, item) {
    if (this.locked) {
      this.on_forbidden_change();
    } else if ((index > -1) && isOf(item, window.Object)) {
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

  persist() {
    return buildArray(result => forEachOwnProperty(this, key => {
      switch (key) {
        case "owner":
        case "last":
        case "length":
          break;
        case "version":
        case "locked":
          result[key] = this[key];
          break;
        default:
          if (window.Number.isInteger(window.Number(key))) {
            const item = cloneObject(this[key]);
            if (item.cache) item.cache = null;
            result.push(item);
          }
          break;
      }
    }));
  }

  restore(instance) {
    forEachOwnProperty(instance, key => {
      switch (key) {
        case "length":
          break;
        case "version":
        case "locked":
          this[key] = instance[key];
          break;
        default:
          if (window.Number.isInteger(window.Number(key))) {
            const item = cloneObject(instance[key]);
            if (item.cache) item.cache = null;
            this.push(item);
          }
          break;
      }
    });
  }

  on_version_change() {}

  on_forbidden_change() {}

}

