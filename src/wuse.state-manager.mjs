// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.mjs';
const { ensureFunction, isNonEmptyString, isAssignedObject } = JsHelpers;

export default class StateManager {

  #on_invalid_state = null;
  #on_invalid_key = null;
  #key = new window.String();
  #keyed = false;
  #maker = null;
  #reader = null;
  #writer = null;
  #state = null;
  #store = null;
  #filiated = new class extends window.Set {
    name(parentKey, id) {
      let key = `${parentKey}_${id}`;
      let x = 0;
      while (this.has(key)) key = `${parentKey}_${id}_${++x}`;
      this.add(key);
      return key;
    }
  }();

  #persistState() {
    if (this.#keyed) {
      this.#state.persisted = !!this.#state.data;
      this.#store.setItem(this.#key, this.#state);
    }
  }

  constructor(maker, reader, writer, store = {}, onInvalidState = () => {}, onInvalidKey = () => {}) {
    this.#maker = ensureFunction(maker);
    this.#reader = ensureFunction(reader);
    this.#writer = ensureFunction(writer);
    this.#store = store;
    this.#on_invalid_state = ensureFunction(onInvalidState);
    this.#on_invalid_key = ensureFunction(onInvalidKey);
  }

  getStore() {
    return this.#store;
  }

  setStore(store) {
    this.#store = store;
  }

  get state() {
    return this.#state;
  }

  get key() {
    return this.#key;
  }

  set key(key) {
    return this.#keyed = isNonEmptyString(this.#key = key);
  }

  hasKey() {
    return this.#keyed;
  }

  validateKey() {
    if (!this.#keyed) {
      this.#on_invalid_key();
      return false;
    }
    return true;
  }

  nameFiliatedKey(id) {
    return this.#filiated.name(this.#key, id);
  }

  rememberFiliatedKey(key) {
    this.#filiated.add(key);
  }

  hasFiliatedKey(key) {
    return this.#filiated.has(key);
  }

  initializeState() {
    this.#filiated.clear();
    if (this.#keyed) {
      const state = this.#store.hasItem(this.key) ?
        this.#store.getItem(this.key) : this.#maker();
      if (isAssignedObject(state)) {
        this.#state = state;
        this.#state.generation++;
        this.#persistState();
      } else {
        this.#on_invalid_state();
        return -1;
      }
    } else {
      this.#state = this.#maker();
      this.#state.generation++;
    }
    return this.#state.generation;
  }

  writeState() {
    const state = this.#state;
    if (isAssignedObject(state)) {
      state.data = this.#writer();
      this.#persistState();
      return true;
    }
    return false;
  }

  readState() {
    const state = this.#state;
    if (isAssignedObject(state) && state.persisted) {
      this.#reader(state.data);
      return true;
    }
    return false;
  }

  eraseState() {
    const state = this.#state;
    if (isAssignedObject(state) && state.persisted && state.data) {
      delete state.data;
      this.#persistState();
      return true;
    }
    return false;
  }

}

