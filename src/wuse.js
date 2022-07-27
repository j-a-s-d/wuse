// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseStringConstants from './wuse.string-constants.js';
import WuseWebHelpers from './wuse.web-helpers.js';
import WuseJsHelpers from './wuse.javascript-helpers.js';
import WuseRuntimeErrors from './wuse.runtime-errors.js';
import WuseEqualityAnalyzer from './wuse.equality-analyzer.js';
import WuseSimpleStorage from './wuse.simple-storage.js';
import WuseNodeManager from './wuse.node-manager.js';
import WuseContentManager from './wuse.content-manager.js';
import WusePerformanceMeasurement from './wuse.performance-measurement.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseTemplateImporter from './wuse.template-importer.js';

class Wuse {

  static get VERSION() { return "0.3.8"; }

  static WebHelpers = WuseWebHelpers;

  static JsHelpers = WuseJsHelpers;

  static PerformanceMeasurement = WusePerformanceMeasurement;

  static tmp = new window.Object(); // convenience temporary object

  static DEBUG = false; // debug mode

  static FATALS = false; // show-stopper errors

  static MEASURE = false; // performance monitoring

  static RENDERING = true; // global rendering flag

  static blockUpdate(task, arg) {
    if (WuseJsHelpers.isOf(task, Function)) {
      if (Wuse.DEBUG) Wuse.debug("blocking");
      Wuse.RENDERING = false;
      try {
        task(arg);
      } catch (e) {
        throw e;
      } finally {
        Wuse.RENDERING = true;
        if (Wuse.DEBUG) Wuse.debug("unblocking");
      }
    }
  }

  static debug(msg) {
    window.console.log("[WUSE:DEBUG]", msg);
  }

  static register(classes) {
    return WuseElementClasses.registerClasses(WuseJsHelpers.isOf(classes, window.Array) ? classes : new window.Array(classes));
  }

  static instantiate(classes, target) {
    return WuseElementClasses.instantiateClasses(WuseJsHelpers.isOf(classes, window.Array) ? classes : new window.Array(classes), target);
  }

  static isShadowElement(instance) {
    const p = window.Object.getPrototypeOf(instance.constructor);
    return p === Wuse.OpenShadowElement || p === Wuse.ClosedShadowElement;
  }

  static #ElementParts = class {

    static PartsHolder = class extends window.Array {

      owner = null;
      last = null;
      version = 0;

      constructor(owner) {
        super();
        this.owner = owner;
      }

      #roll(item)  {
        this.last = item;
        this.version++;
        this.on_version_change();
      }

      append(item) {
        if (WuseJsHelpers.isOf(item, window.Object)) {
          this.push(item);
          this.#roll(item);
        }
      }

      prepend(item) {
        if (WuseJsHelpers.isOf(item, window.Object)) {
          this.unshift(item);
          this.#roll(item);
        }
      }

      replace(index, item) {
        if ((index > -1) && WuseJsHelpers.isOf(item, window.Object)) {
          this.#roll(this[index] = item);
        }
      }

      on_version_change() {}

      persist() {
        let result = new window.Array();
        window.Object.getOwnPropertyNames(this).forEach(key => {
          switch (key) {
            case "owner":
            case "last":
            case "length":
              break;
            case "version":
              result[key] = this[key];
              break;
            default:
              if (window.Number.isInteger(Number(key))) {
                const item = window.Object.assign(new window.Object(), this[key]);
                if (item.cache) item.cache = null;
                result.push(item);
              }
              break;
          }
        });
        return result;
      }

