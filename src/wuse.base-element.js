// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseJsHelpers from './wuse.javascript-helpers.js';
import WuseStringConstants from './wuse.string-constants.js';
import WuseTextReplacements from './wuse.text-replacements.js';
import WuseRenderingRoutines from './wuse.rendering-routines.js';
import WuseEqualityAnalyzer from './wuse.equality-analyzer.js';
import WuseNodeManager from './wuse.node-manager.js';
import WuseContentManager from './wuse.content-manager.js';
import WusePartsHolder from './wuse.parts-holder.js';
import WuseElementParts from './wuse.element-parts.js';

const EVENT_NAMES =
  // NOTE: this are root-level events, that means it does not include other events like
  // those related to: children (click, mouseoout, etc), slots (change), document, etc.
  [
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

class RootModes {

  static get REGULAR() { return "regular"; }

  static get OPEN() { return "open"; }

  static get CLOSED() { return "closed"; }

}

export default class BaseElement extends window.HTMLElement {

  // PRIVATE

  // CONTENT HOLDERS
  #html = ""; // RAW HTML
  #rules = new (class extends WusePartsHolder {
    on_version_change() {
      this.last.version = this.version;
      this.last.replacements = WuseTextReplacements.extractReplacementsFromRule(this.last);
      if (window.Wuse.DEBUG) this.owner.#debug(`rules list version change: ${this.version}`);
    }
  })(this); // CSS RULES
  #children = new (class extends WusePartsHolder {
    on_version_change() {
      this.last.version = this.version;
      this.last.replacements = WuseTextReplacements.extractReplacementsFromChild(this.last);
      this.owner.#slotted |= (this.last.kind === WuseStringConstants.SLOTS_KIND);
      if (window.Wuse.DEBUG) this.owner.#debug(`children list version change: ${this.version}`);
    }
  })(this); // HTML ELEMENTS
  #fields = new (class extends WusePartsHolder {
    on_version_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`fields list version change: ${this.version}`);
    }
    snapshot() {
      this.forEach(x => x.value = this.owner[x.name]);
    }
    recall() {
      this.forEach(x => this.owner[x.name] = x.value);
    }
  })(this); // INSTANCE FIELDS

  // USER CUSTOMIZATION
  #options = {
    mainDefinition: WuseElementParts.newDefinition(),
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
  #shadowed = window.Wuse.isShadowElement(this);
  #inserted = false;
  #binded = false;

  // ELEMENT STATE
  #elementsStore = window.Wuse.elementsStorage;
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
      rule: rule => this.#contents.style.append(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#renderingReplacer, rule)),
      children: {
        mixed: child => this.#shadowed && child.kind === WuseStringConstants.SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
        slot: child => {
          if (!child.cache) {
            this.#contents.root.verify(content => true);
            this.#contents.root.append(child.cache = WuseRenderingRoutines.renderChild(this.#renderingReplacer, child));
          }
        },
        normal: child => {
          this.#contents.main.append(child.cache ? child.cache : child.cache = WuseRenderingRoutines.renderChild(this.#renderingReplacer, child));
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
    rule: rule => this.#style.sheet.insertRule(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#renderingReplacer, rule)),
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
    main: new WuseEqualityAnalyzer(window.Wuse.hashRoutine),
    style: new WuseEqualityAnalyzer(window.Wuse.hashRoutine)
  }

  // PERFORMANCE MEASUREMENT
  #measurement = {
    attachment: new window.Wuse.PerformanceMeasurement.StopWatch(),
    partial: new window.Wuse.PerformanceMeasurement.StopWatch(),
    full: new window.Wuse.PerformanceMeasurement.StopWatch(),
    dettachment: new window.Wuse.PerformanceMeasurement.StopWatch()
  }

  // ROUTINES

  #debug(msg) {
    if (this.#identified) window.Wuse.debug(
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
      this.#root, WuseElementParts.makeStyleNode(this.#options.styleMedia, this.#options.styleType)
    ) : null;
    this.#main = new WuseNodeManager(
      this.#root, WuseElementParts.makeMainNode(this.#options.mainDefinition)
    );
    this.#children.forEach(WuseRenderingRoutines.cacheInvalidator);
    this.#rules.forEach(WuseRenderingRoutines.cacheInvalidator);
  }

  #extirpateElements() {
    if (this.#inserted) {
      this.#main.disaffiliate();
      if (this.#style) this.#style.disaffiliate();
       if (this.#slotted && this.#shadowed) window.Wuse.WebHelpers.removeChildren(this);
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
    if (window.Wuse.DEBUG) this.#debug(this.#contents.getDebugInfo());
  }

  #render() {
    if (!window.Wuse.RENDERING) return;
    if (window.Wuse.MEASURE) this.#measurement.partial.start();
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
    if (window.Wuse.DEBUG) this.#debug(
      `unmodified: ${this.info.unmodifiedRounds} (main: ${this.#waste.main.rounds}, style: ${this.#waste.style.rounds}) | updated: ${this.info.updatedRounds}`
    );
    this.#trigger("on_postrender");
    if (window.Wuse.MEASURE) this.#measurement.partial.stop(window.Wuse.DEBUG);
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

  #redraw() {
    if (window.Wuse.MEASURE) this.#measurement.full.start();
    this.#bind(false);
    this.#extirpateElements();
    this.#trigger("on_unload");
    this.#detectHandledEvents();
    this.#inject("on_reload");
    this.#committedTrigger("on_repaint");
    if (window.Wuse.MEASURE) this.#measurement.full.stop(window.Wuse.DEBUG);
  }

  // FIELD ROUTINES
  #fieldRender(name, label = "$none") {
    if (this.#binded) {
      const rulesHits = WuseTextReplacements.scanRulesForReplacements(this.#rules, name);
      rulesHits.forEach(WuseRenderingRoutines.cacheInvalidator);
      const childrenHits = WuseTextReplacements.scanChildrenForReplacements(this.#children, name);
      childrenHits.forEach(WuseRenderingRoutines.cacheInvalidator);
      if (window.Wuse.DEBUG) this.#debug(`reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
      if (!!rulesHits.length || !!childrenHits.length) {
        if (childrenHits.some(x => !!x.kind.length)) {
          // NOTE: when a slot gets invalidated the replaceChild will drop all other slots,
          // so to avoid a full redraw, all other slots are required to be invalidated too.
          this.#children.forEach(x => x.kind === WuseStringConstants.SLOTS_KIND ? WuseRenderingRoutines.cacheInvalidator(x) : undefined);
        }
        this.render();
      }
    }
  }

  #makeReactiveField(name, value, handler, initial = true) {
    window.Wuse.makeReactiveField(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"));
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

  #detectHandledEvents = () => EVENT_NAMES.forEach(
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
    if (window.Wuse.DEBUG) this.#elementState.key = this.#key;
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
    instanceNumber: ++this.instancesCount,
    unmodifiedRounds: 0,
    updatedRounds: 0
  }

  constructor(mode) {
    super();
    this.#root = mode !== BaseElement.RootMode.REGULAR ? this.attachShadow({ mode }) : this;
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
    if (window.Wuse.MEASURE) this.#measurement.attachment.start();
    this.#detectHandledEvents();
    this.#trigger("on_connect");
    this.#inject("on_load");
    if (this.#keyed) this.persistToElementsStore();
    if (window.Wuse.MEASURE) this.#measurement.attachment.stop(window.Wuse.DEBUG);
  }

  disconnectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.dettachment.start();
    this.#bind(false);
    this.#trigger("on_disconnect");
    if (window.Wuse.MEASURE) this.#measurement.dettachment.stop(window.Wuse.DEBUG);
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
    const tmp = WuseElementParts.newChild(shorthandNotation);
    if (WuseElementParts.performValidations(tmp)) {
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
    const rule = WuseElementParts.newRule(selector, properties);
    if (!sliced.length || !WuseElementParts.tryToJoinRules(sliced[0], rule)) {
      this.#rules.append(rule);
    }
    return this;
  }

  prependCSSRule(selector, properties, nesting) {
    if (nesting) return this.prependCSSNestedRule(selector, properties, nesting);
    const sliced = this.#rules.slice(0, 1);
    const rule = WuseElementParts.newRule(selector, properties);
    if (!sliced.length || !WuseElementParts.tryToJoinRules(sliced[0], rule)) {
      this.#rules.prepend(rule);
    }
    return this;
  }

  appendCSSNestedRule(selector, subselector, properties) {
    const sliced = this.#rules.slice(-1);
    const rule = WuseElementParts.newNestedRule(selector, subselector, properties);
    if (!sliced.length || !WuseElementParts.tryToJoinNestedRules(sliced[0], rule)) {
      this.#rules.append(rule);
    }
    return this;
  }

  prependCSSNestedRule(selector, subselector, properties) {
    const sliced = this.#rules.slice(0, 1);
    const rule = WuseElementParts.newNestedRule(selector, subselector, properties);
    if (!sliced.length || !WuseElementParts.tryToJoinNestedRules(sliced[0], rule)) {
      this.#rules.prepend(rule);
    }
    return this;
  }

  appendChildElement(shorthandNotation, rules) {
    this.#children.append(
      WuseElementParts.performValidations(
        WuseElementParts.newChild(shorthandNotation, rules)
      )
    );
    return this;
  }

  prependChildElement(shorthandNotation, rules) {
    this.#children.prepend(
      WuseElementParts.performValidations(
        WuseElementParts.newChild(shorthandNotation, rules)
      )
    );
    return this;
  }

  replaceChildElement(id, shorthandNotation) {
    this.#children.replace(
      this.#children.findIndex(child => child.id === id),
      WuseElementParts.newChild(shorthandNotation)
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
    this.#children.forEach(child => (child.id === id) && WuseRenderingRoutines.renderingIncluder(child));
    return this;
  }

  excludeChildElementById(id) {
    this.#children.forEach(child => (child.id === id) && WuseRenderingRoutines.renderingExcluder(child));
    return this;
  }

  invalidateChildElementsById(ids) {
    this.#children.forEach(child => (ids.indexOf(child.id) > -1) && WuseRenderingRoutines.cacheInvalidator(child));
    return this;
  }

  invalidateChildElements(childs) {
    if (WuseJsHelpers.isOf(childs, window.Array)) childs.forEach(WuseRenderingRoutines.cacheInvalidator);
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

  static RootMode = RootModes;

  static specializeClass = rootMode => class extends this {

    constructor() {
      super(rootMode);
    }

  }

  static instancesCount = 0;

  static initialize(options) {
    WuseTextReplacements.initialize(WuseStringConstants.DEFAULT_REPLACEMENT_OPEN, WuseStringConstants.DEFAULT_REPLACEMENT_CLOSE);
    if (WuseJsHelpers.isOf(options, window.Object) && WuseJsHelpers.isOf(options.onFetchTemplate, window.Function)) {
      WuseRenderingRoutines.initialize({ onFetchTemplate: options.onFetchTemplate });
    }
  }

}

