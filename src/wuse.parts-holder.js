// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { isOf, cloneObject, forEachOwnProperty, buildArray } = JsHelpers;

export default class PartsHolder extends window.Array {

  owner = null;
  last = null;
  version = 0;

  constructor(owner) {
    super();
    this.owner = owner;
  }

  #roll(item)  {
    this.last = item;
    this.version++;
    this.on_version_change();
  }

  append(item) {
    if (isOf(item, window.Object)) {
      this.push(item);
      this.#roll(item);
    }
  }

  prepend(item) {
    if (isOf(item, window.Object)) {
      this.unshift(item);
      this.#roll(item);
    }
  }

  replace(index, item) {
    if ((index > -1) && isOf(item, window.Object)) {
      this.#roll(this[index] = item);
    }
  }

  on_version_change() {}

  persist() {
    return buildArray(result => forEachOwnProperty(this, key => {
      switch (key) {
        case "owner":
        case "last":
        case "length":
          break;
        case "version":
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

}

