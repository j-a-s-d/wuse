// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseJsHelpers from './wuse.javascript-helpers.js';
const { EMPTY_STRING, noop, isOf, isNonEmptyArray, isNonEmptyString, forcedStringSplit } = WuseJsHelpers;
import WuseStringConstants from './wuse.string-constants.js';
import WuseTextReplacements from './wuse.text-replacements.js';
import WuseRenderingRoutines from './wuse.rendering-routines.js';
import WuseEqualityAnalyzer from './wuse.equality-analyzer.js';
import WuseNodeManager from './wuse.node-manager.js';
import WuseContentManager from './wuse.content-manager.js';
import WusePartsHolder from './wuse.parts-holder.js';
import WuseElementParts from './wuse.element-parts.js';
import WuseElementModes from './wuse.element-modes.js';
import WuseElementEvents from './wuse.element-events.js';

function createReactiveField(obj, name, value, handler, renderizer) {
  const redefiner = (get, set) => window.Object.defineProperty(obj, name, {
    get, set, enumerable: true, configurable: true
  });
  const remover = () => delete obj[name];
  const recreator = (v, maneuverer) => createReactiveField(obj, name, v, maneuverer, renderizer);
  redefiner(() => value, (v) => {
    recreator(v, handler);
    !isOf(handler, window.Function) ? renderizer(name) : handler({
      renderize: (label) => renderizer(name, label), // manual render
      automate: () => recreator(v, null), // converts the field into an automatic reactive field (autorenders)
      freeze: () => redefiner(() => v, (v) => {}), // freeze the field value until calling defreeze()
      defreeze: () => recreator(v, handler), // defreezes the field after the freeze action
      dereact: () => redefiner(() => v, (v) => { remover(); obj[name] = v }), // disable reactiveness (convert into a simple field)
      remove: () => remover() // removes the field enterely
    });
  });
}

let RuntimeErrors = {
  onInvalidState: noop,
  onInvalidKey: noop,
  onInvalidDefinition: noop,
  onLockedDefinition: noop,
  onAllowHTML: noop
}

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
    on_version_change() {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = WuseTextReplacements.extractReplacementsFromChild(this.last);
        this.owner.#slotted |= (this.last.kind === WuseStringConstants.SLOTS_KIND);
      }
      if (window.Wuse.DEBUG) this.owner.#debug(`children list version change: ${this.version}`);
    }
    on_forbidden_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`children list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
    }
  })(this); // HTML ELEMENTS
  #fields = new (class extends WusePartsHolder {
    on_version_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`fields list version change: ${this.version}`);
    }
    on_forbidden_change() {
      if (window.Wuse.DEBUG) this.owner.#debug(`fields list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.#options.mainDefinition.id);
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
  #elementEvents = new WuseElementEvents(this);

  // CONTENT FLAGS
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
  #elementsStore = window.Wuse.elementsStorage;
  #elementState = null;
  #key = new window.String();
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
  #renderingReplacer = (str, rep) => str.replace(rep.find, this[rep.field] !== undefined ? this[rep.field] : EMPTY_STRING);
  /*#ruleInserters = {
    rule: rule => this.#style.sheet.insertRule(rule.cache ? rule.cache : rule.cache = WuseRenderingRoutines.renderRule(this.#renderingReplacer, rule)),
    childRule: child => child.included && child.rules.forEach(this.#ruleInserters.rule)
  }*/
  #bindingPerformers = {
    bind: {
      key: () => {
        const performer = (id) => {
          if (isNonEmptyString(id)) this[id] = this.#getElementByIdFromRoot(id);
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
    this.#contents.main.verify(content => !this.#waste.main.compute(content));
    this.#contents.style.verify(content => !this.#waste.style.compute(content));
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
      if (this.#keyed) this.persistToElementsStore();
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
    if (this.#keyed) this.persistToElementsStore();
    this.#elementEvents.committedTrigger("on_repaint");
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

  // ELEMENT STATE
  #initializeElementState() {
    if (this.#keyed) {
      const state = this.#elementsStore.hasItem(this.#key) ?
        this.#elementsStore.getItem(this.#key) : WuseElementParts.newState();
      if (isOf(state, window.Object)) {
        this.#elementState = state;
        this.#elementState.generation++;
        this.#persistElementState();
        return true;
      } else {
        RuntimeErrors.onInvalidState();
      }
    }
    return false;
  }

  #persistElementState() {
    if (window.Wuse.DEBUG) this.#elementState.key = this.#key;
    this.#elementState.persisted = !!this.#elementState.data;
    this.#elementsStore.setItem(this.#key, this.#elementState);
  }

  #eraseFromElementsStore() {
    const state = this.#elementState;
    if (isOf(state, window.Object) && state.persisted && state.data) {
      delete state.data;
      this.#persistElementState();
      return true;
    }
    return false;
  }

  #validateElementsStoreKey() {
    if (!this.#keyed) {
      RuntimeErrors.onInvalidKey();
      return false;
    }
    return true;
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
    this.#initializeElementState() && this.#elementState.generation > 1 ?
      this.#elementEvents.immediateTrigger("on_reconstruct", this.#elementState) :
      this.#elementEvents.immediateTrigger("on_construct");
  }

  get render() { return this.#binded ? this.#render : noop }

  get redraw() { return this.#binded ? this.#redraw : noop }

  connectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.attachment.start();
    this.#elementEvents.detect();
    this.#elementEvents.immediateTrigger("on_connect");
    this.#inject("on_load");
    if (this.#keyed) this.persistToElementsStore();
    if (window.Wuse.MEASURE) this.#measurement.attachment.stop(window.Wuse.DEBUG);
  }

  disconnectedCallback() {
    if (window.Wuse.MEASURE) this.#measurement.dettachment.start();
    this.#bind(false);
    this.#elementEvents.immediateTrigger("on_disconnect");
    if (window.Wuse.MEASURE) this.#measurement.dettachment.stop(window.Wuse.DEBUG);
  }

  getElementsStore() {
    return this.#elementsStore;
  }

  setElementsStore(storage) {
    this.#elementsStore = storage;
    return this;
  }

  hasElementsStoreKey(key) {
    return this.#keyed;
  }

  getElementsStoreKey(key) {
    return this.#key;
  }

  setElementsStoreKey(key) {
    this.#keyed = isNonEmptyString(this.#key = key);
    return this;
  }

  persistToElementsStore() {
    if (this.#validateElementsStoreKey()) {
      const state = this.#elementState;
      if (isOf(state, window.Object)) {
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

  restoreFromElementsStore() {
    if (this.#validateElementsStoreKey()) {
      const state = this.#elementState;
      if (isOf(state, window.Object) && state.persisted && state.data) {
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
        return true;
      }
    }
    return false;
  }

  removeFromElementsStore() {
    return this.#validateElementsStoreKey() && this.#eraseFromElementsStore();
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
    const tmp = WuseElementParts.performValidations(WuseElementParts.newChild(shorthandNotation));
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
    const tmp = WuseElementParts.performValidations(WuseElementParts.newChild(shorthandNotation, rules));
    if (tmp !== null) this.#children.append(tmp);
    return this;
  }

  prependChildElement(shorthandNotation, rules) {
    const tmp = WuseElementParts.performValidations(WuseElementParts.newChild(shorthandNotation, rules));
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
    const tmp = WuseElementParts.newChild(shorthandNotation, rules);
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
    createReactiveField(this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"));
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
    WuseTextReplacements.initialize(WuseStringConstants.DEFAULT_REPLACEMENT_OPEN, WuseStringConstants.DEFAULT_REPLACEMENT_CLOSE);
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

