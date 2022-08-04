// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_ARRAY, buildArray, buildObject, isOf, hasObjectKeys, isNonEmptyString, forcedStringSplit } = JsHelpers;
import StringConstants from './wuse.string-constants.js';
const { DEFAULT_TAG, DEFAULT_KIND, TEMPLATES_KIND, SLOTS_KIND } = StringConstants;
import RuntimeErrors from './wuse.runtime-errors.js';

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
      return input.replace(ip, "");
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
    if (input !== "") {
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
          return this.#extractData(def, val.replace(def.kind = TEMPLATES_KIND, ""));
        } else if (val.startsWith(SLOTS_KIND)) {
          return this.#extractData(def, val.replace(def.kind = SLOTS_KIND, ""));
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
      isOf(content, window.Array) ? content : forcedStringSplit(content, "\n").map(x => x.trim()).join("").split(";")
    ).forEach(item => isNonEmptyString(item) && this.#process(result, item.trim())));
  }

}

// ROUTINES

const makeDefinition = () => ({
  kind: DEFAULT_KIND,
  // =
  tag: DEFAULT_TAG, id: "", classes: new window.Array(),
  attributes: new window.Object(), style: new window.Object(), events: new window.Array(),
  // =
  content: "", encode: false
});

const makeEvent = (kind, capture) => typeof kind === "string" && typeof capture === "boolean" ? { kind, capture } : null;

const makeChild = (shorthandNotation, rules) => {
  let result = ShorthandNotationParser.parse(shorthandNotation);
  if (!result) {
    return RuntimeErrors.INVALID_DEFINITION.emit(shorthandNotation);
  }
  result.rules = isOf(rules, window.Array) ? rules : new window.Array();
  result.rendering = true;
  result.cache = null;
  return result;
}

const doValidations = child => {
  if (child.kind === TEMPLATES_KIND) {
    if (!window.document.getElementById(child.id)) {
      return RuntimeErrors.INEXISTENT_TEMPLATE.emit(child.id);
    }
  } else if (child.kind === SLOTS_KIND) {
    if (new window.String(child.attributes["slot"]).replaceAll("\"", "").replaceAll("\'", "").length === 0) {
      return RuntimeErrors.UNESPECIFIED_SLOT.emit(child.id);
    }
  } else if (typeof child.id !== "string" || (child.id !== "" && window.document.getElementById(child.id) !== null)) {
    return RuntimeErrors.INVALID_ID.emit(child.id);
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
    var style = "";
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
  result.appendChild(window.document.createTextNode("")); // NOTE: check if this webkit hack is still required
  return result;
}

const makeRule = (selector, properties) => {
  const s = isOf(selector, window.Array) ? selector.join(",") : (isNonEmptyString(selector) ? selector : "");
  return !s.length ? null : {
    selector: s,
    properties: isOf(properties, window.Object) ? properties : CSSPropertiesParser.parse(properties),
    cache: null
  };
}

const makeNestedRule = (selector, sub, properties) => {
  const s = isOf(selector, window.Array) ? selector.join(",") : (isNonEmptyString(selector) ? selector : "");
  const b = isOf(sub, window.Array) ? sub.join(",") : (isNonEmptyString(sub) ? sub : "");
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

}

