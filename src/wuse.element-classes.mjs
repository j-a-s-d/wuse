// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.mjs';
const { noop, ensureFunction, isAssignedObject, isAssignedArray, isNonEmptyArray, isOf, forEachOwnProperty } = JsHelpers;

const convertClassNameToKebabCaseTag = name => name.toLowerCase().replaceAll("_", "-");

export default class ElementClasses {

  static #onBadTarget = noop;  
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

  static #immediateClassInstantiator(klass, target, events, parameters) {
    let selector = target.selector;
    let parent = target.node;
    if (parent instanceof window.HTMLElement === false) try {
      parent = window.document.querySelector(selector);
    } catch {
      // on_bad_target happens when the specified target is not a valid query selector (for ex. a number), if this event is not specified a console warning is emitted
      if (!isOf(events.on_bad_target, window.Function)) {
        this.#onBadTarget(selector);
        return;
      } else if (events.on_bad_target(selector) === false) return;
    } finally {
      parent = parent || window.document.body;
    }
    const element = window.document.createElement(klass.tag);
    element.parameters = parameters;
    ensureFunction(events.on_element_instantiated)(element, selector); // on_element_instantiated happens after the creation of an element and before it's addition to it's parent target
    parent.appendChild(element);
    return element;
  }

  static #instantiateClass(klass, target, events, parameters) {
    const instantiator = () => this.#immediateClassInstantiator(klass, target, events, parameters);
    return window.customElements.get(klass.tag) ? (
      window.document.body ? instantiator() : this.#onDeferredInstantiation(instantiator)
    ) : this.#onUnregisteredClass(klass.name);
  }

  static instantiateClasses(classes, target, events, parameters) {
    if (isNonEmptyArray(classes)) window.Array.prototype.forEach.call(
      classes, klass => this.#instantiateClass(
        klass, isAssignedObject(target) ? target : (
          target instanceof window.HTMLElement ? { node: target } : { selector: target }
        ), isAssignedObject(events) ? events : new window.Object(), parameters
      )
    );
  }

  static createInstance(element, target, instance) {
    if (isAssignedObject(element) && isOf(element.type, window.Function)) {
      if (element.register === true) this.#classRegistrar(element.type);
      target = isAssignedObject(target) ? target : new window.Object();
      instance = isAssignedObject(instance) ? instance : new window.Object();
      return this.#instantiateClass(element.type, target, {
        on_bad_target: target.on_bad_target,
        on_element_instantiated: instance.on_element_instantiated
      }, instance.parameters);
    }
    return undefined;
  }

  static initialize(events) {
    if (isAssignedObject(events)) {
      this.#onBadTarget = ensureFunction(events.onBadTarget, this.#onBadTarget);
      this.#onDeferredInstantiation = ensureFunction(events.onDeferredInstantiation, this.#onDeferredInstantiation);
      this.#onInvalidClass = ensureFunction(events.onInvalidClass, this.#onInvalidClass);
      this.#onMisnamedClass = ensureFunction(events.onMisnamedClass, this.#onMisnamedClass);
      this.#onUnregistrableClass = ensureFunction(events.onUnregistrableClass, this.#onUnregistrableClass);
      this.#onUnregisteredClass = ensureFunction(events.onUnregisteredClass, this.#onUnregisteredClass);
      this.#onAlreadyRegistered = ensureFunction(events.onAlreadyRegistered, this.#onAlreadyRegistered);
    }
  }

}

