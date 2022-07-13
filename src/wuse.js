// Wuse (Web Using Shadow Elements) by j-a-s-d

class Wuse {

  static get VERSION() { return "0.3.1"; }

  static tmp = new window.Object(); // convenience temporary object

  static DEBUG = false; // debug mode

  static FATALS = false; // show-stopper errors

  static MEASURE = false; // performance monitoring

  static RENDERING = true; // global rendering flag

  static blockUpdate(task, arg) {
    if (Wuse.isOf(task, Function)) {
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
    window.console.log(Wuse.#StringConstants.DEBUG_TAG, msg);
  }

  static isOf(instance, cls) {
    return !!(instance && instance.constructor === cls);
  }

  static isNonEmptyString(str) {
    return typeof str === "string" && !!str.length;
  }

  static forcedStringSplit(str, by) {
    return typeof str === "string" ? str.split(by) : new window.Array();
  }

  static hasObjectKeys(obj) {
    return !!window.Object.keys(obj).length;
  }

  static #instanceBuilder(instance, initializer) {
    if (Wuse.isOf(initializer, window.Function)) initializer(instance);
    return instance;
  }

  static buildArray(initializer) {
    return Wuse.#instanceBuilder(new window.Array(), initializer);
  }

  static buildObject(initializer) {
    return Wuse.#instanceBuilder(new window.Object(), initializer);
  }

  static EMPTY_ARRAY = new window.Array();

  static WebHelpers = class {

    static onDOMContentLoaded(callback) {
      if (Wuse.isOf(callback, window.Function)) {
        const loader = () => {
          callback();
          setTimeout(() => window.removeEventListener("DOMContentLoaded", loader), 100);
        }
        window.addEventListener("DOMContentLoaded", loader);
      }
    }

    static getUniqueId(prefix = "WUSE") {
      var result, p = "_" + (prefix ? prefix : "") + "_";
      while (window.document.getElementById(result = p + ("" + window.Math.random()).substring(2)) !== null);
      return result;
    }

    static getCSSVendorPrefix() {
      const computedStyle = window.getComputedStyle(window.document.body, '');
      const csPropertyNames = Array.prototype.slice.call(computedStyle);
      const cspnDashPrefixed = csPropertyNames.filter(x => x.charAt(0) === '-');
      return !!cspnDashPrefixed.length ? "-" + cspnDashPrefixed[0].split('-')[1] + "-" : "";
    }

  }

  static register(classes) {
    return Wuse.#ElementClasses.registerClasses(Wuse.isOf(classes, window.Array) ? classes : new window.Array(classes));
  }

  static instantiate(classes, target) {
    return Wuse.#ElementClasses.instantiateClasses(Wuse.isOf(classes, window.Array) ? classes : new window.Array(classes), target);
  }

  static isShadowElement(instance) {
    const p = window.Object.getPrototypeOf(instance.constructor);
    return p === Wuse.OpenShadowElement || p === Wuse.ClosedShadowElement;
  }

  static #PartsMakers = class {

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
          return input.slice(0, index);
        }
        return input;
      }

      static #extractEvents(result, input) {
        const tmp = input.replaceAll("!", " ").split(" ");
        tmp.slice(1).map(item => {
          const [event, ...rest] = item.toLowerCase().split("+");
          const capture = (rest || Wuse.EMPTY_ARRAY).indexOf("capture") > -1;
          result.events.push(Wuse.#PartsMakers.newEvent(event, capture))
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
        if (Wuse.isNonEmptyString(value)) {
          var def = Wuse.#PartsMakers.newDefinition();
          if (value.charAt(0) === '%') {
            if (value.startsWith(Wuse.#StringConstants.TEMPLATES_KIND)) {
              return this.#extractData(def, value.replace(def.kind = Wuse.#StringConstants.TEMPLATES_KIND, ""));
            } else if (value.startsWith(Wuse.#StringConstants.SLOTS_KIND)) {
              return this.#extractData(def, value.replace(def.kind = Wuse.#StringConstants.SLOTS_KIND, ""));
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
        (Wuse.isOf(content, window.Array) ? content : Wuse.forcedStringSplit(content, "\n").map(x => x.trim()).join("").split(";")).forEach(
          item => Wuse.isNonEmptyString(item) && this.#process(result, item.trim())
        );
        return result;
      }

    }

    static makeStyleNode(media, type) {
      var result = window.document.createElement("style");
      if (Wuse.isNonEmptyString(media)) {
        result.setAttribute("media", media);
      }
      if (Wuse.isNonEmptyString(type)) {
        result.setAttribute("type", type);
      }
      result.appendChild(window.document.createTextNode("")); // NOTE: check if this webkit hack is still required
      return result;
    }

    static newRule(selector, properties) {
      const s = Wuse.isOf(selector, window.Array) ? selector.join(",") : "" + selector;
      const p = Wuse.isOf(properties, window.Object) ? properties : this.#CSSPropertiesParser.parse(properties);
      return !s.length ? null : { selector: s, properties: p, cache: null };
    }

    static newNestedRule(selector, subselector, properties) {
      const s = Wuse.isOf(selector, window.Array) ? selector.join(",") : "" + selector;
      const b = Wuse.isOf(subselector, window.Array) ? subselector.join(",") : "" + subselector;
      const p = Wuse.isOf(properties, window.Object) ? properties : this.#CSSPropertiesParser.parse(properties);
      return !s.length || !b.length ? null : { selector: s, nested: [{ selector: b, properties: p }], cache: null };
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
      if (Wuse.isOf(lr.nested, window.Array) && lr.selector === rule.selector) {
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
      if (Wuse.hasObjectKeys(mainDefinition.style)) {
        var style = "";
        for (const property in mainDefinition.style) {
          style += property + ": " + mainDefinition.style[property] + "; ";
        }
        if (!!style.length) {
          const v = style.trim();
          result.setAttribute("style", v.endsWith(";") ? v.slice(0, -1) : v);
        }
      }
      if (Wuse.hasObjectKeys(mainDefinition.attributes)) {
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
      if (child.kind === Wuse.#StringConstants.TEMPLATES_KIND) {
        if (!window.document.getElementById(child.id)) {
          return Wuse.#RuntimeErrors.INEXISTENT_TEMPLATE.emit(child.id);
        }
      } else if (child.kind === Wuse.#StringConstants.SLOTS_KIND) {
        if (new String(child.attributes["slot"]).replaceAll("\"", "").replaceAll("\'", "").length === 0) {
          return Wuse.#RuntimeErrors.UNESPECIFIED_SLOT.emit(child.id);
        }
      } else if (typeof child.id !== "string" || (child.id !== "" && window.document.getElementById(child.id) !== null)) {
        return Wuse.#RuntimeErrors.INVALID_ID.emit(child.id);
      }
      return child;
    }

    static newChild(shorthandNotation, rules) {
      var result = this.#ShorthandNotationParser.parse(shorthandNotation.trimLeft());
      if (!result) {
        return Wuse.#RuntimeErrors.INVALID_DEFINITION.emit(shorthandNotation);
      }
      result.rules = Wuse.isOf(rules, window.Array) ? rules : new window.Array();
      result.rendering = true;
      result.cache = null;
      return result;
    }

    static newDefinition() {
      return {
        kind: Wuse.#StringConstants.DEFAULT_KIND,
        // =
        tag: Wuse.#StringConstants.DEFAULT_TAG, id: "", classes: new window.Array(),
        attributes: new window.Object(), style: new window.Object(), events: new window.Array(),
        // =
        content: ""
      }
    }

  }

  static SimpleStorage = class {

    // NOTE: this class implements the Web Storage API
    // well enough to operate without problems, plus
    // offering the addendum of the method has().

    #items = new window.Object();

    #getKeys() {
      return window.Object.keys(this.#items);
    }

    get length() {
      return this.#getKeys().length;
    }

    key(value) {
      return this.#getKeys()[value] || null;
    }

    getItem(key) {
      return this.#items[key];
    }

    setItem(key, state) {
      this.#items[key] = state;
    }

    removeItem(key) {
      delete this.#items[key];
    }

    clear() {
      this.#items = new window.Object();
    }

    has(key) {
      return this.#items.hasOwnProperty(key);
    }

  }

  static #elementsStorage = new Wuse.SimpleStorage();

  static #formatPerformance = time => time > 1000 ? (time / 1000).toFixed(2) + "s" : time.toFixed(2) + "ms";

  static #MeasureRound = class {

    round = 0;
    domTime = window.Number.MAX_SAFE_INTEGER;
    renderTime = window.Number.MAX_SAFE_INTEGER;
  
    getDebugInfo() {
      var result = new window.Object();
      result.round = this.round;
      result.domTime = Wuse.#formatPerformance(this.domTime);
      if (this.renderTime !== window.Number.MAX_SAFE_INTEGER) {
        result.renderTime = Wuse.#formatPerformance(this.renderTime);
      }
      return result;
    }

  }

  static #MeasureOverall = class {

    name = "";
    rounds = 0;
    time = 0;
    average = 0;

    constructor(name) {
      this.name = name;
    }

    compute(last) {
      this.rounds++;
      this.time += last;
      this.average = this.time / this.rounds;
    }

    getDebugInfo() {
      const spent = Wuse.#formatPerformance(this.time);
      const average = Wuse.#formatPerformance(this.average);
      return { name: this.name, rounds: this.rounds, spent, average };
    }

  }

  static StopWatch = class {

    // NOTE: remember this metrics are element-based.

    static DOMUpdate = class {

      // NOTE: this checks how much time was spent updating the
      // dom with the necessary changes.
      static check = true;
      static overall = new Wuse.#MeasureOverall("overall-dom-update");

    }

    static BrowserRender = class {

      // NOTE: this checks how much time was spent processing
      // all the requested changes to the dom, and it's
      // disabled by default since the only way to check that
      // (when the browser render finishes) is via a setTimeout
      // to capture the moment when the script execution is
      // resumed after all the dom changes were processed.
      static check = false;
      static overall = new Wuse.#MeasureOverall("overall-browser-render");

    }

    _begin = 0;
    _end = {
      dom: 0,
      render: 0
    }
    rounds = 0;
    last = new Wuse.#MeasureRound();
    best = new Wuse.#MeasureRound();
    averages = {
      dom: 0,
      render: 0
    }

    start() {
      if (Wuse.StopWatch.DOMUpdate.check || Wuse.StopWatch.BrowserRender.check) {
        this.last.round = ++this.rounds;
        this._begin = performance.now();
      }
    }

    stop() {
      if (Wuse.StopWatch.DOMUpdate.check) {
        if (this.best.domTime > (this.last.domTime = (this._end.dom = performance.now()) - this._begin)) {
          this.best.round = this.last.round;
          this.best.domTime = this.last.domTime;
        }
        this.averages.dom = ((this.averages.dom * (this.rounds - 1)) + this.last.domTime) / this.rounds;
        Wuse.StopWatch.DOMUpdate.overall.compute(this.last.domTime);
      }
      Wuse.StopWatch.BrowserRender.check ? setTimeout(this.finish.bind(this)) : Wuse.DEBUG && Wuse.debug(
        JSON.stringify(this.getDebugInfo()), JSON.stringify(Wuse.StopWatch.DOMUpdate.overall.getDebugInfo())
      );
    }

    finish() {
      if (this.best.renderTime > (this.last.renderTime = (this._end.render = performance.now()) - this._begin)) {
        this.best.round = this.last.round;
        this.best.renderTime = this.last.renderTime;
      }
      this.averages.render = ((this.averages.render * (this.rounds - 1)) + this.last.renderTime) / this.rounds;
      Wuse.StopWatch.BrowserRender.overall.compute(this.last.renderTime);
      if (Wuse.DEBUG) Wuse.debug(
        JSON.stringify(this.getDebugInfo()), JSON.stringify(Wuse.StopWatch.BrowserRender.overall.getDebugInfo())
      );
    }

    getDebugInfo() {
      return {
        rounds: this.rounds, last: this.last.getDebugInfo(), best: this.best.getDebugInfo(),
        averages: this.averages, instances: Wuse.#BaseElement.instancesCount
      }
    }

  }

  static WasteAnalyzer = class {

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

    rounds = 0; // WASTED RENDERS
    last = 0; // LAST HASH
    hash = 0; // CURRENT HASH
    wasted = false; // ROUND WASTED

    compute(content) {
      this.rounds += +(this.wasted = (this.last === (this.hash = Wuse.WasteAnalyzer.hashRoutine(content))));
      this.last = this.hash;
      return this.wasted;
    }

  }

  static #StringConstants = class {

    static ERROR_TAG = "[WUSE:ERROR]";
    static DEBUG_TAG = "[WUSE:DEBUG]";
    static TEMPLATES_KIND = "%templates%";
    static SLOTS_KIND = "%slots%";
    static DEFAULT_KIND = "";
    static DEFAULT_TAG = "div";
    static DEFAULT_STYLE_MEDIA = "screen";
    static DEFAULT_STYLE_TYPE = "text/css";
    static DEFAULT_REPLACEMENT_OPEN = "~{";
    static DEFAULT_REPLACEMENT_CLOSE = "}~";

  }

  static #RuntimeErrors = class {

    static #makeError = (code, writer) => { return { code, emit: (arg) => {
      const msg = `${Wuse.#StringConstants.ERROR_TAG} ${code} | ${writer(arg)}`;
      if (Wuse.FATALS || code < 10) {
        throw new window.Error(msg);
      } else {
        window.console.error(msg);
      }
      return null;
    }}}

    static get UNKNOWN_ERROR() {
      return this.#makeError(0, arg => `Unknown error.`);
    }

    static get UNSUPPORTED_FEATURE() {
      return this.#makeError(1, arg => `Unsupported feature: ${arg}.`);
    }

    static get UNREGISTERED_CLASS() {
      return this.#makeError(2, arg => `Unregistered class: ${arg}.`);
    }

    static get INVALID_CLASS() {
      return this.#makeError(3, arg => `Invalid class: ${arg}.`);
    }

    static get MISNAMED_CLASS() {
      return this.#makeError(4, arg => `Misnamed class: ${arg}.`);
    }

    static get INVALID_DEFINITION() {
      return this.#makeError(10, arg => `Invalid definition: ${arg}.`);
    }

    static get INVALID_ID() {
      return this.#makeError(11, arg => `Invalid id: ${arg}.`);
    }

    static get INVALID_KEY() {
      return this.#makeError(12, arg => `Call first: this.setElementsStoreKey(<your-valid-key>).`);
    }

    static get ALLOW_HTML() {
      return this.#makeError(13, arg => `Call first: this.allowRawContent(true).`);
    }

    static get INEXISTENT_TEMPLATE() {
      return this.#makeError(20, arg => `Inexistent template: #${arg}.`);
    }

    static get EXTINCT_TEMPLATE() {
      return this.#makeError(21, arg => `Extinct template: #${arg}.`);
    }

    static get UNESPECIFIED_SLOT() {
      return this.#makeError(22, arg => `Unespecified slot: #${arg}.`);
    }

  }

  static ObjectsArray = class extends window.Array {

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
      if (Wuse.isOf(item, window.Object)) {
        this.push(item);
        this.#roll(item);
      }
    }

    prepend(item) {
      if (Wuse.isOf(item, window.Object)) {
        this.unshift(item);
        this.#roll(item);
      }
    }

    replace(index, item) {
      if ((index > -1) && Wuse.isOf(item, window.Object)) {
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

  static ReactiveFields = class {

    static ReplacementMarkers = class {

      static begin = Wuse.#StringConstants.DEFAULT_REPLACEMENT_OPEN;

      static end = Wuse.#StringConstants.DEFAULT_REPLACEMENT_CLOSE;

      static enclose = match => this.begin + match + this.end;

      static makeRegExp = () => new RegExp("(?<=" + this.begin + ").*?(?=" + this.end + ")", "gs");

    }

    static ReplacementsScanners = class {

      static rules = (rules, name) => Wuse.buildArray(hits => rules.forEach(
        rule => rule.replacements.forEach(x => (x.field === name) && hits.push(rule))
      ));

      static children = (children, name) => Wuse.buildArray(hits => {
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

    static ReplacementsExtractors = class {

      static #regExpCache = null;

      static #performMatch = str => str.match(
        this.#regExpCache ? this.#regExpCache : this.#regExpCache = Wuse.ReactiveFields.ReplacementMarkers.makeRegExp()
      );

      static #addReplacement = (hits, at, match) => hits.push({
        at, find: Wuse.ReactiveFields.ReplacementMarkers.enclose(match), field: match.trim()
      });

      static #includeMatches = (hits, at, str) => Wuse.isNonEmptyString(str) && (this.#performMatch(str) || Wuse.EMPTY_ARRAY).forEach(
        match => this.#addReplacement(hits, at, match)
      );

      static #includeStringMatches = (result, key, value) => {
        result[key] = new window.Array();
        this.#includeMatches(result[key], key, value);
      }

      static #includeKeysMatches = (result, key, obj) => {
        result[key] = new window.Array();
        window.Object.keys(obj).forEach(k => {
          Wuse.ReactiveFields.ReplacementsExtractors.#includeMatches(result[key], key, k);
          Wuse.ReactiveFields.ReplacementsExtractors.#includeMatches(result[key], key, obj[k]);
        });
      }

      static child = child => Wuse.buildObject(result => {
        this.#includeStringMatches(result, "contents", child.content);
        this.#includeStringMatches(result, "classes", child.classes.join(" "));
        this.#includeKeysMatches(result, "styles", child.style);
        this.#includeKeysMatches(result, "attributes", child.attributes);
        child.rules.forEach(r => r.replacements = Wuse.ReactiveFields.ReplacementsExtractors.rule(r));
      });

      static rule = rule => Wuse.buildArray(result => {
        if (Wuse.isOf(rule.nested, window.Array)) {
          return rule.nested.map(r => Wuse.ReactiveFields.ReplacementsExtractors.rule(r));
        }
        var c = "";
        for (const property in rule.properties) {
          c += property + ":" + rule.properties[property] + ";";
        }
        this.#includeMatches(result, "rules", c);
      });

    }

    static make(obj, name, value, handler, renderizer) {
      const redefiner = (get, set) => window.Object.defineProperty(obj, name, {
        get, set, enumerable: true, configurable: true
      });
      const remover = () => delete obj[name];
      const recreator = (v, maneuverer) => this.make(obj, name, v, maneuverer, renderizer);
      redefiner(() => value, (v) => {
        recreator(v, handler);
        !Wuse.isOf(handler, window.Function) ? renderizer(name) : handler({
          renderize: (label) => renderizer(name, label), // manual render
          automate: () => recreator(v, null), // converts the field into an automatic reactive field (autorenders)
          freeze: () => redefiner(() => v, (v) => {}), // freeze the field value until calling defreeze()
          defreeze: () => recreator(v, handler), // defreezes the field after the freeze action
          dereact: () => redefiner(() => v, (v) => { remover(); obj[name] = v }), // disable reactiveness (convert into a simple field)
          remove: () => remover() // removes the field enterely
        });
      });
    }

  }

  static #NodeManager = class {

    #parent = null;
    #actual = null;
    #clone = null;

    constructor(parent, original) {
      this.#parent = parent;
      this.#actual = original;
      this.#clone = original.cloneNode(false);
    }

    get element() { return this.#actual; }

    affiliate() {
      this.#parent.appendChild(this.#actual);
    }

    disaffiliate(parent) {
      this.#parent.removeChild(this.#actual);
    }

    #roll() {
      const tmp = this.#clone;
      this.#clone = this.#actual.cloneNode(false);
      this.#actual = tmp;
    }

    promote(content) {
      this.#clone.innerHTML = content;
      this.#parent.replaceChild(this.#clone, this.#actual);
      this.#roll();
    }

  }

  static #ContentManager = class {

    owner = null;
    #invalidated = false;
    #content = "";

    constructor(owner) {
      this.owner = owner;
    }

    reset(content) {
      this.#invalidated = false;
      this.#content = content;
    }

    append(more) {
      this.#content += more;
    }

    verify(verifier) {
      if (Wuse.isOf(verifier, window.Function)) this.#invalidated = verifier(this.#content);
    }

    process() {
      if (this.#invalidated) this.on_content_invalidation(this.#content);
    }

    get invalidated() {
      return this.#invalidated;
    }

    on_content_invalidation(content) {}

  }

  static #BaseElement = class extends window.HTMLElement {

    static get EVENT_NAMES() {
      // NOTE: this are root-level events, that means it does not include other events like
      // those related to: children (click, mouseoout, etc), slots (change), document, etc.
      return [
        "on_create", // after element creation and root node definition (after `this` availability and where handled events had been detected for the first time and the shadow attachment performed -basically when isShadowElement(this) is true-, also mention that after on_create returns the attribute keys will be added -if applies-)
        "on_construct", // after the element state has been created for the first time (if it has a store key, otherwise it's called always)
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
    #rules = new (class extends Wuse.ObjectsArray {

      on_version_change() {
        this.last.version = this.version;
        this.last.replacements = Wuse.ReactiveFields.ReplacementsExtractors.rule(this.last);
        if (Wuse.DEBUG) this.owner.#debug(`rules list version change: ${this.version}`);
      }

    })(this) // CSS RULES
    #children = new (class extends Wuse.ObjectsArray {

      on_version_change() {
        this.last.version = this.version;
        this.last.replacements = Wuse.ReactiveFields.ReplacementsExtractors.child(this.last);
        this.owner.#slotted |= (this.last.kind === Wuse.#StringConstants.SLOTS_KIND);
        if (Wuse.DEBUG) this.owner.#debug(`children list version change: ${this.version}`);
      }

    })(this) // HTML ELEMENTS
    #fields = new (class extends Wuse.ObjectsArray {

      on_version_change() {
        if (Wuse.DEBUG) this.owner.#debug(`fields list version change: ${this.version}`);
      }

      snapshot() {
        this.forEach(x => x.value = this.owner[x.name]);
      }

      recall() {
        this.forEach(x => this.owner[x.name] = x.value);
      }

    })(this) // REACTIVE FIELDS

    // USER CUSTOMIZATION
    #options = {
      mainDefinition: Wuse.#PartsMakers.newDefinition(),
      styleMedia: Wuse.#StringConstants.DEFAULT_STYLE_MEDIA,
      styleType: Wuse.#StringConstants.DEFAULT_STYLE_TYPE,
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
      root: new (class extends Wuse.#ContentManager {

        on_content_invalidation(content) {
          this.owner.innerHTML = content; // slot change
        }

      })(this),
      style: new (class extends Wuse.#ContentManager {

        on_content_invalidation(content) {
          this.owner.#style.promote(content); // rule change
        }

      })(this),
      main: new (class extends Wuse.#ContentManager {

        on_content_invalidation(content) {
          this.owner.#main.promote(content); // child change
        }

      })(this),
      renderizers: {
        rule: rule => this.#contents.style.append(rule.cache ? rule.cache : rule.cache = this.#renderingPerformers.rule(rule)),
        children: {
          mixed: child => this.#shadowed && child.kind === Wuse.#StringConstants.SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
          slot: child => {
            if (!child.cache) {
              this.#contents.root.verify(content => true);
              this.#contents.root.append(child.cache = this.#renderingPerformers.child(child));
            }
          },
          normal: child => {
            this.#contents.main.append(child.cache ? child.cache : child.cache = this.#renderingPerformers.child(child));
            child.rules.forEach(this.#contents.renderizers.rule);
          }
        }
      },
      gotModified: () => this.#contents.root.invalidated || this.#contents.main.invalidated || this.#contents.style.invalidated,
      getDebugInfo: () => `updated (root: ${this.#contents.root.invalidated}, main: ${this.#contents.main.invalidated}, style: ${this.#contents.style.invalidated})`
    }

    // FIXED CALLBACKS
    /*#ruleInserters = {
      rule: rule => this.#style.sheet.insertRule(rule.cache ? rule.cache : rule.cache = this.#renderingPerformers.rule(rule)),
      childRule: child => child.rendering && child.rules.forEach(this.#ruleInserters.rule)
    }*/
    #bindingPerformers = {
      bind: {
        key: () => {
          const performer = (id) => {
            if (Wuse.isNonEmptyString(id)) this[id] = this.#getElementByIdFromRoot(id);
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
    #cacheInvalidator = item => item.cache = null;
    #renderingIncluder = item => item.rendering = true;
    #renderingExcluder = item => item.rendering = false;
    #renderingPerformers = {
      rule: (rule) => {
        if (Wuse.isOf(rule.nested, window.Array)) {
          return rule.selector + "{" + rule.nested.map(r => this.#renderingPerformers.rule(r)).join("\n") + "}";
        } else if (rule.selector !== "") {
          var c = "";
          for (const property in rule.properties) {
            c += property + ":" + rule.properties[property] + ";";
          }
          if (Wuse.isOf(rule.replacements, window.Array)) {
            rule.replacements.forEach(r => c = c.replace(r.find, this[r.field] !== undefined ? this[r.field] : ""));
          }
          return rule.selector + "{" + c + "}";
        }
        return null;
      },
      child: (child) => {
        if (child.kind === Wuse.#StringConstants.TEMPLATES_KIND) {
          const template = window.document.getElementById(child.id);
          return template !== null ? template.innerHTML : Wuse.#RuntimeErrors.EXTINCT_TEMPLATE.emit(child.id);
        }
        var result = "<" + child.tag;
        if (Wuse.isNonEmptyString(child.id)) {
          result += " id='" + child.id + "'";
        }
        if (!!child.classes.length) {
          var c = child.classes.join(" ");
          child.replacements["classes"].forEach(r => c = c.replace(r.find, this[r.field] !== undefined ? this[r.field] : ""));
          result += " class='" + c + "'";
        }
        if (Wuse.hasObjectKeys(child.style)) {
          var c = " style='";
          for (const property in child.style) {
            c += property + ": " + child.style[property] + "; ";
          }
          c += "'";
          child.replacements["styles"].forEach(r => c = c.replace(r.find, this[r.field] !== undefined ? this[r.field] : ""));
          result += c;
        }
        if (Wuse.hasObjectKeys(child.attributes)) {
          var c = "";
          for (const property in child.attributes) {
            c += " " + property + "=" + child.attributes[property];
          }
          child.replacements["attributes"].forEach(r => c = c.replace(r.find, this[r.field] !== undefined ? this[r.field] : ""));
          result += c;
        }
        if (typeof child.content === "string") {
          var c = child.content;
          child.replacements["contents"].forEach(r => c = c.replace(r.find, this[r.field] !== undefined ? this[r.field] : ""));
          result += ">" + c + "</" + child.tag + ">";
        } else {
          result += "/>"
        }
        return result;
      }
    }

    // RENDERING PERFORMANCE
    #waste = {
      main: new Wuse.WasteAnalyzer(),
      style: new Wuse.WasteAnalyzer()
    }

    // PERFORMANCE MEASUREMENT
    #measurement = {
      attachment: new Wuse.StopWatch(),
      partial: new Wuse.StopWatch(),
      full: new Wuse.StopWatch(),
      dettachment: new Wuse.StopWatch()
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
      this.#style = !!this.#rules.length ? new Wuse.#NodeManager(
        this.#root, Wuse.#PartsMakers.makeStyleNode(this.#options.styleMedia, this.#options.styleType)
      ) : null;
      this.#main = new Wuse.#NodeManager(
        this.#root, Wuse.#PartsMakers.makeMainNode(this.#options.mainDefinition)
      );
      this.#children.forEach(this.#cacheInvalidator);
      this.#rules.forEach(this.#cacheInvalidator);
    }

    #extirpateElements() {
      if (this.#inserted) {
        this.#main.disaffiliate();
        if (this.#style) this.#style.disaffiliate();
        if (this.#slotted && this.#shadowed) this.innerHTML = "";
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
      return Wuse.isNonEmptyString(id) ? this.#root.querySelector(`#${id}`) : undefined;
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
      if (Wuse.MEASURE) this.#measurement.partial.stop();
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
      if (Wuse.MEASURE) this.#measurement.full.stop();
    }

    // FIELD ROUTINES
    #fieldRender(name, label = "$none") {
      if (this.#binded) {
        const rulesHits = Wuse.ReactiveFields.ReplacementsScanners.rules(this.#rules, name);
        rulesHits.forEach(this.#cacheInvalidator);
        const childrenHits = Wuse.ReactiveFields.ReplacementsScanners.children(this.#children, name);
        childrenHits.forEach(this.#cacheInvalidator);
        if (Wuse.DEBUG) this.#debug(`reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
        if (!!rulesHits.length || !!childrenHits.length) {
          if (childrenHits.some(x => !!x.kind.length)) {
            // NOTE: when a slot gets invalidated the replaceChild will drop all other slots,
            // so to avoid a full redraw, all other slots are required to be invalidated too.
            this.#children.forEach(x => x.kind === Wuse.#StringConstants.SLOTS_KIND ? this.#cacheInvalidator(x) : undefined);
          }
          this.render();
        }
      }
    }

    #makeReactiveField(name, value, handler, initial = true) {
      Wuse.ReactiveFields.make(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"));
      if (initial) this.#fieldRender(name, "$init");
    }

    #republishField(name, value) {
      delete this[name];
      window.Object.defineProperty(this, name, { value });
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
        this.#elementState = this.#elementsStore.has(this.#key) ?
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
        Wuse.#RuntimeErrors.INVALID_KEY.emit();
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

    render() {}

    redraw() {}

    connectedCallback() {
      if (Wuse.MEASURE) this.#measurement.attachment.start();
      this.#detectHandledEvents();
      this.#trigger("on_connect");
      this.#republishField("render", this.#render);
      this.#republishField("redraw", this.#redraw);
      this.#inject("on_load");
      if (this.#keyed) this.persistToElementsStore();
      if (Wuse.MEASURE) this.#measurement.attachment.stop();
    }

    disconnectedCallback() {
      if (Wuse.MEASURE) this.#measurement.dettachment.start();
      this.#bind(false);
      this.#trigger("on_disconnect");
      if (Wuse.MEASURE) this.#measurement.dettachment.stop();
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
      this.#keyed = Wuse.isNonEmptyString(this.#key = key);
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
      const tmp = Wuse.#PartsMakers.newChild(shorthandNotation);
      if (Wuse.#PartsMakers.performValidations(tmp)) {
        if (tmp.content !== "" || !!tmp.events.length) {
          return Wuse.#RuntimeErrors.INVALID_DEFINITION.emit(shorthandNotation);
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
      this.#options.rawContent ? this.#html = html : Wuse.#RuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    appendRawContent(html) {
      this.#options.rawContent ? this.#html = this.#html + html : Wuse.#RuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    prependRawContent(html) {
      this.#options.rawContent ? this.#html = html + this.#html : Wuse.#RuntimeErrors.ALLOW_HTML.emit();
      return this;
    }

    appendCSSRule(selector, properties, nesting) {
      if (nesting) return this.appendCSSNestedRule(selector, properties, nesting);
      const sliced = this.#rules.slice(-1);
      const rule = Wuse.#PartsMakers.newRule(selector, properties);
      if (!sliced.length || !Wuse.#PartsMakers.tryToJoinRules(sliced[0], rule)) {
        this.#rules.append(rule);
      }
      return this;
    }

    prependCSSRule(selector, properties, nesting) {
      if (nesting) return this.prependCSSNestedRule(selector, properties, nesting);
      const sliced = this.#rules.slice(0, 1);
      const rule = Wuse.#PartsMakers.newRule(selector, properties);
      if (!sliced.length || !Wuse.#PartsMakers.tryToJoinRules(sliced[0], rule)) {
        this.#rules.prepend(rule);
      }
      return this;
    }

    appendCSSNestedRule(selector, subselector, properties) {
      const sliced = this.#rules.slice(-1);
      const rule = Wuse.#PartsMakers.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !Wuse.#PartsMakers.tryToJoinNestedRules(sliced[0], rule)) {
        this.#rules.append(rule);
      }
      return this;
    }

    prependCSSNestedRule(selector, subselector, properties) {
      const sliced = this.#rules.slice(0, 1);
      const rule = Wuse.#PartsMakers.newNestedRule(selector, subselector, properties);
      if (!sliced.length || !Wuse.#PartsMakers.tryToJoinNestedRules(sliced[0], rule)) {
        this.#rules.prepend(rule);
      }
      return this;
    }

    appendChildElement(shorthandNotation, rules) {
      this.#children.append(
        Wuse.#PartsMakers.performValidations(
          Wuse.#PartsMakers.newChild(shorthandNotation, rules)
        )
      );
      return this;
    }

    prependChildElement(shorthandNotation, rules) {
      this.#children.prepend(
        Wuse.#PartsMakers.performValidations(
          Wuse.#PartsMakers.newChild(shorthandNotation, rules)
        )
      );
      return this;
    }

    replaceChildElement(id, shorthandNotation) {
      this.#children.replace(
        this.#children.findIndex(child => child.id === id),
        Wuse.#PartsMakers.newChild(shorthandNotation)
      );
      return this;
    }

    appendChildElements(items) {
      (Wuse.isOf(items, window.Array) ? items : Wuse.forcedStringSplit(items, "\n")).forEach(
        item => typeof item === "string" && !!item.trim().length && this.appendChildElement(item)
      );
      return this;
    }

    prependChildElements(items) {
      (Wuse.isOf(items, window.Array) ? items : Wuse.forcedStringSplit(items, "\n")).forEach(
        item => typeof item === "string" && !!item.trim().length && this.prependChildElement(item)
      );
      return this;
    }

    checkChildElementIsIncludedById(id, yes, no) {
      const fire = cb => Wuse.isOf(cb, window.Function) ? cb() : undefined;
      this.#children.some(child => child.id === id && child.rendering) ? fire(yes) : fire(no);
      return this;
    }

    includeChildElementById(id) {
      this.#children.forEach(child => (child.id === id) && this.#renderingIncluder(child));
      return this;
    }

    excludeChildElementById(id) {
      this.#children.forEach(child => (child.id === id) && this.#renderingExcluder(child));
      return this;
    }

    invalidateChildElementsById(ids) {
      this.#children.forEach(child => (ids.indexOf(child.id) > -1) && this.#cacheInvalidator(child));
      return this;
    }

    invalidateChildElements(childs) {
      if (Wuse.isOf(childs, window.Array)) childs.forEach(this.#cacheInvalidator);
      return this;
    }

    makeField(name, value) {
      this[name] = value;
      this.#fields.append({ name, value });
      return this;
    }

    makeReactiveField(name, value, handler, initial = true) {
      this.#makeReactiveField(name, value, handler, initial);
      this.#fields.append({ name, value });
      return this;
    }

    makeExternalReactiveField(mirror, name, value, handler, initial = true) {
      this.makeReactiveField(name, mirror[name] || value, actions => { mirror[name] = this[name]; handler(actions) }, initial);
      return this;
    }

  }

  static #ElementClasses = class {

    static #convertClassNameToKebabCaseTag(name) {
      return name.toLowerCase().replaceAll("_", "-");
    }

    static #classRegistrar(klass) {
      Wuse.isNonEmptyString(klass.name) && klass.name.indexOf("_") > 0 ?
        klass.tag = Wuse.#ElementClasses.#convertClassNameToKebabCaseTag(klass.name) :
        Wuse.#RuntimeErrors.MISNAMED_CLASS.emit(klass.name);
      window.HTMLElement.isPrototypeOf(klass) ?
        window.customElements.define(klass.tag, klass) :
        Wuse.#RuntimeErrors.INVALID_CLASS.emit(klass.name);
    }

    static registerClasses(classes) {
      window.Array.prototype.forEach.call(classes, Wuse.#ElementClasses.#classRegistrar);
    }

    static #immediateClassInstantiator(klass, target) {
      const t = Wuse.isNonEmptyString(target) ? window.document.querySelector(target) : window.document.body;
      if (t) t.appendChild(window.document.createElement(klass.tag));
    }

    static #instantiateClass(klass, target) {
      const instantiator = () => Wuse.#ElementClasses.#immediateClassInstantiator(klass, target);
      window.document.body ? instantiator() : Wuse.WebHelpers.onDOMContentLoaded(instantiator);
    }

    static instantiateClasses(classes, target) {
      window.Array.prototype.forEach.call(classes, (klass) => window.customElements.get(klass.tag) ?
        Wuse.#ElementClasses.#instantiateClass(klass, target) :
        Wuse.#RuntimeErrors.UNREGISTERED_CLASS.emit(klass.name)
      );
    }

  }

  static NonShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.REGULAR);

  static OpenShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.OPEN);

  static ClosedShadowElement = Wuse.#BaseElement.specializeClass(Wuse.#BaseElement.RootMode.CLOSED);

  static {
    const detectFeature = (flag, msg) => !flag && Wuse.#RuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
    try {
      detectFeature(Wuse.isOf(window.document, window.HTMLDocument), "HTML Document");
      detectFeature(Wuse.isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
      Wuse.WebHelpers.onDOMContentLoaded(() => detectFeature(Wuse.isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
    } catch {
      Wuse.#RuntimeErrors.UNKNOWN_ERROR.emit();
    }
  }

}

