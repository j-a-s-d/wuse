// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class SimpleStorage {

    // NOTE: this class implements the Web Storage API
    // well enough to operate without problems, plus
    // offering the addendum of the method hasItem()
    // and the ability of storing non-string values
    // any conversion involved.

    #items = new window.Object();

    #getKeys() {
      return window.Object.keys(this.#items);
    }

    get length() {
      return this.#getKeys().length;
    }

    key(value) {
      return this.#getKeys()[value] || null;
    }

    getItem(key) {
      return this.#items[key];
    }

    setItem(key, state) {
      this.#items[key] = state;
    }

    removeItem(key) {
      delete this.#items[key];
    }

    clear() {
      this.#items = new window.Object();
    }

    hasItem(key) {
      return this.#items.hasOwnProperty(key);
    }

  }
  
