// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_STRING, noop, ensureFunction, isOf, isAssignedObject, isAssignedArray, isNonEmptyArray, isNonEmptyString, forcedStringSplit, forEachOwnProperty } = JsHelpers;
import WebHelpers from './wuse.web-helpers.js';
const { removeChildren } = WebHelpers;
import StringConstants from './wuse.string-constants.js';
const { WUSEKEY_ATTRIBUTE, DEFAULT_STYLE_TYPE, DEFAULT_STYLE_MEDIA, DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE, SLOTS_KIND } = StringConstants;
import ReactiveField from './wuse.reactive-field.js';
const { createReactiveField } = ReactiveField;
import WuseTextReplacements from './wuse.text-replacements.js';
import WuseRenderingRoutines from './wuse.rendering-routines.js';
import WuseEqualityAnalyzer from './wuse.equality-analyzer.js';
import WuseStateManager from './wuse.state-manager.js';
import WuseNodeManager from './wuse.node-manager.js';
import WuseContentManager from './wuse.content-manager.js';
import WusePartsHolder from './wuse.parts-holder.js';
import WuseElementParts from './wuse.element-parts.js';
import WuseElementModes from './wuse.element-modes.js';
import WuseElementEvents from './wuse.element-events.js';

let RuntimeErrors = {
  onInvalidState: noop,
  onInvalidKey: noop,
  onInvalidDefinition: noop,
  onLockedDefinition: noop,
  onTakenId: noop,
  onAllowHTML: noop
}

const debug = (wel, msg) => window.Wuse.debug(`#${wel.id} (${wel.info.instanceNumber}) | ${(typeof msg === "string" ? msg : JSON.stringify(msg))}`);

const parseElement = (shorthandNotation, rules) => WuseElementParts.performValidations(WuseElementParts.newChild(shorthandNotation, rules));

const makeUserOptions = () => ({
  mainDefinition: WuseElementParts.newDefinition(),
  styleMedia: DEFAULT_STYLE_MEDIA,
  styleType: DEFAULT_STYLE_TYPE,
  rawContent: false,
  attributeKeys: false,
  elementKeys: true,
  autokeyChildren: true
});

const makePerformanceWatches = () => ({
  attachment: new window.Wuse.PerformanceMeasurement.StopWatch(),
  partial: new window.Wuse.PerformanceMeasurement.StopWatch(),
  full: new window.Wuse.PerformanceMeasurement.StopWatch(),
  dettachment: new window.Wuse.PerformanceMeasurement.StopWatch()
});

const makeWasteAnalyzers = () => ({
  main: new WuseEqualityAnalyzer(window.Wuse.hashRoutine),
  style: new WuseEqualityAnalyzer(window.Wuse.hashRoutine)
});

export default class BaseElement extends window.HTMLElement {

  // INSTANCE

  // PRIVATE

