(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };

  // src/wuse.runtime-errors.js
  var makeError = (code, writer) => ({ code, emit: (arg) => {
    const lvl = code < 80 ? "error" : "warn";
    const msg = `[WUSE:${lvl.toUpperCase()}] ${code} | ${writer(arg)}`;
    if (window.Wuse && window.Wuse.FATALS || code < 10) {
      throw new window.Error(msg);
    } else {
      window.console[lvl](msg);
    }
    return null;
  } });
  var RuntimeErrors = class {
    static get UNKNOWN_ERROR() {
      return makeError(0, (arg) => `Unknown error.`);
    }
    static get UNSUPPORTED_FEATURE() {
      return makeError(1, (arg) => `Unsupported feature: ${arg}.`);
    }
    static get UNREGISTERED_CLASS() {
      return makeError(2, (arg) => `Unregistered class: ${arg}.`);
    }
    static get UNREGISTRABLE_CLASS() {
      return makeError(3, (arg) => `Unregistrable class: ${arg}.`);
    }
    static get INVALID_CLASS() {
      return makeError(4, (arg) => `Invalid class: ${arg}.`);
    }
    static get MISNAMED_CLASS() {
      return makeError(5, (arg) => `Misnamed class: ${arg}.`);
    }
    static get INVALID_DEFINITION() {
      return makeError(10, (arg) => `Invalid definition: ${arg}.`);
    }
    static get INVALID_ID() {
      return makeError(11, (arg) => `Invalid id: ${arg}.`);
    }
    static get INVALID_KEY() {
      return makeError(12, (arg) => `Call first: this.setElementsStoreKey(<your-valid-key>).`);
    }
    static get ALLOW_HTML() {
      return makeError(13, (arg) => `Call first: this.allowRawContent(true).`);
    }
    static get INVALID_STATE() {
      return makeError(14, (arg) => `Invalid state.`);
    }
    static get TAKEN_ID() {
      return makeError(15, (arg) => `Taken id: ${arg}.`);
    }
    static get MISNAMED_FIELD() {
      return makeError(16, (arg) => `Misnamed field: ${arg}.`);
    }
    static get INEXISTENT_TEMPLATE() {
      return makeError(20, (arg) => `Inexistent template: #${arg}.`);
    }
    static get EXTINCT_TEMPLATE() {
      return makeError(21, (arg) => `Extinct template: #${arg}.`);
    }
    static get INVALID_TEMPLATE() {
      return makeError(22, (arg) => `Invalid template: #${arg}.`);
    }
    static get UNESPECIFIED_SLOT() {
      return makeError(30, (arg) => `Unespecified slot: #${arg}.`);
    }
    static get LOCKED_DEFINITION() {
      return makeError(40, (arg) => `Locked definition: #${arg}.`);
    }
    static get UNKNOWN_TAG() {
      return makeError(80, (arg) => `Unknown tag: ${arg}.`);
    }
    static get BAD_TARGET() {
      return makeError(81, (arg) => `Bad target: ${arg}.`);
    }
    static get ALREADY_REGISTERED() {
      return makeError(90, (arg) => `Already registered: ${arg}.`);
    }
  };

  // src/wuse.javascript-helpers.js
  var _EMPTY_STRING, _EMPTY_ARRAY;
  var instanceBuilder = (instance, initializer) => {
    if (typeof initializer === "function")
      initializer(instance);
    return instance;
  };
  var JavascriptHelpers = class {
    static get EMPTY_STRING() {
      return __privateGet(this, _EMPTY_STRING);
    }
    static get EMPTY_ARRAY() {
      return __privateGet(this, _EMPTY_ARRAY);
    }
    static noop() {
    }
    static isNonEmptyString(str) {
      return typeof str === "string" && !!str.length;
    }
    static forcedStringSplit(str, by) {
      return typeof str === "string" ? str.split(by) : new window.Array();
    }
    static buildArray(initializer) {
      return instanceBuilder(new window.Array(), initializer);
    }
    static buildObject(initializer) {
      return instanceBuilder(new window.Object(), initializer);
    }
    static ensureFunction(fun, def = () => {
    }) {
      return typeof fun === "function" ? fun : def;
    }
    static isOf(instance, c) {
      return !!(instance !== void 0 && instance !== null && (instance.constructor === c || c !== void 0 && c !== null && instance.constructor.name === c.name));
    }
    static areOf(instances, c) {
      var result = !!(instances && instances.constructor === window.Array && !!instances.length);
      if (result)
        for (var x in instances) {
          const instance = instances[x];
          if (!(instance !== void 0 && instance !== null && (instance.constructor === c || c !== void 0 && c !== null && instance.constructor.name === c.name))) {
            result = false;
            break;
          }
        }
      return result;
    }
    static hasObjectKeys(obj) {
      return !!(obj && !!window.Object.keys(obj).length);
    }
    static cloneObject(instance) {
      return window.Object.assign(new window.Object(), instance);
    }
    static forEachOwnProperty(instance, callback) {
      instance && window.Object.getOwnPropertyNames(instance).forEach(callback);
    }
    static isAssignedObject(instance) {
      return typeof instance === "object" && instance !== null;
    }
    static isAssignedArray(instance) {
      return typeof instance === "object" && instance !== null && instance.constructor.name === "Array";
    }
    static isNonEmptyArray(instance) {
      return typeof instance === "object" && instance !== null && instance.constructor.name === "Array" && !!instance.length;
    }
    static isIntegerNumber(x) {
      return (typeof x === "number" || typeof x === "string" && !!x.length) && window.Number.isInteger(window.Number(x));
    }
  };
  _EMPTY_STRING = new WeakMap();
  _EMPTY_ARRAY = new WeakMap();
  __privateAdd(JavascriptHelpers, _EMPTY_STRING, new window.String().valueOf());
  __privateAdd(JavascriptHelpers, _EMPTY_ARRAY, window.Object.freeze(new window.Array()));

  // src/wuse.template-importer.js
  var _onExtinctTemplate, _onInvalidTemplate;
  var { noop, ensureFunction, isAssignedObject } = JavascriptHelpers;
  var TemplateImporter = class {
    static fetch(id) {
      const template = window.document.getElementById(id);
      if (template === null) {
        return __privateGet(this, _onExtinctTemplate).call(this, id);
      } else if (template.tagName !== "TEMPLATE") {
        return __privateGet(this, _onInvalidTemplate).call(this, id);
      } else {
        return template.innerHTML;
      }
    }
    static initialize(events) {
      if (isAssignedObject(events)) {
        __privateSet(this, _onExtinctTemplate, ensureFunction(events.onExtinctTemplate, __privateGet(this, _onExtinctTemplate)));
        __privateSet(this, _onInvalidTemplate, ensureFunction(events.onInvalidTemplate, __privateGet(this, _onInvalidTemplate)));
      }
    }
  };
  _onExtinctTemplate = new WeakMap();
  _onInvalidTemplate = new WeakMap();
  __privateAdd(TemplateImporter, _onExtinctTemplate, noop);
  __privateAdd(TemplateImporter, _onInvalidTemplate, noop);

  // src/wuse.element-classes.js
  var _onBadTarget, _onDeferredInstantiation, _onMisnamedClass, _onInvalidClass, _onUnregistrableClass, _onUnregisteredClass, _onAlreadyRegistered, _registrationPerformer, registrationPerformer_fn, _registrationIntender, registrationIntender_fn, _classRegistrar, classRegistrar_fn, _immediateClassInstantiator, immediateClassInstantiator_fn, _instantiateClass, instantiateClass_fn;
  var { noop: noop2, ensureFunction: ensureFunction2, isAssignedObject: isAssignedObject2, isAssignedArray, isNonEmptyArray, isOf, forEachOwnProperty } = JavascriptHelpers;
  var convertClassNameToKebabCaseTag = (name) => name.toLowerCase().replaceAll("_", "-");
  var ElementClasses = class {
    static registerClasses(classes) {
      if (isNonEmptyArray(classes))
        window.Array.prototype.forEach.call(classes, (item) => typeof item === "function" ? __privateMethod(this, _classRegistrar, classRegistrar_fn).call(this, item) : __privateGet(this, _onInvalidClass).call(this, item));
    }
    static instantiateClasses(classes, target, events, parameters) {
      if (isNonEmptyArray(classes))
        window.Array.prototype.forEach.call(classes, (klass) => __privateMethod(this, _instantiateClass, instantiateClass_fn).call(this, klass, isAssignedObject2(target) ? target : target instanceof window.HTMLElement ? { node: target } : { selector: target }, isAssignedObject2(events) ? events : new window.Object(), parameters));
    }
    static createInstance(element, target, instance) {
      if (isAssignedObject2(element) && isOf(element.type, window.Function)) {
        if (element.register === true)
          __privateMethod(this, _classRegistrar, classRegistrar_fn).call(this, element.type);
        target = isAssignedObject2(target) ? target : new window.Object();
        instance = isAssignedObject2(instance) ? instance : new window.Object();
        return __privateMethod(this, _instantiateClass, instantiateClass_fn).call(this, element.type, target, {
          on_bad_target: target.on_bad_target,
          on_element_instantiated: instance.on_element_instantiated
        }, instance.parameters);
      }
      return void 0;
    }
    static initialize(events) {
      if (isAssignedObject2(events)) {
        __privateSet(this, _onBadTarget, ensureFunction2(events.onBadTarget, __privateGet(this, _onBadTarget)));
        __privateSet(this, _onDeferredInstantiation, ensureFunction2(events.onDeferredInstantiation, __privateGet(this, _onDeferredInstantiation)));
        __privateSet(this, _onInvalidClass, ensureFunction2(events.onInvalidClass, __privateGet(this, _onInvalidClass)));
        __privateSet(this, _onMisnamedClass, ensureFunction2(events.onMisnamedClass, __privateGet(this, _onMisnamedClass)));
        __privateSet(this, _onUnregistrableClass, ensureFunction2(events.onUnregistrableClass, __privateGet(this, _onUnregistrableClass)));
        __privateSet(this, _onUnregisteredClass, ensureFunction2(events.onUnregisteredClass, __privateGet(this, _onUnregisteredClass)));
        __privateSet(this, _onAlreadyRegistered, ensureFunction2(events.onAlreadyRegistered, __privateGet(this, _onAlreadyRegistered)));
      }
    }
  };
  _onBadTarget = new WeakMap();
  _onDeferredInstantiation = new WeakMap();
  _onMisnamedClass = new WeakMap();
  _onInvalidClass = new WeakMap();
  _onUnregistrableClass = new WeakMap();
  _onUnregisteredClass = new WeakMap();
  _onAlreadyRegistered = new WeakMap();
  _registrationPerformer = new WeakSet();
  registrationPerformer_fn = function(klass) {
    window.HTMLElement.isPrototypeOf(klass) ? window.customElements.define(klass.tag, klass) : __privateGet(this, _onUnregistrableClass).call(this, klass.name);
  };
  _registrationIntender = new WeakSet();
  registrationIntender_fn = function(klass) {
    window.customElements.get(klass.tag = convertClassNameToKebabCaseTag(klass.name)) ? __privateGet(this, _onAlreadyRegistered).call(this, klass.name) : __privateMethod(this, _registrationPerformer, registrationPerformer_fn).call(this, klass);
  };
  _classRegistrar = new WeakSet();
  classRegistrar_fn = function(klass) {
    klass.name.indexOf("_") > 0 ? __privateMethod(this, _registrationIntender, registrationIntender_fn).call(this, klass) : __privateGet(this, _onMisnamedClass).call(this, klass.name);
  };
  _immediateClassInstantiator = new WeakSet();
  immediateClassInstantiator_fn = function(klass, target, events, parameters) {
    let selector = target.selector;
    let parent = target.node;
    if (parent instanceof window.HTMLElement === false)
      try {
        parent = window.document.querySelector(selector);
      } catch (e) {
        if (!isOf(events.on_bad_target, window.Function)) {
          __privateGet(this, _onBadTarget).call(this, selector);
          return;
        } else if (events.on_bad_target(selector) === false)
          return;
      } finally {
        parent = parent || window.document.body;
      }
    const element = window.document.createElement(klass.tag);
    element.parameters = parameters;
    ensureFunction2(events.on_element_instantiated)(element, selector);
    parent.appendChild(element);
    return element;
  };
  _instantiateClass = new WeakSet();
  instantiateClass_fn = function(klass, target, events, parameters) {
    const instantiator = () => __privateMethod(this, _immediateClassInstantiator, immediateClassInstantiator_fn).call(this, klass, target, events, parameters);
    return window.customElements.get(klass.tag) ? window.document.body ? instantiator() : __privateGet(this, _onDeferredInstantiation).call(this, instantiator) : __privateGet(this, _onUnregisteredClass).call(this, klass.name);
  };
  __privateAdd(ElementClasses, _registrationPerformer);
  __privateAdd(ElementClasses, _registrationIntender);
  __privateAdd(ElementClasses, _classRegistrar);
  __privateAdd(ElementClasses, _immediateClassInstantiator);
  __privateAdd(ElementClasses, _instantiateClass);
  __privateAdd(ElementClasses, _onBadTarget, noop2);
  __privateAdd(ElementClasses, _onDeferredInstantiation, noop2);
  __privateAdd(ElementClasses, _onMisnamedClass, noop2);
  __privateAdd(ElementClasses, _onInvalidClass, noop2);
  __privateAdd(ElementClasses, _onUnregistrableClass, noop2);
  __privateAdd(ElementClasses, _onUnregisteredClass, noop2);
  __privateAdd(ElementClasses, _onAlreadyRegistered, noop2);

  // src/wuse.string-hashing.js
  var StringHashing = class {
    static defaultRoutine(str = "") {
      var h = 0;
      for (let idx = 0; idx < str.length; idx++) {
        h = (h = (h << 5) - h + str.charCodeAt(idx)) & h;
      }
      return h;
    }
  };

  // src/wuse.web-helpers.js
  var hash = StringHashing.defaultRoutine;
  var HTML_TAGS = [
    "a",
    "abbr",
    "acronym",
    "address",
    "applet",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "basefont",
    "bdi",
    "bdo",
    "bgsound",
    "big",
    "blink",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "center",
    "cite",
    "code",
    "content",
    "col",
    "colgroup",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "dir",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "font",
    "footer",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "listing",
    "main",
    "map",
    "marquee",
    "mark",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "multicol",
    "nav",
    "nextid",
    "nobr",
    "noembed",
    "noframes",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "plaintext",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "shadow",
    "select",
    "slot",
    "small",
    "source",
    "spacer",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "sup",
    "summary",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "tt",
    "u",
    "ul",
    "var",
    "video",
    "xmp",
    "wbr"
  ].map(hash);
  var HTML_ATTRIBUTES = [
    "accept",
    "accept-charset",
    "accesskey",
    "action",
    "align",
    "allow",
    "alt",
    "async",
    "autocapitalize",
    "autocomplete",
    "autofocus",
    "autoplay",
    "buffered",
    "capture",
    "challenge",
    "charset",
    "checked",
    "cite",
    "class",
    "code",
    "codebase",
    "cols",
    "colspan",
    "content",
    "contenteditable",
    "contextmenu",
    "controls",
    "coords",
    "crossorigin",
    "csp",
    "data",
    "datetime",
    "decoding",
    "default",
    "defer",
    "dir",
    "dirname",
    "disabled",
    "download",
    "draggable",
    "enctype",
    "enterkeyhint",
    "for",
    "form",
    "formaction",
    "formenctype",
    "formmethod",
    "formnovalidate",
    "formtarget",
    "headers",
    "hidden",
    "high",
    "href",
    "hreflang",
    "http-equiv",
    "icon",
    "id",
    "importance",
    "integrity",
    "ismap",
    "itemprop",
    "keytype",
    "kind",
    "label",
    "lang",
    "language",
    "list",
    "loop",
    "low",
    "manifest",
    "max",
    "maxlength",
    "minlength",
    "media",
    "method",
    "min",
    "multiple",
    "muted",
    "name",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "ping",
    "placeholder",
    "poster",
    "preload",
    "radiogroup",
    "readonly",
    "referrerpolicy",
    "rel",
    "required",
    "reversed",
    "role",
    "rows",
    "rowspan",
    "sandbox",
    "scope",
    "scoped",
    "selected",
    "shape",
    "size",
    "sizes",
    "slot",
    "span",
    "spellcheck",
    "src",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "style",
    "summary",
    "tabindex",
    "target",
    "title",
    "translate",
    "type",
    "usemap",
    "value",
    "width",
    "wrap"
  ].map(hash);
  var WebHelpers = class {
    static onDOMContentLoaded(callback) {
      if (callback && callback.constructor === window.Function) {
        const loader = () => {
          callback();
          setTimeout(() => window.removeEventListener("DOMContentLoaded", loader), 100);
        };
        window.addEventListener("DOMContentLoaded", loader);
      }
    }
    static getUniqueId(prefix = "WUSE") {
      const pfx = "_" + (prefix ? prefix : "") + "_";
      var result;
      while (window.document.getElementById(result = pfx + ("" + window.Math.random()).substring(2)) !== null)
        ;
      return result;
    }
    static removeChildren(element) {
      if (element)
        while (element.firstChild)
          element.removeChild(element.firstChild);
    }
    static isHTMLTag(tag) {
      return typeof tag === "string" && HTML_TAGS.indexOf(hash(tag)) > -1;
    }
    static isHTMLAttribute(attribute) {
      return typeof attribute === "string" && HTML_ATTRIBUTES.indexOf(hash(attribute)) > -1;
    }
    static htmlEncode(text = "") {
      return typeof text !== "string" ? null : text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    static getCSSVendorPrefix() {
      const bodyComputedStyle = window.getComputedStyle(window.document.body, "");
      const csPropertyNames = window.Array.prototype.slice.call(bodyComputedStyle);
      const cspnDashPrefixed = csPropertyNames.filter((x) => x.charAt(0) === "-");
      return !!cspnDashPrefixed.length ? "-" + cspnDashPrefixed[0].split("-")[1] + "-" : "";
    }
  };

  // src/wuse.string-constants.js
  var StringConstants = class {
    static get TEMPLATES_KIND() {
      return "%templates%";
    }
    static get SLOTS_KIND() {
      return "%slots%";
    }
    static get TEXTNODE_TAG() {
      return "^text^";
    }
    static get DEFAULT_KIND() {
      return "";
    }
    static get DEFAULT_TAG() {
      return "div";
    }
    static get DEFAULT_STYLE_MEDIA() {
      return "screen";
    }
    static get DEFAULT_STYLE_TYPE() {
      return "text/css";
    }
    static get DEFAULT_REPLACEMENT_OPEN() {
      return "~{";
    }
    static get DEFAULT_REPLACEMENT_CLOSE() {
      return "}~";
    }
    static get WUSEKEY_ATTRIBUTE() {
      return "data-wusekey";
    }
    static get WUSENODE_ATTRIBUTE() {
      return "data-wusenode";
    }
  };

  // src/wuse.reactive-field.js
  var { noop: noop3, isOf: isOf2, isNonEmptyString } = JavascriptHelpers;
  var isNotFunction = (x) => !isOf2(x, window.Function);
  var setReactiveField = (name, value, handler, renderizer, redefiner, recreator, dereactor, remover) => redefiner(() => value, (v) => {
    recreator(v, handler);
    isNotFunction(handler) ? renderizer(name) : handler({
      renderize: (label) => renderizer(name, label),
      automate: () => recreator(v, null),
      dereact: () => redefiner(() => v, dereactor),
      remove: () => remover(name)
    });
  });
  var makeReactiveField = (owner, name, value, handler, renderizer, dropper) => {
    const redefiner = (get, set) => {
      window.Object.defineProperty(owner, name, {
        get,
        set,
        enumerable: true,
        configurable: true
      });
    };
    const remover = isNotFunction(dropper) ? (field) => delete owner[field] : dropper;
    const dereactor = (v) => {
      remover(name);
      owner[name] = v;
    };
    const recreator = (v, maneuverer) => setReactiveField(name, v, maneuverer, renderizer, redefiner, recreator, dereactor, remover);
    return recreator(value, handler);
  };
  var ReactiveField = class {
    static createReactiveField(owner, name, value, handler, renderizer, dropper) {
      return owner && isNonEmptyString(name) && isOf2(renderizer, window.Function) ? makeReactiveField(owner, name, value, handler, renderizer, dropper) : null;
    }
  };

  // src/wuse.text-replacements.js
  var _regExp, _addReplacement, _includeMatches, _includeStringMatches, _includeKeysMatches;
  var { EMPTY_ARRAY, buildArray, buildObject, isNonEmptyString: isNonEmptyString2, isAssignedArray: isAssignedArray2 } = JavascriptHelpers;
  var _ReplacementMarkers = class {
    static initialize(begin, end) {
      this.begin = begin;
      this.end = end;
    }
  };
  var ReplacementMarkers = _ReplacementMarkers;
  __publicField(ReplacementMarkers, "begin", null);
  __publicField(ReplacementMarkers, "end", null);
  __publicField(ReplacementMarkers, "enclose", (match) => _ReplacementMarkers.begin + match + _ReplacementMarkers.end);
  __publicField(ReplacementMarkers, "makeRegExp", () => new window.RegExp(`(?<=${_ReplacementMarkers.begin}).*?(?=${_ReplacementMarkers.end})`, "gs"));
  var REPLACEMENT_PLACES = ["contents", "classes", "styles", "attributes"];
  var ReplacementsScanners = class {
  };
  __publicField(ReplacementsScanners, "rules", (rules, name) => buildArray((hits) => rules.forEach((rule) => rule.replacements.forEach((x) => x.field === name && hits.push(rule)))));
  __publicField(ReplacementsScanners, "children", (children, name) => buildArray((hits) => {
    const processAll = (child) => {
      const process = (collection) => collection.forEach((x) => x.field === name && hits.push(child));
      REPLACEMENT_PLACES.forEach((key) => process(child.replacements[key]));
      child.rules.forEach((rule) => rule.replacements.forEach((x) => x.field === name && hits.push(child)));
    };
    children.forEach((child) => child.included && processAll(child));
  }));
  var _ReplacementsExtractors = class {
    static initialize(regExp) {
      __privateSet(this, _regExp, regExp);
    }
  };
  var ReplacementsExtractors = _ReplacementsExtractors;
  _regExp = new WeakMap();
  _addReplacement = new WeakMap();
  _includeMatches = new WeakMap();
  _includeStringMatches = new WeakMap();
  _includeKeysMatches = new WeakMap();
  __privateAdd(ReplacementsExtractors, _regExp, null);
  __privateAdd(ReplacementsExtractors, _addReplacement, (hits, at, match) => hits.push({
    at,
    field: match.trim(),
    find: ReplacementMarkers.enclose(match)
  }));
  __privateAdd(ReplacementsExtractors, _includeMatches, (hits, at, str) => isNonEmptyString2(str) && (str.match(__privateGet(_ReplacementsExtractors, _regExp)) || EMPTY_ARRAY).forEach((match) => {
    var _a3;
    return __privateGet(_a3 = _ReplacementsExtractors, _addReplacement).call(_a3, hits, at, match);
  }));
  __privateAdd(ReplacementsExtractors, _includeStringMatches, (result, key, value) => {
    var _a3;
    result[key] = new window.Array();
    __privateGet(_a3 = _ReplacementsExtractors, _includeMatches).call(_a3, result[key], key, value);
  });
  __privateAdd(ReplacementsExtractors, _includeKeysMatches, (result, key, obj) => {
    result[key] = new window.Array();
    window.Object.keys(obj).forEach((k) => {
      var _a3, _b2;
      __privateGet(_a3 = _ReplacementsExtractors, _includeMatches).call(_a3, result[key], key, k);
      __privateGet(_b2 = _ReplacementsExtractors, _includeMatches).call(_b2, result[key], key, obj[k]);
    });
  });
  __publicField(ReplacementsExtractors, "child", (child) => buildObject((result) => {
    var _a3, _b2, _c2, _d;
    __privateGet(_a3 = _ReplacementsExtractors, _includeStringMatches).call(_a3, result, "contents", child.content);
    __privateGet(_b2 = _ReplacementsExtractors, _includeStringMatches).call(_b2, result, "classes", child.classes.join(" "));
    __privateGet(_c2 = _ReplacementsExtractors, _includeKeysMatches).call(_c2, result, "styles", child.style);
    __privateGet(_d = _ReplacementsExtractors, _includeKeysMatches).call(_d, result, "attributes", child.attributes);
    child.rules.forEach((r) => r.replacements = _ReplacementsExtractors.rule(r));
  }));
  __publicField(ReplacementsExtractors, "rule", (rule) => buildArray((result) => {
    var _a3;
    if (isAssignedArray2(rule.nested)) {
      return rule.nested.map((r) => _ReplacementsExtractors.rule(r));
    }
    var c = "";
    for (const property in rule.properties) {
      c += `${property}:${rule.properties[property]};`;
    }
    __privateGet(_a3 = _ReplacementsExtractors, _includeMatches).call(_a3, result, "rules", c);
  }));
  var TextReplacements = class {
    static initialize(openMarker, closeMarker) {
      ReplacementMarkers.initialize(openMarker, closeMarker);
      ReplacementsExtractors.initialize(ReplacementMarkers.makeRegExp());
    }
  };
  __publicField(TextReplacements, "extractReplacementsFromRule", ReplacementsExtractors.rule);
  __publicField(TextReplacements, "extractReplacementsFromChild", ReplacementsExtractors.child);
  __publicField(TextReplacements, "scanRulesForReplacements", ReplacementsScanners.rules);
  __publicField(TextReplacements, "scanChildrenForReplacements", ReplacementsScanners.children);

  // src/wuse.rendering-routines.js
  var _onFetchTemplate;
  var { noop: noop4, isAssignedArray: isAssignedArray3, hasObjectKeys, isNonEmptyString: isNonEmptyString3, isNonEmptyArray: isNonEmptyArray2, isAssignedObject: isAssignedObject3, ensureFunction: ensureFunction3 } = JavascriptHelpers;
  var { htmlEncode } = WebHelpers;
  var { SLOTS_KIND, TEMPLATES_KIND, TEXTNODE_TAG } = StringConstants;
  var _RenderingRoutines = class {
    static initialize(events) {
      if (isAssignedObject3(events)) {
        __privateSet(this, _onFetchTemplate, ensureFunction3(events.onFetchTemplate, __privateGet(this, _onFetchTemplate)));
      }
    }
  };
  var RenderingRoutines = _RenderingRoutines;
  _onFetchTemplate = new WeakMap();
  __privateAdd(RenderingRoutines, _onFetchTemplate, noop4);
  __publicField(RenderingRoutines, "cacheInvalidator", (item) => item.cache = null);
  __publicField(RenderingRoutines, "slotsInvalidator", (item) => item.kind === SLOTS_KIND ? _RenderingRoutines.cacheInvalidator(item) : void 0);
  __publicField(RenderingRoutines, "renderingIncluder", (item) => item.included = true);
  __publicField(RenderingRoutines, "renderingExcluder", (item) => item.included = false);
  __publicField(RenderingRoutines, "renderRule", (replacer, rule) => {
    if (isAssignedArray3(rule.nested)) {
      return `${rule.selector}{${rule.nested.map((r) => _RenderingRoutines.renderRule(replacer, r)).join("\n")}}`;
    } else if (isNonEmptyString3(rule.selector) && !rule.nested) {
      var c = new window.String();
      for (const property in rule.properties) {
        c += `${property}:${rule.properties[property]};`;
      }
      if (isNonEmptyArray2(rule.replacements)) {
        rule.replacements.forEach((r) => c = replacer(c, r));
      }
      return `${rule.selector}{${c}}`;
    }
    return null;
  });
  __publicField(RenderingRoutines, "renderChild", (replacer, child) => {
    var _a3;
    if (child.kind === TEMPLATES_KIND) {
      return __privateGet(_a3 = _RenderingRoutines, _onFetchTemplate).call(_a3, child.id);
    }
    if (child.tag === TEXTNODE_TAG) {
      var c = child.content;
      child.replacements["contents"].forEach((r) => c = replacer(c, r));
      return child.encode ? htmlEncode(c) : c;
    }
    var result = isNonEmptyString3(child.id) ? `<${child.tag} id='${child.id}'` : `<${child.tag}`;
    if (!!child.classes.length) {
      var c = child.classes.join(" ");
      child.replacements["classes"].forEach((r) => c = replacer(c, r));
      result += ` class='${c}'`;
    }
    if (hasObjectKeys(child.style)) {
      var c = " style='";
      for (const property in child.style) {
        c += `${property}: ${child.style[property]}; `;
      }
      c += "'";
      child.replacements["styles"].forEach((r) => c = replacer(c, r));
      result += c;
    }
    if (hasObjectKeys(child.attributes)) {
      var c = new window.String();
      for (const property in child.attributes) {
        c += ` ${property}=${child.attributes[property]}`;
      }
      child.replacements["attributes"].forEach((r) => c = replacer(c, r));
      result += c;
    }
    if (typeof child.content === "string") {
      var c = child.content;
      child.replacements["contents"].forEach((r) => c = replacer(c, r));
      result += `>${child.encode ? htmlEncode(c) : c}</${child.tag}>`;
    } else {
      result += "/>";
    }
    return result;
  });

  // src/wuse.equality-analyzer.js
  var _last, _current, _equal, _analyzer;
  var { ensureFunction: ensureFunction4 } = JavascriptHelpers;
  var EqualityAnalyzer = class {
    constructor(analyzer) {
      __publicField(this, "rounds", 0);
      __privateAdd(this, _last, 0);
      __privateAdd(this, _current, null);
      __privateAdd(this, _equal, false);
      __privateAdd(this, _analyzer, null);
      __privateSet(this, _analyzer, ensureFunction4(analyzer));
    }
    compute(value) {
      this.rounds += +__privateSet(this, _equal, __privateGet(this, _last) == __privateSet(this, _current, __privateGet(this, _analyzer).call(this, value)));
      __privateSet(this, _last, __privateGet(this, _current));
      return __privateGet(this, _equal);
    }
  };
  _last = new WeakMap();
  _current = new WeakMap();
  _equal = new WeakMap();
  _analyzer = new WeakMap();

  // src/wuse.state-manager.js
  var _key, _keyed, _maker, _reader, _writer, _state, _store, _filiated, _persistState, persistState_fn;
  var { ensureFunction: ensureFunction5, isNonEmptyString: isNonEmptyString4, isAssignedObject: isAssignedObject4 } = JavascriptHelpers;
  var StateManager = class {
    constructor(maker, reader, writer, store = {}) {
      __privateAdd(this, _persistState);
      __privateAdd(this, _key, new window.String());
      __privateAdd(this, _keyed, false);
      __privateAdd(this, _maker, null);
      __privateAdd(this, _reader, null);
      __privateAdd(this, _writer, null);
      __privateAdd(this, _state, null);
      __privateAdd(this, _store, null);
      __privateAdd(this, _filiated, new class extends window.Set {
        name(parentKey, id) {
          let key = `${parentKey}_${id}`;
          var x = 0;
          while (this.has(key))
            key = `${parentKey}_${id}_${++x}`;
          this.add(key);
          return key;
        }
      }());
      __privateSet(this, _maker, ensureFunction5(maker));
      __privateSet(this, _reader, ensureFunction5(reader));
      __privateSet(this, _writer, ensureFunction5(writer));
      __privateSet(this, _store, store);
    }
    getStore() {
      return __privateGet(this, _store);
    }
    setStore(store) {
      __privateSet(this, _store, store);
    }
    get state() {
      return __privateGet(this, _state);
    }
    get key() {
      return __privateGet(this, _key);
    }
    set key(key) {
      return __privateSet(this, _keyed, isNonEmptyString4(__privateSet(this, _key, key)));
    }
    hasKey() {
      return __privateGet(this, _keyed);
    }
    validateKey() {
      if (!__privateGet(this, _keyed)) {
        this.on_invalid_key();
        return false;
      }
      return true;
    }
    nameFiliatedKey(id) {
      return __privateGet(this, _filiated).name(__privateGet(this, _key), id);
    }
    rememberFiliatedKey(key) {
      __privateGet(this, _filiated).add(key);
    }
    hasFiliatedKey(key) {
      return __privateGet(this, _filiated).has(key);
    }
    initializeState() {
      __privateGet(this, _filiated).clear();
      if (__privateGet(this, _keyed)) {
        const state = __privateGet(this, _store).hasItem(this.key) ? __privateGet(this, _store).getItem(this.key) : __privateGet(this, _maker).call(this);
        if (isAssignedObject4(state)) {
          __privateSet(this, _state, state);
          __privateGet(this, _state).generation++;
          __privateMethod(this, _persistState, persistState_fn).call(this);
        } else {
          this.on_invalid_state();
          return -1;
        }
      } else {
        __privateSet(this, _state, __privateGet(this, _maker).call(this));
        __privateGet(this, _state).generation++;
      }
      return __privateGet(this, _state).generation;
    }
    writeState() {
      const state = __privateGet(this, _state);
      if (isAssignedObject4(state)) {
        state.data = __privateGet(this, _writer).call(this);
        __privateMethod(this, _persistState, persistState_fn).call(this);
        return true;
      }
      return false;
    }
    readState() {
      const state = __privateGet(this, _state);
      if (isAssignedObject4(state) && state.persisted) {
        __privateGet(this, _reader).call(this, state.data);
        return true;
      }
      return false;
    }
    eraseState() {
      const state = __privateGet(this, _state);
      if (isAssignedObject4(state) && state.persisted && state.data) {
        delete state.data;
        __privateMethod(this, _persistState, persistState_fn).call(this);
        return true;
      }
      return false;
    }
    on_invalid_state() {
    }
    on_invalid_key() {
    }
  };
  _key = new WeakMap();
  _keyed = new WeakMap();
  _maker = new WeakMap();
  _reader = new WeakMap();
  _writer = new WeakMap();
  _state = new WeakMap();
  _store = new WeakMap();
  _filiated = new WeakMap();
  _persistState = new WeakSet();
  persistState_fn = function() {
    if (__privateGet(this, _keyed)) {
      __privateGet(this, _state).persisted = !!__privateGet(this, _state).data;
      __privateGet(this, _store).setItem(__privateGet(this, _key), __privateGet(this, _state));
    }
  };

  // src/wuse.node-manager.js
  var _parent, _actual, _clone, _drop, drop_fn, _roll, roll_fn;
  var { WUSENODE_ATTRIBUTE } = StringConstants;
  var NodeManager = class {
    constructor(parent, original) {
      __privateAdd(this, _drop);
      __privateAdd(this, _roll);
      __privateAdd(this, _parent, null);
      __privateAdd(this, _actual, null);
      __privateAdd(this, _clone, null);
      if (parent instanceof window.Node && original instanceof window.Node) {
        __privateSet(this, _parent, parent);
        this.element = original;
      } else
        throw new Error("[WUSE:ERROR] Wrong arguments supplied.");
    }
    set element(original) {
      __privateMethod(this, _drop, drop_fn).call(this, original.getAttribute(WUSENODE_ATTRIBUTE));
      __privateSet(this, _actual, original);
      __privateSet(this, _clone, original.cloneNode(false));
    }
    get element() {
      return __privateGet(this, _actual);
    }
    affiliate() {
      __privateGet(this, _parent).appendChild(__privateGet(this, _actual));
    }
    disaffiliate() {
      __privateGet(this, _parent).removeChild(__privateGet(this, _actual));
    }
    promote(content) {
      __privateGet(this, _clone).innerHTML = content;
      __privateGet(this, _parent).replaceChild(__privateGet(this, _clone), __privateGet(this, _actual));
      __privateMethod(this, _roll, roll_fn).call(this);
    }
  };
  _parent = new WeakMap();
  _actual = new WeakMap();
  _clone = new WeakMap();
  _drop = new WeakSet();
  drop_fn = function(type) {
    const old = __privateGet(this, _parent).querySelector(`[${WUSENODE_ATTRIBUTE}='${type}']`);
    if (old)
      __privateGet(this, _parent).removeChild(old);
  };
  _roll = new WeakSet();
  roll_fn = function() {
    const tmp = __privateGet(this, _clone);
    __privateSet(this, _clone, __privateGet(this, _actual).cloneNode(false));
    __privateSet(this, _actual, tmp);
  };

  // src/wuse.content-manager.js
  var _invalidated, _content;
  var { isOf: isOf3 } = JavascriptHelpers;
  var ContentManager = class {
    constructor(promoter, verifier) {
      __privateAdd(this, _invalidated, false);
      __privateAdd(this, _content, "");
      if (isOf3(promoter, window.Function))
        this.on_content_invalidation = promoter;
      if (isOf3(verifier, window.Function))
        this.on_content_verification = verifier;
    }
    get invalidated() {
      return __privateGet(this, _invalidated);
    }
    reset(content) {
      __privateSet(this, _invalidated, false);
      __privateSet(this, _content, content);
    }
    append(more) {
      __privateSet(this, _content, __privateGet(this, _content) + more);
    }
    verify() {
      __privateSet(this, _invalidated, this.on_content_verification(__privateGet(this, _content)));
    }
    process(force) {
      if (force || __privateGet(this, _invalidated))
        this.on_content_invalidation(__privateGet(this, _content));
    }
    on_content_verification(content) {
    }
    on_content_invalidation(content) {
    }
  };
  _invalidated = new WeakMap();
  _content = new WeakMap();

  // src/wuse.parts-holder.js
  var _roll2, roll_fn2;
  var { isIntegerNumber, isAssignedObject: isAssignedObject5, cloneObject, forEachOwnProperty: forEachOwnProperty2, buildArray: buildArray2 } = JavascriptHelpers;
  var partsLooper = (holder, partCallback, metaCallback) => forEachOwnProperty2(holder, (key) => {
    switch (key) {
      case "owner":
      case "last":
      case "length":
        break;
      case "version":
      case "locked":
        metaCallback(key);
        break;
      default:
        if (isIntegerNumber(key))
          partCallback(key);
    }
  });
  var partProcessor = (collection, part, event) => {
    event(part);
    const item = cloneObject(part);
    item.cache = null;
    collection.push(item);
  };
  var PartsHolder = class extends window.Array {
    constructor(owner) {
      super();
      __privateAdd(this, _roll2);
      __publicField(this, "owner", null);
      __publicField(this, "last", null);
      __publicField(this, "version", 0);
      __publicField(this, "locked", false);
      this.owner = owner;
    }
    prepare() {
      if (this.locked) {
        this.on_forbidden_change();
        return false;
      }
      return true;
    }
    append(item) {
      if (this.prepare() && isAssignedObject5(item)) {
        this.push(item);
        __privateMethod(this, _roll2, roll_fn2).call(this, item);
      }
    }
    prepend(item) {
      if (this.prepare() && isAssignedObject5(item)) {
        this.unshift(item);
        __privateMethod(this, _roll2, roll_fn2).call(this, item);
      }
    }
    replace(index, item) {
      if (this.prepare() && index > -1 && isAssignedObject5(item)) {
        __privateMethod(this, _roll2, roll_fn2).call(this, this[index] = item);
      }
    }
    remove(index) {
      if (this.prepare() && index > -1) {
        const a = this.splice(index, 1);
        __privateMethod(this, _roll2, roll_fn2).call(this, !!a.length ? a[0] : null);
      }
    }
    clear() {
      if (this.prepare()) {
        this.length = 0;
        __privateMethod(this, _roll2, roll_fn2).call(this, null);
      }
    }
    persist() {
      return buildArray2((result) => partsLooper(this, (key) => partProcessor(result, this[key], this.on_snapshot_part), (key) => result[key] = this[key]));
    }
    restore(owner, instance) {
      this.owner = owner;
      partsLooper(instance, (key) => partProcessor(this, instance[key], this.on_recall_part), (key) => this[key] = instance[key]);
    }
    getIndexOf(field, value) {
      for (let idx = 0; idx < this.length; idx++) {
        if (this[idx][field] === value)
          return idx;
      }
      return -1;
    }
    on_snapshot_part() {
    }
    on_recall_part() {
    }
    on_version_change() {
    }
    on_forbidden_change() {
    }
  };
  _roll2 = new WeakSet();
  roll_fn2 = function(item) {
    this.last = item;
    this.version++;
    this.on_version_change();
  };

  // src/wuse.element-parts.js
  var _extractAttributes, extractAttributes_fn, _extractContent, extractContent_fn, _extractEvents, extractEvents_fn, _extractClasses, extractClasses_fn, _extractIdAndTag, extractIdAndTag_fn, _extractData, extractData_fn, _process, process_fn;
  var { isHTMLTag } = WebHelpers;
  var { EMPTY_STRING, EMPTY_ARRAY: EMPTY_ARRAY2, noop: noop5, buildArray: buildArray3, buildObject: buildObject2, isAssignedObject: isAssignedObject6, isAssignedArray: isAssignedArray4, ensureFunction: ensureFunction6, hasObjectKeys: hasObjectKeys2, isNonEmptyString: isNonEmptyString5, forcedStringSplit } = JavascriptHelpers;
  var { WUSENODE_ATTRIBUTE: WUSENODE_ATTRIBUTE2, DEFAULT_TAG, DEFAULT_KIND, TEMPLATES_KIND: TEMPLATES_KIND2, SLOTS_KIND: SLOTS_KIND2, TEXTNODE_TAG: TEXTNODE_TAG2 } = StringConstants;
  var hash2 = StringHashing.defaultRoutine;
  var RuntimeErrors2 = {
    onInvalidDefinition: noop5,
    onInexistentTemplate: noop5,
    onUnespecifiedSlot: noop5,
    onInvalidId: noop5,
    onUnknownTag: noop5
  };
  var isCustomTag = (tag) => tag.indexOf("-") > 0 && !isHTMLTag(tag);
  var ShorthandNotationParser = class {
    static parse(value) {
      if (isNonEmptyString5(value)) {
        let val = value.trimLeft();
        let def = makeDefinition();
        if (val.charAt(0) === "%") {
          if (val.startsWith(TEMPLATES_KIND2)) {
            return __privateMethod(this, _extractData, extractData_fn).call(this, def, val.replace(def.kind = TEMPLATES_KIND2, EMPTY_STRING));
          } else if (val.startsWith(SLOTS_KIND2)) {
            return __privateMethod(this, _extractData, extractData_fn).call(this, def, val.replace(def.kind = SLOTS_KIND2, EMPTY_STRING));
          } else {
            return null;
          }
        } else {
          return __privateMethod(this, _extractData, extractData_fn).call(this, def, val);
        }
      }
      return null;
    }
  };
  _extractAttributes = new WeakSet();
  extractAttributes_fn = function(result, input) {
    const op = input.indexOf("[");
    const cp = input.indexOf("]");
    if (op > -1 && cp > -1 && cp > op) {
      const ip = input.substr(op, cp - op + 1);
      const pp = ip.substr(1, ip.length - 2).split("|");
      for (const z in pp) {
        const x = pp[z].split("=");
        if (x[0] === "style") {
          x[1].split(";").forEach((r) => {
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
  };
  _extractContent = new WeakSet();
  extractContent_fn = function(result, input) {
    const index = input.indexOf("=");
    if (index > -1) {
      result.content = input.slice(index + 1);
      if (!!result.content.length && result.content.charAt(0) === "&") {
        result.content = result.content.slice(1);
        result.encode = !!result.content.length && result.content.charAt(0) !== "&";
      }
      return input.slice(0, index);
    }
    return input;
  };
  _extractEvents = new WeakSet();
  extractEvents_fn = function(result, input) {
    const tmp = input.replaceAll("!", " ").split(" ");
    tmp.slice(1).map((item) => {
      const [event, ...rest] = item.toLowerCase().split("+");
      const capture = (rest || EMPTY_ARRAY2).indexOf("capture") > -1;
      result.events.push(makeEvent(event, capture));
    });
    return tmp[0];
  };
  _extractClasses = new WeakSet();
  extractClasses_fn = function(result, input) {
    const tmp = input.replaceAll(".", " ").split(" ");
    result.classes = tmp.slice(1);
    return tmp[0];
  };
  _extractIdAndTag = new WeakSet();
  extractIdAndTag_fn = function(result, input) {
    if (isNonEmptyString5(input)) {
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
  };
  _extractData = new WeakSet();
  extractData_fn = function(result, input) {
    return __privateMethod(this, _extractIdAndTag, extractIdAndTag_fn).call(this, result, __privateMethod(this, _extractClasses, extractClasses_fn).call(this, result, __privateMethod(this, _extractEvents, extractEvents_fn).call(this, result, __privateMethod(this, _extractContent, extractContent_fn).call(this, result, __privateMethod(this, _extractAttributes, extractAttributes_fn).call(this, result, input)))));
  };
  __privateAdd(ShorthandNotationParser, _extractAttributes);
  __privateAdd(ShorthandNotationParser, _extractContent);
  __privateAdd(ShorthandNotationParser, _extractEvents);
  __privateAdd(ShorthandNotationParser, _extractClasses);
  __privateAdd(ShorthandNotationParser, _extractIdAndTag);
  __privateAdd(ShorthandNotationParser, _extractData);
  var CSSPropertiesParser = class {
    static parse(content) {
      return buildObject2((result) => (isAssignedArray4(content) ? content : forcedStringSplit(content, "\n").map((x) => x.trim()).join(EMPTY_STRING).split(";")).forEach((item) => isNonEmptyString5(item) && __privateMethod(this, _process, process_fn).call(this, result, item.trim())));
    }
  };
  _process = new WeakSet();
  process_fn = function(result, item) {
    if (!!item.length && item.indexOf(":") > -1) {
      const [key, ...values] = item.split(":");
      const k = key.trim();
      if (!!k.length) {
        const v = values.join(":").trim();
        result[k] = v.endsWith(";") ? v.slice(0, -1) : v;
      }
    }
  };
  __privateAdd(CSSPropertiesParser, _process);
  var makeDefinition = () => ({
    kind: DEFAULT_KIND,
    tag: DEFAULT_TAG,
    id: EMPTY_STRING,
    classes: new window.Array(),
    attributes: new window.Object(),
    style: new window.Object(),
    events: new window.Array(),
    content: EMPTY_STRING,
    encode: false
  });
  var makeState = () => ({ generation: 0, persisted: false });
  var makeEvent = (kind, capture) => typeof kind === "string" && typeof capture === "boolean" ? { kind, capture } : null;
  var makeChild = (shorthandNotation, rules) => {
    let result = ShorthandNotationParser.parse(shorthandNotation);
    if (!result) {
      return RuntimeErrors2.onInvalidDefinition(shorthandNotation);
    }
    result.custom = result.kind === DEFAULT_KIND && isCustomTag(result.tag);
    result.hash = hash2(shorthandNotation);
    result.rules = isAssignedArray4(rules) ? rules : new window.Array();
    result.included = true;
    result.cache = null;
    return result;
  };
  var doValidations = (child) => {
    if (child !== null) {
      if (child.kind === TEMPLATES_KIND2) {
        if (!window.document.getElementById(child.id)) {
          return RuntimeErrors2.onInexistentTemplate(child.id);
        }
      } else if (child.kind === SLOTS_KIND2) {
        if (new window.String(child.attributes["slot"]).replaceAll('"', EMPTY_STRING).replaceAll("'", EMPTY_STRING).length === 0) {
          return RuntimeErrors2.onUnespecifiedSlot(child.id);
        }
      } else if (typeof child.id !== "string") {
        return RuntimeErrors2.onInvalidId(child.id);
      } else if (child.custom && !window.customElements.get(child.tag)) {
        RuntimeErrors2.onUnknownTag(child.tag);
      }
    }
    return child;
  };
  var createMainNode = (mainDefinition) => {
    if (!isAssignedObject6(mainDefinition)) {
      return null;
    }
    let result = window.document.createElement(mainDefinition.tag);
    if (!!mainDefinition.id.length) {
      result.setAttribute("id", mainDefinition.id);
    }
    if (!!mainDefinition.classes.length) {
      result.setAttribute("class", mainDefinition.classes.join(" "));
    }
    if (hasObjectKeys2(mainDefinition.style)) {
      var style = new window.String();
      for (const property in mainDefinition.style) {
        style += `${property}: ${mainDefinition.style[property]}; `;
      }
      if (!!style.length) {
        const v = style.trim();
        result.setAttribute("style", v.endsWith(";") ? v.slice(0, -1) : v);
      }
    }
    if (hasObjectKeys2(mainDefinition.attributes)) {
      for (const property in mainDefinition.attributes) {
        result.setAttribute(property, mainDefinition.attributes[property]);
      }
    }
    result.setAttribute(WUSENODE_ATTRIBUTE2, "main");
    return result;
  };
  var createStyleNode = (media, type) => {
    let result = window.document.createElement("style");
    if (isNonEmptyString5(media))
      result.setAttribute("media", media);
    if (isNonEmptyString5(type))
      result.setAttribute("type", type);
    result.setAttribute(WUSENODE_ATTRIBUTE2, "style");
    result.appendChild(window.document.createTextNode(EMPTY_STRING));
    return result;
  };
  var makeRule = (selector, properties) => {
    const s = isAssignedArray4(selector) ? selector.join(",") : isNonEmptyString5(selector) ? selector : EMPTY_STRING;
    return !s.length ? null : {
      selector: s,
      properties: isAssignedObject6(properties) ? properties : CSSPropertiesParser.parse(properties),
      cache: null
    };
  };
  var makeNestedRule = (selector, sub, properties) => {
    const s = isAssignedArray4(selector) ? selector.join(",") : isNonEmptyString5(selector) ? selector : EMPTY_STRING;
    const b = isAssignedArray4(sub) ? sub.join(",") : isNonEmptyString5(sub) ? sub : EMPTY_STRING;
    return !s.length || !b.length ? null : {
      selector: s,
      nested: [{
        selector: b,
        properties: isAssignedObject6(properties) ? properties : CSSPropertiesParser.parse(properties)
      }],
      cache: null
    };
  };
  var rulesJoiner = (lr, rule) => {
    if (lr.selector === rule.selector) {
      for (const p in rule.properties) {
        lr.properties[p] = rule.properties[p];
      }
      lr.cache = null;
      return true;
    }
    return false;
  };
  var nestedRulesJoiner = (lr, rule) => {
    if (isAssignedArray4(lr.nested) && lr.selector === rule.selector) {
      rule.nested.forEach((n) => {
        var found = false;
        for (const x in lr.nested) {
          if (found = lr.nested[x].selector === n.selector) {
            for (const p in n.properties) {
              lr.nested[x].properties[p] = n.properties[p];
            }
            break;
          }
        }
        if (!found)
          lr.nested.push(n);
      });
      lr.cache = null;
      return true;
    }
    return false;
  };
  var ElementParts = class {
    static initialize(options) {
      if (isAssignedObject6(options)) {
        RuntimeErrors2.onInvalidDefinition = ensureFunction6(options.onInvalidDefinition);
        RuntimeErrors2.onInexistentTemplate = ensureFunction6(options.onInexistentTemplate);
        RuntimeErrors2.onUnespecifiedSlot = ensureFunction6(options.onUnespecifiedSlot);
        RuntimeErrors2.onInvalidId = ensureFunction6(options.onInvalidId);
        RuntimeErrors2.onUnknownTag = ensureFunction6(options.onUnknownTag);
      }
    }
  };
  __publicField(ElementParts, "makeStyleNode", createStyleNode);
  __publicField(ElementParts, "newRule", makeRule);
  __publicField(ElementParts, "newNestedRule", makeNestedRule);
  __publicField(ElementParts, "tryToJoinRules", rulesJoiner);
  __publicField(ElementParts, "tryToJoinNestedRules", nestedRulesJoiner);
  __publicField(ElementParts, "performValidations", doValidations);
  __publicField(ElementParts, "makeMainNode", createMainNode);
  __publicField(ElementParts, "newChild", makeChild);
  __publicField(ElementParts, "newDefinition", makeDefinition);
  __publicField(ElementParts, "newEvent", makeEvent);
  __publicField(ElementParts, "newState", makeState);

  // src/wuse.element-modes.js
  var ElementModes = class {
    static get REGULAR() {
      return "regular";
    }
    static get OPEN() {
      return "open";
    }
    static get CLOSED() {
      return "closed";
    }
  };
  __publicField(ElementModes, "specializeClass", (elementClass, rootMode) => class extends elementClass {
    constructor() {
      super(rootMode);
    }
  });

  // src/wuse.element-events.js
  var _owner, _events;
  var EVENT_NAMES = [
    "on_create",
    "on_construct",
    "on_reconstruct",
    "on_connect",
    "on_inject",
    "on_load",
    "on_prerender",
    "on_update",
    "on_postrender",
    "on_refresh",
    "on_unload",
    "on_reload",
    "on_repaint",
    "on_disconnect"
  ];
  var ElementEvents = class {
    constructor(owner) {
      __privateAdd(this, _owner, null);
      __privateAdd(this, _events, new window.Object());
      __privateSet(this, _owner, owner);
    }
    detect() {
      EVENT_NAMES.forEach((event) => __privateGet(this, _events)[event] = typeof __privateGet(this, _owner)[event] === "function");
    }
    immediateTrigger(event, argument) {
      __privateGet(this, _events)[event] && __privateGet(this, _owner)[event].call(__privateGet(this, _owner), argument);
    }
    committedTrigger(event, argument) {
      __privateGet(this, _events)[event] && window.requestAnimationFrame(() => __privateGet(this, _owner)[event].call(__privateGet(this, _owner), argument));
    }
  };
  _owner = new WeakMap();
  _events = new WeakMap();

  // src/wuse.base-element.js
  var _html, _rules, _children, _fields, _options, _parameters, _elementEvents, _initialized, _identified, _slotted, _styled, _shadowed, _main, _style, _root, _inserted, _binded, _rendering, _filiatedKeys, _stateReader, _stateWriter, _stateManager, _binding, _contents, _waste, _measurement, _insertStyle, insertStyle_fn, _insertMain, insertMain_fn, _extirpateElements, extirpateElements_fn, _bind, bind_fn, _getElementByIdFromRoot, getElementByIdFromRoot_fn, _clearContents, clearContents_fn, _prepareContents, prepareContents_fn, _commitContents, commitContents_fn, _render, render_fn, _inject, inject_fn, _redraw, redraw_fn, _fieldRender, fieldRender_fn, _createField, createField_fn, _validateField, validateField_fn, _filiateChild, filiateChild_fn;
  var { EMPTY_STRING: EMPTY_STRING2, noop: noop6, ensureFunction: ensureFunction7, isOf: isOf4, isAssignedObject: isAssignedObject7, isAssignedArray: isAssignedArray5, isNonEmptyArray: isNonEmptyArray3, isNonEmptyString: isNonEmptyString6, forcedStringSplit: forcedStringSplit2, forEachOwnProperty: forEachOwnProperty3 } = JavascriptHelpers;
  var { removeChildren, isHTMLAttribute } = WebHelpers;
  var { WUSEKEY_ATTRIBUTE, DEFAULT_STYLE_TYPE, DEFAULT_STYLE_MEDIA, DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE, SLOTS_KIND: SLOTS_KIND3 } = StringConstants;
  var { createReactiveField } = ReactiveField;
  var RuntimeErrors3 = {
    onInvalidState: noop6,
    onInvalidKey: noop6,
    onInvalidDefinition: noop6,
    onLockedDefinition: noop6,
    onTakenId: noop6,
    onMisnamedField: noop6,
    onAllowHTML: noop6
  };
  var debug = (wel, msg) => window.Wuse.debug(`#${wel.id} (${wel.info.instanceNumber}) | ${typeof msg === "string" ? msg : JSON.stringify(msg)}`);
  var parseElement = (shorthandNotation, rules) => ElementParts.performValidations(ElementParts.newChild(shorthandNotation, rules));
  var isInvalidFieldName = (name) => typeof name !== "string" || !name.trim().length || name.startsWith("data") || isHTMLAttribute(name);
  var makeUserOptions = () => ({
    mainDefinition: ElementParts.newDefinition(),
    styleMedia: DEFAULT_STYLE_MEDIA,
    styleType: DEFAULT_STYLE_TYPE,
    rawContent: false,
    attributeKeys: false,
    elementKeys: true,
    autokeyChildren: true,
    automaticallyRestore: false
  });
  var makePerformanceWatches = () => ({
    attachment: new window.Wuse.PerformanceMeasurement.StopWatch(),
    partial: new window.Wuse.PerformanceMeasurement.StopWatch(),
    full: new window.Wuse.PerformanceMeasurement.StopWatch(),
    dettachment: new window.Wuse.PerformanceMeasurement.StopWatch()
  });
  var makeWasteAnalyzers = () => ({
    main: new EqualityAnalyzer(window.Wuse.hashRoutine),
    style: new EqualityAnalyzer(window.Wuse.hashRoutine)
  });
  var _BaseElement = class extends window.HTMLElement {
    constructor(mode) {
      super();
      __privateAdd(this, _insertStyle);
      __privateAdd(this, _insertMain);
      __privateAdd(this, _extirpateElements);
      __privateAdd(this, _bind);
      __privateAdd(this, _getElementByIdFromRoot);
      __privateAdd(this, _clearContents);
      __privateAdd(this, _prepareContents);
      __privateAdd(this, _commitContents);
      __privateAdd(this, _render);
      __privateAdd(this, _inject);
      __privateAdd(this, _redraw);
      __privateAdd(this, _fieldRender);
      __privateAdd(this, _createField);
      __privateAdd(this, _validateField);
      __privateAdd(this, _filiateChild);
      __privateAdd(this, _html, new window.String());
      __privateAdd(this, _rules, new class extends PartsHolder {
        constructor() {
          super(...arguments);
          __publicField(this, "getIndexOf", (value) => super.getIndexOf("selector", value));
          __publicField(this, "on_version_change", () => {
            if (this.last !== null) {
              this.last.version = this.version;
              this.last.replacements = TextReplacements.extractReplacementsFromRule(this.last);
            }
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `rules list version change: ${this.version}`);
          });
          __publicField(this, "on_forbidden_change", () => {
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `rules list is locked and can not be changed`);
            RuntimeErrors3.onLockedDefinition(__privateGet(this.owner, _options).mainDefinition.id);
          });
        }
      }(this));
      __privateAdd(this, _children, new class extends PartsHolder {
        constructor() {
          super(...arguments);
          __publicField(this, "getIndexOf", (value) => super.getIndexOf("id", value));
          __publicField(this, "on_version_change", () => {
            var _a3;
            if (this.last !== null) {
              this.last.version = this.version;
              this.last.replacements = TextReplacements.extractReplacementsFromChild(this.last);
            }
            if (!__privateGet(this.owner, _slotted))
              __privateSet(_a3 = this.owner, _slotted, __privateGet(_a3, _slotted) | this.some((child) => child.kind === SLOTS_KIND3));
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `children list version change: ${this.version}`);
          });
          __publicField(this, "on_forbidden_change", () => {
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `children list is locked and can not be changed`);
            RuntimeErrors3.onLockedDefinition(__privateGet(this.owner, _options).mainDefinition.id);
          });
          __publicField(this, "on_recall_part", (part) => __privateGet(this.owner, _filiatedKeys).tryToRemember(part));
        }
      }(this));
      __privateAdd(this, _fields, new class extends PartsHolder {
        constructor() {
          super(...arguments);
          __publicField(this, "getIndexOf", (value) => super.getIndexOf("name", value));
          __publicField(this, "on_version_change", () => {
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `fields list version change: ${this.version}`);
          });
          __publicField(this, "on_forbidden_change", () => {
            if (window.Wuse.DEBUG && __privateGet(this.owner, _identified))
              debug(this.owner, `fields list is locked and can not be changed`);
            RuntimeErrors3.onLockedDefinition(__privateGet(this.owner, _options).mainDefinition.id);
          });
          __publicField(this, "on_snapshot_part", (part) => part.value = this.owner[part.name]);
          __publicField(this, "on_recall_part", (part) => this.owner[part.name] = part.value);
        }
        establish(name, value) {
          if (this.prepare()) {
            const idx = super.getIndexOf("name", value);
            idx > -1 ? this[idx].value = value : this.append({ name, value });
            return true;
          }
          return false;
        }
      }(this));
      __privateAdd(this, _options, makeUserOptions());
      __privateAdd(this, _parameters, void 0);
      __privateAdd(this, _elementEvents, new ElementEvents(this));
      __privateAdd(this, _initialized, false);
      __privateAdd(this, _identified, false);
      __privateAdd(this, _slotted, false);
      __privateAdd(this, _styled, false);
      __privateAdd(this, _shadowed, window.Wuse.isShadowElement(this));
      __privateAdd(this, _main, void 0);
      __privateAdd(this, _style, void 0);
      __privateAdd(this, _root, null);
      __privateAdd(this, _inserted, false);
      __privateAdd(this, _binded, false);
      __privateAdd(this, _rendering, true);
      __privateAdd(this, _filiatedKeys, {
        tryToName: (child) => {
          const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
          if (!wusekey)
            child.attributes[WUSEKEY_ATTRIBUTE] = __privateGet(this, _stateManager).nameFiliatedKey(child.hash);
        },
        tryToRemember: (child) => {
          const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
          if (wusekey)
            __privateGet(this, _stateManager).rememberFiliatedKey(wusekey);
        }
      });
      __privateAdd(this, _stateReader, (data) => {
        if (data) {
          __privateSet(this, _options, data.options);
          __privateSet(this, _slotted, data.slotted);
          __privateSet(this, _identified, data.identified);
          __privateSet(this, _html, data.html);
          __privateGet(this, _children).restore(this, data.children);
          __privateGet(this, _rules).restore(this, data.rules);
          __privateGet(this, _fields).restore(this, data.fields);
        }
      });
      __privateAdd(this, _stateWriter, () => {
        return {
          options: __privateGet(this, _options),
          html: __privateGet(this, _html),
          children: __privateGet(this, _children).persist(),
          rules: __privateGet(this, _rules).persist(),
          fields: __privateGet(this, _fields).persist(),
          slotted: __privateGet(this, _slotted),
          identified: __privateGet(this, _identified)
        };
      });
      __privateAdd(this, _stateManager, new class extends StateManager {
        on_invalid_state() {
          RuntimeErrors3.onInvalidState();
        }
        on_invalid_key() {
          RuntimeErrors3.onInvalidKey();
        }
      }(ElementParts.newState, __privateGet(this, _stateReader), __privateGet(this, _stateWriter), window.Wuse.elementsStorage));
      __privateAdd(this, _binding, {
        binder: (id) => isNonEmptyString6(id) && (this[id] = __privateMethod(this, _getElementByIdFromRoot, getElementByIdFromRoot_fn).call(this, id)),
        unbinder: (id) => delete this[id],
        makePerformers: (event, doer) => ({
          event,
          key: () => {
            if (__privateGet(this, _identified))
              doer(__privateGet(this, _options).mainDefinition.id);
            return (child) => doer(child.id);
          }
        }),
        makeHandlers: (performers) => ({
          key: __privateGet(this, _options).elementKeys && performers.key(),
          event: (id, event, capture) => {
            const handler = this[`on_${id}_${event}`];
            if (handler) {
              const el = __privateMethod(this, _getElementByIdFromRoot, getElementByIdFromRoot_fn).call(this, id);
              if (el)
                el[performers.event](event, handler, capture);
            }
          },
          slots: () => this.on_slot_change && __privateGet(this, _root).querySelectorAll("slot").forEach((slot) => slot[performers.event]("slotchange", this.on_slot_change))
        }),
        getHandlers: (value) => __privateGet(this, _binding).makeHandlers(value ? __privateGet(this, _binding).makePerformers("addEventListener", __privateGet(this, _binding).binder) : __privateGet(this, _binding).makePerformers("removeEventListener", __privateGet(this, _binding).unbinder))
      });
      __privateAdd(this, _contents, {
        root: new ContentManager((content) => this.innerHTML = content, (content) => true),
        style: new ContentManager((content) => __privateGet(this, _style) && __privateGet(this, _style).promote(content), (content) => !__privateGet(this, _waste).style.compute(content)),
        main: new ContentManager((content) => __privateGet(this, _main).promote(content), (content) => !__privateGet(this, _waste).main.compute(content)),
        renderizers: {
          replacer: (str, rep) => str.replace(rep.find, this[rep.field] !== void 0 ? this[rep.field] : EMPTY_STRING2),
          rule: (rule) => {
            const cts = __privateGet(this, _contents);
            return cts.style.append(rule.cache ? rule.cache : rule.cache = RenderingRoutines.renderRule(cts.renderizers.replacer, rule));
          },
          children: {
            mixed: (child) => child.kind === SLOTS_KIND3 ? __privateGet(this, _contents).renderizers.children.slot(child) : __privateGet(this, _contents).renderizers.children.normal(child),
            slot: (child) => {
              if (!child.cache) {
                const cts = __privateGet(this, _contents);
                return cts.root.append(child.cache = RenderingRoutines.renderChild(cts.renderizers.replacer, child), cts.root.verify());
              }
            },
            normal: (child) => {
              const cts = __privateGet(this, _contents);
              cts.main.append(child.cache ? child.cache : child.cache = RenderingRoutines.renderChild(cts.renderizers.replacer, child));
              if (!!child.rules.length)
                child.rules.forEach(cts.renderizers.rule);
            }
          }
        }
      });
      __privateAdd(this, _waste, makeWasteAnalyzers());
      __privateAdd(this, _measurement, makePerformanceWatches());
      __publicField(this, "info", {
        instanceNumber: ++_BaseElement.instancesCount,
        unmodifiedRounds: 0,
        updatedRounds: 0
      });
      __privateSet(this, _root, mode === ElementModes.REGULAR ? this : this.shadowRoot || this.attachShadow({ mode }));
      const evs = __privateGet(this, _elementEvents);
      evs.detect();
      evs.immediateTrigger("on_create");
      if (__privateGet(this, _options).attributeKeys) {
        const ats = this.getAttributeNames();
        if (!!ats.length)
          ats.forEach((attr) => this[attr] = this.getAttribute(attr));
      }
      if (this.dataset.wusekey)
        this.setElementsStoreKey(this.dataset.wusekey);
      const stm = __privateGet(this, _stateManager);
      if (stm.initializeState() > 1) {
        __privateGet(this, _options).automaticallyRestore ? this.restoreFromElementsStore() : evs.immediateTrigger("on_reconstruct", stm.state);
      } else {
        evs.immediateTrigger("on_construct", stm.state);
      }
      __privateSet(this, _initialized, true);
    }
    get parameters() {
      return __privateGet(this, _parameters);
    }
    set parameters(value) {
      if (isAssignedObject7(__privateSet(this, _parameters, value)))
        forEachOwnProperty3(value, (name) => this[name] = value[name]);
    }
    render() {
      window.Wuse.RENDERING && __privateGet(this, _rendering) && __privateGet(this, _binded) && __privateMethod(this, _render, render_fn).call(this);
    }
    redraw() {
      window.Wuse.RENDERING && __privateGet(this, _rendering) && __privateGet(this, _binded) && __privateMethod(this, _redraw, redraw_fn).call(this);
    }
    connectedCallback() {
      if (window.Wuse.MEASURE)
        __privateGet(this, _measurement).attachment.start();
      const evs = __privateGet(this, _elementEvents);
      evs.detect();
      evs.immediateTrigger("on_connect");
      __privateMethod(this, _inject, inject_fn).call(this, evs, "on_load");
      if (window.Wuse.MEASURE)
        __privateGet(this, _measurement).attachment.stop(window.Wuse.DEBUG);
    }
    disconnectedCallback() {
      if (window.Wuse.MEASURE)
        __privateGet(this, _measurement).dettachment.start();
      __privateMethod(this, _bind, bind_fn).call(this, false);
      __privateGet(this, _elementEvents).immediateTrigger("on_disconnect");
      __privateGet(this, _stateManager).writeState();
      if (window.Wuse.MEASURE)
        __privateGet(this, _measurement).dettachment.stop(window.Wuse.DEBUG);
    }
    getElementsStore() {
      return __privateGet(this, _stateManager).getStore();
    }
    setElementsStore(store) {
      __privateGet(this, _stateManager).setStore(store);
      return this;
    }
    hasElementsStoreKey() {
      return __privateGet(this, _stateManager).hasKey();
    }
    getElementsStoreKey(key) {
      return __privateGet(this, _stateManager).key;
    }
    setElementsStoreKey(key) {
      if (__privateGet(this, _stateManager).key = key) {
        this.setAttribute(WUSEKEY_ATTRIBUTE, key);
        __privateGet(this, _stateManager).writeState();
      }
      return this;
    }
    deriveChildrenStoreKey(value) {
      __privateGet(this, _options).autokeyChildren = value;
      return this;
    }
    restoreOnReconstruct(value) {
      __privateGet(this, _options).automaticallyRestore = value;
      return this;
    }
    persistToElementsStore() {
      return __privateGet(this, _stateManager).validateKey() && __privateGet(this, _stateManager).writeState();
    }
    restoreFromElementsStore() {
      return __privateGet(this, _stateManager).validateKey() && __privateGet(this, _stateManager).readState();
    }
    removeFromElementsStore() {
      return __privateGet(this, _stateManager).validateKey() && __privateGet(this, _stateManager).eraseState();
    }
    selectChildElement(x) {
      return __privateGet(this, _root).querySelector(x);
    }
    getMainAttribute(key) {
      return key === "id" && __privateGet(this, _identified) ? __privateGet(this, _options).mainDefinition.id : __privateGet(this, _options).mainDefinition.attributes[key];
    }
    setMainAttribute(key, value) {
      __privateGet(this, _options).mainDefinition.attributes[key] = value;
      if (__privateGet(this, _inserted))
        __privateGet(this, _main).element.setAttribute(key, value);
      return this;
    }
    addMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      if (cls.indexOf(klass) === -1) {
        cls.push(klass);
        if (__privateGet(this, _inserted))
          __privateGet(this, _main).element.classList.add(klass);
      }
      return this;
    }
    removeMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      const idx = cls.indexOf(klass);
      if (idx > -1) {
        cls.splice(idx, 1);
        if (__privateGet(this, _inserted))
          __privateGet(this, _main).element.classList.remove(klass);
      }
      return this;
    }
    toggleMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      const idx = cls.indexOf(klass);
      idx > -1 ? cls.splice(idx, 1) : cls.push(klass);
      if (__privateGet(this, _inserted))
        __privateGet(this, _main).element.classList.toggle(klass);
      return this;
    }
    setMainElement(shorthandNotation) {
      const tmp = parseElement(shorthandNotation);
      if (tmp !== null) {
        if (isNonEmptyString6(tmp.content) || isNonEmptyArray3(tmp.events)) {
          return RuntimeErrors3.onInvalidDefinition(shorthandNotation);
        }
        const def = __privateGet(this, _options).mainDefinition;
        if (__privateSet(this, _identified, isNonEmptyString6(tmp.id)))
          def.id = tmp.id;
        if (isNonEmptyString6(tmp.tag))
          def.tag = tmp.tag;
        if (isNonEmptyArray3(tmp.classes))
          def.classes = tmp.classes;
        if (isAssignedObject7(tmp.style))
          def.style = tmp.style;
        if (isAssignedObject7(tmp.attributes))
          def.attributes = tmp.attributes;
      }
      return this;
    }
    setStyleOptions(media, type) {
      __privateGet(this, _options).styleMedia = isNonEmptyString6(media) ? media : EMPTY_STRING2;
      __privateGet(this, _options).styleType = isNonEmptyString6(type) ? type : EMPTY_STRING2;
      return this;
    }
    setElementsAsKeys(value) {
      __privateGet(this, _options).elementKeys = !!value;
      return this;
    }
    setAttributesAsKeys(value) {
      __privateGet(this, _options).attributeKeys = !!value;
      return this;
    }
    allowRawContent(value) {
      __privateGet(this, _options).rawContent = !!value;
      return this;
    }
    setRawContent(html) {
      __privateGet(this, _options).rawContent ? __privateSet(this, _html, html) : RuntimeErrors3.onAllowHTML();
      return this;
    }
    appendRawContent(html) {
      __privateGet(this, _options).rawContent ? __privateSet(this, _html, __privateGet(this, _html) + html) : RuntimeErrors3.onAllowHTML();
      return this;
    }
    prependRawContent(html) {
      __privateGet(this, _options).rawContent ? __privateSet(this, _html, html + __privateGet(this, _html)) : RuntimeErrors3.onAllowHTML();
      return this;
    }
    lockCSSRules() {
      __privateGet(this, _rules).locked = true;
      return this;
    }
    unlockCSSRules() {
      __privateGet(this, _rules).locked = false;
      return this;
    }
    appendCSSRule(selector, properties, nesting) {
      if (nesting)
        return this.appendCSSNestedRule(selector, properties, nesting);
      const sliced = __privateGet(this, _rules).slice(-1);
      const rule = ElementParts.newRule(selector, properties);
      if (!sliced.length || !ElementParts.tryToJoinRules(sliced[0], rule)) {
        __privateGet(this, _rules).append(rule);
      }
      return this;
    }
    prependCSSRule(selector, properties, nesting) {
      if (nesting)
        return this.prependCSSNestedRule(selector, properties, nesting);
      const sliced = __privateGet(this, _rules).slice(0, 1);
      const rule = ElementParts.newRule(selector, properties);
      if (!sliced.length || !ElementParts.tryToJoinRules(sliced[0], rule)) {
        __privateGet(this, _rules).prepend(rule);
      }
      return this;
    }
    appendCSSNestedRule(selector, subselector, properties) {
      const sliced = __privateGet(this, _rules).slice(-1);
      const rule = ElementParts.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !ElementParts.tryToJoinNestedRules(sliced[0], rule)) {
        __privateGet(this, _rules).append(rule);
      }
      return this;
    }
    prependCSSNestedRule(selector, subselector, properties) {
      const sliced = __privateGet(this, _rules).slice(0, 1);
      const rule = ElementParts.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !ElementParts.tryToJoinNestedRules(sliced[0], rule)) {
        __privateGet(this, _rules).prepend(rule);
      }
      return this;
    }
    hasCSSRuleBySelector(selector) {
      return __privateGet(this, _rules).getIndexOf(selector) > -1;
    }
    replaceCSSRuleBySelector(selector, properties) {
      __privateGet(this, _rules).replace(__privateGet(this, _rules).getIndexOf(selector), ElementParts.newRule(selector, properties));
      return this;
    }
    removeCSSRuleBySelector(selector) {
      __privateGet(this, _rules).remove(__privateGet(this, _rules).getIndexOf(selector));
      return this;
    }
    removeAllCSSRules() {
      __privateGet(this, _rules).clear();
      return this;
    }
    lockChildElements() {
      __privateGet(this, _children).locked = true;
      return this;
    }
    unlockChildElements() {
      __privateGet(this, _children).locked = false;
      return this;
    }
    appendChildElement(shorthandNotation, rules) {
      const tmp = __privateMethod(this, _filiateChild, filiateChild_fn).call(this, parseElement(shorthandNotation, rules));
      if (tmp !== null)
        __privateGet(this, _children).append(tmp);
      return this;
    }
    prependChildElement(shorthandNotation, rules) {
      const tmp = __privateMethod(this, _filiateChild, filiateChild_fn).call(this, parseElement(shorthandNotation, rules));
      if (tmp !== null)
        __privateGet(this, _children).prepend(tmp);
      return this;
    }
    appendChildElements(items) {
      (isAssignedArray5(items) ? items : forcedStringSplit2(items, "\n")).forEach((item) => typeof item === "string" && !!item.trim().length && this.appendChildElement(item));
      return this;
    }
    prependChildElements(items) {
      (isAssignedArray5(window.Array) ? items : forcedStringSplit2(items, "\n")).forEach((item) => typeof item === "string" && !!item.trim().length && this.prependChildElement(item));
      return this;
    }
    replaceChildElementById(id, shorthandNotation, rules) {
      const tmp = parseElement(shorthandNotation, rules);
      if (tmp !== null)
        __privateGet(this, _children).replace(__privateGet(this, _children).getIndexOf(id), tmp);
      return this;
    }
    removeChildElementById(id) {
      __privateGet(this, _children).remove(__privateGet(this, _children).getIndexOf(id));
      return this;
    }
    removeAllChildElements() {
      __privateGet(this, _children).clear();
      return this;
    }
    checkChildElementIsIncludedById(id, yes, no) {
      const fire = (cb) => isOf4(cb, window.Function) ? cb() : void 0;
      __privateGet(this, _children).some((child) => child.id === id && child.included) ? fire(yes) : fire(no);
      return this;
    }
    includeChildElementById(id) {
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => child.id === id && RenderingRoutines.renderingIncluder(child));
      return this;
    }
    excludeChildElementById(id) {
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => child.id === id && RenderingRoutines.renderingExcluder(child));
      return this;
    }
    invalidateChildElementsById(ids) {
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => ids.indexOf(child.id) > -1 && RenderingRoutines.cacheInvalidator(child));
      return this;
    }
    invalidateChildElements(childs) {
      if (isAssignedArray5(childs))
        childs.forEach(RenderingRoutines.cacheInvalidator);
      return this;
    }
    lockInstanceFields() {
      __privateGet(this, _fields).locked = true;
      return this;
    }
    unlockInstanceFields() {
      __privateGet(this, _fields).locked = false;
      return this;
    }
    makeField(name, value) {
      return __privateMethod(this, _createField, createField_fn).call(this, name, value, true);
    }
    makeReadonlyField(name, value) {
      return __privateMethod(this, _createField, createField_fn).call(this, name, value, false);
    }
    makeReactiveField(name, value, handler, initial = true) {
      if (__privateMethod(this, _validateField, validateField_fn).call(this, name)) {
        if (__privateGet(this, _fields).establish(name, value))
          createReactiveField(this, name, value, handler, (name2, label) => __privateMethod(this, _fieldRender, fieldRender_fn).call(this, name2, label || "$auto"), (name2) => this.dropField(name2));
        if (initial)
          __privateMethod(this, _fieldRender, fieldRender_fn).call(this, name, "$init");
      }
      return this;
    }
    makeExternalReactiveField(mirror, name, value, handler, initial = true) {
      return __privateMethod(this, _validateField, validateField_fn).call(this, name) ? this.makeReactiveField(name, mirror[name] || value, (actions) => {
        mirror[name] = this[name];
        handler(actions);
      }, initial) : this;
    }
    hasField(name) {
      return __privateGet(this, _fields).getIndexOf(name) > -1;
    }
    dropField(name) {
      if (__privateGet(this, _fields).prepare()) {
        const idx = __privateGet(this, _fields).getIndexOf(name);
        if (idx > -1) {
          if (this.hasOwnProperty(name))
            delete this[name];
          __privateGet(this, _fields).splice(idx, 1);
          __privateGet(this, _stateManager).writeState();
          return true;
        }
      }
      return false;
    }
    dropAllFields() {
      if (__privateGet(this, _fields).locked) {
        __privateGet(this, _fields).on_forbidden_change();
      } else {
        const names = [];
        __privateGet(this, _fields).forEach((field) => this.hasOwnProperty(field.name) && names.push(field.name));
        __privateGet(this, _fields).clear();
        names.forEach((name) => delete this[name]);
        __privateGet(this, _stateManager).writeState();
      }
      return this;
    }
    suspendRender() {
      __privateSet(this, _rendering, false);
      return this;
    }
    resumeRender(autorender = true) {
      __privateSet(this, _rendering, true);
      if (autorender)
        this.render();
      return this;
    }
    isRenderSuspended() {
      return !__privateGet(this, _rendering);
    }
    static initialize(options) {
      TextReplacements.initialize(DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE);
      if (isAssignedObject7(options)) {
        RenderingRoutines.initialize({ onFetchTemplate: options.onFetchTemplate });
        ElementParts.initialize({
          onInvalidDefinition: options.onInvalidDefinition,
          onInexistentTemplate: options.onInexistentTemplate,
          onUnespecifiedSlot: options.onUnespecifiedSlot,
          onInvalidId: options.onInvalidId,
          onUnknownTag: options.onUnknownTag
        });
        RuntimeErrors3.onAllowHTML = ensureFunction7(options.onAllowHTML);
        RuntimeErrors3.onInvalidKey = ensureFunction7(options.onInvalidKey);
        RuntimeErrors3.onInvalidState = ensureFunction7(options.onInvalidState);
        RuntimeErrors3.onInvalidDefinition = ensureFunction7(options.onInvalidDefinition);
        RuntimeErrors3.onLockedDefinition = ensureFunction7(options.onLockedDefinition);
        RuntimeErrors3.onTakenId = ensureFunction7(options.onTakenId);
        RuntimeErrors3.onMisnamedField = ensureFunction7(options.onMisnamedField);
      }
    }
    static register() {
      return Wuse.register(this);
    }
    static create(parameters, at = "body") {
      const target = at instanceof window.HTMLElement ? { node: at } : typeof at === "string" ? { selector: at } : at;
      return Wuse.create({ element: { type: this }, target, instance: { parameters } });
    }
  };
  var BaseElement = _BaseElement;
  _html = new WeakMap();
  _rules = new WeakMap();
  _children = new WeakMap();
  _fields = new WeakMap();
  _options = new WeakMap();
  _parameters = new WeakMap();
  _elementEvents = new WeakMap();
  _initialized = new WeakMap();
  _identified = new WeakMap();
  _slotted = new WeakMap();
  _styled = new WeakMap();
  _shadowed = new WeakMap();
  _main = new WeakMap();
  _style = new WeakMap();
  _root = new WeakMap();
  _inserted = new WeakMap();
  _binded = new WeakMap();
  _rendering = new WeakMap();
  _filiatedKeys = new WeakMap();
  _stateReader = new WeakMap();
  _stateWriter = new WeakMap();
  _stateManager = new WeakMap();
  _binding = new WeakMap();
  _contents = new WeakMap();
  _waste = new WeakMap();
  _measurement = new WeakMap();
  _insertStyle = new WeakSet();
  insertStyle_fn = function() {
    if (__privateSet(this, _styled, __privateSet(this, _style, !__privateGet(this, _rules).length ? null : new NodeManager(__privateGet(this, _root), ElementParts.makeStyleNode(__privateGet(this, _options).styleMedia, __privateGet(this, _options).styleType)))))
      __privateGet(this, _style).affiliate();
  };
  _insertMain = new WeakSet();
  insertMain_fn = function() {
    __privateSet(this, _main, new NodeManager(__privateGet(this, _root), ElementParts.makeMainNode(__privateGet(this, _options).mainDefinition))).affiliate();
  };
  _extirpateElements = new WeakSet();
  extirpateElements_fn = function() {
    __privateGet(this, _main).disaffiliate();
    if (__privateGet(this, _styled))
      __privateGet(this, _style).disaffiliate();
    if (__privateGet(this, _slotted) && __privateGet(this, _shadowed))
      removeChildren(__privateGet(this, _root));
  };
  _bind = new WeakSet();
  bind_fn = function(value) {
    if (__privateGet(this, _binded) && !value || !__privateGet(this, _binded) && value) {
      const bindingHandlers = __privateGet(this, _binding).getHandlers(value);
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => {
          if (!child.included && value)
            return;
          if (bindingHandlers.key)
            bindingHandlers.key(child);
          if (!!child.events.length)
            child.events.forEach((event) => event && bindingHandlers.event(child.id, event.kind, event.capture));
        });
      if (__privateGet(this, _slotted) && __privateGet(this, _shadowed))
        bindingHandlers.slots();
      __privateSet(this, _binded, value);
    }
  };
  _getElementByIdFromRoot = new WeakSet();
  getElementByIdFromRoot_fn = function(id) {
    return isNonEmptyString6(id) ? __privateGet(this, _root).querySelector(`#${id}`) : void 0;
  };
  _clearContents = new WeakSet();
  clearContents_fn = function() {
    if (!!__privateGet(this, _children).length)
      __privateGet(this, _children).forEach(RenderingRoutines.cacheInvalidator);
    if (!!__privateGet(this, _rules).length)
      __privateGet(this, _rules).forEach(RenderingRoutines.cacheInvalidator);
  };
  _prepareContents = new WeakSet();
  prepareContents_fn = function() {
    const cts = __privateGet(this, _contents);
    cts.root.reset(EMPTY_STRING2);
    cts.style.reset(EMPTY_STRING2);
    cts.main.reset(__privateGet(this, _html));
    const rdr = __privateGet(this, _slotted) && __privateGet(this, _shadowed) ? cts.renderizers.children.mixed : cts.renderizers.children.normal;
    if (!!__privateGet(this, _children).length)
      __privateGet(this, _children).forEach((child) => child.included && rdr(child));
    if (!!__privateGet(this, _rules).length)
      __privateGet(this, _rules).forEach(cts.renderizers.rule);
    cts.main.verify();
    cts.style.verify();
  };
  _commitContents = new WeakSet();
  commitContents_fn = function(forceRoot, forceStyle, forceMain) {
    const cts = __privateGet(this, _contents);
    cts.root.process(forceRoot);
    cts.style.process(forceStyle);
    cts.main.process(forceMain);
    if (window.Wuse.DEBUG && __privateGet(this, _identified))
      debug(this, `updated (root: ${cts.root.invalidated}, main: ${cts.main.invalidated}, style: ${cts.style.invalidated})`);
  };
  _render = new WeakSet();
  render_fn = function() {
    if (window.Wuse.MEASURE)
      __privateGet(this, _measurement).partial.start();
    if (!__privateGet(this, _styled))
      __privateMethod(this, _insertStyle, insertStyle_fn).call(this);
    const evs = __privateGet(this, _elementEvents);
    evs.immediateTrigger("on_prerender");
    __privateMethod(this, _prepareContents, prepareContents_fn).call(this);
    const cts = __privateGet(this, _contents);
    if (cts.root.invalidated || cts.main.invalidated || cts.style.invalidated) {
      __privateMethod(this, _bind, bind_fn).call(this, false);
      __privateMethod(this, _commitContents, commitContents_fn).call(this, false, false, false);
      __privateMethod(this, _bind, bind_fn).call(this, true);
      this.info.updatedRounds++;
      evs.immediateTrigger("on_update");
      __privateGet(this, _stateManager).writeState();
      evs.committedTrigger("on_refresh");
    } else {
      this.info.unmodifiedRounds++;
    }
    if (window.Wuse.DEBUG && __privateGet(this, _identified))
      debug(this, `unmodified: ${this.info.unmodifiedRounds} (main: ${__privateGet(this, _waste).main.rounds}, style: ${__privateGet(this, _waste).style.rounds}) | updated: ${this.info.updatedRounds}`);
    evs.immediateTrigger("on_postrender");
    if (window.Wuse.MEASURE)
      __privateGet(this, _measurement).partial.stop(window.Wuse.DEBUG);
  };
  _inject = new WeakSet();
  inject_fn = function(evs, event) {
    __privateMethod(this, _clearContents, clearContents_fn).call(this);
    __privateMethod(this, _insertStyle, insertStyle_fn).call(this);
    __privateMethod(this, _insertMain, insertMain_fn).call(this);
    __privateSet(this, _inserted, true);
    evs.immediateTrigger("on_inject");
    __privateMethod(this, _prepareContents, prepareContents_fn).call(this);
    __privateMethod(this, _commitContents, commitContents_fn).call(this, false, __privateGet(this, _styled), true);
    __privateMethod(this, _bind, bind_fn).call(this, true);
    evs.immediateTrigger(event);
    __privateGet(this, _stateManager).writeState();
  };
  _redraw = new WeakSet();
  redraw_fn = function() {
    if (window.Wuse.MEASURE)
      __privateGet(this, _measurement).full.start();
    __privateMethod(this, _bind, bind_fn).call(this, false);
    if (__privateGet(this, _inserted)) {
      __privateMethod(this, _extirpateElements, extirpateElements_fn).call(this);
      __privateSet(this, _inserted, false);
    }
    const evs = __privateGet(this, _elementEvents);
    evs.immediateTrigger("on_unload");
    evs.detect();
    __privateMethod(this, _inject, inject_fn).call(this, evs, "on_reload");
    evs.committedTrigger("on_repaint");
    if (window.Wuse.MEASURE)
      __privateGet(this, _measurement).full.stop(window.Wuse.DEBUG);
  };
  _fieldRender = new WeakSet();
  fieldRender_fn = function(name, label = "$none") {
    if (__privateGet(this, _binded)) {
      const rulesHits = TextReplacements.scanRulesForReplacements(__privateGet(this, _rules), name);
      rulesHits.forEach(RenderingRoutines.cacheInvalidator);
      const childrenHits = TextReplacements.scanChildrenForReplacements(__privateGet(this, _children), name);
      childrenHits.forEach(RenderingRoutines.cacheInvalidator);
      if (window.Wuse.DEBUG && __privateGet(this, _identified))
        debug(this, `reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
      if (!!rulesHits.length || !!childrenHits.length) {
        if (childrenHits.some((x) => !!x.kind.length)) {
          __privateGet(this, _children).forEach(RenderingRoutines.slotsInvalidator);
        }
        this.render();
      }
    }
  };
  _createField = new WeakSet();
  createField_fn = function(name, value, writable) {
    if (__privateMethod(this, _validateField, validateField_fn).call(this, name) && __privateGet(this, _fields).establish(name, value)) {
      window.Object.defineProperty(this, name, { value, writable });
    }
    return this;
  };
  _validateField = new WeakSet();
  validateField_fn = function(name) {
    if (__privateGet(this, _fields).getIndexOf(name) === -1 && isInvalidFieldName(name)) {
      RuntimeErrors3.onMisnamedField(name);
      return false;
    }
    return true;
  };
  _filiateChild = new WeakSet();
  filiateChild_fn = function(tmp) {
    if (tmp !== null) {
      if (__privateGet(this, _initialized) && __privateMethod(this, _getElementByIdFromRoot, getElementByIdFromRoot_fn).call(this, tmp.id)) {
        return RuntimeErrors3.onTakenId(tmp.id);
      }
      if (tmp.custom && __privateGet(this, _options).autokeyChildren && __privateGet(this, _stateManager).hasKey()) {
        __privateGet(this, _filiatedKeys).tryToName(tmp);
      }
    }
    return tmp;
  };
  __publicField(BaseElement, "instancesCount", 0);

  // src/wuse.initialization-routines.js
  var defineReadOnlyMembers = (instance, items) => window.Object.getOwnPropertyNames(items).forEach((name) => Object.defineProperty(instance, name, {
    value: items[name],
    writable: false,
    configurable: false,
    enumerable: false
  }));
  var InitializationRoutines = class {
    static detectFeatures(instance) {
      const detectFeature = (flag, msg) => !flag && RuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
      try {
        detectFeature(instance.JsHelpers.isOf(window.document, window.HTMLDocument), "HTML Document");
        detectFeature(instance.JsHelpers.isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
        instance.WebHelpers.onDOMContentLoaded(() => detectFeature(instance.JsHelpers.isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
      } catch (e) {
        RuntimeErrors.UNKNOWN_ERROR.emit();
      }
    }
    static initializeModules(instance) {
      instance.PerformanceMeasurement.initialize((stopWatch, event) => instance.debug(JSON.stringify(instance.JsHelpers.buildArray((data) => {
        data.push({ instances: instance.elementCount });
        data.push(stopWatch.getDebugInfo());
        switch (event) {
          case "stop":
            data.push(instance.PerformanceMeasurement.DOMUpdate.overall.getDebugInfo());
            break;
          case "finish":
            data.push(instance.PerformanceMeasurement.BrowserRender.overall.getDebugInfo());
            break;
        }
      }))));
      TemplateImporter.initialize({
        onExtinctTemplate: RuntimeErrors.EXTINCT_TEMPLATE.emit,
        onInvalidTemplate: RuntimeErrors.INVALID_TEMPLATE.emit
      });
      ElementClasses.initialize({
        onBadTarget: RuntimeErrors.BAD_TARGET.emit,
        onMisnamedClass: RuntimeErrors.MISNAMED_CLASS.emit,
        onUnregistrableClass: RuntimeErrors.UNREGISTRABLE_CLASS.emit,
        onUnregisteredClass: RuntimeErrors.UNREGISTERED_CLASS.emit,
        onAlreadyRegistered: RuntimeErrors.ALREADY_REGISTERED.emit,
        onInvalidClass: RuntimeErrors.INVALID_CLASS.emit,
        onDeferredInstantiation: instance.WebHelpers.onDOMContentLoaded
      });
      BaseElement.initialize({
        onAllowHTML: RuntimeErrors.ALLOW_HTML.emit,
        onInvalidKey: RuntimeErrors.INVALID_KEY.emit,
        onInvalidDefinition: RuntimeErrors.INVALID_DEFINITION.emit,
        onLockedDefinition: RuntimeErrors.LOCKED_DEFINITION.emit,
        onInexistentTemplate: RuntimeErrors.INEXISTENT_TEMPLATE.emit,
        onUnespecifiedSlot: RuntimeErrors.UNESPECIFIED_SLOT.emit,
        onUnknownTag: RuntimeErrors.UNKNOWN_TAG.emit,
        onInvalidId: RuntimeErrors.INVALID_ID.emit,
        onTakenId: RuntimeErrors.TAKEN_ID.emit,
        onMisnamedField: RuntimeErrors.MISNAMED_FIELD.emit,
        onInvalidState: RuntimeErrors.INVALID_STATE.emit,
        onFetchTemplate: TemplateImporter.fetch
      });
    }
    static declareUnwritableMembers(instance, items) {
      defineReadOnlyMembers(instance, items.fields);
      defineReadOnlyMembers(instance, items.methods);
    }
  };

  // src/wuse.performance-measurement.js
  var _finish, finish_fn, _a, _b, _c, _debugCallback;
  var formatTime = (time) => time > 1e3 ? (time / 1e3).toFixed(2) + "s" : time.toFixed(2) + "ms";
  var MeasureRound = class {
    constructor() {
      __publicField(this, "round", 0);
      __publicField(this, "domTime", window.Number.MAX_SAFE_INTEGER);
      __publicField(this, "renderTime", window.Number.MAX_SAFE_INTEGER);
    }
    getDebugInfo() {
      var result = new window.Object();
      result.round = this.round;
      result.domTime = formatTime(this.domTime);
      if (this.renderTime !== window.Number.MAX_SAFE_INTEGER) {
        result.renderTime = formatTime(this.renderTime);
      }
      return result;
    }
  };
  var MeasureOverall = class {
    constructor(name) {
      __publicField(this, "name", "");
      __publicField(this, "rounds", 0);
      __publicField(this, "time", 0);
      __publicField(this, "average", 0);
      this.name = name;
    }
    compute(last) {
      this.rounds++;
      this.time += last;
      this.average = this.time / this.rounds;
    }
    getDebugInfo() {
      const spent = formatTime(this.time);
      const average = formatTime(this.average);
      return { name: this.name, rounds: this.rounds, spent, average };
    }
  };
  var _PerformanceMeasurement = class {
    static initialize(dbgCb) {
      if (typeof dbgCb === "function")
        __privateSet(_PerformanceMeasurement, _debugCallback, dbgCb);
      _PerformanceMeasurement.DOMUpdate.overall = new MeasureOverall("overall-dom-update");
      _PerformanceMeasurement.BrowserRender.overall = new MeasureOverall("overall-browser-render");
    }
  };
  var PerformanceMeasurement = _PerformanceMeasurement;
  _debugCallback = new WeakMap();
  __privateAdd(PerformanceMeasurement, _debugCallback, () => {
  });
  __publicField(PerformanceMeasurement, "StopWatch", (_a = class {
    constructor() {
      __privateAdd(this, _finish);
      __publicField(this, "_begin", 0);
      __publicField(this, "_end", {
        dom: 0,
        render: 0
      });
      __publicField(this, "rounds", 0);
      __publicField(this, "last", new MeasureRound());
      __publicField(this, "best", new MeasureRound());
      __publicField(this, "averages", {
        dom: 0,
        render: 0
      });
    }
    start() {
      if (_PerformanceMeasurement.DOMUpdate.check || _PerformanceMeasurement.BrowserRender.check) {
        this.last.round = ++this.rounds;
        this._begin = performance.now();
      }
    }
    stop(debug2) {
      var _a3;
      if (_PerformanceMeasurement.DOMUpdate.check) {
        if (this.best.domTime > (this.last.domTime = (this._end.dom = performance.now()) - this._begin)) {
          this.best.round = this.last.round;
          this.best.domTime = this.last.domTime;
        }
        this.averages.dom = (this.averages.dom * (this.rounds - 1) + this.last.domTime) / this.rounds;
        _PerformanceMeasurement.DOMUpdate.overall.compute(this.last.domTime);
      }
      _PerformanceMeasurement.BrowserRender.check ? setTimeout(() => __privateMethod(this, _finish, finish_fn).bind(this)(debug2)) : debug2 && __privateGet(_a3 = _PerformanceMeasurement, _debugCallback).call(_a3, this, "stop");
    }
    getDebugInfo() {
      return {
        rounds: this.rounds,
        last: this.last.getDebugInfo(),
        best: this.best.getDebugInfo(),
        averages: this.averages
      };
    }
  }, _finish = new WeakSet(), finish_fn = function(debug2) {
    var _a3;
    if (this.best.renderTime > (this.last.renderTime = (this._end.render = performance.now()) - this._begin)) {
      this.best.round = this.last.round;
      this.best.renderTime = this.last.renderTime;
    }
    this.averages.render = (this.averages.render * (this.rounds - 1) + this.last.renderTime) / this.rounds;
    _PerformanceMeasurement.BrowserRender.overall.compute(this.last.renderTime);
    debug2 && __privateGet(_a3 = _PerformanceMeasurement, _debugCallback).call(_a3, this, "finish");
  }, _a));
  __publicField(PerformanceMeasurement, "DOMUpdate", (_b = class {
  }, __publicField(_b, "check", true), __publicField(_b, "overall", null), _b));
  __publicField(PerformanceMeasurement, "BrowserRender", (_c = class {
  }, __publicField(_c, "check", false), __publicField(_c, "overall", null), _c));

  // src/wuse.simple-storage.js
  var _items, _getKeys, getKeys_fn;
  var SimpleStorage = class {
    constructor() {
      __privateAdd(this, _getKeys);
      __privateAdd(this, _items, new window.Object());
    }
    get length() {
      return __privateMethod(this, _getKeys, getKeys_fn).call(this).length;
    }
    key(value) {
      return __privateMethod(this, _getKeys, getKeys_fn).call(this)[value] || null;
    }
    getItem(key) {
      return __privateGet(this, _items)[key];
    }
    setItem(key, state) {
      __privateGet(this, _items)[key] = state;
    }
    removeItem(key) {
      delete __privateGet(this, _items)[key];
    }
    clear() {
      __privateSet(this, _items, new window.Object());
    }
    hasItem(key) {
      return __privateGet(this, _items).hasOwnProperty(key);
    }
  };
  _items = new WeakMap();
  _getKeys = new WeakSet();
  getKeys_fn = function() {
    return window.Object.keys(__privateGet(this, _items));
  };

  // package.json
  var version = "0.7.4";

  // src/wuse.js
  var _a2;
  var { noop: noop7, isOf: isOf5 } = JavascriptHelpers;
  window.Wuse = window.Wuse || (_a2 = class {
    static get VERSION() {
      return version;
    }
    static get elementCount() {
      return BaseElement.instancesCount;
    }
  }, __publicField(_a2, "DEBUG", false), __publicField(_a2, "FATALS", false), __publicField(_a2, "MEASURE", false), __publicField(_a2, "RENDERING", true), __publicField(_a2, "hashRoutine", StringHashing.defaultRoutine), __publicField(_a2, "elementsStorage", new SimpleStorage()), __publicField(_a2, "tmp", null), __publicField(_a2, "WebHelpers", null), __publicField(_a2, "JsHelpers", null), __publicField(_a2, "PerformanceMeasurement", null), __publicField(_a2, "NonShadowElement", null), __publicField(_a2, "OpenShadowElement", null), __publicField(_a2, "ClosedShadowElement", null), __publicField(_a2, "debug", noop7), __publicField(_a2, "blockUpdate", noop7), __publicField(_a2, "register", noop7), __publicField(_a2, "instantiate", noop7), __publicField(_a2, "create", noop7), __publicField(_a2, "isShadowElement", noop7), (() => {
    InitializationRoutines.declareUnwritableMembers(_a2, {
      fields: {
        tmp: new window.Object(),
        WebHelpers,
        JsHelpers: JavascriptHelpers,
        PerformanceMeasurement,
        NonShadowElement: ElementModes.specializeClass(BaseElement, ElementModes.REGULAR),
        OpenShadowElement: ElementModes.specializeClass(BaseElement, ElementModes.OPEN),
        ClosedShadowElement: ElementModes.specializeClass(BaseElement, ElementModes.CLOSED)
      },
      methods: {
        debug: (msg) => window.console.log("[WUSE:DEBUG]", msg),
        blockUpdate: (task, arg) => {
          if (isOf5(task, Function)) {
            if (window.Wuse.DEBUG)
              window.Wuse.debug("blocking");
            window.Wuse.RENDERING = false;
            try {
              task(arg);
            } catch (e) {
              throw e;
            } finally {
              window.Wuse.RENDERING = true;
              if (window.Wuse.DEBUG)
                window.Wuse.debug("unblocking");
            }
          }
        },
        isShadowElement: (instance) => {
          const p = window.Object.getPrototypeOf(instance.constructor);
          return p === window.Wuse.OpenShadowElement || p === window.Wuse.ClosedShadowElement;
        },
        register: (classes) => ElementClasses.registerClasses(isOf5(classes, window.Array) ? classes : new window.Array(classes)),
        instantiate: (classes, target, events) => ElementClasses.instantiateClasses(isOf5(classes, window.Array) ? classes : new window.Array(classes), target, events),
        create: (configuration, option) => isOf5(configuration, window.Object) ? ElementClasses.createInstance(configuration.element, configuration.target, configuration.instance) : void 0
      }
    });
    InitializationRoutines.detectFeatures(_a2);
    InitializationRoutines.initializeModules(_a2);
  })(), _a2);
})();
Wuse.DEBUG=Wuse.MEASURE=!0;
