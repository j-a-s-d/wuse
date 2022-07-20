// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class ContentManager {

  owner = null;
  #invalidated = false;
  #content = "";

  constructor(owner) {
    this.owner = owner;
  }

  get invalidated() { return this.#invalidated; }

  reset(content) {
    this.#invalidated = false;
    this.#content = content;
  }

  append(more) {
    this.#content += more;
  }

  verify(verifier) {
    this.#invalidated = verifier(this.#content);
  }

  process() {
    if (this.#invalidated) this.on_content_invalidation(this.#content);
  }

  on_content_invalidation(content) {}

}

