// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.mjs';
const { isOf } = JsHelpers;

export default class ContentManager {

  #invalidated = false;
  #content = "";

  constructor(promoter, verifier) {
    if (isOf(promoter, window.Function)) this.on_content_invalidation = promoter;
    if (isOf(verifier, window.Function)) this.on_content_verification = verifier;
  }

  get invalidated() { return this.#invalidated; }

  reset(content) {
    this.#invalidated = false;
    this.#content = content;
  }

  append(more) {
    this.#content += more;
  }

  verify() {
    this.#invalidated = this.on_content_verification(this.#content);
  }

  process(force) {
    if (force || this.#invalidated) this.on_content_invalidation(this.#content);
  }

  on_content_verification(content) {}

  on_content_invalidation(content) {}

}

