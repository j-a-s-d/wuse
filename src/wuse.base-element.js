// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_STRING, noop, isOf, isNonEmptyArray, isNonEmptyString, forcedStringSplit } = JsHelpers;
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

const parseElement = (shorthandNotation, rules) => WuseElementParts.performValidations(WuseElementParts.newChild(shorthandNotation, rules));

export default class BaseElement extends window.HTMLElement {

  // INSTANCE

  // PRIVATE

  // CONTENT HOLDERS
  #html = new window.String(); // RAW HTML
  #rules = new (class extends WusePartsHolder {
    on_version_change() {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = WuseTextReplacements.extractReplacementsFromRule(this.last);
      }
      if (window.Wuse.DEBUG) this.owner.#debug(`rules list version change: ${this.version}`);
    }
    on_forbidden_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`rules list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
  })(this); // CSS RULES
  #children = new (class extends WusePartsHolder {
    detectSlots() {
      var result = this.owner.#slotted;
      this.forEach(child => result |= (child.kind === SLOTS_KIND));
      this.owner.#slotted = result;
    }
    on_recall_part = part => this.owner.#filiatedKeys.tryToRemember(part);
    on_version_change() {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = WuseTextReplacements.extractReplacementsFromChild(this.last);
      }
      this.detectSlots();
      if (window.Wuse.DEBUG) this.owner.#debug(`children list version change: ${this.version}`);
    }
    on_forbidden_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`children list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
  })(this); // HTML ELEMENTS
  #fields = new (class extends WusePartsHolder {
    on_snapshot_part = part => part.value = this.owner[part.name];
    on_recall_part = part => this.owner[part.name] = part.value;
    on_version_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`fields list version change: ${this.version}`);
    }
    on_forbidden_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`fields list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
  })(this); // INSTANCE FIELDS

  // USER CUSTOMIZATION
  #options = {
    mainDefinition: WuseElementParts.newDefinition(),
    styleMedia: DEFAULT_STYLE_MEDIA,
    styleType: DEFAULT_STYLE_TYPE,
    rawContent: false,
    attributeKeys: false,
    elementKeys: true,
    autokeyChildren: true
  }
  #elementEvents = new WuseElementEvents(this);

  // CONTENT FLAGS
  #initialized = false;
  #identified = false;
  #slotted = false;
  #shadowed = window.Wuse.isShadowElement(this);

  // INNER ELEMENTS
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
    verifiers: {
      main: content => !this.#waste.main.compute(content),
      style: content => !this.#waste.style.compute(content)
    },
    renderizers: {
      rule: rule => this.#contents.style.append(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#renderingReplacer, rule)),
      children: {
        mixed: child => this.#shadowed && child.kind === SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
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
  #renderingReplacer = (str, rep) => str.replace(rep.find, this[rep.field] !== undefined ? this[rep.field] : EMPTY_STRING);
  /*#ruleInserters = {
    rule: rule => this.#style.sheet.insertRule(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#renderingReplacer, rule)),
    childRule: child => child.included && child.rules.forEach(this.#ruleInserters.rule)
  }*/
  #bindingPerformers = {
    bind: {
      key: () => {
        const performer = id => isNonEmptyString(id) ? this[id] = this.#getElementByIdFromRoot(id) : undefined;
        if (this.#identified) performer(this.#options.mainDefinition.id);
        return child => performer(child.id);
      },
      event: "addEventListener"
    },
    unbind: {
      key: () => {
        const performer = id => delete this[id];
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
    if (this.#style) this.#style.affiliate();
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
      if (this.#slotted && this.#shadowed) removeChildren(this);
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
        if (!child.included && value) return;
        if (bindingHandlers.key) bindingHandlers.key(child);
        child.events.forEach(event => event && bindingHandlers.event(child.id, event.kind, event.capture));
      });
      if (this.#slotted) bindingHandlers.slots();
      this.#binded = value;
    }
  }

  #getElementByIdFromRoot(id) {
    return isNonEmptyString(id) ? this.#root.querySelector(`#${id}`) : undefined;
  }

  #prepareContents() {
    this.#contents.root.reset(EMPTY_STRING);
    this.#contents.style.reset(EMPTY_STRING);
    this.#contents.main.reset(this.#html);
    const r = this.#slotted ? this.#contents.renderizers.children.mixed : this.#contents.renderizers.children.normal;
    this.#children.forEach(child => child.included && r(child));
    this.#rules.forEach(this.#contents.renderizers.rule);
    this.#contents.main.verify(this.#contents.verifiers.main);
    this.#contents.style.verify(this.#contents.verifiers.style);
  }

  #commitContents(forceRoot, forceStyle, forceMain) {
    this.#contents.root.process(forceRoot);
    this.#contents.style.process(forceStyle);
    this.#contents.main.process(forceMain);
    if (window.Wuse.DEBUG) this.#debug(this.#contents.getDebugInfo());
  }

  #render() {
    if (!window.Wuse.RENDERING || !this.#rendering) return;
    if (window.Wuse.MEASURE) this.#measurement.partial.start();
    this.#elementEvents.immediateTrigger("on_prerender");
    this.#prepareContents();
    if (this.#contents.gotModified()) {
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
    if (window.Wuse.DEBUG) this.#debug(
      `unmodified: ${this.info.unmodifiedRounds} (main: ${this.#waste.main.rounds}, style: ${this.#waste.style.rounds}) | updated: ${this.info.updatedRounds}`
    );
    this.#elementEvents.immediateTrigger("on_postrender");
    if (window.Wuse.MEASURE) this.#measurement.partial.stop(window.Wuse.DEBUG);
  }

  #inject(event) {
    this.#prepareElements();
    this.#insertElements();
    this.#elementEvents.immediateTrigger("on_inject");
    this.#prepareContents();
    // NOTE: on injection, due to it's optional nature the style element must be invalidated only if present
    this.#commitContents(false, !!this.#style, true);
    this.#bind(true);
    this.#elementEvents.immediateTrigger(event);
  }

  #redraw() {
    if (window.Wuse.MEASURE) this.#measurement.full.start();
    this.#bind(false);
    this.#extirpateElements();
    this.#elementEvents.immediateTrigger("on_unload");
    this.#elementEvents.detect();
    this.#inject("on_reload");
    this.#stateManager.writeState();
    this.#elementEvents.committedTrigger("on_repaint");
    if (window.Wuse.MEASURE) this.#measurement.full.stop(window.Wuse.DEBUG);
  }

  // ROUTINES
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
          this.#children.forEach(WuseRenderingRoutines.slotsInvalidator);
        }
        this.render();
      }
    }
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
    this.#root = mode !== WuseElementModes.REGULAR ? this.attachShadow({ mode }) : this;
    this.#elementEvents.detect();
    this.#elementEvents.immediateTrigger("on_create");
    if (this.#options.attributeKeys) this.getAttributeNames().forEach(attr => this[attr] = this.getAttribute(attr));
    if (this.dataset.wusekey) this.setElementsStoreKey(this.dataset.wusekey);
    this.#elementEvents.immediateTrigger(
      this.#stateManager.initializeState() > 1 ? "on_reconstruct" : "on_construct", this.#stateManager.state
    );
    this.#initialized = true;
  }

  get render() { return this.#binded ? this.#render : noop }

  get redraw() { return this.#binded ? this.#redraw : noop }

  connectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.attachment.start();
    this.#elementEvents.detect();
    this.#elementEvents.immediateTrigger("on_connect");
    this.#inject("on_load");
    this.#stateManager.writeState();
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
    return this.#inserted ? this.#main.element.setAttribute(key) : undefined;
  }

  setMainAttribute(key, value) {
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
      if (isOf(tmp.style, window.Object)) {
        this.#options.mainDefinition.style = tmp.style;
      }
      if (isOf(tmp.attributes, window.Array)) {
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
    for (let idx = 0; idx < this.#rules.length; idx++) {
      if (this.#rules[idx].selector === selector) {
        return true;
      }
    }
    return false;
  }

  replaceCSSRuleBySelector(selector, properties) {
    for (let idx = 0; idx < this.#rules.length; idx++) {
      if (this.#rules[idx].selector === selector) {
        this.#rules[idx] = WuseElementParts.newRule(selector, properties);
        break;
      }
    }
    return this;
  }

  removeCSSRuleBySelector(selector) {
    for (let idx = 0; idx < this.#rules.length; idx++) {
      if (this.#rules[idx].selector === selector) {
        this.#rules.splice(idx, 1);
        break;
      }
    }
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
    (isOf(items, window.Array) ? items : forcedStringSplit(items, "\n")).forEach(
      item => typeof item === "string" && !!item.trim().length && this.appendChildElement(item)
    );
    return this;
  }

  prependChildElements(items) {
    (isOf(items, window.Array) ? items : forcedStringSplit(items, "\n")).forEach(
      item => typeof item === "string" && !!item.trim().length && this.prependChildElement(item)
    );
    return this;
  }

  replaceChildElementById(id, shorthandNotation, rules) {
    const tmp = parseElement(shorthandNotation, rules);
    if (tmp !== null) this.#children.replace(this.#children.findIndex(child => child.id === id), tmp);
    return this;
  }

  removeChildElementById(id) {
    this.#children.remove(this.#children.findIndex(child => child.id === id));
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
    if (isOf(childs, window.Array)) childs.forEach(WuseRenderingRoutines.cacheInvalidator);
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
    this[name] = value;
    this.#fields.append({ name, value });
    return this;
  }

  makeReactiveField(name, value, handler, initial = true) {
    createReactiveField(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"), name => this.dropField(name));
    this.#fields.append({ name, value });
    if (initial) this.#fieldRender(name, "$init");
    return this;
  }

  makeExternalReactiveField(mirror, name, value, handler, initial = true) {
    return this.makeReactiveField(name, mirror[name] || value, actions => { mirror[name] = this[name]; handler(actions) }, initial);
  }

  hasField(name) {
    for (let idx = 0; idx < this.#fields.length; idx++) {
      if (this.#fields[idx].name === name) {
        return true;
      }
    }
    return false;
  }

  dropField(name) {
    for (let idx = 0; idx < this.#fields.length; idx++) {
      if (this.#fields[idx].name === name) {
        if (this.hasOwnProperty(name)) delete this[name];
        this.#fields.splice(idx, 1);
        this.#stateManager.writeState();
        return true;
      }
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
    if (isOf(options, window.Object)) {
      if (isOf(options.onFetchTemplate, window.Function)) {
        WuseRenderingRoutines.initialize({ onFetchTemplate: options.onFetchTemplate });
      }
      if (isOf(options.onAllowHTML, window.Function)) {
        RuntimeErrors.onAllowHTML = options.onAllowHTML;
      }
      if (isOf(options.onInvalidKey, window.Function)) {
        RuntimeErrors.onInvalidKey = options.onInvalidKey;
      }
      if (isOf(options.onInvalidState, window.Function)) {
        RuntimeErrors.onInvalidState = options.onInvalidState;
      }
      if (isOf(options.onLockedDefinition, window.Function)) {
        RuntimeErrors.onLockedDefinition = options.onLockedDefinition;
      }
      if (isOf(options.onTakenId, window.Function)) {
        RuntimeErrors.onTakenId = options.onTakenId;
      }
      let rte = {
        onInvalidDefinition: noop,
        onInexistentTemplate: noop,
        onUnespecifiedSlot: noop,
        onInvalidId: noop,
        onUnknownTag: noop
      };
      if (isOf(options.onInvalidDefinition, window.Function)) {
        RuntimeErrors.onInvalidDefinition = options.onInvalidDefinition;
        rte.onInvalidDefinition = options.onInvalidDefinition;
      }
      if (isOf(options.onInexistentTemplate, window.Function)) {
        rte.onInexistentTemplate = options.onInexistentTemplate;
      }
      if (isOf(options.onUnespecifiedSlot, window.Function)) {
        rte.onUnespecifiedSlot = options.onUnespecifiedSlot;
      }
      if (isOf(options.onInvalidId, window.Function)) {
        rte.onInvalidId = options.onInvalidId;
      }
      if (isOf(options.onUnknownTag, window.Function)) {
        rte.onUnknownTag = options.onUnknownTag;
      }
      WuseElementParts.initialize(rte);
    }
  }

}

