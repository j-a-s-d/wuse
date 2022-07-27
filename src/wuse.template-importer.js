// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { noop, ensureFunction, isAssignedObject } = JsHelpers;

export default class TemplateImporter {

  static #onExtinctTemplate = noop;
  static #onInvalidTemplate = noop;

  static fetch(id) {
    const template = window.document.getElementById(id);
    if (template === null) {
      return this.#onExtinctTemplate(id);
    } else if (template.tagName !== "TEMPLATE") {
      return this.#onInvalidTemplate(id);
    } else {
      return template.innerHTML;
    }
  }

  static initialize(events) {
    if (isAssignedObject(events)) {
      this.#onExtinctTemplate = ensureFunction(events.onExtinctTemplate, this.#onExtinctTemplate);
      this.#onInvalidTemplate = ensureFunction(events.onInvalidTemplate, this.#onInvalidTemplate);
    }
  }

}

