// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { noop, isOf, hasObjectKeys, isNonEmptyString, isNonEmptyArray, isAssignedObject, ensureFunction } = JsHelpers;
import WebHelpers from './wuse.web-helpers.js';
const { htmlEncode } = WebHelpers;
import StringConstants from './wuse.string-constants.js';
const { TEMPLATES_KIND, TEXTNODE_TAG } = StringConstants;

export default class RenderingRoutines {

    static #onFetchTemplate = noop;

    static cacheInvalidator = item => item.cache = null;

    static renderingIncluder = item => item.rendering = true;

    static renderingExcluder = item => item.rendering = false;

    static renderRule = (replacer, rule) => {
      if (isOf(rule.nested, window.Array)) {
        return `${rule.selector}{${rule.nested.map(r => this.renderRule(replacer, r)).join("\n")}}`;
      } else if (isNonEmptyString(rule.selector) && !rule.nested) {
        var c = new window.String();
        for (const property in rule.properties) {
          c += `${property}:${rule.properties[property]};`;
        }
        if (isNonEmptyArray(rule.replacements)) {
          rule.replacements.forEach(r => c = replacer(c, r));
        }
        return `${rule.selector}{${c}}`;
      }
      return null;
    }

    static renderChild = (replacer, child) => {
      if (child.kind === TEMPLATES_KIND) {
        return this.#onFetchTemplate(child.id);
      }
      if (child.tag === TEXTNODE_TAG) {
        var c = child.content;
        child.replacements["contents"].forEach(r => c = replacer(c, r));
        return child.encode ? htmlEncode(c) : c;
      }
      var result = isNonEmptyString(child.id) ? `<${child.tag} id='${child.id}'` : `<${child.tag}`;
      if (!!child.classes.length) {
        var c = child.classes.join(" ");
        child.replacements["classes"].forEach(r => c = replacer(c, r));
        result += ` class='${c}'`;
      }
      if (hasObjectKeys(child.style)) {
        var c = " style='";
        for (const property in child.style) {
          c += property + ": " + child.style[property] + "; ";
        }
        c += "'";
        child.replacements["styles"].forEach(r => c = replacer(c, r));
        result += c;
      }
      if (hasObjectKeys(child.attributes)) {
        var c = new window.String();
        for (const property in child.attributes) {
          c += ` ${property}=${child.attributes[property]}`;
        }
        child.replacements["attributes"].forEach(r => c = replacer(c, r));
        result += c;
      }
      if (typeof child.content === "string") {
        var c = child.content;
        child.replacements["contents"].forEach(r => c = replacer(c, r));
        result += `>${child.encode ? htmlEncode(c) : c}</${child.tag}>`;
      } else {
        result += "/>"
      }
      return result;
    }

    static initialize(events) {
      if (isAssignedObject(events)) {
        this.#onFetchTemplate = ensureFunction(events.onFetchTemplate, this.#onFetchTemplate);
      }
    }

}

