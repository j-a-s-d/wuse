// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_ARRAY, buildArray, buildObject, isNonEmptyString, isAssignedArray } = JsHelpers;

class ReplacementMarkers {

  static begin = null;

  static end = null;

  static enclose = match => this.begin + match + this.end;

  static makeRegExp = () => new window.RegExp(`(?<=${this.begin}).*?(?=${this.end})`, "gs");

  static initialize(begin, end) {
    this.begin = begin;
    this.end = end;
  }

}

const REPLACEMENT_PLACES = ["contents", "classes", "styles", "attributes"];

class ReplacementsScanners {

  static rules = (rules, name) => buildArray(hits => rules.forEach(
    rule => rule.replacements.forEach(x => (x.field === name) && hits.push(rule))
  ));

  static children = (children, name) => buildArray(hits => {
    const processAll = child => {
      const process = collection => collection.forEach(
        x => (x.field === name) && hits.push(child)
      );
      REPLACEMENT_PLACES.forEach(
        key => process(child.replacements[key])
      );
      child.rules.forEach(rule => rule.replacements.forEach(
        x => (x.field === name) && hits.push(child)
      )); // NOTE: in this case is faster to ignore duplication
    };
    children.forEach(child => child.included && processAll(child));
  });

}

class ReplacementsExtractors {

  static #regExp = null;

  static #addReplacement = (hits, at, match) => hits.push({
    at, field: match.trim(), find: ReplacementMarkers.enclose(match)
  });

  static #includeMatches = (hits, at, str) => isNonEmptyString(str) && (str.match(this.#regExp) || EMPTY_ARRAY).forEach(
    match => this.#addReplacement(hits, at, match)
  );

  static #includeStringMatches = (result, key, value) => {
    result[key] = new window.Array();
    this.#includeMatches(result[key], key, value);
  }

  static #includeKeysMatches = (result, key, obj) => {
    result[key] = new window.Array();
    window.Object.keys(obj).forEach(k => {
      this.#includeMatches(result[key], key, k);
      this.#includeMatches(result[key], key, obj[k]);
    });
  }

  static child = child => buildObject(result => {
    this.#includeStringMatches(result, "contents", child.content);
    this.#includeStringMatches(result, "classes", child.classes.join(" "));
    this.#includeKeysMatches(result, "styles", child.style);
    this.#includeKeysMatches(result, "attributes", child.attributes);
    child.rules.forEach(r => r.replacements = this.rule(r));
  });

  static rule = rule => buildArray(result => {
    if (isAssignedArray(rule.nested)) {
      return rule.nested.map(r => this.rule(r));
    }
    var c = "";
    for (const property in rule.properties) {
      c += `${property}:${rule.properties[property]};`;
    }
    this.#includeMatches(result, "rules", c);
  });

  static initialize(regExp) {
    this.#regExp = regExp;
  }

}

export default class TextReplacements {

  static extractReplacementsFromRule = ReplacementsExtractors.rule;

  static extractReplacementsFromChild = ReplacementsExtractors.child;

  static scanRulesForReplacements = ReplacementsScanners.rules;

  static scanChildrenForReplacements = ReplacementsScanners.children;

  static initialize(openMarker, closeMarker) {
    ReplacementMarkers.initialize(openMarker, closeMarker);
    ReplacementsExtractors.initialize(ReplacementMarkers.makeRegExp());
  }

}

