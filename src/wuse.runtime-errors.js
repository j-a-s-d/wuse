// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class RuntimeErrors {

    static #ERROR_TAG = "[WUSE:ERROR]";

    static #makeError = (code, writer) => { return { code, emit: (arg) => {
      const msg = `${this.#ERROR_TAG} ${code} | ${writer(arg)}`;
      if ((window.Wuse && window.Wuse.FATALS) || code < 10) {
        throw new window.Error(msg);
      } else {
        window.console.error(msg);
      }
      return null;
    }}}

    static get UNKNOWN_ERROR() {
      return this.#makeError(0, arg => `Unknown error.`);
    }

    static get UNSUPPORTED_FEATURE() {
      return this.#makeError(1, arg => `Unsupported feature: ${arg}.`);
    }

    static get UNREGISTERED_CLASS() {
      return this.#makeError(2, arg => `Unregistered class: ${arg}.`);
    }

    static get UNREGISTRABLE_CLASS() {
      return this.#makeError(3, arg => `Unregistrable class: ${arg}.`);
    }

    static get INVALID_CLASS() {
      return this.#makeError(4, arg => `Invalid class: ${arg}.`);
    }

    static get MISNAMED_CLASS() {
      return this.#makeError(5, arg => `Misnamed class: ${arg}.`);
    }

    static get INVALID_DEFINITION() {
      return this.#makeError(10, arg => `Invalid definition: ${arg}.`);
    }

    static get INVALID_ID() {
      return this.#makeError(11, arg => `Invalid id: ${arg}.`);
    }

    static get INVALID_KEY() {
      return this.#makeError(12, arg => `Call first: this.setElementsStoreKey(<your-valid-key>).`);
    }

    static get ALLOW_HTML() {
      return this.#makeError(13, arg => `Call first: this.allowRawContent(true).`);
    }

    static get INVALID_STATE() {
      return this.#makeError(14, arg => `Invalid state.`);
    }

    static get INEXISTENT_TEMPLATE() {
      return this.#makeError(20, arg => `Inexistent template: #${arg}.`);
    }

    static get EXTINCT_TEMPLATE() {
      return this.#makeError(21, arg => `Extinct template: #${arg}.`);
    }

    static get INVALID_TEMPLATE() {
      return this.#makeError(22, arg => `Invalid template: #${arg}.`);
    }

    static get UNESPECIFIED_SLOT() {
      return this.#makeError(30, arg => `Unespecified slot: #${arg}.`);
    }

    static get LOCKED_DEFINITION() {
      return this.#makeError(40, arg => `Locked definition: #${arg}.`);
    }

}
