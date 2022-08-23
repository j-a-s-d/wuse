// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { noop, ensureFunction, isAssignedObject, isAssignedArray, isNonEmptyArray } = JsHelpers;

const convertClassNameToKebabCaseTag = name => name.toLowerCase().replaceAll("_", "-");

export default class ElementClasses {
  
  static #onDeferredInstantiation = noop;
  static #onMisnamedClass = noop;
  static #onInvalidClass = noop;
  static #onUnregistrableClass = noop;
  static #onUnregisteredClass = noop;
  static #onAlreadyRegistered = noop;

  static #registrationPerformer(klass) {
    window.HTMLElement.isPrototypeOf(klass) ?
      window.customElements.define(klass.tag, klass) :
      this.#onUnregistrableClass(klass.name);
  }

  static #registrationIntender(klass) {
    window.customElements.get(klass.tag = convertClassNameToKebabCaseTag(klass.name)) ?
      this.#onAlreadyRegistered(klass.name) :
      this.#registrationPerformer(klass);
  }

  static #classRegistrar(klass) {
    klass.name.indexOf("_") > 0 ?
      this.#registrationIntender(klass) :
      this.#onMisnamedClass(klass.name);
  }

  static registerClasses(classes) {
    if (isNonEmptyArray(classes)) window.Array.prototype.forEach.call(classes, item => typeof item === "function" ?
      this.#classRegistrar(item) :
      this.#onInvalidClass(item)
    );
  }

  static #immediateClassInstantiator(klass, target, events) {
    let t = null;
    try {
      t = window.document.querySelector(target);
    } catch {
      if (ensureFunction(events.onBadTarget)(target) === false) return;
    } finally {
      t = t || window.document.body;
    }
    const x = window.document.createElement(klass.tag);
    ensureFunction(events.onElementInstantiated)(x, target);
    t.appendChild(x);
  }

  static #instantiateClass(klass, target, events) {
    const instantiator = () => this.#immediateClassInstantiator(klass, target, events);
    window.document.body ? instantiator() : this.#onDeferredInstantiation(instantiator);
  }

  static instantiateClasses(classes, target, events) {
    if (isNonEmptyArray(classes)) window.Array.prototype.forEach.call(classes, klass => window.customElements.get(klass.tag) ?
      this.#instantiateClass(klass, target, isAssignedObject(events) ? events : new window.Object()) :
      this.#onUnregisteredClass(klass.name)
    );
  }

  static initialize(events) {
    if (isAssignedObject(events)) {
      this.#onDeferredInstantiation = ensureFunction(events.onDeferredInstantiation, this.#onDeferredInstantiation);
      this.#onInvalidClass = ensureFunction(events.onInvalidClass, this.#onInvalidClass);
      this.#onMisnamedClass = ensureFunction(events.onMisnamedClass, this.#onMisnamedClass);
      this.#onUnregistrableClass = ensureFunction(events.onUnregistrableClass, this.#onUnregistrableClass);
      this.#onUnregisteredClass = ensureFunction(events.onUnregisteredClass, this.#onUnregisteredClass);
      this.#onAlreadyRegistered = ensureFunction(events.onAlreadyRegistered, this.#onAlreadyRegistered);
    }
  }

}

