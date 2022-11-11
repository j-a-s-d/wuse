// Wuse (Web Using Shadow Elements) by j-a-s-d

import WebHelpers from './wuse.web-helpers.mjs';
const { isHTMLTag } = WebHelpers;
import JsHelpers from './wuse.javascript-helpers.mjs';
const { EMPTY_STRING, EMPTY_ARRAY, noop, buildArray, buildObject, isAssignedObject, isAssignedArray, ensureFunction, hasObjectKeys, isNonEmptyString, forcedStringSplit } = JsHelpers;
import StringConstants from './wuse.string-constants.mjs';
const { WUSENODE_ATTRIBUTE, DEFAULT_TAG, DEFAULT_KIND, TEMPLATES_KIND, SLOTS_KIND, TEXTNODE_TAG } = StringConstants;
import StringHashing from './wuse.string-hashing.mjs';
const hash = StringHashing.defaultRoutine;

const RuntimeErrors = {
  onInvalidDefinition: noop,
  onInexistentTemplate: noop,
  onUnespecifiedSlot: noop,
  onInvalidId: noop,
  onUnknownTag: noop
}

const isCustomTag = tag => tag.indexOf('-') > 0 && !isHTMLTag(tag);

// PARSERS

class ShorthandNotationParser {

  static #extractAttributes(result, input) {
    const op = input.indexOf("[");
    const cp = input.indexOf("]");
    if (op > -1 && cp > -1 && cp > op) {
      const ip = input.substr(op, cp - op + 1);
      const pp = ip.substr(1, ip.length - 2).split("|");
      for (const z in pp) {
        const x = pp[z].split("=");
        if (x[0] === "style") {
          x[1].split(";").forEach(r => {
            const s = r.split(":");
            const k = s[0].trim();
            if (!!k.length) {
              result.style[k] = s[1].trim();
            }
          });
        } else {
          result.attributes[x[0]] = x[1] || "";
        }
      }
      return input.replace(ip, EMPTY_STRING);
    }
    return input;
  }

  static #extractContent(result, input) {
    const index = input.indexOf("=");
    if (index > -1) {
      result.content = input.slice(index + 1);
      if (!!result.content.length && result.content.charAt(0) === '&') {
        result.content = result.content.slice(1);
        result.encode = !!result.content.length && result.content.charAt(0) !== '&';
      }
      return input.slice(0, index);
    }
    return input;
  }

  static #extractEvents(result, input) {
    const tmp = input.replaceAll("!", " ").split(" ");
    tmp.slice(1).map(item => {
      const [event, ...rest] = item.toLowerCase().split("+");
      const capture = (rest || EMPTY_ARRAY).indexOf("capture") > -1;
      result.events.push(makeEvent(event, capture))
    });
    return tmp[0];
  }

  static #extractClasses(result, input) {
    const tmp = input.replaceAll(".", " ").split(" ");
    result.classes = tmp.slice(1);
    return tmp[0];
  }

  static #extractIdAndTag(result, input) {
    if (isNonEmptyString(input)) {
      const x = input.indexOf("#");
      if (x === -1) {
        result.tag = input;
      } else {
        if (x > 0) {
          result.tag = input.substr(0, x);
        }
        result.id = input.substr(x + 1);
      }
    }
    return result;
  }

  static #extractData(result, input) {
    return this.#extractIdAndTag(result,
      this.#extractClasses(result,
        this.#extractEvents(result,
          this.#extractContent(result,
            this.#extractAttributes(result, input)
          )
        )
      )
    );
  }

  static parse(value) {
    if (isNonEmptyString(value)) {
      let val = value.trimLeft();
      let def = makeDefinition();
      if (val.charAt(0) === '%') {
        if (val.startsWith(TEMPLATES_KIND)) {
          return this.#extractData(def, val.replace(def.kind = TEMPLATES_KIND, EMPTY_STRING));
        } else if (val.startsWith(SLOTS_KIND)) {
          return this.#extractData(def, val.replace(def.kind = SLOTS_KIND, EMPTY_STRING));
        } else {
          return null;
        }
      } else {
        return this.#extractData(def, val);
      }
    }
    return null;
  }

}

class CSSPropertiesParser {

