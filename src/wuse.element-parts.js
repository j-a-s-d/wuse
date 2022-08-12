// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_STRING, EMPTY_ARRAY, noop, buildArray, buildObject, isOf, hasObjectKeys, isNonEmptyString, forcedStringSplit } = JsHelpers;
import StringConstants from './wuse.string-constants.js';
const { DEFAULT_TAG, DEFAULT_KIND, TEMPLATES_KIND, SLOTS_KIND } = StringConstants;

const RuntimeErrors = {
  onInvalidDefinition: noop,
  onInexistentTemplate: noop,
  onUnespecifiedSlot: noop,
  onInvalidId: noop
}

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
          result.attributes[x[0]] = x[1];
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
      isOf(content, window.Array) ? content : forcedStringSplit(content, "\n").map(x => x.trim()).join(EMPTY_STRING).split(";")
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

const makeChild = (shorthandNotation, rules) => {
  let result = ShorthandNotationParser.parse(shorthandNotation);
  if (!result) {
    return RuntimeErrors.onInvalidDefinition(shorthandNotation);
  }
  result.rules = isOf(rules, window.Array) ? rules : new window.Array();
  result.rendering = true;
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
    } else if (typeof child.id !== "string" || (isNonEmptyString(child.id) && window.document.getElementById(child.id) !== null)) {
      return RuntimeErrors.onInvalidId(child.id);
    }
  }
  return child;
}

const createMainNode = mainDefinition => {
  if (!isOf(mainDefinition, window.Object)) {
    return null;
  }
  let result = window.document.createElement(mainDefinition.tag);
  if (!!mainDefinition.id.length) {
    result.setAttribute("id", mainDefinition.id);
  }
  if (!!mainDefinition.classes.length) {
    result.setAttribute("class", mainDefinition.classes.join(" "));
  }
  if (hasObjectKeys(mainDefinition.style)) {
    var style = new window.String();
    for (const property in mainDefinition.style) {
      style += property + ": " + mainDefinition.style[property] + "; ";
    }
    if (!!style.length) {
      const v = style.trim();
      result.setAttribute("style", v.endsWith(";") ? v.slice(0, -1) : v);
    }
  }
  if (hasObjectKeys(mainDefinition.attributes)) {
    for (const property in mainDefinition.attributes) {
      result.setAttribute(property, mainDefinition.attributes[property]);
    }
  }
  return result;
}

const createStyleNode = (media, type) => {
  let result = window.document.createElement("style");
  if (isNonEmptyString(media)) {
    result.setAttribute("media", media);
  }
  if (isNonEmptyString(type)) {
    result.setAttribute("type", type);
  }
  result.appendChild(window.document.createTextNode(EMPTY_STRING)); // NOTE: check if this webkit hack is still required
  return result;
}

const makeRule = (selector, properties) => {
  const s = isOf(selector, window.Array) ? selector.join(",") : (isNonEmptyString(selector) ? selector : EMPTY_STRING);
  return !s.length ? null : {
    selector: s,
    properties: isOf(properties, window.Object) ? properties : CSSPropertiesParser.parse(properties),
    cache: null
  };
}

const makeNestedRule = (selector, sub, properties) => {
  const s = isOf(selector, window.Array) ? selector.join(",") : (isNonEmptyString(selector) ? selector : EMPTY_STRING);
  const b = isOf(sub, window.Array) ? sub.join(",") : (isNonEmptyString(sub) ? sub : EMPTY_STRING);
  return !s.length || !b.length ? null : {
    selector: s,
    nested: [{
      selector: b,
      properties: isOf(properties, window.Object) ? properties : CSSPropertiesParser.parse(properties)
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
  if (isOf(lr.nested, window.Array) && lr.selector === rule.selector) {
    rule.nested.forEach(n => {
      var found = false;
      for (const x in lr.nested) {
        if ((found = lr.nested[x].selector === n.selector)) {
          for (const p in n.properties) {
            lr.nested[x].properties[p] = n.properties[p];
          }
          break;
        }
      }
      if (!found) {
        lr.nested.push(n);
      }
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
    if (isOf(options, window.Object)) {
      if (isOf(options.onInvalidDefinition, window.Function)) {
        RuntimeErrors.onInvalidDefinition = options.onInvalidDefinition;
      }
      if (isOf(options.onInexistentTemplate, window.Function)) {
        RuntimeErrors.onInexistentTemplate = options.onInexistentTemplate;
      }
      if (isOf(options.onUnespecifiedSlot, window.Function)) {
        RuntimeErrors.onUnespecifiedSlot = options.onUnespecifiedSlot;
      }
      if (isOf(options.onInvalidId, window.Function)) {
        RuntimeErrors.onInvalidId = options.onInvalidId;
      }
    }
  }

}

