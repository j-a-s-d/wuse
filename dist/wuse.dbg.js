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

  // src/wuse.runtime-errors.mjs
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

  // src/wuse.javascript-helpers.mjs
  var _EMPTY_STRING, _EMPTY_ARRAY;
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
      const instance = new window.Array();
      if (typeof initializer === "function")
        initializer(instance);
      return instance;
    }
    static buildObject(initializer) {
      const instance = new window.Object();
      if (typeof initializer === "function")
        initializer(instance);
      return instance;
    }
    static ensureFunction(fun, def = () => {
    }) {
      return typeof fun === "function" ? fun : def;
    }
    static isOf(instance, c) {
      return !!(instance !== void 0 && instance !== null && (instance.constructor === c || c !== void 0 && c !== null && instance.constructor.name === c.name));
    }
    static areOf(instances, c) {
      let result = !!(instances && instances.constructor === window.Array && !!instances.length);
      if (result)
        for (let x in instances) {
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
    static defineReadOnlyMembers(instance, items) {
      if (instance && typeof items === "object" && items !== null) {
        const defProp = window.Object.defineProperty;
        const names = window.Object.getOwnPropertyNames(items);
        for (let x in names) {
          const name = names[x];
          defProp(instance, name, {
            value: items[name],
            writable: false,
            configurable: false,
            enumerable: false
          });
        }
      }
    }
  };
  _EMPTY_STRING = new WeakMap();
  _EMPTY_ARRAY = new WeakMap();
  __privateAdd(JavascriptHelpers, _EMPTY_STRING, new window.String().valueOf());
  __privateAdd(JavascriptHelpers, _EMPTY_ARRAY, window.Object.freeze(new window.Array()));

  // src/wuse.template-importer.mjs
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

  // src/wuse.element-classes.mjs
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

  // src/wuse.string-hashing.mjs
  var StringHashing = class {
    static defaultRoutine(str = "") {
      let h = 0;
      for (let idx = 0; idx < str.length; idx++) {
        h = (h = (h << 5) - h + str.charCodeAt(idx)) & h;
      }
      return h;
    }
  };

  // src/wuse.web-helpers.mjs
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
    "command",
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
  var HTML_VOID_TAGS = [
    "area",
    "base",
    "br",
    "col",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "command",
    "keygen",
    "source"
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
    static changeDOMElementTag(el, tag) {
      if (!el || typeof tag !== "string" || !tag.length)
        return null;
      const nu = window.document.createElement(tag);
      for (const ae of el.attributes)
        nu.setAttribute(ae.name, ae.value);
      if (!!el.childNodes.length)
        el.childNodes.forEach((ce) => nu.appendChild(ce));
      if (el.parentNode)
        el.parentNode.replaceChild(nu, el);
      window.Object.getOwnPropertyNames(el).forEach((pk) => nu[pk] = el[pk]);
      return nu;
    }
    static buildDOMElement(tag, initializer) {
      if (typeof tag !== "string" || HTML_TAGS.indexOf(hash(tag)) === -1)
        return null;
      const instance = window.document.createElement(tag);
      if (typeof initializer === "function")
        initializer(instance);
      return instance;
    }
    static buildDOMFragment(initializer) {
      const instance = window.document.createDocumentFragment();
      if (typeof initializer === "function")
        initializer(instance);
      return instance;
    }
    static getUniqueId(prefix = "WUSE") {
      const pfx = "_" + (prefix ? prefix : "") + "_";
      let result;
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
    static isHTMLVoidTag(tag) {
      return typeof tag === "string" && HTML_VOID_TAGS.indexOf(hash(tag)) > -1;
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

  // src/wuse.string-constants.mjs
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

  // src/wuse.reactive-field.mjs
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

  // src/wuse.element-modes.mjs
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

  // src/wuse.element-events.mjs
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
  var EVENTS_COUNT = EVENT_NAMES.length;
  var ElementEvents = class {
    constructor(owner) {
      __privateAdd(this, _owner, null);
      __privateAdd(this, _events, new window.Object());
      __privateSet(this, _owner, owner);
      for (let idx = 0; idx < EVENTS_COUNT; idx++)
        __privateGet(this, _events)[EVENT_NAMES[idx]] = false;
    }
    detect() {
      for (let idx = 0; idx < EVENTS_COUNT; idx++) {
        const event = EVENT_NAMES[idx];
        __privateGet(this, _events)[event] = typeof __privateGet(this, _owner)[event] === "function";
      }
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

  // src/wuse.element-parts.mjs
  var _extractAttributes, extractAttributes_fn, _extractContent, extractContent_fn, _extractEvents, extractEvents_fn, _extractClasses, extractClasses_fn, _extractIdAndTag, extractIdAndTag_fn, _extractData, extractData_fn, _process, process_fn;
  var { isHTMLTag } = WebHelpers;
  var { EMPTY_STRING, EMPTY_ARRAY, noop: noop4, buildArray: buildArray2, buildObject, isAssignedObject: isAssignedObject3, isAssignedArray: isAssignedArray2, ensureFunction: ensureFunction3, hasObjectKeys, isNonEmptyString: isNonEmptyString2, forcedStringSplit } = JavascriptHelpers;
  var { WUSENODE_ATTRIBUTE, DEFAULT_TAG, DEFAULT_KIND, TEMPLATES_KIND, SLOTS_KIND, TEXTNODE_TAG } = StringConstants;
  var hash2 = StringHashing.defaultRoutine;
  var RuntimeErrors2 = {
    onInvalidDefinition: noop4,
    onInexistentTemplate: noop4,
    onUnespecifiedSlot: noop4,
    onInvalidId: noop4,
    onUnknownTag: noop4
  };
  var isCustomTag = (tag) => tag.indexOf("-") > 0 && !isHTMLTag(tag);
  var ShorthandNotationParser = class {
    static parse(value) {
      if (isNonEmptyString2(value)) {
        let val = value.trimLeft();
        let def = makeDefinition();
        if (val.charAt(0) === "%") {
          if (val.startsWith(TEMPLATES_KIND)) {
            return __privateMethod(this, _extractData, extractData_fn).call(this, def, val.replace(def.kind = TEMPLATES_KIND, EMPTY_STRING));
          } else if (val.startsWith(SLOTS_KIND)) {
            return __privateMethod(this, _extractData, extractData_fn).call(this, def, val.replace(def.kind = SLOTS_KIND, EMPTY_STRING));
          } else {
            return null;
          }
        } else {
          return __privateMethod(this, _extractData, extractData_fn).call(this, def, val);
        }
      }
      return null;
    }
    static fromHTMLElement(element) {
      if (element instanceof HTMLElement) {
        let tag = "";
        if (!!element.tagName.length)
          tag = element.tagName.toLowerCase();
        let id = "";
        if (!!element.id.length)
          id = "#" + element.id;
        let cls = "";
        if (!!element.classList.length)
          element.classList.forEach((it) => cls += "." + it);
        let value = "";
        if (!!element.innerHTML.length)
          value = "=" + element.innerHTML;
        let attr = "";
        if (!!element.attributes.length) {
          for (let i = 0; i < element.attributes.length; i++) {
            const at = element.attributes[i];
            const an = at.name.toLowerCase();
            if (an !== "id" && an !== "class") {
              attr += "|" + an + "=" + (typeof at.value === "string" ? `'${at.value}'` : at.value);
            }
          }
          if (!!attr.length)
            attr = attr.replace("|", "[") + "]";
        }
        return `${tag}${id}${cls}${attr}${value}`;
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
            if (!!k.length)
              result.style[k] = (s[1] || "").trim();
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
      const capture = (rest || EMPTY_ARRAY).indexOf("capture") > -1;
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
    if (isNonEmptyString2(input)) {
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
      return buildObject((result) => (isAssignedArray2(content) ? content : forcedStringSplit(content, "\n").map((x) => x.trim()).join(EMPTY_STRING).split(";")).forEach((item) => isNonEmptyString2(item) && __privateMethod(this, _process, process_fn).call(this, result, item.trim())));
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
  var getHTMLTagToShorthandNotation = (html) => {
    const chn = new DOMParser().parseFromString(html, "text/html").body.children;
    return !!chn.length ? buildArray2((lines) => {
      for (let x = 0; x < chn.length; x++)
        lines.push(ShorthandNotationParser.fromHTMLElement(chn[x]));
    }).join("\n") : null;
  };
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
  var makeChild = (shorthandNotation) => {
    let result = ShorthandNotationParser.parse(shorthandNotation);
    if (!result) {
      return RuntimeErrors2.onInvalidDefinition(shorthandNotation);
    }
    result.custom = result.kind === DEFAULT_KIND && isCustomTag(result.tag);
    result.hash = hash2(shorthandNotation);
    result.included = true;
    result.cache = null;
    return result;
  };
  var doValidations = (child) => {
    if (child !== null) {
      if (child.kind === TEMPLATES_KIND) {
        if (!window.document.getElementById(child.id)) {
          return RuntimeErrors2.onInexistentTemplate(child.id);
        }
      } else if (child.kind === SLOTS_KIND) {
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
  var createMainNode = (definition) => {
    if (!isAssignedObject3(definition)) {
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
  };
  var createStyleNode = (media, type) => {
    let result = window.document.createElement("style");
    if (isNonEmptyString2(media))
      result.setAttribute("media", media);
    if (isNonEmptyString2(type))
      result.setAttribute("type", type);
    result.setAttribute(WUSENODE_ATTRIBUTE, "style");
    result.appendChild(window.document.createTextNode(EMPTY_STRING));
    return result;
  };
  var makeRule = (selector, properties) => {
    const s = isAssignedArray2(selector) ? selector.join(",") : isNonEmptyString2(selector) ? selector : EMPTY_STRING;
    return !s.length ? null : {
      selector: s,
      properties: isAssignedObject3(properties) ? properties : CSSPropertiesParser.parse(properties),
      cache: null
    };
  };
  var makeNestedRule = (selector, sub, properties) => {
    const s = isAssignedArray2(selector) ? selector.join(",") : isNonEmptyString2(selector) ? selector : EMPTY_STRING;
    const b = isAssignedArray2(sub) ? sub.join(",") : isNonEmptyString2(sub) ? sub : EMPTY_STRING;
    return !s.length || !b.length ? null : {
      selector: s,
      nested: [{
        selector: b,
        properties: isAssignedObject3(properties) ? properties : CSSPropertiesParser.parse(properties)
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
    if (isAssignedArray2(lr.nested) && lr.selector === rule.selector) {
      rule.nested.forEach((n) => {
        let found = false;
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
      if (isAssignedObject3(options)) {
        RuntimeErrors2.onInvalidDefinition = ensureFunction3(options.onInvalidDefinition);
        RuntimeErrors2.onInexistentTemplate = ensureFunction3(options.onInexistentTemplate);
        RuntimeErrors2.onUnespecifiedSlot = ensureFunction3(options.onUnespecifiedSlot);
        RuntimeErrors2.onInvalidId = ensureFunction3(options.onInvalidId);
        RuntimeErrors2.onUnknownTag = ensureFunction3(options.onUnknownTag);
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
  __publicField(ElementParts, "convertHTMLTagToShorthandNotation", getHTMLTagToShorthandNotation);

  // src/wuse.text-replacements.mjs
  var _regExp, _addReplacement, _includeMatches, _includeStringMatches, _includeKeysMatches;
  var { EMPTY_ARRAY: EMPTY_ARRAY2, buildArray: buildArray3, buildObject: buildObject2, isNonEmptyString: isNonEmptyString3, isAssignedArray: isAssignedArray3 } = JavascriptHelpers;
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
  __publicField(ReplacementsScanners, "rules", (rules, name) => buildArray3((hits) => rules.forEach((rule) => rule.replacements.forEach((x) => x.field === name && hits.push(rule)))));
  __publicField(ReplacementsScanners, "children", (children, name) => buildArray3((hits) => {
    const processAll = (child) => {
      const process = (collection) => collection.forEach((x) => x.field === name && hits.push(child));
      REPLACEMENT_PLACES.forEach((key) => process(child.replacements[key]));
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
  __privateAdd(ReplacementsExtractors, _includeMatches, (hits, at, str) => isNonEmptyString3(str) && (str.match(__privateGet(_ReplacementsExtractors, _regExp)) || EMPTY_ARRAY2).forEach((match) => {
    var _a2;
    return __privateGet(_a2 = _ReplacementsExtractors, _addReplacement).call(_a2, hits, at, match);
  }));
  __privateAdd(ReplacementsExtractors, _includeStringMatches, (result, key, value) => {
    var _a2;
    result[key] = new window.Array();
    __privateGet(_a2 = _ReplacementsExtractors, _includeMatches).call(_a2, result[key], key, value);
  });
  __privateAdd(ReplacementsExtractors, _includeKeysMatches, (result, key, obj) => {
    result[key] = new window.Array();
    window.Object.keys(obj).forEach((k) => {
      var _a2, _b2;
      __privateGet(_a2 = _ReplacementsExtractors, _includeMatches).call(_a2, result[key], key, k);
      __privateGet(_b2 = _ReplacementsExtractors, _includeMatches).call(_b2, result[key], key, obj[k]);
    });
  });
  __publicField(ReplacementsExtractors, "child", (child) => buildObject2((result) => {
    var _a2, _b2, _c2, _d;
    __privateGet(_a2 = _ReplacementsExtractors, _includeStringMatches).call(_a2, result, "contents", child.content);
    __privateGet(_b2 = _ReplacementsExtractors, _includeStringMatches).call(_b2, result, "classes", child.classes.join(" "));
    __privateGet(_c2 = _ReplacementsExtractors, _includeKeysMatches).call(_c2, result, "styles", child.style);
    __privateGet(_d = _ReplacementsExtractors, _includeKeysMatches).call(_d, result, "attributes", child.attributes);
  }));
  __publicField(ReplacementsExtractors, "rule", (rule) => buildArray3((result) => {
    var _a2;
    if (isAssignedArray3(rule.nested)) {
      return rule.nested.map((r) => _ReplacementsExtractors.rule(r));
    }
    let c = "";
    for (const property in rule.properties) {
      c += `${property}:${rule.properties[property]};`;
    }
    __privateGet(_a2 = _ReplacementsExtractors, _includeMatches).call(_a2, result, "rules", c);
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

  // src/wuse.rendering-routines.mjs
  var _onFetchTemplate;
  var { noop: noop5, isAssignedArray: isAssignedArray4, hasObjectKeys: hasObjectKeys2, isNonEmptyString: isNonEmptyString4, isNonEmptyArray: isNonEmptyArray2, isAssignedObject: isAssignedObject4, ensureFunction: ensureFunction4 } = JavascriptHelpers;
  var { htmlEncode } = WebHelpers;
  var { SLOTS_KIND: SLOTS_KIND2, TEMPLATES_KIND: TEMPLATES_KIND2, TEXTNODE_TAG: TEXTNODE_TAG2 } = StringConstants;
  var _RenderingRoutines = class {
    static initialize(events) {
      if (isAssignedObject4(events)) {
        __privateSet(this, _onFetchTemplate, ensureFunction4(events.onFetchTemplate, __privateGet(this, _onFetchTemplate)));
      }
    }
  };
  var RenderingRoutines = _RenderingRoutines;
  _onFetchTemplate = new WeakMap();
  __privateAdd(RenderingRoutines, _onFetchTemplate, noop5);
  __publicField(RenderingRoutines, "cacheInvalidator", (item) => item.cache = null);
  __publicField(RenderingRoutines, "slotsInvalidator", (item) => item.kind === SLOTS_KIND2 ? _RenderingRoutines.cacheInvalidator(item) : void 0);
  __publicField(RenderingRoutines, "renderingIncluder", (item) => item.included = true);
  __publicField(RenderingRoutines, "renderingExcluder", (item) => item.included = false);
  __publicField(RenderingRoutines, "renderRule", (replacer, rule) => {
    if (isAssignedArray4(rule.nested)) {
      return `${rule.selector}{${rule.nested.map((r) => _RenderingRoutines.renderRule(replacer, r)).join("\n")}}`;
    } else if (isNonEmptyString4(rule.selector) && !rule.nested) {
      let c = new window.String();
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
    var _a2;
    if (child.kind === TEMPLATES_KIND2) {
      return __privateGet(_a2 = _RenderingRoutines, _onFetchTemplate).call(_a2, child.id);
    }
    if (child.tag === TEXTNODE_TAG2) {
      let c = child.content;
      child.replacements["contents"].forEach((r) => c = replacer(c, r));
      return child.encode ? htmlEncode(c) : c;
    }
    let result = isNonEmptyString4(child.id) ? `<${child.tag} id='${child.id}'` : `<${child.tag}`;
    if (!!child.classes.length) {
      let c = child.classes.join(" ");
      child.replacements["classes"].forEach((r) => c = replacer(c, r));
      result += ` class='${c}'`;
    }
    if (hasObjectKeys2(child.style)) {
      let c = " style='";
      for (const property in child.style) {
        c += `${property}: ${child.style[property]}; `;
      }
      c += "'";
      child.replacements["styles"].forEach((r) => c = replacer(c, r));
      result += c;
    }
    if (hasObjectKeys2(child.attributes)) {
      let c = new window.String();
      for (const property in child.attributes) {
        c += ` ${property}=${child.attributes[property]}`;
      }
      child.replacements["attributes"].forEach((r) => c = replacer(c, r));
      result += c;
    }
    if (typeof child.content === "string") {
      let c = child.content;
      child.replacements["contents"].forEach((r) => c = replacer(c, r));
      result += `>${child.encode ? htmlEncode(c) : c}</${child.tag}>`;
    } else {
      result += "/>";
    }
    return result;
  });

  // src/wuse.state-manager.mjs
  var _on_invalid_state, _on_invalid_key, _key, _keyed, _maker, _reader, _writer, _state, _store, _filiated, _persistState, persistState_fn;
  var { ensureFunction: ensureFunction5, isNonEmptyString: isNonEmptyString5, isAssignedObject: isAssignedObject5 } = JavascriptHelpers;
  var StateManager = class {
    constructor(maker, reader, writer, store = {}, onInvalidState = () => {
    }, onInvalidKey = () => {
    }) {
      __privateAdd(this, _persistState);
      __privateAdd(this, _on_invalid_state, null);
      __privateAdd(this, _on_invalid_key, null);
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
          let x = 0;
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
      __privateSet(this, _on_invalid_state, ensureFunction5(onInvalidState));
      __privateSet(this, _on_invalid_key, ensureFunction5(onInvalidKey));
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
      return __privateSet(this, _keyed, isNonEmptyString5(__privateSet(this, _key, key)));
    }
    hasKey() {
      return __privateGet(this, _keyed);
    }
    validateKey() {
      if (!__privateGet(this, _keyed)) {
        __privateGet(this, _on_invalid_key).call(this);
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
        if (isAssignedObject5(state)) {
          __privateSet(this, _state, state);
          __privateGet(this, _state).generation++;
          __privateMethod(this, _persistState, persistState_fn).call(this);
        } else {
          __privateGet(this, _on_invalid_state).call(this);
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
      if (isAssignedObject5(state)) {
        state.data = __privateGet(this, _writer).call(this);
        __privateMethod(this, _persistState, persistState_fn).call(this);
        return true;
      }
      return false;
    }
    readState() {
      const state = __privateGet(this, _state);
      if (isAssignedObject5(state) && state.persisted) {
        __privateGet(this, _reader).call(this, state.data);
        return true;
      }
      return false;
    }
    eraseState() {
      const state = __privateGet(this, _state);
      if (isAssignedObject5(state) && state.persisted && state.data) {
        delete state.data;
        __privateMethod(this, _persistState, persistState_fn).call(this);
        return true;
      }
      return false;
    }
  };
  _on_invalid_state = new WeakMap();
  _on_invalid_key = new WeakMap();
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

  // src/wuse.node-manager.mjs
  var _parent, _actual, _clone, _drop, drop_fn, _roll, roll_fn;
  var { WUSENODE_ATTRIBUTE: WUSENODE_ATTRIBUTE2 } = StringConstants;
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
      __privateMethod(this, _drop, drop_fn).call(this, original.getAttribute(WUSENODE_ATTRIBUTE2));
      __privateSet(this, _actual, original);
      __privateSet(this, _clone, original.cloneNode(false));
    }
    get element() {
      return __privateGet(this, _actual);
    }
    get next() {
      return __privateGet(this, _clone);
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
    const old = __privateGet(this, _parent).querySelector(`[${WUSENODE_ATTRIBUTE2}='${type}']`);
    if (old)
      __privateGet(this, _parent).removeChild(old);
  };
  _roll = new WeakSet();
  roll_fn = function() {
    const tmp = __privateGet(this, _clone);
    __privateSet(this, _clone, __privateGet(this, _actual).cloneNode(false));
    __privateSet(this, _actual, tmp);
  };

  // src/wuse.content-manager.mjs
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

  // src/wuse.parts-holder.mjs
  var _roll2, roll_fn2;
  var { isIntegerNumber, isAssignedObject: isAssignedObject6, cloneObject, forEachOwnProperty: forEachOwnProperty2, buildArray: buildArray4 } = JavascriptHelpers;
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
      if (this.prepare() && isAssignedObject6(item)) {
        this.push(item);
        __privateMethod(this, _roll2, roll_fn2).call(this, item);
      }
    }
    prepend(item) {
      if (this.prepare() && isAssignedObject6(item)) {
        this.unshift(item);
        __privateMethod(this, _roll2, roll_fn2).call(this, item);
      }
    }
    replace(index, item) {
      if (this.prepare() && index > -1 && isAssignedObject6(item)) {
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
        return true;
      }
      return false;
    }
    persist() {
      return buildArray4((result) => partsLooper(this, (key) => partProcessor(result, this[key], this.on_snapshot_part), (key) => result[key] = this[key]));
    }
    restore(owner, instance) {
      if (this.clear()) {
        this.owner = owner;
        partsLooper(instance, (key) => partProcessor(this, instance[key], this.on_recall_part), (key) => this[key] = instance[key]);
      }
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

  // src/wuse.children-holder.mjs
  var _extractor, _updater, _on_locked_definition, _debug;
  var ChildrenHolder = class extends PartsHolder {
    constructor(owner, extractor, recaller, updater, onLockedDefinition, debug2) {
      super(owner);
      __privateAdd(this, _extractor, (item) => {
      });
      __privateAdd(this, _updater, (holder) => {
      });
      __privateAdd(this, _on_locked_definition, (id) => {
      });
      __privateAdd(this, _debug, () => {
      });
      __publicField(this, "getIndexOf", (value) => super.getIndexOf("id", value));
      __publicField(this, "on_version_change", () => {
        if (this.last !== null) {
          this.last.version = this.version;
          this.last.replacements = __privateGet(this, _extractor).call(this, this.last);
        }
        __privateGet(this, _updater).call(this, this);
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug).call(this, this.owner, `children list version change: ${this.version}`);
      });
      __publicField(this, "on_forbidden_change", () => {
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug).call(this, this.owner, `children list is locked and can not be changed`);
        __privateGet(this, _on_locked_definition).call(this, this.owner.getMainAttribute("id"));
      });
      __privateSet(this, _extractor, extractor);
      this.on_recall_part = recaller;
      __privateSet(this, _updater, updater);
      __privateSet(this, _on_locked_definition, onLockedDefinition);
      __privateSet(this, _debug, debug2);
    }
  };
  _extractor = new WeakMap();
  _updater = new WeakMap();
  _on_locked_definition = new WeakMap();
  _debug = new WeakMap();

  // src/wuse.rules-holder.mjs
  var _extractor2, _on_locked_definition2, _debug2;
  var RulesHolder = class extends PartsHolder {
    constructor(owner, extractor, onLockedDefinition, debug2) {
      super(owner);
      __privateAdd(this, _extractor2, (item) => {
      });
      __privateAdd(this, _on_locked_definition2, (id) => {
      });
      __privateAdd(this, _debug2, () => {
      });
      __publicField(this, "getIndexOf", (value) => super.getIndexOf("selector", value));
      __publicField(this, "on_version_change", () => {
        if (this.last !== null) {
          this.last.version = this.version;
          this.last.replacements = __privateGet(this, _extractor2).call(this, this.last);
        }
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug2).call(this, this.owner, `rules list version change: ${this.version}`);
      });
      __publicField(this, "on_forbidden_change", () => {
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug2).call(this, this.owner, `rules list is locked and can not be changed`);
        __privateGet(this, _on_locked_definition2).call(this, this.owner.getMainAttribute("id"));
      });
      __privateSet(this, _extractor2, extractor);
      __privateSet(this, _on_locked_definition2, onLockedDefinition);
      __privateSet(this, _debug2, debug2);
    }
  };
  _extractor2 = new WeakMap();
  _on_locked_definition2 = new WeakMap();
  _debug2 = new WeakMap();

  // src/wuse.fields-holder.mjs
  var _on_locked_definition3, _debug3;
  var FieldsHolder = class extends PartsHolder {
    constructor(owner, onLockedDefinition, debug2) {
      super(owner);
      __privateAdd(this, _on_locked_definition3, (id) => {
      });
      __privateAdd(this, _debug3, () => {
      });
      __publicField(this, "establish", (name, value) => {
        if (this.prepare()) {
          const idx = super.getIndexOf("name", name);
          idx > -1 ? this[idx].value = value : this.append({ name, value });
          return true;
        }
        return false;
      });
      __publicField(this, "snapshot", () => buildArray((instance) => this.persist().forEach((item) => instance.push({ name: item.name, value: item.value }))));
      __publicField(this, "getIndexOf", (value) => super.getIndexOf("name", value));
      __publicField(this, "on_version_change", () => {
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug3).call(this, this.owner, `fields list version change: ${this.version}`);
      });
      __publicField(this, "on_forbidden_change", () => {
        window.Wuse.DEBUG && this.owner.isMainIdentified() && __privateGet(this, _debug3).call(this, this.owner, `fields list is locked and can not be changed`);
        __privateGet(this, _on_locked_definition3).call(this, this.owner.getMainAttribute("id"));
      });
      __publicField(this, "on_snapshot_part", (part) => part.value = this.owner[part.name]);
      __publicField(this, "on_recall_part", (part) => this.owner[part.name] = part.value);
      __privateSet(this, _on_locked_definition3, onLockedDefinition);
      __privateSet(this, _debug3, debug2);
    }
  };
  _on_locked_definition3 = new WeakMap();
  _debug3 = new WeakMap();

  // src/wuse.equality-analyzer.mjs
  var _last, _current, _equal, _analyzer;
  var { ensureFunction: ensureFunction6 } = JavascriptHelpers;
  var EqualityAnalyzer = class {
    constructor(analyzer) {
      __publicField(this, "rounds", 0);
      __privateAdd(this, _last, 0);
      __privateAdd(this, _current, null);
      __privateAdd(this, _equal, false);
      __privateAdd(this, _analyzer, null);
      __privateSet(this, _analyzer, ensureFunction6(analyzer));
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

  // src/wuse.base-element.mjs
  var _html, _rules, _children, _fields, _reactives, _options, _parameters, _elementEvents, _initialized, _identified, _slotted, _styled, _shadowed, _main, _style, _root, _inserted, _binded, _rendering, _filiatedKeys, _stateReader, _stateWriter, _stateManager, _binder, _unbinder, _makeBindingPerformers, _makeBindingHandlers, _contents, _waste, _measurement, _insertStyle, insertStyle_fn, _insertMain, insertMain_fn, _extirpateElements, extirpateElements_fn, _bind, bind_fn, _clearContents, clearContents_fn, _prepareContents, prepareContents_fn, _commitContents, commitContents_fn, _render, render_fn, _inject, inject_fn, _redraw, redraw_fn, _revise, revise_fn, _fieldRender, fieldRender_fn, _createField, createField_fn, _validateField, validateField_fn, _filiateChild, filiateChild_fn;
  var { EMPTY_STRING: EMPTY_STRING2, noop: noop6, ensureFunction: ensureFunction7, isOf: isOf4, isAssignedObject: isAssignedObject7, isAssignedArray: isAssignedArray5, isNonEmptyArray: isNonEmptyArray3, isNonEmptyString: isNonEmptyString6, forcedStringSplit: forcedStringSplit2, forEachOwnProperty: forEachOwnProperty3, buildArray: buildArray5, defineReadOnlyMembers } = JavascriptHelpers;
  var { removeChildren, isHTMLAttribute } = WebHelpers;
  var { WUSEKEY_ATTRIBUTE, DEFAULT_STYLE_TYPE, DEFAULT_STYLE_MEDIA, DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE, SLOTS_KIND: SLOTS_KIND3 } = StringConstants;
  var { createReactiveField } = ReactiveField;
  var { REGULAR } = ElementModes;
  var { newDefinition, newState, makeMainNode, makeStyleNode, performValidations, newChild, newRule, newNestedRule, tryToJoinRules, tryToJoinNestedRules } = ElementParts;
  var { extractReplacementsFromChild, extractReplacementsFromRule, scanChildrenForReplacements, scanRulesForReplacements } = TextReplacements;
  var { renderChild, renderRule, renderingIncluder, renderingExcluder, cacheInvalidator, slotsInvalidator } = RenderingRoutines;
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
  var getElementByIdFromRoot = (instance, id) => isNonEmptyString6(id) ? instance.selectChildElement(`#${id}`) : void 0;
  var isInvalidFieldName = (name) => typeof name !== "string" || !name.trim().length || name.startsWith("data") || isHTMLAttribute(name);
  var makeUserOptions = () => ({
    mainDefinition: newDefinition(),
    styleMedia: DEFAULT_STYLE_MEDIA,
    styleType: DEFAULT_STYLE_TYPE,
    rawContent: false,
    attributeKeys: true,
    elementKeys: true,
    autokeyChildren: true,
    automaticallyRestore: true,
    redrawReload: false,
    redrawRepaint: false,
    enclosingEvents: false
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
      __privateAdd(this, _clearContents);
      __privateAdd(this, _prepareContents);
      __privateAdd(this, _commitContents);
      __privateAdd(this, _render);
      __privateAdd(this, _inject);
      __privateAdd(this, _redraw);
      __privateAdd(this, _revise);
      __privateAdd(this, _fieldRender);
      __privateAdd(this, _createField);
      __privateAdd(this, _validateField);
      __privateAdd(this, _filiateChild);
      __privateAdd(this, _html, new window.String());
      __privateAdd(this, _rules, new RulesHolder(this, TextReplacements.extractReplacementsFromRule, RuntimeErrors3.onLockedDefinition, debug));
      __privateAdd(this, _children, new ChildrenHolder(this, TextReplacements.extractReplacementsFromChild, (part) => __privateGet(this, _filiatedKeys).tryToRemember(part), (holder) => {
        if (!__privateGet(this, _slotted))
          __privateSet(this, _slotted, __privateGet(this, _slotted) | holder.some((child) => child.kind === SLOTS_KIND3));
      }, RuntimeErrors3.onLockedDefinition, debug));
      __privateAdd(this, _fields, new FieldsHolder(this, RuntimeErrors3.onLockedDefinition, debug));
      __privateAdd(this, _reactives, new window.Set());
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
        forget: (child) => {
          const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
          child.attributes[WUSEKEY_ATTRIBUTE] = "";
          return wusekey;
        },
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
          this.parameters = data.parameters;
          __privateSet(this, _options, data.options);
          __privateSet(this, _slotted, data.slotted);
          __privateSet(this, _identified, data.identified);
          __privateSet(this, _html, data.html);
          __privateGet(this, _children).restore(this, data.children);
          __privateGet(this, _rules).restore(this, data.rules);
          __privateGet(this, _fields).restore(this, data.fields);
          __privateSet(this, _reactives, data.reactives).forEach((name) => this.makeReactiveField(name, this[name]));
        }
      });
      __privateAdd(this, _stateWriter, () => {
        return {
          parameters: __privateGet(this, _parameters),
          options: __privateGet(this, _options),
          slotted: __privateGet(this, _slotted),
          identified: __privateGet(this, _identified),
          html: __privateGet(this, _html),
          children: __privateGet(this, _children).persist(),
          rules: __privateGet(this, _rules).persist(),
          fields: __privateGet(this, _fields).persist(),
          reactives: __privateGet(this, _reactives)
        };
      });
      __privateAdd(this, _stateManager, new StateManager(newState, __privateGet(this, _stateReader), __privateGet(this, _stateWriter), window.Wuse.elementsStorage, RuntimeErrors3.onInvalidState, RuntimeErrors3.onInvalidKey));
      __privateAdd(this, _binder, (id) => {
        const el = getElementByIdFromRoot(this, id);
        if (el)
          this[id] = el;
      });
      __privateAdd(this, _unbinder, (id) => delete this[id]);
      __privateAdd(this, _makeBindingPerformers, (event, doer) => ({
        event,
        key: () => {
          if (__privateGet(this, _identified))
            doer(__privateGet(this, _options).mainDefinition.id);
          return (child) => doer(child.id);
        },
        handler: (id, evkind, capture) => {
          const hnd = this[`on_${id}_${evkind}`];
          if (typeof hnd === "function") {
            const el = getElementByIdFromRoot(this, id);
            if (el)
              el[event](evkind, hnd, capture);
          }
        }
      }));
      __privateAdd(this, _makeBindingHandlers, (performers) => ({
        key: __privateGet(this, _options).elementKeys && performers.key(),
        events: (item) => !!item.events.length && item.events.forEach((event) => event && performers.handler(item.id, event.kind, event.capture)),
        slots: () => this.on_slot_change && __privateGet(this, _root).querySelectorAll("slot").forEach((slot) => slot[performers.event]("slotchange", this.on_slot_change))
      }));
      __privateAdd(this, _contents, {
        root: new ContentManager((content) => this.innerHTML = content, (content) => true),
        style: new ContentManager((content) => __privateGet(this, _style) && __privateGet(this, _style).promote(content), (content) => !__privateGet(this, _waste).style.compute(content)),
        main: new ContentManager((content) => __privateGet(this, _main).promote(content), (content) => !__privateGet(this, _waste).main.compute(content)),
        renderizers: {
          replacer: (str, rep) => str.replace(rep.find, this[rep.field] !== void 0 ? this[rep.field] : EMPTY_STRING2),
          rule: (rule) => {
            const cts = __privateGet(this, _contents);
            return cts.style.append(rule.cache ? rule.cache : rule.cache = renderRule(cts.renderizers.replacer, rule));
          },
          children: {
            mixed: (child) => child.kind === SLOTS_KIND3 ? __privateGet(this, _contents).renderizers.children.slot(child) : __privateGet(this, _contents).renderizers.children.normal(child),
            slot: (child) => {
              if (!child.cache) {
                const cts = __privateGet(this, _contents);
                return cts.root.append(child.cache = renderChild(cts.renderizers.replacer, child), cts.root.verify());
              }
            },
            normal: (child) => {
              const cts = __privateGet(this, _contents);
              cts.main.append(child.cache ? child.cache : child.cache = renderChild(cts.renderizers.replacer, child));
            }
          }
        }
      });
      __privateAdd(this, _waste, makeWasteAnalyzers());
      __privateAdd(this, _measurement, makePerformanceWatches());
      defineReadOnlyMembers(this, {
        info: {
          instanceNumber: ++_BaseElement.instancesCount,
          unmodifiedRounds: 0,
          updatedRounds: 0
        },
        render: () => window.Wuse.RENDERING && __privateGet(this, _rendering) && __privateGet(this, _binded) && __privateMethod(this, _revise, revise_fn).call(this, true),
        redraw: () => window.Wuse.RENDERING && __privateGet(this, _rendering) && __privateGet(this, _binded) && __privateMethod(this, _revise, revise_fn).call(this, false),
        suspendRender: () => {
          __privateSet(this, _rendering, false);
          return this;
        },
        resumeRender: (autorender = true) => {
          __privateSet(this, _rendering, true);
          autorender && window.Wuse.RENDERING && __privateGet(this, _rendering) && __privateGet(this, _binded) && __privateMethod(this, _revise, revise_fn).call(this, true);
          return this;
        },
        isRenderSuspended: () => !__privateGet(this, _rendering)
      });
      __privateSet(this, _root, mode === REGULAR ? this : this.shadowRoot || this.attachShadow({ mode }));
      const evs = __privateGet(this, _elementEvents);
      evs.detect();
      evs.immediateTrigger("on_create");
      if (__privateGet(this, _options).attributeKeys) {
        const ats = this.getAttributeNames();
        if (!!ats.length)
          for (let x in ats) {
            const attr = ats[x];
            this[attr] = this.getAttribute(attr);
          }
      }
      if (this.dataset.wusekey)
        this.setElementsStoreKey(this.dataset.wusekey);
      const stm = __privateGet(this, _stateManager);
      if (stm.initializeState() > 1) {
        stm.state.data.options.automaticallyRestore ? this.restoreFromElementsStore() : evs.immediateTrigger("on_reconstruct", stm.state);
      } else {
        evs.immediateTrigger("on_construct", stm.state);
      }
      stm.writeState();
      __privateSet(this, _initialized, true);
    }
    get parameters() {
      return __privateGet(this, _parameters);
    }
    set parameters(value) {
      if (isAssignedObject7(__privateSet(this, _parameters, value)))
        forEachOwnProperty3(value, (name) => this[name] = value[name]);
    }
    selectChildElement(x) {
      return __privateGet(this, _root).querySelector(x);
    }
    selectChildElements(x) {
      return __privateGet(this, _root).querySelectorAll(x);
    }
    removeFromParent() {
      if (isAssignedObject7(this.parentElement)) {
        this.parentElement.removeChild(this);
        return true;
      }
      return false;
    }
    connectedCallback() {
      window.Wuse.MEASURE && __privateGet(this, _measurement).attachment.start();
      const evs = __privateGet(this, _elementEvents);
      evs.detect();
      evs.immediateTrigger("on_connect");
      __privateMethod(this, _inject, inject_fn).call(this, evs, "on_load");
      window.Wuse.MEASURE && __privateGet(this, _measurement).attachment.stop(window.Wuse.DEBUG);
    }
    disconnectedCallback() {
      window.Wuse.MEASURE && __privateGet(this, _measurement).dettachment.start();
      __privateMethod(this, _bind, bind_fn).call(this, false);
      __privateGet(this, _elementEvents).immediateTrigger("on_disconnect");
      __privateGet(this, _stateManager).writeState();
      window.Wuse.MEASURE && __privateGet(this, _measurement).dettachment.stop(window.Wuse.DEBUG);
    }
    deriveChildrenStoreKey(value) {
      __privateGet(this, _options).autokeyChildren = value;
      return this;
    }
    restoreOnReconstruct(value) {
      __privateGet(this, _options).automaticallyRestore = value;
      return this;
    }
    encloseRenderingEvents(value) {
      __privateGet(this, _options).enclosingEvents = value;
      return this;
    }
    fireSpecificRedrawEvents(reload, repaint) {
      __privateGet(this, _options).redrawReload = !!reload;
      __privateGet(this, _options).redrawRepaint = !!repaint;
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
    setStyleOptions(media, type) {
      if (isNonEmptyString6(media))
        __privateGet(this, _options).styleMedia = media;
      if (isNonEmptyString6(type))
        __privateGet(this, _options).styleType = type;
      return this;
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
        if (__privateGet(this, _options).autokeyChildren && !!__privateGet(this, _children).length) {
          __privateGet(this, _children).forEach((child) => {
            if (child.custom) {
              __privateGet(this, _filiatedKeys).forget(child);
              __privateGet(this, _filiatedKeys).tryToName(child);
              cacheInvalidator(child);
            }
          });
          this.redraw();
        }
        __privateGet(this, _stateManager).writeState();
      }
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
    isMainIdentified() {
      return __privateGet(this, _identified);
    }
    getMainAttribute(key) {
      return key === "id" && __privateGet(this, _identified) ? __privateGet(this, _options).mainDefinition.id : __privateGet(this, _options).mainDefinition.attributes[key];
    }
    setMainAttribute(key, value) {
      __privateGet(this, _options).mainDefinition.attributes[key] = value;
      if (__privateGet(this, _inserted)) {
        __privateGet(this, _main).element.setAttribute(key, value);
        __privateGet(this, _main).next.setAttribute(key, value);
      }
      return this;
    }
    removeMainAttribute(key) {
      delete __privateGet(this, _options).mainDefinition.attributes[key];
      if (__privateGet(this, _inserted)) {
        __privateGet(this, _main).element.removeAttribute(key);
        __privateGet(this, _main).next.removeAttribute(key);
      }
      return this;
    }
    addMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      if (cls.indexOf(klass) === -1) {
        cls.push(klass);
        if (__privateGet(this, _inserted)) {
          __privateGet(this, _main).element.classList.add(klass);
          __privateGet(this, _main).next.classList.add(klass);
        }
      }
      return this;
    }
    removeMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      const idx = cls.indexOf(klass);
      if (idx > -1) {
        cls.splice(idx, 1);
        if (__privateGet(this, _inserted)) {
          __privateGet(this, _main).element.classList.remove(klass);
          __privateGet(this, _main).next.classList.remove(klass);
        }
      }
      return this;
    }
    toggleMainClass(klass) {
      const cls = __privateGet(this, _options).mainDefinition.classes;
      const idx = cls.indexOf(klass);
      idx > -1 ? cls.splice(idx, 1) : cls.push(klass);
      if (__privateGet(this, _inserted)) {
        __privateGet(this, _main).element.classList.toggle(klass);
        __privateGet(this, _main).next.classList.toggle(klass);
      }
      return this;
    }
    setMainEventHandler(kind, handler, capture = false) {
      if (__privateGet(this, _identified) && isNonEmptyString6(kind) && isOf4(handler, window.Function)) {
        const def = __privateGet(this, _options).mainDefinition;
        const present = def.events.some((ev) => ev.kind === kind);
        if (!present)
          def.events.push({ kind, capture });
        const name = `on_${def.id}_${kind}`;
        if (__privateGet(this, _inserted)) {
          const el = __privateGet(this, _main).element;
          const nx = __privateGet(this, _main).next;
          if (present) {
            el.removeEventListener(kind, this[name], capture);
            nx.removeEventListener(kind, this[name], capture);
          }
          el.addEventListener(kind, handler, capture);
          nx.addEventListener(kind, handler, capture);
        }
        this[name] = handler;
        return true;
      }
      return false;
    }
    dropMainEventHandler(kind, capture = false) {
      if (__privateGet(this, _identified) && isNonEmptyString6(kind)) {
        const def = __privateGet(this, _options).mainDefinition;
        def.events = buildArray5((instance) => def.events.forEach((ev) => {
          if (ev.kind !== kind || ev.kind === kind && ev.capture !== capture)
            instance.push(ev);
        }));
        const name = `on_${def.id}_${kind}`;
        if (__privateGet(this, _inserted)) {
          __privateGet(this, _main).element.removeEventListener(kind, this[name], capture);
          __privateGet(this, _main).next.removeEventListener(kind, this[name], capture);
        }
        delete this[name];
        return true;
      }
      return false;
    }
    setMainElement(shorthandNotation) {
      const tmp = performValidations(newChild(shorthandNotation));
      if (tmp !== null) {
        if (isNonEmptyString6(tmp.content))
          return RuntimeErrors3.onInvalidDefinition(shorthandNotation);
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
        if (isNonEmptyArray3(tmp.events))
          def.events = tmp.events;
      }
      return this;
    }
    allowsRawContent() {
      return __privateGet(this, _options).rawContent;
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
    getCSSRulesCount() {
      return __privateGet(this, _rules).length;
    }
    appendCSSRule(selector, properties, nesting) {
      if (nesting)
        return this.appendCSSNestedRule(selector, properties, nesting);
      const sliced = __privateGet(this, _rules).slice(-1);
      const rule = newRule(selector, properties);
      if (!sliced.length || !tryToJoinRules(sliced[0], rule)) {
        __privateGet(this, _rules).append(rule);
      }
      return this;
    }
    prependCSSRule(selector, properties, nesting) {
      if (nesting)
        return this.prependCSSNestedRule(selector, properties, nesting);
      const sliced = __privateGet(this, _rules).slice(0, 1);
      const rule = newRule(selector, properties);
      if (!sliced.length || !tryToJoinRules(sliced[0], rule)) {
        __privateGet(this, _rules).prepend(rule);
      }
      return this;
    }
    appendCSSNestedRule(selector, subselector, properties) {
      const sliced = __privateGet(this, _rules).slice(-1);
      const rule = newNestedRule(selector, subselector, properties);
      if (!sliced.length || !tryToJoinNestedRules(sliced[0], rule)) {
        __privateGet(this, _rules).append(rule);
      }
      return this;
    }
    prependCSSNestedRule(selector, subselector, properties) {
      const sliced = __privateGet(this, _rules).slice(0, 1);
      const rule = newNestedRule(selector, subselector, properties);
      if (!sliced.length || !tryToJoinNestedRules(sliced[0], rule)) {
        __privateGet(this, _rules).prepend(rule);
      }
      return this;
    }
    hasCSSRuleBySelector(selector) {
      return __privateGet(this, _rules).getIndexOf(selector) > -1;
    }
    replaceCSSRuleBySelector(selector, properties) {
      __privateGet(this, _rules).replace(__privateGet(this, _rules).getIndexOf(selector), newRule(selector, properties));
      return this;
    }
    transferCSSRuleBySelector(selector, element) {
      if (isNonEmptyString6(selector) && typeof element === "object" && typeof __privateGet(element, _rules) === "object") {
        const rls = __privateGet(this, _rules);
        const idx = rls.getIndexOf(selector);
        if (idx > -1) {
          __privateGet(element, _rules).append(rls[idx]);
          rls.remove(idx);
          return true;
        }
      }
      return false;
    }
    removeCSSRuleBySelector(selector) {
      __privateGet(this, _rules).remove(__privateGet(this, _rules).getIndexOf(selector));
      return this;
    }
    removeAllCSSRules() {
      __privateGet(this, _rules).clear();
      return this;
    }
    adoptCSSStyleSheet(sheet) {
      if (sheet instanceof CSSStyleSheet) {
        const target = __privateGet(this, _shadowed) ? __privateGet(this, _root) : document;
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
        return true;
      }
      return false;
    }
    lockChildElements() {
      __privateGet(this, _children).locked = true;
      return this;
    }
    unlockChildElements() {
      __privateGet(this, _children).locked = false;
      return this;
    }
    getChildElementsCount() {
      return __privateGet(this, _children).length;
    }
    appendChildElement(shorthandNotation) {
      const tmp = __privateMethod(this, _filiateChild, filiateChild_fn).call(this, performValidations(newChild(shorthandNotation)));
      if (tmp !== null)
        __privateGet(this, _children).append(tmp);
      return this;
    }
    prependChildElement(shorthandNotation) {
      const tmp = __privateMethod(this, _filiateChild, filiateChild_fn).call(this, performValidations(newChild(shorthandNotation)));
      if (tmp !== null)
        __privateGet(this, _children).prepend(tmp);
      return this;
    }
    appendChildElements(items) {
      (isAssignedArray5(items) ? items : forcedStringSplit2(items, "\n")).forEach((item) => typeof item === "string" && !!item.trim().length && this.appendChildElement(item));
      return this;
    }
    prependChildElements(items) {
      (isAssignedArray5(items) ? items : forcedStringSplit2(items, "\n")).forEach((item) => typeof item === "string" && !!item.trim().length && this.prependChildElement(item));
      return this;
    }
    replaceChildElementById(id, shorthandNotation) {
      const tmp = performValidations(newChild(shorthandNotation));
      const chn = __privateGet(this, _children);
      const idx = chn.getIndexOf(id);
      if (idx > -1 && tmp !== null)
        chn.replace(idx, tmp);
      return this;
    }
    transferChildElementById(id, element) {
      var _a2;
      if (isNonEmptyString6(id) && typeof element === "object" && typeof __privateMethod(element, _filiateChild, filiateChild_fn) === "function") {
        const chn = __privateGet(this, _children);
        const idx = chn.getIndexOf(id);
        if (idx > -1) {
          const cel = chn[idx];
          const owa = __privateGet(this, _filiatedKeys).forget(cel);
          const tmp = __privateMethod(_a2 = element, _filiateChild, filiateChild_fn).call(_a2, cel);
          if (tmp !== null) {
            __privateGet(element, _children).append(tmp);
            chn.remove(idx);
            const clx = `on_${tmp.id}_click`;
            if (typeof this[clx] === "function") {
              const handler = this[clx];
              delete this[clx];
              element[clx] = handler;
            }
            return true;
          } else {
            cel.attributes[WUSEKEY_ATTRIBUTE] = owa;
          }
        }
      }
      return false;
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
        __privateGet(this, _children).forEach((child) => child.id === id && renderingIncluder(child));
      return this;
    }
    excludeChildElementById(id) {
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => child.id === id && renderingExcluder(child));
      return this;
    }
    invalidateChildElementsById(ids) {
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => ids.indexOf(child.id) > -1 && cacheInvalidator(child));
      return this;
    }
    invalidateChildElements(childs) {
      if (isAssignedArray5(childs))
        childs.forEach(cacheInvalidator);
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
    getInstanceFieldsCount() {
      return __privateGet(this, _fields).length;
    }
    makeField(name, value) {
      return __privateMethod(this, _createField, createField_fn).call(this, name, value, true);
    }
    makeReadonlyField(name, value) {
      return __privateMethod(this, _createField, createField_fn).call(this, name, value, false);
    }
    makeReactiveField(name, value, handler, initial = true) {
      if (__privateMethod(this, _validateField, validateField_fn).call(this, name)) {
        if (__privateGet(this, _fields).establish(name, value)) {
          createReactiveField(this, name, value, handler, (name2, label) => __privateMethod(this, _fieldRender, fieldRender_fn).call(this, name2, label || "$auto"), (name2) => this.dropField(name2));
          __privateGet(this, _reactives).add(name);
        }
        if (initial)
          __privateMethod(this, _fieldRender, fieldRender_fn).call(this, name, "$init");
      }
      return this;
    }
    makeExternalReactiveField(mirror, name, value, handler, initial = true) {
      return this.makeReactiveField(name, mirror[name] || value, (actions) => {
        mirror[name] = this[name];
        handler(actions);
      }, initial);
    }
    isReactiveField(name) {
      return __privateGet(this, _reactives).has(name);
    }
    hasField(name) {
      return __privateGet(this, _fields).getIndexOf(name) > -1;
    }
    dropField(name) {
      const fds = __privateGet(this, _fields);
      if (fds.prepare()) {
        const idx = fds.getIndexOf(name);
        if (idx > -1) {
          fds.splice(idx, 1);
          if (this.hasOwnProperty(name))
            delete this[name];
          if (__privateGet(this, _reactives).has(name))
            __privateGet(this, _reactives).delete(name);
          __privateGet(this, _stateManager).writeState();
          return true;
        }
      }
      return false;
    }
    dropAllFields() {
      const knames = [];
      const rnames = [];
      __privateGet(this, _fields).forEach((field) => {
        const name = field.name;
        this.hasOwnProperty(name) && knames.push(name);
        __privateGet(this, _reactives).has(name) && rnames.push(name);
      });
      if (__privateGet(this, _fields).clear()) {
        knames.forEach((name) => delete this[name]);
        rnames.forEach((name) => __privateGet(this, _reactives).delete(name));
        __privateGet(this, _stateManager).writeState();
        return true;
      }
      return false;
    }
    snapshotInstanceFields() {
      return __privateGet(this, _fields).snapshot();
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
      window.Wuse.register(this);
      return this;
    }
    static create(parameters, at = "body") {
      return window.Wuse.create({
        element: { type: this },
        target: at instanceof window.HTMLElement ? { node: at } : typeof at === "string" ? { selector: at } : at,
        instance: { parameters }
      });
    }
  };
  var BaseElement = _BaseElement;
  _html = new WeakMap();
  _rules = new WeakMap();
  _children = new WeakMap();
  _fields = new WeakMap();
  _reactives = new WeakMap();
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
  _binder = new WeakMap();
  _unbinder = new WeakMap();
  _makeBindingPerformers = new WeakMap();
  _makeBindingHandlers = new WeakMap();
  _contents = new WeakMap();
  _waste = new WeakMap();
  _measurement = new WeakMap();
  _insertStyle = new WeakSet();
  insertStyle_fn = function() {
    if (__privateSet(this, _styled, __privateSet(this, _style, !__privateGet(this, _rules).length ? null : new NodeManager(__privateGet(this, _root), makeStyleNode(__privateGet(this, _options).styleMedia, __privateGet(this, _options).styleType)))))
      __privateGet(this, _style).affiliate();
  };
  _insertMain = new WeakSet();
  insertMain_fn = function() {
    __privateSet(this, _main, new NodeManager(__privateGet(this, _root), makeMainNode(__privateGet(this, _options).mainDefinition))).affiliate();
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
      const bindingHandlers = __privateGet(this, _makeBindingHandlers).call(this, value ? __privateGet(this, _makeBindingPerformers).call(this, "addEventListener", __privateGet(this, _binder)) : __privateGet(this, _makeBindingPerformers).call(this, "removeEventListener", __privateGet(this, _unbinder)));
      if (__privateGet(this, _identified))
        bindingHandlers.events(__privateGet(this, _options).mainDefinition);
      if (!!__privateGet(this, _children).length)
        __privateGet(this, _children).forEach((child) => {
          if (!child.included && value)
            return;
          if (bindingHandlers.key)
            bindingHandlers.key(child);
          bindingHandlers.events(child);
        });
      if (__privateGet(this, _slotted) && __privateGet(this, _shadowed))
        bindingHandlers.slots();
      __privateSet(this, _binded, value);
    }
  };
  _clearContents = new WeakSet();
  clearContents_fn = function() {
    if (!!__privateGet(this, _children).length)
      __privateGet(this, _children).forEach(cacheInvalidator);
    if (!!__privateGet(this, _rules).length)
      __privateGet(this, _rules).forEach(cacheInvalidator);
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
    window.Wuse.DEBUG && __privateGet(this, _identified) && debug(this, `updated (root: ${cts.root.invalidated}, main: ${cts.main.invalidated}, style: ${cts.style.invalidated})`);
  };
  _render = new WeakSet();
  render_fn = function() {
    if (!__privateGet(this, _styled))
      __privateMethod(this, _insertStyle, insertStyle_fn).call(this);
    const opt = __privateGet(this, _options);
    const evs = __privateGet(this, _elementEvents);
    opt.enclosingEvents && evs.immediateTrigger("on_prerender");
    __privateMethod(this, _prepareContents, prepareContents_fn).call(this);
    const nfo = this.info;
    const cts = __privateGet(this, _contents);
    const result = cts.root.invalidated || cts.main.invalidated || cts.style.invalidated;
    if (result) {
      __privateMethod(this, _bind, bind_fn).call(this, false);
      __privateMethod(this, _commitContents, commitContents_fn).call(this, false, false, false);
      __privateMethod(this, _bind, bind_fn).call(this, true);
      nfo.updatedRounds++;
      evs.immediateTrigger("on_update");
      __privateGet(this, _stateManager).writeState();
      evs.committedTrigger("on_refresh");
    } else {
      nfo.unmodifiedRounds++;
    }
    window.Wuse.DEBUG && __privateGet(this, _identified) && debug(this, `unmodified: ${nfo.unmodifiedRounds} (main: ${__privateGet(this, _waste).main.rounds}, style: ${__privateGet(this, _waste).style.rounds}) | updated: ${nfo.updatedRounds}`);
    opt.enclosingEvents && evs.immediateTrigger("on_postrender");
    return result;
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
    __privateMethod(this, _bind, bind_fn).call(this, false);
    if (__privateGet(this, _inserted)) {
      __privateMethod(this, _extirpateElements, extirpateElements_fn).call(this);
      __privateSet(this, _inserted, false);
    }
    const evs = __privateGet(this, _elementEvents);
    evs.immediateTrigger("on_unload");
    evs.detect();
    const opt = __privateGet(this, _options);
    __privateMethod(this, _inject, inject_fn).call(this, evs, opt.redrawReload ? "on_reload" : "on_load");
    evs.committedTrigger(opt.redrawRepaint ? "on_repaint" : "on_refresh");
    return true;
  };
  _revise = new WeakSet();
  revise_fn = function(partial) {
    if (window.Wuse.MEASURE) {
      const measure = partial ? __privateGet(this, _measurement).partial : __privateGet(this, _measurement).full;
      measure.start();
      const result = partial ? __privateMethod(this, _render, render_fn).call(this) : __privateMethod(this, _redraw, redraw_fn).call(this);
      measure.stop(window.Wuse.DEBUG);
      return result;
    } else {
      return partial ? __privateMethod(this, _render, render_fn).call(this) : __privateMethod(this, _redraw, redraw_fn).call(this);
    }
  };
  _fieldRender = new WeakSet();
  fieldRender_fn = function(name, label = "$none") {
    if (__privateGet(this, _binded)) {
      let hittedRules, hittedChildren;
      const rulesHits = scanRulesForReplacements(__privateGet(this, _rules), name);
      if (hittedRules = !!rulesHits.length)
        rulesHits.forEach(cacheInvalidator);
      const childrenHits = scanChildrenForReplacements(__privateGet(this, _children), name);
      if (hittedChildren = !!childrenHits.length)
        childrenHits.forEach(cacheInvalidator);
      window.Wuse.DEBUG && __privateGet(this, _identified) && debug(this, `reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
      if (hittedChildren || hittedRules) {
        if (childrenHits.some((x) => !!x.kind.length)) {
          __privateGet(this, _children).forEach(slotsInvalidator);
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
      if (__privateGet(this, _initialized) && getElementByIdFromRoot(this, tmp.id)) {
        return RuntimeErrors3.onTakenId(tmp.id);
      }
      if (tmp.custom && __privateGet(this, _options).autokeyChildren && __privateGet(this, _stateManager).hasKey()) {
        __privateGet(this, _filiatedKeys).tryToName(tmp);
      }
    }
    return tmp;
  };
  __publicField(BaseElement, "instancesCount", 0);

  // src/wuse.initialization-routines.mjs
  var { defineReadOnlyMembers: defineReadOnlyMembers2, isOf: isOf5, buildArray: buildArray6 } = JavascriptHelpers;
  var InitializationRoutines = class {
    static detectFeatures(instance) {
      const detectFeature = (flag, msg) => !flag && RuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
      try {
        detectFeature(isOf5(window.document, window.HTMLDocument), "HTML Document");
        detectFeature(isOf5(window.customElements, window.CustomElementRegistry), "Custom Elements");
        instance.WebHelpers.onDOMContentLoaded(() => detectFeature(isOf5(window.document.body.attachShadow, window.Function), "Shadow DOM"));
      } catch (e) {
        RuntimeErrors.UNKNOWN_ERROR.emit();
      }
    }
    static initializeModules(instance) {
      instance.PerformanceMeasurement.initialize((stopWatch, event) => instance.debug(JSON.stringify(buildArray6((data) => {
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
      defineReadOnlyMembers2(instance, items.fields);
      defineReadOnlyMembers2(instance, items.methods);
    }
  };

  // src/wuse.performance-measurement.mjs
  var _finish, finish_fn, _a, _b, _c, _debugCallback;
  var formatTime = (time) => time > 1e3 ? (time / 1e3).toFixed(2) + "s" : time.toFixed(2) + "ms";
  var MeasureRound = class {
    constructor() {
      __publicField(this, "round", 0);
      __publicField(this, "domTime", window.Number.MAX_SAFE_INTEGER);
      __publicField(this, "renderTime", window.Number.MAX_SAFE_INTEGER);
    }
    getDebugInfo() {
      let result = new window.Object();
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
      var _a2;
      if (_PerformanceMeasurement.DOMUpdate.check) {
        if (this.best.domTime > (this.last.domTime = (this._end.dom = performance.now()) - this._begin)) {
          this.best.round = this.last.round;
          this.best.domTime = this.last.domTime;
        }
        this.averages.dom = (this.averages.dom * (this.rounds - 1) + this.last.domTime) / this.rounds;
        _PerformanceMeasurement.DOMUpdate.overall.compute(this.last.domTime);
      }
      _PerformanceMeasurement.BrowserRender.check ? setTimeout(() => __privateMethod(this, _finish, finish_fn).bind(this)(debug2)) : debug2 && __privateGet(_a2 = _PerformanceMeasurement, _debugCallback).call(_a2, this, "stop");
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
    var _a2;
    if (this.best.renderTime > (this.last.renderTime = (this._end.render = performance.now()) - this._begin)) {
      this.best.round = this.last.round;
      this.best.renderTime = this.last.renderTime;
    }
    this.averages.render = (this.averages.render * (this.rounds - 1) + this.last.renderTime) / this.rounds;
    _PerformanceMeasurement.BrowserRender.overall.compute(this.last.renderTime);
    debug2 && __privateGet(_a2 = _PerformanceMeasurement, _debugCallback).call(_a2, this, "finish");
  }, _a));
  __publicField(PerformanceMeasurement, "DOMUpdate", (_b = class {
  }, __publicField(_b, "check", true), __publicField(_b, "overall", null), _b));
  __publicField(PerformanceMeasurement, "BrowserRender", (_c = class {
  }, __publicField(_c, "check", false), __publicField(_c, "overall", null), _c));

  // src/wuse.simple-storage.mjs
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

  // src/wuse.core-class.mjs
  var { noop: noop7, isOf: isOf6 } = JavascriptHelpers;
  var { convertHTMLTagToShorthandNotation } = ElementParts;
  var { specializeClass, REGULAR: REGULAR2, OPEN, CLOSED } = ElementModes;
  var fields = {
    tmp: new window.Object(),
    WebHelpers,
    JsHelpers: JavascriptHelpers,
    PerformanceMeasurement,
    NonShadowElement: specializeClass(BaseElement, REGULAR2),
    OpenShadowElement: specializeClass(BaseElement, OPEN),
    ClosedShadowElement: specializeClass(BaseElement, CLOSED)
  };
  var methods = {
    debug: (msg) => window.console.log("[WUSE:DEBUG]", msg),
    blockUpdate: (task, arg) => {
      if (isOf6(task, Function)) {
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
    htmlToShorthand: (html) => convertHTMLTagToShorthandNotation(html),
    register: (classes) => ElementClasses.registerClasses(isOf6(classes, window.Array) ? classes : new window.Array(classes)),
    create: (configuration) => isOf6(configuration, window.Object) ? ElementClasses.createInstance(configuration.element, configuration.target, configuration.instance) : void 0
  };
  function makeCoreClass(version2) {
    var _a2;
    return _a2 = class {
      static get VERSION() {
        return version2;
      }
      static get elementCount() {
        return BaseElement.instancesCount;
      }
    }, __publicField(_a2, "DEBUG", false), __publicField(_a2, "FATALS", false), __publicField(_a2, "MEASURE", false), __publicField(_a2, "RENDERING", true), __publicField(_a2, "hashRoutine", StringHashing.defaultRoutine), __publicField(_a2, "elementsStorage", new SimpleStorage()), __publicField(_a2, "tmp", null), __publicField(_a2, "WebHelpers", null), __publicField(_a2, "JsHelpers", null), __publicField(_a2, "PerformanceMeasurement", null), __publicField(_a2, "NonShadowElement", null), __publicField(_a2, "OpenShadowElement", null), __publicField(_a2, "ClosedShadowElement", null), __publicField(_a2, "debug", noop7), __publicField(_a2, "blockUpdate", noop7), __publicField(_a2, "register", noop7), __publicField(_a2, "instantiate", noop7), __publicField(_a2, "create", noop7), __publicField(_a2, "isShadowElement", noop7), (() => {
      InitializationRoutines.declareUnwritableMembers(_a2, { fields, methods });
      InitializationRoutines.detectFeatures(_a2);
      InitializationRoutines.initializeModules(_a2);
    })(), _a2;
  }
  ;

  // package.json
  var version = "0.9.3";

  // src/wuse.js
  window.Wuse = window.Wuse || makeCoreClass(version);
})();
Wuse.DEBUG=Wuse.MEASURE=!0;
