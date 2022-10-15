// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.mjs';
const { ensureFunction } = JsHelpers;

export default class EqualityAnalyzer {

  rounds = 0; // EQUAL ROUNDS
  #last = 0; // LAST VALUE
  #current = null; // CURRENT VALUE
  #equal = false; // EQUAL ROUND
  #analyzer = null; // VALUE ANALYZER

  constructor(analyzer) {
    this.#analyzer = ensureFunction(analyzer);
  }

  compute(value) {
    this.rounds += +(this.#equal = (this.#last == (this.#current = this.#analyzer(value))));
    this.#last = this.#current;
    return this.#equal;
  }

}
