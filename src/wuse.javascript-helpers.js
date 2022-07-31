// Wuse (Web Using Shadow Elements) by j-a-s-d

const instanceBuilder = (instance, initializer) => {
  if (typeof initializer === "function") initializer(instance);
  return instance;
}

export default class JavascriptHelpers {

  static #EMPTY_ARRAY = new window.Array();
  static get EMPTY_ARRAY() { return this.#EMPTY_ARRAY; }

  static noop() {};

  static isNonEmptyString(str) {
    return typeof str === "string" && !!str.length;
  }

  static forcedStringSplit(str, by) {
    return typeof str === "string" ? str.split(by) : new window.Array();
  }

  static buildArray(initializer) {
    return instanceBuilder(new window.Array(), initializer);
  }

  static buildObject(initializer) {
    return instanceBuilder(new window.Object(), initializer);
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

  static hasObjectKeys(obj) {
    return !!(obj && !!window.Object.keys(obj).length);
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

}
