// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class NodeManager {

  #parent = null;
  #actual = null;
  #clone = null;

  constructor(parent, original) {
    if (parent instanceof Node && original instanceof Node) {
      this.#parent = parent;
      this.#actual = original;
      this.#clone = original.cloneNode(false);
    } else throw new Error("[WUSE:ERROR] Wrong arguments supplied.");
  }

  get element() { return this.#actual; }

  affiliate() {
    this.#parent.appendChild(this.#actual);
  }

  disaffiliate() {
    this.#parent.removeChild(this.#actual);
  }

  #roll() {
    const tmp = this.#clone;
    this.#clone = this.#actual.cloneNode(false);
    this.#actual = tmp;
  }

  promote(content) {
    this.#clone.innerHTML = content;
    this.#parent.replaceChild(this.#clone, this.#actual);
    this.#roll();
  }

}