  // CONTENT HOLDERS
  #html = new window.String(); // RAW HTML
  #rules = new (class extends WusePartsHolder {
    getIndexOf(value) {
      for (let idx = 0; idx < this.length; idx++) {
        if (this[idx].selector === value) return idx;
      }
      return -1;
    }
    on_version_change = () => {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = WuseTextReplacements.extractReplacementsFromRule(this.last);
      }
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `rules list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `rules list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
  })(this); // CSS RULES
  #children = new (class extends WusePartsHolder {
    getIndexOf(value) {
      for (let idx = 0; idx < this.length; idx++) {
        if (this[idx].id === value) return idx;
      }
      return -1;
    }
    on_version_change = () => {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = WuseTextReplacements.extractReplacementsFromChild(this.last);
      }
      if (!this.owner.#slotted) this.owner.#slotted |= this.some(child => child.kind === SLOTS_KIND);
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `children list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `children list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
    on_recall_part = part => this.owner.#filiatedKeys.tryToRemember(part);
  })(this); // HTML ELEMENTS
  #fields = new (class extends WusePartsHolder {
    getIndexOf(value) {
      for (let idx = 0; idx < this.length; idx++) {
        if (this[idx].name === value) return idx;
      }
      return -1;
    }
    on_version_change = () => {
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `fields list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      if (window.Wuse.DEBUG && this.owner.#identified) debug(this.owner, `fields list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
    on_snapshot_part = part => part.value = this.owner[part.name];
    on_recall_part = part => this.owner[part.name] = part.value;
  })(this); // INSTANCE FIELDS

  // USER CUSTOMIZATION
  #options = makeUserOptions();
  #parameters = undefined;
  #elementEvents = new WuseElementEvents(this);

  // CONTENT FLAGS
  #initialized = false;
  #identified = false;
  #slotted = false;
  #shadowed = window.Wuse.isShadowElement(this);

  // INNER STRUCTURE
  #main = undefined;
  #style = undefined;
  #root = null;

  // NODE FLAGS
  #inserted = false;
  #binded = false;
  #rendering = true;

  // ELEMENT STATE
  #filiatedKeys = {
    tryToName: child => {
      const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
      if (!wusekey) child.attributes[WUSEKEY_ATTRIBUTE] = this.#stateManager.nameFiliatedKey(child.hash);
    },
    tryToRemember: child => {
      const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
      if (wusekey) this.#stateManager.rememberFiliatedKey(wusekey);
    }
  };
  #stateReader = data => {
    if (data) {
      this.#options = data.options;
      this.#slotted = data.slotted;
      this.#identified = data.identified;
      this.#html = data.html;
      this.#children.restore(this, data.children);
      this.#rules.restore(this, data.rules);
      this.#fields.restore(this, data.fields);
    }
  };
  #stateWriter = () => {
    return {
      options: this.#options,
      html: this.#html,
      children: this.#children.persist(),
      rules: this.#rules.persist(),
      fields: this.#fields.persist(),
      slotted: this.#slotted,
      identified: this.#identified
    };
  };
  #stateManager = new (class extends WuseStateManager {
    on_invalid_state() {
      RuntimeErrors.onInvalidState();
    }
    on_invalid_key() {
      RuntimeErrors.onInvalidKey();
    }
  })(WuseElementParts.newState, this.#stateReader, this.#stateWriter, window.Wuse.elementsStorage);

  // ELEMENTS BINDING
  #binding = {
    binder: id => isNonEmptyString(id) && (this[id] = this.#getElementByIdFromRoot(id)),
    unbinder: id => delete this[id],
    makePerformers: (event, doer) => ({
      event, key: () => {
        if (this.#identified) doer(this.#options.mainDefinition.id);
        return child => doer(child.id);
      }
    }),
    makeHandlers: performers => ({
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
    }),
    getHandlers: value => this.#binding.makeHandlers(value ?
      this.#binding.makePerformers("addEventListener", this.#binding.binder) :
      this.#binding.makePerformers("removeEventListener", this.#binding.unbinder)
    )
  }

  // RENDERING STATE
  #contents = {
    root: new WuseContentManager(
      content => this.innerHTML = content, // slot change promoter
      content => true
    ),
    style: new WuseContentManager(
      content => this.#style.promote(content), // rule change promoter
      content => !this.#waste.style.compute(content)
    ),
    main: new WuseContentManager(
      content => this.#main.promote(content), // child change promoter
      content => !this.#waste.main.compute(content)
    ),
    renderizers: {
      replacer: (str, rep) => str.replace(rep.find, this[rep.field] !== undefined ? this[rep.field] : EMPTY_STRING),
      rule: rule => this.#contents.style.append(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#contents.renderizers.replacer, rule)),
      children: {
        mixed: child => child.kind === SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
        slot: child => !child.cache && this.#contents.root.append(
          child.cache = WuseRenderingRoutines.renderChild(this.#contents.renderizers.replacer, child), this.#contents.root.verify()
        ),
        normal: child => {
          this.#contents.main.append(child.cache ? child.cache : child.cache = WuseRenderingRoutines.renderChild(this.#contents.renderizers.replacer, child));
          child.rules.forEach(this.#contents.renderizers.rule);
        }
      }
    },
    getDebugInfo: () => `updated (root: ${this.#contents.root.invalidated}, main: ${this.#contents.main.invalidated}, style: ${this.#contents.style.invalidated})`
  }

  // CONTENT ANALYSIS
  #waste = makeWasteAnalyzers();

  // PERFORMANCE MEASUREMENT
  #measurement = makePerformanceWatches();

  // ROUTINES

  // DOM ROUTINES
  #insertElements() {
    if (this.#style = !this.#rules.length ? null : new WuseNodeManager(
      this.#root, WuseElementParts.makeStyleNode(this.#options.styleMedia, this.#options.styleType)
    )) this.#style.affiliate();
    (this.#main = new WuseNodeManager(
      this.#root, WuseElementParts.makeMainNode(this.#options.mainDefinition)
    )).affiliate();
    this.#inserted = true;
  }

  #extirpateElements() {
    if (this.#inserted) {
      this.#main.disaffiliate();
      if (this.#style) this.#style.disaffiliate();
      if (this.#slotted && this.#shadowed) removeChildren(this.#root);
    }
    this.#inserted = false;
  }

  #bind(value) {
    if ((this.#binded && !value) || (!this.#binded && value)) {
      const bindingHandlers = this.#binding.getHandlers(value);
      this.#children.forEach(child => {
        if (!child.included && value) return;
        if (bindingHandlers.key) bindingHandlers.key(child);
        child.events.forEach(event => event && bindingHandlers.event(child.id, event.kind, event.capture));
      });
      if (this.#slotted && this.#shadowed) bindingHandlers.slots();
      this.#binded = value;
    }
  }

  #getElementByIdFromRoot(id) {
    return isNonEmptyString(id) ? this.#root.querySelector(`#${id}`) : undefined;
  }

  #clearContents() {
    this.#children.forEach(WuseRenderingRoutines.cacheInvalidator);
    this.#rules.forEach(WuseRenderingRoutines.cacheInvalidator);
  }

  #prepareContents() {
    this.#contents.root.reset(EMPTY_STRING);
    this.#contents.style.reset(EMPTY_STRING);
    this.#contents.main.reset(this.#html);
    const r = this.#slotted && this.#shadowed ? this.#contents.renderizers.children.mixed : this.#contents.renderizers.children.normal;
    this.#children.forEach(child => child.included && r(child));
    this.#rules.forEach(this.#contents.renderizers.rule);
    this.#contents.main.verify();
    this.#contents.style.verify();
  }

  #commitContents(forceRoot, forceStyle, forceMain) {
    this.#contents.root.process(forceRoot);
    this.#contents.style.process(forceStyle);
    this.#contents.main.process(forceMain);
    if (window.Wuse.DEBUG && this.#identified) debug(this, this.#contents.getDebugInfo());
  }

  #render() {
    if (window.Wuse.MEASURE) this.#measurement.partial.start();
    this.#elementEvents.immediateTrigger("on_prerender");
    this.#prepareContents();
    if (this.#contents.root.invalidated || this.#contents.main.invalidated || this.#contents.style.invalidated) {
      this.#bind(false);
      this.#commitContents(false, false, false);
      this.#bind(true);
      this.info.updatedRounds++;
      this.#elementEvents.immediateTrigger("on_update");
      this.#stateManager.writeState();
      this.#elementEvents.committedTrigger("on_refresh");
    } else {
      this.info.unmodifiedRounds++;
    }
    if (window.Wuse.DEBUG && this.#identified) debug(this,
      `unmodified: ${this.info.unmodifiedRounds} (main: ${this.#waste.main.rounds}, style: ${this.#waste.style.rounds}) | updated: ${this.info.updatedRounds}`
    );
    this.#elementEvents.immediateTrigger("on_postrender");
    if (window.Wuse.MEASURE) this.#measurement.partial.stop(window.Wuse.DEBUG);
  }

  #inject(event) {
    this.#clearContents();
    this.#insertElements();
    this.#elementEvents.immediateTrigger("on_inject");
    this.#prepareContents();
    // NOTE: on injection, due to it's optional nature the style element must be invalidated only if present
    this.#commitContents(false, !!this.#style, true);
    this.#bind(true);
    this.#elementEvents.immediateTrigger(event);
    this.#stateManager.writeState();
  }

  #redraw() {
    if (window.Wuse.MEASURE) this.#measurement.full.start();
    this.#bind(false);
    this.#extirpateElements();
    this.#elementEvents.immediateTrigger("on_unload");
    this.#elementEvents.detect();
    this.#inject("on_reload");
    this.#elementEvents.committedTrigger("on_repaint");
    if (window.Wuse.MEASURE) this.#measurement.full.stop(window.Wuse.DEBUG);
  }

  // PARTS ROUTINES
  #fieldRender(name, label = "$none") {
    if (this.#binded) {
      const rulesHits = WuseTextReplacements.scanRulesForReplacements(this.#rules, name);
      rulesHits.forEach(WuseRenderingRoutines.cacheInvalidator);
      const childrenHits = WuseTextReplacements.scanChildrenForReplacements(this.#children, name);
      childrenHits.forEach(WuseRenderingRoutines.cacheInvalidator);
      if (window.Wuse.DEBUG && this.#identified) debug(this, `reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`);
      if (!!rulesHits.length || !!childrenHits.length) {
        if (childrenHits.some(x => !!x.kind.length)) {
          // NOTE: when a slot gets invalidated the replaceChild will drop all other slots,
          // so to avoid a full redraw, all other slots are required to be invalidated too.
          this.#children.forEach(WuseRenderingRoutines.slotsInvalidator);
        }
        this.render();
      }
    }
  }

  #setField(name, value) {
    const idx = this.#fields.getIndexOf(name);
    idx > -1 ? this.#fields[idx].value = value : this.#fields.append({ name, value });
  }

  #createField(name, value, writable) {
    window.Object.defineProperty(this, name, { value, writable });
    this.#setField(name, value);
    return this;
  }

  #filiateChild(tmp) {
    if (tmp !== null) {
      if (this.#initialized && this.#getElementByIdFromRoot(tmp.id)) {
        return RuntimeErrors.onTakenId(tmp.id);
      }
      if (tmp.custom && this.#options.autokeyChildren && this.#stateManager.hasKey()) {
        this.#filiatedKeys.tryToName(tmp);
      }
    }
    return tmp;
  }

  // PUBLIC

  info = {
    instanceNumber: ++BaseElement.instancesCount,
    unmodifiedRounds: 0,
    updatedRounds: 0
  }

  constructor(mode) {
    super();
    this.#root = mode === WuseElementModes.REGULAR ? this : this.shadowRoot || this.attachShadow({ mode });
    this.#elementEvents.detect();
    this.#elementEvents.immediateTrigger("on_create");
    if (this.#options.attributeKeys) this.getAttributeNames().forEach(attr => this[attr] = this.getAttribute(attr));
    if (this.dataset.wusekey) this.setElementsStoreKey(this.dataset.wusekey);
    this.#elementEvents.immediateTrigger(
      this.#stateManager.initializeState() > 1 ? "on_reconstruct" : "on_construct", this.#stateManager.state
    );
    this.#initialized = true;
  }

  render() {
    window.Wuse.RENDERING && this.#rendering && this.#binded && this.#render();
  }

  redraw() {
    window.Wuse.RENDERING && this.#rendering && this.#binded && this.#redraw();
  }

  get parameters() {
    return this.#parameters;
  }

  set parameters(value) {
    if (isAssignedObject(this.#parameters = value)) forEachOwnProperty(value, name => this[name] = value[name]);
  }

  connectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.attachment.start();
    this.#elementEvents.detect();
    this.#elementEvents.immediateTrigger("on_connect");
    this.#inject("on_load");
    if (window.Wuse.MEASURE) this.#measurement.attachment.stop(window.Wuse.DEBUG);
  }

  disconnectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.dettachment.start();
    this.#bind(false);
    this.#elementEvents.immediateTrigger("on_disconnect");
    this.#stateManager.writeState();
    if (window.Wuse.MEASURE) this.#measurement.dettachment.stop(window.Wuse.DEBUG);
  }

  getElementsStore() {
    return this.#stateManager.getStore();
  }

  setElementsStore(store) {
    this.#stateManager.setStore(store);
    return this;
  }

  hasElementsStoreKey() {
    return this.#stateManager.hasKey();
  }

  getElementsStoreKey(key) {
    return this.#stateManager.key;
  }

  setElementsStoreKey(key) {
    if (this.#stateManager.key = key) {
      this.setAttribute(WUSEKEY_ATTRIBUTE, key);
      this.#stateManager.writeState();
    }
    return this;
  }

  deriveChildrenStoreKey(value) {
    this.#options.autokeyChildren = value;
  }

  persistToElementsStore() {
    return this.#stateManager.validateKey() && this.#stateManager.writeState();
  }

  restoreFromElementsStore() {
    return this.#stateManager.validateKey() && this.#stateManager.readState();
  }

  removeFromElementsStore() {
    return this.#stateManager.validateKey() && this.#stateManager.eraseState();
  }

  selectChildElement(x) {
    return this.#root.querySelector(x);
  }

  getMainAttribute(key) {
    return key === "id" && this.#identified ?
      this.#options.mainDefinition.id :
      this.#options.mainDefinition.attributes[key];
  }

  setMainAttribute(key, value) {
    this.#options.mainDefinition.attributes[key] = value;
    if (this.#inserted) this.#main.element.setAttribute(key, value);
    return this;
  }

  setMainElement(shorthandNotation) {
    const tmp = parseElement(shorthandNotation);
    if (tmp !== null) {
      if (isNonEmptyString(tmp.content) || isNonEmptyArray(tmp.events)) {
        return RuntimeErrors.onInvalidDefinition(shorthandNotation);
      }
      if (this.#identified = isNonEmptyString(tmp.id)) {
        this.#options.mainDefinition.id = tmp.id;
      }
      if (isNonEmptyString(tmp.tag)) {
        this.#options.mainDefinition.tag = tmp.tag;
      }
      if (isNonEmptyArray(tmp.classes)) {
        this.#options.mainDefinition.classes = tmp.classes;
      }
      if (isAssignedObject(tmp.style)) {
        this.#options.mainDefinition.style = tmp.style;
      }
      if (isAssignedObject(tmp.attributes)) {
        this.#options.mainDefinition.attributes = tmp.attributes;
      }
    }
    return this;
  }

  setStyleOptions(media, type) {
    this.#options.styleMedia = isNonEmptyString(media) ? media : EMPTY_STRING;
    this.#options.styleType = isNonEmptyString(type) ? type : EMPTY_STRING;
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
    this.#options.rawContent ? this.#html = html : RuntimeErrors.onAllowHTML();
    return this;
  }

  appendRawContent(html) {
    this.#options.rawContent ? this.#html = this.#html + html : RuntimeErrors.onAllowHTML();
    return this;
  }

  prependRawContent(html) {
    this.#options.rawContent ? this.#html = html + this.#html : RuntimeErrors.onAllowHTML();
    return this;
  }

  lockCSSRules() {
    this.#rules.locked = true;
    return this;
  }

  unlockCSSRules() {
    this.#rules.locked = false;
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

  hasCSSRuleBySelector(selector) {
    return this.#rules.getIndexOf(selector) > -1;
  }

  replaceCSSRuleBySelector(selector, properties) {
    const idx = this.#rules.getIndexOf(selector);
    if (idx >-1) this.#rules[idx] = WuseElementParts.newRule(selector, properties);
    return this;
  }

  removeCSSRuleBySelector(selector) {
    const idx = this.#rules.getIndexOf(selector);
    if (idx >-1) this.#rules.splice(idx, 1);
    return this;
  }

  removeAllCSSRules() {
    this.#rules.clear();
    return this;
  }

  lockChildElements() {
    this.#children.locked = true;
    return this;
  }

  unlockChildElements() {
    this.#children.locked = false;
    return this;
  }

  appendChildElement(shorthandNotation, rules) {
    const tmp = this.#filiateChild(parseElement(shorthandNotation, rules));
    if (tmp !== null) this.#children.append(tmp);
    return this;
  }

  prependChildElement(shorthandNotation, rules) {
    const tmp = this.#filiateChild(parseElement(shorthandNotation, rules));
    if (tmp !== null) this.#children.prepend(tmp);
    return this;
  }

  appendChildElements(items) {
    (isAssignedArray(items) ? items : forcedStringSplit(items, "\n")).forEach(
      item => typeof item === "string" && !!item.trim().length && this.appendChildElement(item)
    );
    return this;
  }

  prependChildElements(items) {
    (isAssignedArray(window.Array) ? items : forcedStringSplit(items, "\n")).forEach(
      item => typeof item === "string" && !!item.trim().length && this.prependChildElement(item)
    );
    return this;
  }

  replaceChildElementById(id, shorthandNotation, rules) {
    const idx = this.#children.getIndexOf(id);
    if (idx > -1) {
      const tmp = parseElement(shorthandNotation, rules);
      if (tmp !== null) this.#children.replace(idx, tmp);
    }
    return this;
  }

  removeChildElementById(id) {
    const idx = this.#children.getIndexOf(id);
    if (idx >-1) this.#children.remove(idx);
    return this;
  }

  removeAllChildElements() {
    this.#children.clear();
    return this;
  }

  checkChildElementIsIncludedById(id, yes, no) {
    const fire = cb => isOf(cb, window.Function) ? cb() : undefined;
    this.#children.some(child => child.id === id && child.included) ? fire(yes) : fire(no);
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
    if (isAssignedArray(childs)) childs.forEach(WuseRenderingRoutines.cacheInvalidator);
    return this;
  }

  lockInstanceFields() {
    this.#fields.locked = true;
    return this;
  }

  unlockInstanceFields() {
    this.#fields.locked = false;
    return this;
  }

  makeField(name, value) {
    return this.#createField(name, value, true);
  }

  makeReadonlyField(name, value) {
    return this.#createField(name, value, false);
  }

  makeReactiveField(name, value, handler, initial = true) {
    createReactiveField(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"), name => this.dropField(name));
    this.#setField(name, value);
    if (initial) this.#fieldRender(name, "$init");
    return this;
  }

  makeExternalReactiveField(mirror, name, value, handler, initial = true) {
    return this.makeReactiveField(name, mirror[name] || value, actions => { mirror[name] = this[name]; handler(actions) }, initial);
  }

  hasField(name) {
    return this.#fields.getIndexOf(name) > -1;
  }

  dropField(name) {
    const idx = this.#fields.getIndexOf(name);
    if (idx > -1) {
      if (this.hasOwnProperty(name)) delete this[name];
      this.#fields.splice(idx, 1);
      this.#stateManager.writeState();
      return true;
    }
    return false;
  }

  suspendRender() {
    this.#rendering = false;
    return this;
  }

  resumeRender(autorender = true) {
    this.#rendering = true;
    if (autorender) this.render();
    return this;
  }

  isRenderSuspended() {
    return !this.#rendering;
  }

  // STATIC

  static instancesCount = 0;

  static initialize(options) {
    WuseTextReplacements.initialize(DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE);
    if (isAssignedObject(options)) {
      WuseRenderingRoutines.initialize({ onFetchTemplate: options.onFetchTemplate });
      WuseElementParts.initialize({
        onInvalidDefinition: options.onInvalidDefinition,
        onInexistentTemplate: options.onInexistentTemplate,
        onUnespecifiedSlot: options.onUnespecifiedSlot,
        onInvalidId: options.onInvalidId,
        onUnknownTag: options.onUnknownTag
      });
      RuntimeErrors.onAllowHTML = ensureFunction(options.onAllowHTML);
      RuntimeErrors.onInvalidKey = ensureFunction(options.onInvalidKey);
      RuntimeErrors.onInvalidState = ensureFunction(options.onInvalidState);
      RuntimeErrors.onInvalidDefinition = ensureFunction(options.onInvalidDefinition);
      RuntimeErrors.onLockedDefinition = ensureFunction(options.onLockedDefinition);
      RuntimeErrors.onTakenId = ensureFunction(options.onTakenId);
    }
  }

  static register() {
    return Wuse.register(this);
  }

  static create(parameters, at = "body") {
    const target = at instanceof window.HTMLElement ? { node: at } : (typeof at === "string" ? { selector: at } : at);
    return Wuse.create({ element: { type: this }, target, instance: { parameters } });
  }

}

