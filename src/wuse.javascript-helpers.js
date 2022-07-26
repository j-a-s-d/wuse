// Wuse (Web Using Shadow Elements) by j-a-s-d

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

  static #instanceBuilder(instance, initializer) {
    if (this.isOf(initializer, window.Function)) initializer(instance);
    return instance;
  }

  static buildArray(initializer) {
    return this.#instanceBuilder(new window.Array(), initializer);
  }

  static buildObject(initializer) {
    return this.#instanceBuilder(new window.Object(), initializer);
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