      restore(instance) {
        window.Object.getOwnPropertyNames(instance).forEach(key => {
          switch (key) {
            case "length":
              break;
            case "version":
              this[key] = instance[key];
              break;
            default:
              if (window.Number.isInteger(Number(key))) {
                const item = window.Object.assign(new window.Object(), instance[key]);
                if (item.cache) item.cache = null;
                this.push(item);
              }
              break;
          }
        });
      }

    }

    static #ShorthandNotationParser = class {

      static #extractAttributes(result, input) {
        const op = input.indexOf("[");
        const cp = input.indexOf("]");
        if (op > -1 && cp > -1 && cp > op) {
          const ip = input.substr(op, cp - op + 1);
          const pp = ip.substr(1, ip.length - 2).split("|");
          for (var z in pp) {
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
          const capture = (rest || WuseJsHelpers.EMPTY_ARRAY).indexOf("capture") > -1;
          result.events.push(Wuse.#ElementParts.newEvent(event, capture))
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
        if (WuseJsHelpers.isNonEmptyString(value)) {
          var def = Wuse.#ElementParts.newDefinition();
          if (value.charAt(0) === '%') {
            if (value.startsWith(WuseStringConstants.TEMPLATES_KIND)) {
              return this.#extractData(def, value.replace(def.kind = WuseStringConstants.TEMPLATES_KIND, ""));
            } else if (value.startsWith(WuseStringConstants.SLOTS_KIND)) {
              return this.#extractData(def, value.replace(def.kind = WuseStringConstants.SLOTS_KIND, ""));
            } else {
              return null;
            }
          } else {
            return this.#extractData(def, value);
          }
        }
        return null;
      }

    }

    static #CSSPropertiesParser = class {

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
        let result = new window.Object();
        (WuseJsHelpers.isOf(content, window.Array) ? content : WuseJsHelpers.forcedStringSplit(content, "\n").map(x => x.trim()).join("").split(";")).forEach(
          item => WuseJsHelpers.isNonEmptyString(item) && this.#process(result, item.trim())
        );
        return result;
      }

    }

    static makeStyleNode(media, type) {
      var result = window.document.createElement("style");
      if (WuseJsHelpers.isNonEmptyString(media)) {
        result.setAttribute("media", media);
      }
      if (WuseJsHelpers.isNonEmptyString(type)) {
        result.setAttribute("type", type);
      }
      result.appendChild(window.document.createTextNode("")); // NOTE: check if this webkit hack is still required
      return result;
    }

    static newRule(selector, properties) {
      const s = WuseJsHelpers.isOf(selector, window.Array) ? selector.join(",") : "" + selector;
      return !s.length ? null : {
        selector: s,
        properties: WuseJsHelpers.isOf(properties, window.Object) ? properties : this.#CSSPropertiesParser.parse(properties),
        cache: null
      };
    }

    static newNestedRule(selector, sub, properties) {
      const s = WuseJsHelpers.isOf(selector, window.Array) ? selector.join(",") : "" + selector;
      const b = WuseJsHelpers.isOf(sub, window.Array) ? sub.join(",") : "" + sub;
      return !s.length || !b.length ? null : {
        selector: s,
        nested: [{
          selector: b,
          properties: WuseJsHelpers.isOf(properties, window.Object) ? properties : this.#CSSPropertiesParser.parse(properties)
        }],
        cache: null
      };
    }

    static tryToJoinRules(lr, rule) {
      if (lr.selector === rule.selector) {
        for (const p in rule.properties) {
          lr.properties[p] = rule.properties[p];
        }
        lr.cache = null;
        return true;
      }
      return false;
    }

    static tryToJoinNestedRules(lr, rule) {
      if (WuseJsHelpers.isOf(lr.nested, window.Array) && lr.selector === rule.selector) {
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

    static makeMainNode(mainDefinition) {
      var result = window.document.createElement(mainDefinition.tag);
      if (!!mainDefinition.id.length) {
        result.setAttribute("id", mainDefinition.id);
      }
      if (!!mainDefinition.classes.length) {
        result.setAttribute("class", mainDefinition.classes.join(" "));
      }
      if (WuseJsHelpers.hasObjectKeys(mainDefinition.style)) {
        var style = "";
        for (const property in mainDefinition.style) {
          style += property + ": " + mainDefinition.style[property] + "; ";
        }
        if (!!style.length) {
          const v = style.trim();
          result.setAttribute("style", v.endsWith(";") ? v.slice(0, -1) : v);
        }
      }
      if (WuseJsHelpers.hasObjectKeys(mainDefinition.attributes)) {
        for (const property in mainDefinition.attributes) {
          result.setAttribute(property, mainDefinition.attributes[property]);
        }
      }
      return result;
    }

    static newEvent(kind, capture) {
      return typeof kind === "string" && typeof capture === "boolean" ? { kind, capture: capture } : null;
    }

    static performValidations(child) {
      if (child.kind === WuseStringConstants.TEMPLATES_KIND) {
        if (!window.document.getElementById(child.id)) {
          return WuseRuntimeErrors.INEXISTENT_TEMPLATE.emit(child.id);
        }
      } else if (child.kind === WuseStringConstants.SLOTS_KIND) {
        if (new String(child.attributes["slot"]).replaceAll("\"", "").replaceAll("\'", "").length === 0) {
          return WuseRuntimeErrors.UNESPECIFIED_SLOT.emit(child.id);
        }
      } else if (typeof child.id !== "string" || (child.id !== "" && window.document.getElementById(child.id) !== null)) {
        return WuseRuntimeErrors.INVALID_ID.emit(child.id);
      }
      return child;
    }

    static newChild(shorthandNotation, rules) {
      var result = this.#ShorthandNotationParser.parse(shorthandNotation.trimLeft());
      if (!result) {
        return WuseRuntimeErrors.INVALID_DEFINITION.emit(shorthandNotation);
      }
      result.rules = WuseJsHelpers.isOf(rules, window.Array) ? rules : new window.Array();
      result.rendering = true;
      result.cache = null;
      return result;
    }

    static newDefinition() {
      return {
        kind: WuseStringConstants.DEFAULT_KIND,
        // =
        tag: WuseStringConstants.DEFAULT_TAG, id: "", classes: new window.Array(),
        attributes: new window.Object(), style: new window.Object(), events: new window.Array(),
        // =
        content: "", encode: false
      }
    }

  }

  static #elementsStorage = new WuseSimpleStorage();

  static get elementCount() { return Wuse.#BaseElement.instancesCount; }

  static hashRoutine = (s) => {
    // NOTE: Java's classic String.hashCode()
    // style, multiplying by the odd prime 31
    // ('(h << 5) - h' was faster originally)
    var h = 0;
    for (let x = 0; x < s.length; x++) {
      h = (h = ((h << 5) - h) + s.charCodeAt(x)) & h;
    }
    return h;
  }

  static #TextReplacements = class {

    static #ReplacementMarkers = class {

      static begin = null;

      static end = null;

      static enclose = match => this.begin + match + this.end;

      static makeRegExp = () => new window.RegExp("(?<=" + this.begin + ").*?(?=" + this.end + ")", "gs");

      static initialize(begin, end) {
        this.begin = begin;
        this.end = end;
      }

    }

    static #ReplacementsScanners = class {

      static rules = (rules, name) => WuseJsHelpers.buildArray(hits => rules.forEach(
        rule => rule.replacements.forEach(x => (x.field === name) && hits.push(rule))
      ));

      static children = (children, name) => WuseJsHelpers.buildArray(hits => {
        const processAll = child => {
          const process = collection => collection.forEach(
            x => (x.field === name) && hits.push(child)
          );
          ["contents", "classes", "styles", "attributes"].forEach(
            key => process(child.replacements[key])
          );
          child.rules.forEach(rule => rule.replacements.forEach(
            x => (x.field === name) && hits.push(child)
          )); // NOTE: in this case is faster to ignore duplication
        };
        children.forEach(child => child.rendering && processAll(child));
      });

    }

    static #ReplacementsExtractors = class {

      static #regExp = null;

      static #addReplacement = (hits, at, match) => hits.push({
        at, field: match.trim(), find: Wuse.#TextReplacements.#ReplacementMarkers.enclose(match)
      });

      static #includeMatches = (hits, at, str) => WuseJsHelpers.isNonEmptyString(str) && (str.match(this.#regExp) || WuseJsHelpers.EMPTY_ARRAY).forEach(
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

      static child = child => WuseJsHelpers.buildObject(result => {
        this.#includeStringMatches(result, "contents", child.content);
        this.#includeStringMatches(result, "classes", child.classes.join(" "));
        this.#includeKeysMatches(result, "styles", child.style);
        this.#includeKeysMatches(result, "attributes", child.attributes);
        child.rules.forEach(r => r.replacements = this.rule(r));
      });

      static rule = rule => WuseJsHelpers.buildArray(result => {
        if (WuseJsHelpers.isOf(rule.nested, window.Array)) {
          return rule.nested.map(r => this.rule(r));
        }
        var c = "";
        for (const property in rule.properties) {
          c += property + ":" + rule.properties[property] + ";";
        }
        this.#includeMatches(result, "rules", c);
      });

      static initialize(regExp) {
        this.#regExp = regExp;
      }

    }

    static initialize(openMarker, closeMarker) {
      this.#ReplacementMarkers.initialize(openMarker, closeMarker);
      this.#ReplacementsExtractors.initialize(this.#ReplacementMarkers.makeRegExp());
    }

    static extractReplacementsFromRule = this.#ReplacementsExtractors.rule;

    static extractReplacementsFromChild = this.#ReplacementsExtractors.child;

    static scanRulesForReplacements = this.#ReplacementsScanners.rules;

    static scanChildrenForReplacements = this.#ReplacementsScanners.children;

  }

  static makeReactiveField(obj, name, value, handler, renderizer) {
    const redefiner = (get, set) => window.Object.defineProperty(obj, name, {
      get, set, enumerable: true, configurable: true
    });
    const remover = () => delete obj[name];
    const recreator = (v, maneuverer) => Wuse.makeReactiveField(obj, name, v, maneuverer, renderizer);
    redefiner(() => value, (v) => {
      recreator(v, handler);
      !WuseJsHelpers.isOf(handler, window.Function) ? renderizer(name) : handler({
        renderize: (label) => renderizer(name, label), // manual render
        automate: () => recreator(v, null), // converts the field into an automatic reactive field (autorenders)
        freeze: () => redefiner(() => v, (v) => {}), // freeze the field value until calling defreeze()
        defreeze: () => recreator(v, handler), // defreezes the field after the freeze action
        dereact: () => redefiner(() => v, (v) => { remover(); obj[name] = v }), // disable reactiveness (convert into a simple field)
        remove: () => remover() // removes the field enterely
      });
    });
  }

  static #RenderingRoutines = class {

    static #onFetchTemplate = WuseJsHelpers.noop;

    static cacheInvalidator = item => item.cache = null;

    static renderingIncluder = item => item.rendering = true;

    static renderingExcluder = item => item.rendering = false;

    static renderRule = (replacer, rule) => {
      if (WuseJsHelpers.isOf(rule.nested, window.Array)) {
        return rule.selector + "{" + rule.nested.map(r => Wuse.#RenderingRoutines.renderRule(replacer, r)).join("\n") + "}";
      } else if (rule.selector !== "") {
        var c = "";
        for (const property in rule.properties) {
          c += property + ":" + rule.properties[property] + ";";
        }
        if (WuseJsHelpers.isOf(rule.replacements, window.Array) && !!rule.replacements.length) {
          rule.replacements.forEach(r => c = replacer(c, r));
        }
        return rule.selector + "{" + c + "}";
      }
      return null;
    }

    static renderChild = (replacer, child) => {
      if (child.kind === WuseStringConstants.TEMPLATES_KIND) {
        return this.#onFetchTemplate(child.id);
      }
      if (child.tag === WuseStringConstants.TEXTNODE_TAG) {
        var c = child.content;
        child.replacements["contents"].forEach(r => c = replacer(c, r));
        return child.encode ? WuseWebHelpers.htmlEncode(c) : c;
      }
      var result = WuseJsHelpers.isNonEmptyString(child.id) ? `<${child.tag} id='${child.id}'` : "<" + child.tag;
      if (!!child.classes.length) {
        var c = child.classes.join(" ");
        child.replacements["classes"].forEach(r => c = replacer(c, r));
        result += ` class='${c}'`;
      }
      if (WuseJsHelpers.hasObjectKeys(child.style)) {
        var c = " style='";
        for (const property in child.style) {
          c += property + ": " + child.style[property] + "; ";
        }
        c += "'";
        child.replacements["styles"].forEach(r => c = replacer(c, r));
        result += c;
      }
      if (WuseJsHelpers.hasObjectKeys(child.attributes)) {
        var c = "";
        for (const property in child.attributes) {
          c += " " + property + "=" + child.attributes[property];
        }
        child.replacements["attributes"].forEach(r => c = replacer(c, r));
        result += c;
      }
      if (typeof child.content === "string") {
        var c = child.content;
        child.replacements["contents"].forEach(r => c = replacer(c, r));
        result += `>${child.encode ? WuseWebHelpers.htmlEncode(c) : c}</${child.tag}>`;
      } else {
        result += "/>"
      }
      return result;
    }

    static initialize(events) {
      if (WuseJsHelpers.isAssignedObject(events)) {
        this.#onFetchTemplate = WuseJsHelpers.ensureFunction(events.onFetchTemplate, this.#onFetchTemplate);
      }
    }

  }

  static #BaseElement = class extends window.HTMLElement {

    static get EVENT_NAMES() {
      // NOTE: this are root-level events, that means it does not include other events like
      // those related to: children (click, mouseoout, etc), slots (change), document, etc.
      return [
        "on_create", // after element creation and root node definition (after `this` availability and where handled events had been detected for the first time and the shadow attachment performed -basically when isShadowElement(this) is true-, also mention that after on_create returns the attribute keys will be added -if applies-)
        "on_construct", // after the element state has been created for the first time (if it has a store key, otherwise it's called every time the element is recreated)
        "on_reconstruct", // after the element state has been loaded from a previous existence (if it has a store key, otherwise it's never called)
        "on_connect", // on connectedCallback (this event is called right after handled events had been redetected)
        "on_inject", // right after the elements insertion and before content generation (it's fired both, before on_load and before on_reload)
        "on_load", // after the initial elements insertion is performed (first moment where you can find the render and redraw methods published, and where you have the element keys binded -if applies-)
        "on_prerender", // before the render process start
        "on_update", // after an actual dom update occurs
        "on_postrender", // after the render process finishes (dom updated or not)
        "on_refresh", // after the browser paints the content after a render() call
        "on_unload", // after elements got removed
        "on_reload", // after any time the elements are reinserted (except the initial time, also by now handled events had been redetected again)
        "on_repaint", // after the browser paints the content after a redraw() call
        "on_disconnect" // on disconnectedCallback
      ];
    }

    static RootMode = class {

      static get REGULAR() { return "regular"; }

      static get OPEN() { return "open"; }

      static get CLOSED() { return "closed"; }

    }

    static specializeClass = (rootMode) => class extends this {

      constructor() {
        super(rootMode);
      }

    }

    static instancesCount = 0;

    // PRIVATE

    // CONTENT HOLDERS
    #html = "" // RAW HTML
    #rules = new (class extends Wuse.#ElementParts.PartsHolder {

      on_version_change() {
        this.last.version = this.version;
        this.last.replacements = Wuse.#TextReplacements.extractReplacementsFromRule(this.last);
        if (Wuse.DEBUG) this.owner.#debug(`rules list version change: ${this.version}`);
      }

    })(this) // CSS RULES
    #children = new (class extends Wuse.#ElementParts.PartsHolder {

      on_version_change() {
        this.last.version = this.version;
        this.last.replacements = Wuse.#TextReplacements.extractReplacementsFromChild(this.last);
        this.owner.#slotted |= (this.last.kind === WuseStringConstants.SLOTS_KIND);
        if (Wuse.DEBUG) this.owner.#debug(`children list version change: ${this.version}`);
      }

    })(this) // HTML ELEMENTS
    #fields = new (class extends Wuse.#ElementParts.PartsHolder {

      on_version_change() {
        if (Wuse.DEBUG) this.owner.#debug(`fields list version change: ${this.version}`);
      }

      snapshot() {
        this.forEach(x => x.value = this.owner[x.name]);
      }

      recall() {
        this.forEach(x => this.owner[x.name] = x.value);
      }

    })(this) // INSTANCE FIELDS

    // USER CUSTOMIZATION
    #options = {
      mainDefinition: Wuse.#ElementParts.newDefinition(),
      styleMedia: WuseStringConstants.DEFAULT_STYLE_MEDIA,
      styleType: WuseStringConstants.DEFAULT_STYLE_TYPE,
      rawContent: false,
      attributeKeys: false,
      elementKeys: true
    }
    #events = new window.Object();

    // CONTENT FLAGS
    #identified = false;
    #slotted = false;

    // INNER ELEMENTS
    #main = undefined;
    #style = undefined;
    #root = null;

    // NODE FLAGS
    #shadowed = Wuse.isShadowElement(this);
    #inserted = false;
    #binded = false;

    // ELEMENT STATE
    #elementsStore = Wuse.#elementsStorage;
    #elementState = null;
    #key = "";
    #keyed = false;

    // RENDERING STATE
    #contents = {
      root: new (class extends WuseContentManager {

        on_content_invalidation(content) {
          this.owner.innerHTML = content; // slot change
        }

      })(this),
      style: new (class extends WuseContentManager {

        on_content_invalidation(content) {
          this.owner.#style.promote(content); // rule change
        }

      })(this),
      main: new (class extends WuseContentManager {

        on_content_invalidation(content) {
          this.owner.#main.promote(content); // child change
        }

      })(this),
      renderizers: {
        rule: rule => this.#contents.style.append(rule.cache ? rule.cache : rule.cache = Wuse.#RenderingRoutines.renderRule(this.#renderingReplacer, rule)),
        children: {
          mixed: child => this.#shadowed && child.kind === WuseStringConstants.SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
          slot: child => {
            if (!child.cache) {
              this.#contents.root.verify(content => true);
              this.#contents.root.append(child.cache = Wuse.#RenderingRoutines.renderChild(this.#renderingReplacer, child));
            }
          },
          normal: child => {
            this.#contents.main.append(child.cache ? child.cache : child.cache = Wuse.#RenderingRoutines.renderChild(this.#renderingReplacer, child));
            child.rules.forEach(this.#contents.renderizers.rule);
          }
        }
      },
      gotModified: () => this.#contents.root.invalidated || this.#contents.main.invalidated || this.#contents.style.invalidated,
      getDebugInfo: () => `updated (root: ${this.#contents.root.invalidated}, main: ${this.#contents.main.invalidated}, style: ${this.#contents.style.invalidated})`
    }

    // FIXED CALLBACKS
    #renderingReplacer = (str, rep) => str.replace(rep.find, this[rep.field] !== undefined ? this[rep.field] : "");
    /*#ruleInserters = {
      rule: rule => this.#style.sheet.insertRule(rule.cache ? rule.cache : rule.cache = Wuse.#RenderingRoutines.renderRule(this.#renderingReplacer, rule)),
      childRule: child => child.rendering && child.rules.forEach(this.#ruleInserters.rule)
    }*/
    #bindingPerformers = {
      bind: {
        key: () => {
          const performer = (id) => {
            if (WuseJsHelpers.isNonEmptyString(id)) this[id] = this.#getElementByIdFromRoot(id);
          }
          if (this.#identified) performer(this.#options.mainDefinition.id);
          return child => performer(child.id);
        },
        event: "addEventListener"
      },
      unbind: {
        key: () => {
          const performer = (id) => delete this[id];
          if (this.#identified) performer(this.#options.mainDefinition.id);
          return child => performer(child.id);
        },
        event: "removeEventListener"
      }
    }

    // CONTENT ANALYSIS
    #waste = {
      main: new WuseEqualityAnalyzer(Wuse.hashRoutine),
      style: new WuseEqualityAnalyzer(Wuse.hashRoutine)
    }

    // PERFORMANCE MEASUREMENT
    #measurement = {
      attachment: new WusePerformanceMeasurement.StopWatch(),
      partial: new WusePerformanceMeasurement.StopWatch(),
      full: new WusePerformanceMeasurement.StopWatch(),
      dettachment: new WusePerformanceMeasurement.StopWatch()
    }

    // ROUTINES

    #debug(msg) {
      if (this.#identified) Wuse.debug(
        `#${this.#options.mainDefinition.id} (${this.info.instanceNumber}) | ${(typeof msg === "string" ? msg : JSON.stringify(msg))}`
      );
    }

    // DOM ROUTINES
    #insertElements() {
      if (this.#style) {
        this.#style.affiliate();
      }
      this.#main.affiliate();
      this.#inserted = true;
    }

    #prepareElements() {
      this.#style = !!this.#rules.length ? new WuseNodeManager(
        this.#root, Wuse.#ElementParts.makeStyleNode(this.#options.styleMedia, this.#options.styleType)
      ) : null;
      this.#main = new WuseNodeManager(
        this.#root, Wuse.#ElementParts.makeMainNode(this.#options.mainDefinition)
      );
      this.#children.forEach(Wuse.#RenderingRoutines.cacheInvalidator);
      this.#rules.forEach(Wuse.#RenderingRoutines.cacheInvalidator);
    }

    #extirpateElements() {
      if (this.#inserted) {
        this.#main.disaffiliate();
        if (this.#style) this.#style.disaffiliate();
        if (this.#slotted && this.#shadowed) WuseWebHelpers.removeChildren(this);
      }
      this.#inserted = false;
    }

    #getBindingHandlers(performers) {
      return {
        key: this.#options.elementKeys && performers.key(),
        event: (id, event, capture) => {
          const handler = this[`on_${id}_${event}`];
          if (handler) {
            const el = this.#getElementByIdFromRoot(id);
            if (el) el[performers.event](event, handler, capture);
          }
        },
        slots: () => this.on_slot_change && this.#root.querySelectorAll("slot").forEach(
          slot => slot[performers.event]("slotchange", this.on_slot_change)
        )
      };
    }

    #bind(value) {
      if ((this.#binded && !value) || (!this.#binded && value)) {
        const bindingHandlers = this.#getBindingHandlers(value ? this.#bindingPerformers.bind : this.#bindingPerformers.unbind);
        this.#children.forEach(child => {
          if (!child.rendering && value) {
            return;
          }
          if (bindingHandlers.key) bindingHandlers.key(child);
          child.events.forEach(event => event && bindingHandlers.event(child.id, event.kind, event.capture));
        });
        if (this.#slotted) bindingHandlers.slots();
        this.#binded = value;
      }
    }

    #getElementByIdFromRoot(id) {
      return WuseJsHelpers.isNonEmptyString(id) ? this.#root.querySelector(`#${id}`) : undefined;
    }

    #prepareContents() {
      this.#contents.root.reset("");
      this.#contents.style.reset("");
      this.#contents.main.reset(this.#html);
      const r = this.#slotted ? this.#contents.renderizers.children.mixed : this.#contents.renderizers.children.normal;
      this.#children.forEach(child => child.rendering && r(child));
      this.#rules.forEach(this.#contents.renderizers.rule);
      this.#contents.main.verify(content => !this.#waste.main.compute(content));
      this.#contents.style.verify(content => !this.#waste.style.compute(content));
    }

    #commitContents() {
      this.#contents.root.process();
      this.#contents.style.process();
      this.#contents.main.process();
      if (Wuse.DEBUG) this.#debug(this.#contents.getDebugInfo());
    }

    #render() {
      if (!Wuse.RENDERING) return;
      if (Wuse.MEASURE) this.#measurement.partial.start();
      this.#trigger("on_prerender");
      this.#prepareContents();
      if (this.#contents.gotModified()) {
        this.#bind(false);
        this.#commitContents();
        this.#bind(true);
        this.info.updatedRounds++;
        this.#trigger("on_update");
        this.#committedTrigger("on_refresh");
      } else {
        this.info.unmodifiedRounds++;
      }
      if (Wuse.DEBUG) this.#debug(
        `unmodified: ${this.info.unmodifiedRounds} (main: ${this.#waste.main.rounds}, style: ${this.#waste.style.rounds}) | updated: ${this.info.updatedRounds}`
      );
      this.#trigger("on_postrender");
      if (Wuse.MEASURE) this.#measurement.partial.stop(Wuse.DEBUG);
    }

    #inject(event) {
      this.#prepareElements();
      this.#insertElements();
      this.#trigger("on_inject");
      this.#prepareContents();
      // NOTE: due to it's optional nature, on injection the style element must be invalidated if present, no matter the triggered event or the content change
      this.#contents.style.verify(content => !!this.#style);
      this.#commitContents();
      this.#bind(true);
      this.#trigger(event);
    }

    #redraw(n) {
      if (Wuse.MEASURE) this.#measurement.full.start();
      this.#bind(false);
      this.#extirpateElements();
      this.#trigger("on_unload");
      this.#detectHandledEvents();
      this.#inject("on_reload");
      this.#committedTrigger("on_repaint");
      if (Wuse.MEASURE) this.#measurement.full.stop(Wuse.DEBUG);
    }

    // FIELD ROUTINES
    #fieldRender(name, label = "$none") {
      if (this.#binded) {
        const rulesHits = Wuse.#TextReplacements.scanRulesForReplacements(this.#rules, name);
        rulesHits.forEach(Wuse.#RenderingRoutines.cacheInvalidator);
        const childrenHits = Wuse.#TextReplacements.scanChildrenForReplacements(this.#children, name);
        childrenHits.forEach(Wuse.#RenderingRoutines.cacheInvalidator);
        if (Wuse.DEBUG) this.#debug(`reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
        if (!!rulesHits.length || !!childrenHits.length) {
          if (childrenHits.some(x => !!x.kind.length)) {
            // NOTE: when a slot gets invalidated the replaceChild will drop all other slots,
            // so to avoid a full redraw, all other slots are required to be invalidated too.
            this.#children.forEach(x => x.kind === WuseStringConstants.SLOTS_KIND ? Wuse.#RenderingRoutines.cacheInvalidator(x) : undefined);
          }
          this.render();
        }
      }
    }

    #makeReactiveField(name, value, handler, initial = true) {
      Wuse.makeReactiveField(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"));
      this.#fields.append({ name, value });
      if (initial) this.#fieldRender(name, "$init");
      return this;
    }

    // EVENT ROUTINES
    #trigger(event, argument) {
      this.#events[event] && this[event].call(this, argument);
    }

    #committedTrigger(event, argument) {
      if (this.#keyed) this.persistToElementsStore();
      this.#events[event] && window.requestAnimationFrame(() => this[event].call(this, argument));
    }

    #detectHandledEvents = () => Wuse.#BaseElement.EVENT_NAMES.forEach(
      event => this.#events[event] = typeof this[event] === "function"
    );

    // ELEMENT STATE
    #initializeElementState() {
      if (this.#keyed) {
        this.#elementState = this.#elementsStore.hasItem(this.#key) ?
          this.#elementsStore.getItem(this.#key) : { generation: 0, persisted: false };
        this.#elementState.generation++;
        this.#persistElementState();
        return true;
      }
      return false;
    }

    #persistElementState() {
      if (Wuse.DEBUG) this.#elementState.key = this.#key;
      this.#elementState.persisted = !!this.#elementState.data;
      this.#elementsStore.setItem(this.#key, this.#elementState);
    }

    #validateElementsStoreKey() {
      if (!this.#keyed) {
        WuseRuntimeErrors.INVALID_KEY.emit();
        return false;
      }
      return true;
    }

    // PUBLIC

    info = {
      instanceNumber: ++Wuse.#BaseElement.instancesCount,
      unmodifiedRounds: 0,
      updatedRounds: 0
    }

    constructor(mode) {
      super();
      this.#root = mode !== Wuse.#BaseElement.RootMode.REGULAR ? this.attachShadow({ mode }) : this;
      this.#detectHandledEvents();
      this.#trigger("on_create");
      if (this.#options.attributeKeys) this.getAttributeNames().forEach(attr => this[attr] = this.getAttribute(attr));
      this.#initializeElementState() && this.#elementState.generation > 1 ?
        this.#trigger("on_reconstruct", this.#elementState) :
        this.#trigger("on_construct");
    }

    get render() { return this.#binded ? this.#render : WuseJsHelpers.noop }

    get redraw() { return this.#binded ? this.#redraw : WuseJsHelpers.noop }

    connectedCallback() {
      if (Wuse.MEASURE) this.#measurement.attachment.start();
      this.#detectHandledEvents();
      this.#trigger("on_connect");
      this.#inject("on_load");
      if (this.#keyed) this.persistToElementsStore();
      if (Wuse.MEASURE) this.#measurement.attachment.stop(Wuse.DEBUG);
    }

    disconnectedCallback() {
      if (Wuse.MEASURE) this.#measurement.dettachment.start();
      this.#bind(false);
      this.#trigger("on_disconnect");
      if (Wuse.MEASURE) this.#measurement.dettachment.stop(Wuse.DEBUG);
    }

    getElementsStore() {
      return this.#elementsStore;
    }

    setElementsStore(storage) {
      this.#elementsStore = storage;
    }

    hasElementsStoreKey(key) {
      return this.#keyed;
    }

    getElementsStoreKey(key) {
      return this.#key;
    }

    setElementsStoreKey(key) {
      this.#keyed = WuseJsHelpers.isNonEmptyString(this.#key = key);
      return this;
    }

    persistToElementsStore() {
      if (this.#validateElementsStoreKey()) {
        const state = this.#elementState;
        if (state) {
          this.#fields.snapshot();
          state.data = new window.Object({
            options: this.#options,
            html: this.#html,
            children: this.#children.persist(),
            rules: this.#rules.persist(),
            fields: this.#fields.persist(),
            slotted: this.#slotted,
            identified: this.#identified
          });
          this.#persistElementState();
          return true;
        }
      }
      return false;
    }

    restoreFromElementsStore(keepDataStored) {
      if (this.#validateElementsStoreKey()) {
        const state = this.#elementState;
        if (state && state.persisted && state.data) {
          this.#options = state.data.options;
          this.#slotted = state.data.slotted;
          this.#identified = state.data.identified;
          this.#html = state.data.html;
          this.#children.restore(state.data.children);
          this.#children.owner = this;
          this.#rules.restore(state.data.rules);
          this.#rules.owner = this;
          this.#fields.restore(state.data.fields);
          this.#fields.owner = this;
          this.#fields.recall();
          if (!keepDataStored) {
            delete state.data;
            this.#persistElementState();
          }
          return true;
        }
      }
      return false;
    }

    selectChildElement(x) {
      return this.#root.querySelector(x);
    }

    setMainAttribute(key, value) {
      if (this.#inserted) this.#main.element.setAttribute(key, value);
    }

    setMainElement(shorthandNotation) {
      const tmp = Wuse.#ElementParts.newChild(shorthandNotation);
      if (Wuse.#ElementParts.performValidations(tmp)) {
        if (tmp.content !== "" || !!tmp.events.length) {
          return WuseRuntimeErrors.INVALID_DEFINITION.emit(shorthandNotation);
        }
        if (this.#identified = !!tmp.id.length) {
          this.#options.mainDefinition.id = tmp.id;
        }
        if (!!tmp.tag.length) {
          this.#options.mainDefinition.tag = tmp.tag;
        }
        if (!!tmp.classes.length) {
          this.#options.mainDefinition.classes = tmp.classes;
        }
        if (tmp.style) {
          this.#options.mainDefinition.style = tmp.style;
        }
        if (tmp.attributes) {
          this.#options.mainDefinition.attributes = tmp.attributes;
        }
      }
      return this;
    }

    setStyleOptions(media, type) {
      this.#options.styleMedia = media || "";
      this.#options.styleType = type || "";
      return this;
    }

    setElementsAsKeys(value) {
      this.#options.elementKeys = !!value;
      return this;
    }

    setAttributesAsKeys(value) {
      this.#options.attributeKeys = !!value;
      return this;
    }

    allowRawContent(value) {
      this.#options.rawContent = !!value;
      return this;
    }

    setRawContent(html) {
      this.#options.rawContent ? this.#html = html : WuseRuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    appendRawContent(html) {
      this.#options.rawContent ? this.#html = this.#html + html : WuseRuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    prependRawContent(html) {
      this.#options.rawContent ? this.#html = html + this.#html : WuseRuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    appendCSSRule(selector, properties, nesting) {
      if (nesting) return this.appendCSSNestedRule(selector, properties, nesting);
      const sliced = this.#rules.slice(-1);
      const rule = Wuse.#ElementParts.newRule(selector, properties);
      if (!sliced.length || !Wuse.#ElementParts.tryToJoinRules(sliced[0], rule)) {
        this.#rules.append(rule);
      }
      return this;
    }

    prependCSSRule(selector, properties, nesting) {
      if (nesting) return this.prependCSSNestedRule(selector, properties, nesting);
      const sliced = this.#rules.slice(0, 1);
      const rule = Wuse.#ElementParts.newRule(selector, properties);
      if (!sliced.length || !Wuse.#ElementParts.tryToJoinRules(sliced[0], rule)) {
        this.#rules.prepend(rule);
      }
      return this;
    }

    appendCSSNestedRule(selector, subselector, properties) {
      const sliced = this.#rules.slice(-1);
      const rule = Wuse.#ElementParts.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !Wuse.#ElementParts.tryToJoinNestedRules(sliced[0], rule)) {
        this.#rules.append(rule);
      }
      return this;
    }

    prependCSSNestedRule(selector, subselector, properties) {
      const sliced = this.#rules.slice(0, 1);
      const rule = Wuse.#ElementParts.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !Wuse.#ElementParts.tryToJoinNestedRules(sliced[0], rule)) {
        this.#rules.prepend(rule);
      }
      return this;
    }

    appendChildElement(shorthandNotation, rules) {
      this.#children.append(
        Wuse.#ElementParts.performValidations(
          Wuse.#ElementParts.newChild(shorthandNotation, rules)
        )
      );
      return this;
    }

    prependChildElement(shorthandNotation, rules) {
      this.#children.prepend(
        Wuse.#ElementParts.performValidations(
          Wuse.#ElementParts.newChild(shorthandNotation, rules)
        )
      );
      return this;
    }

    replaceChildElement(id, shorthandNotation) {
      this.#children.replace(
        this.#children.findIndex(child => child.id === id),
        Wuse.#ElementParts.newChild(shorthandNotation)
      );
      return this;
    }

    appendChildElements(items) {
      (WuseJsHelpers.isOf(items, window.Array) ? items : WuseJsHelpers.forcedStringSplit(items, "\n")).forEach(
        item => typeof item === "string" && !!item.trim().length && this.appendChildElement(item)
      );
      return this;
    }

    prependChildElements(items) {
      (WuseJsHelpers.isOf(items, window.Array) ? items : WuseJsHelpers.forcedStringSplit(items, "\n")).forEach(
        item => typeof item === "string" && !!item.trim().length && this.prependChildElement(item)
      );
      return this;
    }

    checkChildElementIsIncludedById(id, yes, no) {
      const fire = cb => WuseJsHelpers.isOf(cb, window.Function) ? cb() : undefined;
      this.#children.some(child => child.id === id && child.rendering) ? fire(yes) : fire(no);
      return this;
    }

    includeChildElementById(id) {
      this.#children.forEach(child => (child.id === id) && Wuse.#RenderingRoutines.renderingIncluder(child));
      return this;
    }

    excludeChildElementById(id) {
      this.#children.forEach(child => (child.id === id) && Wuse.#RenderingRoutines.renderingExcluder(child));
      return this;
    }

    invalidateChildElementsById(ids) {
      this.#children.forEach(child => (ids.indexOf(child.id) > -1) && Wuse.#RenderingRoutines.cacheInvalidator(child));
      return this;
    }

    invalidateChildElements(childs) {
      if (WuseJsHelpers.isOf(childs, window.Array)) childs.forEach(Wuse.#RenderingRoutines.cacheInvalidator);
      return this;
    }

    makeField(name, value) {
      this[name] = value;
      this.#fields.append({ name, value });
      return this;
    }

    makeReactiveField(name, value, handler, initial = true) {
      return this.#makeReactiveField(name, value, handler, initial);
    }

    makeExternalReactiveField(mirror, name, value, handler, initial = true) {
      return this.makeReactiveField(name, mirror[name] || value, actions => { mirror[name] = this[name]; handler(actions) }, initial);
    }

  }

  static NonShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.REGULAR);

  static OpenShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.OPEN);

  static ClosedShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.CLOSED);

  static {
    const detectFeature = (flag, msg) => !flag && WuseRuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
    try {
      detectFeature(WuseJsHelpers.isOf(window.document, window.HTMLDocument), "HTML Document");
      detectFeature(WuseJsHelpers.isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
      WuseWebHelpers.onDOMContentLoaded(() => detectFeature(WuseJsHelpers.isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
    } catch (e) {
      WuseRuntimeErrors.UNKNOWN_ERROR.emit();
    }
    WusePerformanceMeasurement.initialize((stopWatch, event) => Wuse.debug(JSON.stringify(WuseJsHelpers.buildArray(data => {
      data.push({ instances: Wuse.elementCount });
      data.push(stopWatch.getDebugInfo());
      switch (event) {
        case "stop":
          data.push(WusePerformanceMeasurement.DOMUpdate.overall.getDebugInfo());
          break;
        case "finish":
          data.push(WusePerformanceMeasurement.BrowserRender.overall.getDebugInfo());
          break;
      }
    }))));
    WuseElementClasses.initialize({
      onMisnamedClass: WuseRuntimeErrors.MISNAMED_CLASS.emit,
      onUnregistrableClass: WuseRuntimeErrors.UNREGISTRABLE_CLASS.emit,
      onUnregisteredClass: WuseRuntimeErrors.UNREGISTERED_CLASS.emit,
      onInvalidClass: WuseRuntimeErrors.INVALID_CLASS.emit,
      onDeferredInstantiation: WuseWebHelpers.onDOMContentLoaded
    });
    WuseTemplateImporter.initialize({
      onExtinctTemplate: WuseRuntimeErrors.EXTINCT_TEMPLATE.emit,
      onInvalidTemplate: WuseRuntimeErrors.INVALID_TEMPLATE.emit
    });
    Wuse.#RenderingRoutines.initialize({ onFetchTemplate: WuseTemplateImporter.fetch });
    Wuse.#TextReplacements.initialize(WuseStringConstants.DEFAULT_REPLACEMENT_OPEN, WuseStringConstants.DEFAULT_REPLACEMENT_CLOSE);
  }

}

window.Wuse = Wuse;