  static #process(result, item) {
    if (!!item.length && item.indexOf(":") > -1) {
      const [key, ...values] = item.split(":");
      const k = key.trim();
      if (!!k.length) {
        const v = values.join(":").trim();
        result[k] = v.endsWith(";") ? v.slice(0, -1) : v;
      }
    }
  }

  static parse(content) {
    return buildObject(result => (
      isAssignedArray(content) ? content : forcedStringSplit(content, "\n").map(x => x.trim()).join(EMPTY_STRING).split(";")
    ).forEach(item => isNonEmptyString(item) && this.#process(result, item.trim())));
  }

}

// ROUTINES

const makeDefinition = () => ({
  kind: DEFAULT_KIND,
  // =
  tag: DEFAULT_TAG, id: EMPTY_STRING, classes: new window.Array(),
  attributes: new window.Object(), style: new window.Object(), events: new window.Array(),
  // =
  content: EMPTY_STRING, encode: false
});

const makeState = () => ({ generation: 0, persisted: false });

const makeEvent = (kind, capture) => typeof kind === "string" && typeof capture === "boolean" ? { kind, capture } : null;

const makeChild = shorthandNotation => {
  let result = ShorthandNotationParser.parse(shorthandNotation);
  if (!result) {
    return RuntimeErrors.onInvalidDefinition(shorthandNotation);
  }
  result.custom = result.kind === DEFAULT_KIND && isCustomTag(result.tag); /*&& result.tag !== TEXTNODE_TAG*/
  result.hash = hash(shorthandNotation);
  //result.rules = new window.Array();
  result.included = true;
  result.cache = null;
  return result;
}

const doValidations = child => {
  if (child !== null) {
    if (child.kind === TEMPLATES_KIND) {
      if (!window.document.getElementById(child.id)) {
        return RuntimeErrors.onInexistentTemplate(child.id);
      }
    } else if (child.kind === SLOTS_KIND) {
      if (new window.String(child.attributes["slot"]).replaceAll("\"", EMPTY_STRING).replaceAll("\'", EMPTY_STRING).length === 0) {
        return RuntimeErrors.onUnespecifiedSlot(child.id);
      }
    } else if (typeof child.id !== "string") {
      return RuntimeErrors.onInvalidId(child.id);
    } else if (child.custom && !window.customElements.get(child.tag)) {
      RuntimeErrors.onUnknownTag(child.tag); // emit warning when a child custom element tag is not registered
    }
  }
  return child;
}

const createMainNode = definition => {
  if (!isAssignedObject(definition)) {
    return null;
  }
  let result = window.document.createElement(definition.tag);
  if (!!definition.id.length) {
    result.setAttribute("id", definition.id);
  }
  if (!!definition.classes.length) {
    result.setAttribute("class", definition.classes.join(" "));
  }
  const ds = definition.style;
  if (hasObjectKeys(ds)) {
    let style = new window.String();
    for (const property in ds) {
      style += `${property}: ${ds[property]}; `;
    }
    if (!!style.length) {
      const v = style.trim();
      result.setAttribute("style", v.endsWith(";") ? v.slice(0, -1) : v);
    }
  }
  const da = definition.attributes;
  if (hasObjectKeys(da)) {
    for (const property in da) {
      result.setAttribute(property, da[property]);
    }
  }
  result.setAttribute(WUSENODE_ATTRIBUTE, "main");
  return result;
}

const createStyleNode = (media, type) => {
  let result = window.document.createElement("style");
  if (isNonEmptyString(media)) result.setAttribute("media", media);
  if (isNonEmptyString(type)) result.setAttribute("type", type);
  result.setAttribute(WUSENODE_ATTRIBUTE, "style");
  result.appendChild(window.document.createTextNode(EMPTY_STRING)); // NOTE: check if this webkit hack is still required
  return result;
}

const makeRule = (selector, properties) => {
  const s = isAssignedArray(selector) ? selector.join(",") : (isNonEmptyString(selector) ? selector : EMPTY_STRING);
  return !s.length ? null : {
    selector: s,
    properties: isAssignedObject(properties) ? properties : CSSPropertiesParser.parse(properties),
    cache: null
  };
}

const makeNestedRule = (selector, sub, properties) => {
  const s = isAssignedArray(selector) ? selector.join(",") : (isNonEmptyString(selector) ? selector : EMPTY_STRING);
  const b = isAssignedArray(sub) ? sub.join(",") : (isNonEmptyString(sub) ? sub : EMPTY_STRING);
  return !s.length || !b.length ? null : {
    selector: s,
    nested: [{
      selector: b,
      properties: isAssignedObject(properties) ? properties : CSSPropertiesParser.parse(properties)
    }],
    cache: null
  };
}

const rulesJoiner = (lr, rule) => {
  if (lr.selector === rule.selector) {
    for (const p in rule.properties) {
      lr.properties[p] = rule.properties[p];
    }
    lr.cache = null;
    return true;
  }
  return false;
}

const nestedRulesJoiner = (lr, rule) => {
  if (isAssignedArray(lr.nested) && lr.selector === rule.selector) {
    rule.nested.forEach(n => {
      let found = false;
      for (const x in lr.nested) {
        if ((found = lr.nested[x].selector === n.selector)) {
          for (const p in n.properties) {
            lr.nested[x].properties[p] = n.properties[p];
          }
          break;
        }
      }
      if (!found) lr.nested.push(n);
    });
    lr.cache = null;
    return true;
  }
  return false;
}

// EXPORTS

export default class ElementParts {

  static makeStyleNode = createStyleNode;

  static newRule = makeRule;

  static newNestedRule = makeNestedRule;

  static tryToJoinRules = rulesJoiner;

  static tryToJoinNestedRules = nestedRulesJoiner;

  static performValidations = doValidations;

  static makeMainNode = createMainNode;

  static newChild = makeChild;

  static newDefinition = makeDefinition;

  static newEvent = makeEvent;
  
  static newState = makeState;

  static initialize(options) {
    if (isAssignedObject(options)) {
      RuntimeErrors.onInvalidDefinition = ensureFunction(options.onInvalidDefinition);
      RuntimeErrors.onInexistentTemplate = ensureFunction(options.onInexistentTemplate);
      RuntimeErrors.onUnespecifiedSlot = ensureFunction(options.onUnespecifiedSlot);
      RuntimeErrors.onInvalidId = ensureFunction(options.onInvalidId);
      RuntimeErrors.onUnknownTag = ensureFunction(options.onUnknownTag);
    }
  }

}

