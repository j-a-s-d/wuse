// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class JavascriptHelpers {

  static #EMPTY_STRING = (new window.String()).valueOf();
  static get EMPTY_STRING() { return this.#EMPTY_STRING; }

  static #EMPTY_ARRAY = window.Object.freeze(new window.Array());
  static get EMPTY_ARRAY() { return this.#EMPTY_ARRAY; }

  static noop() {};

  static isNonEmptyString(str) {
    return typeof str === "string" && !!str.length;
  }

  static forcedStringSplit(str, by) {
    return typeof str === "string" ? str.split(by) : new window.Array();
  }

  static buildArray(initializer) {
    const instance = new window.Array();
    if (typeof initializer === "function") initializer(instance);
    return instance;
  }

  static buildObject(initializer) {
    const instance = new window.Object();
    if (typeof initializer === "function") initializer(instance);
    return instance;
  }

  static ensureFunction(fun, def = () => {}) {
    return typeof fun === "function" ? fun : def;
  }

  static isOf(instance, c) {
    return !!(
      instance !== undefined && instance !== null && (
        instance.constructor === c || (
          c !== undefined && c !== null && instance.constructor.name === c.name
        )
      )
    );
  }

  static areOf(instances, c) {
    let result = !!(instances && instances.constructor === window.Array && !!instances.length);
    if (result) for (let x in instances) {
      const instance = instances[x];
      if (!(instance !== undefined && instance !== null && (
        instance.constructor === c || (
          c !== undefined && c !== null && instance.constructor.name === c.name
        ))
      )) {
        result = false;
        break;
      }
    }
    return result;
  }

  static hasObjectKeys(obj) {
    return !!(obj && !!window.Object.keys(obj).length);
  }

  static cloneObject(instance) {
    return window.Object.assign(new window.Object(), instance);
  }

  static forEachOwnProperty(instance, callback) {
    instance && window.Object.getOwnPropertyNames(instance).forEach(callback);
  }

  static isAssignedObject(instance) {
    return typeof instance === "object" && instance !== null;
  }

  static isAssignedArray(instance) {
    return typeof instance === "object" && instance !== null && instance.constructor.name === "Array";
  }

  static isNonEmptyArray(instance) {
    return typeof instance === "object" && instance !== null && instance.constructor.name === "Array" && !!instance.length;
  }

  static isIntegerNumber(x) {
    return (typeof x === "number" || (typeof x === "string" && !!x.length)) && window.Number.isInteger(window.Number(x));
  }

  static defineReadOnlyMembers(instance, items) {
    if (instance && typeof items === "object" && items !== null) {
      const defProp = window.Object.defineProperty;
      const names = window.Object.getOwnPropertyNames(items);
      for (let x in names) {
        const name = names[x];
        defProp(instance, name, {
          value: items[name], writable: false, configurable: false, enumerable: false
        });
      }
    }
  }

}
