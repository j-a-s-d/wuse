// Wuse (Web Using Shadow Elements) by j-a-s-d

const makeError = (code, writer) => ({ code, emit: arg => {
  const lvl = code < 80 ? "error" : "warn";
  const msg = `[WUSE:${lvl.toUpperCase()}] ${code} | ${writer(arg)}`;
  if ((window.Wuse && window.Wuse.FATALS) || code < 10) {
    throw new window.Error(msg);
  } else {
    window.console[lvl](msg);
  }
  return null;
}});

export default class RuntimeErrors {

  static get UNKNOWN_ERROR() {
    return makeError(0, arg => `Unknown error.`);
  }

  static get UNSUPPORTED_FEATURE() {
    return makeError(1, arg => `Unsupported feature: ${arg}.`);
  }

  static get UNREGISTERED_CLASS() {
    return makeError(2, arg => `Unregistered class: ${arg}.`);
  }

  static get UNREGISTRABLE_CLASS() {
    return makeError(3, arg => `Unregistrable class: ${arg}.`);
  }

  static get INVALID_CLASS() {
    return makeError(4, arg => `Invalid class: ${arg}.`);
  }

  static get MISNAMED_CLASS() {
    return makeError(5, arg => `Misnamed class: ${arg}.`);
  }

  static get INVALID_DEFINITION() {
    return makeError(10, arg => `Invalid definition: ${arg}.`);
  }

  static get INVALID_ID() {
    return makeError(11, arg => `Invalid id: ${arg}.`);
  }

  static get INVALID_KEY() {
    return makeError(12, arg => `Call first: this.setElementsStoreKey(<your-valid-key>).`);
  }

  static get ALLOW_HTML() {
    return makeError(13, arg => `Call first: this.allowRawContent(true).`);
  }

  static get INVALID_STATE() {
    return makeError(14, arg => `Invalid state.`);
  }

  static get INEXISTENT_TEMPLATE() {
    return makeError(20, arg => `Inexistent template: #${arg}.`);
  }

  static get EXTINCT_TEMPLATE() {
    return makeError(21, arg => `Extinct template: #${arg}.`);
  }

  static get INVALID_TEMPLATE() {
    return makeError(22, arg => `Invalid template: #${arg}.`);
  }

  static get UNESPECIFIED_SLOT() {
    return makeError(30, arg => `Unespecified slot: #${arg}.`);
  }

  static get LOCKED_DEFINITION() {
    return makeError(40, arg => `Locked definition: #${arg}.`);
  }

  static get UNKNOWN_TAG() {
    return makeError(80, arg => `Unknown tag: ${arg}.`);
  }

  static get BAD_TARGET() {
    return makeError(81, arg => `Bad target: ${arg}.`);
  }

  static get ALREADY_REGISTERED() {
    return makeError(90, arg => `Already registered: ${arg}.`);
  }

}

