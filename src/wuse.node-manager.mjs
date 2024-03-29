// Wuse (Web Using Shadow Elements) by j-a-s-d

import StringConstants from './wuse.string-constants.mjs';
const { WUSENODE_ATTRIBUTE } = StringConstants;

export default class NodeManager {

  #parent = null;
  #actual = null;
  #clone = null;

  #drop(type) {
    const old = this.#parent.querySelector(`[${WUSENODE_ATTRIBUTE}='${type}']`);
    if (old) this.#parent.removeChild(old);
  }

  #roll() {
    const tmp = this.#clone;
    this.#clone = this.#actual.cloneNode(false);
    this.#actual = tmp;
  }

  constructor(parent, original) {
    if (parent instanceof window.Node && original instanceof window.Node) {
      this.#parent = parent;
      this.element = original;
    } else throw new Error("[WUSE:ERROR] Wrong arguments supplied.");
  }

  set element(original) {
    this.#drop(original.getAttribute(WUSENODE_ATTRIBUTE));
    this.#actual = original;
    this.#clone = original.cloneNode(false);
  }

  get element() {
    return this.#actual;
  }

  get next() {
    return this.#clone;
  }

  affiliate() {
    this.#parent.appendChild(this.#actual);
  }

  disaffiliate() {
    this.#parent.removeChild(this.#actual);
  }

  promote(content) {
    this.#clone.innerHTML = content;
    this.#parent.replaceChild(this.#clone, this.#actual);
    this.#roll();
  }

}

