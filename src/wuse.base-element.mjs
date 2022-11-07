// Wuse (Web Using Shadow Elements) by j-a-s-d

import JsHelpers from './wuse.javascript-helpers.mjs';
const { EMPTY_STRING, noop, ensureFunction, isOf, isAssignedObject, isAssignedArray, isNonEmptyArray, isNonEmptyString, forcedStringSplit, forEachOwnProperty, buildArray, defineReadOnlyMembers } = JsHelpers;
import WebHelpers from './wuse.web-helpers.mjs';
const { removeChildren, isHTMLAttribute } = WebHelpers;
import StringConstants from './wuse.string-constants.mjs';
const { WUSEKEY_ATTRIBUTE, DEFAULT_STYLE_TYPE, DEFAULT_STYLE_MEDIA, DEFAULT_REPLACEMENT_OPEN, DEFAULT_REPLACEMENT_CLOSE, SLOTS_KIND } = StringConstants;
import ReactiveField from './wuse.reactive-field.mjs';
const { createReactiveField } = ReactiveField;
import ElementModes from './wuse.element-modes.mjs';
const { REGULAR } = ElementModes;
import ElementEvents from './wuse.element-events.mjs';
import WuseElementParts from './wuse.element-parts.mjs';
const { newDefinition, newState, makeMainNode, makeStyleNode, performValidations, newChild, newRule, newNestedRule, tryToJoinRules, tryToJoinNestedRules } = WuseElementParts;
import WuseTextReplacements from './wuse.text-replacements.mjs';
const { extractReplacementsFromChild, extractReplacementsFromRule, scanChildrenForReplacements, scanRulesForReplacements } = WuseTextReplacements;
import WuseRenderingRoutines from './wuse.rendering-routines.mjs';
const { renderChild, renderRule, renderingIncluder, renderingExcluder, cacheInvalidator, slotsInvalidator } = WuseRenderingRoutines;
import WuseStateManager from './wuse.state-manager.mjs';
import NodeManager from './wuse.node-manager.mjs';
import ContentManager from './wuse.content-manager.mjs';
import PartsHolder from './wuse.parts-holder.mjs';
import EqualityAnalyzer from './wuse.equality-analyzer.mjs';

let RuntimeErrors = {
  onInvalidState: noop,
  onInvalidKey: noop,
  onInvalidDefinition: noop,
  onLockedDefinition: noop,
  onTakenId: noop,
  onMisnamedField: noop,
  onAllowHTML: noop
}

const debug = (wel, msg) => window.Wuse.debug(`#${wel.id} (${wel.info.instanceNumber}) | ${(typeof msg === "string" ? msg : JSON.stringify(msg))}`);

const parseElement = (shorthandNotation, rules) => performValidations(newChild(shorthandNotation, rules));

const getElementByIdFromRoot = (instance, id) => isNonEmptyString(id) ? instance.selectChildElement(`#${id}`) : undefined;

const isInvalidFieldName = name => typeof name !== "string" || !name.trim().length || name.startsWith("data") || isHTMLAttribute(name);

const makeUserOptions = () => ({
  mainDefinition: newDefinition(),
  styleMedia: DEFAULT_STYLE_MEDIA,
  styleType: DEFAULT_STYLE_TYPE,
  rawContent: false, // when on, allows the inclusion of raw html content
  attributeKeys: false, // when on, sets the received node attributes as element keys
  elementKeys: true, // when on, add the main element and it's children as element keys using their ids
  autokeyChildren: true, // when on, automatically add store key to children elements
  automaticallyRestore: true, // when on, it ignores any on_reconstruct event handler set and simply does call to the restoreFromElementsStore method directly
  redrawReload: false, // when on, the redraw method fires on_reload events, when off it fires on_load like onConnected
  redrawRepaint: false, // when on, the redraw method fires on_repaint events, when off it fires on_refresh like render
  enclosingEvents: false // when on, the render process is preceded by on_prerender and succeeded by on_postrender events
});

const makePerformanceWatches = () => ({
  attachment: new window.Wuse.PerformanceMeasurement.StopWatch(),
  partial: new window.Wuse.PerformanceMeasurement.StopWatch(),
  full: new window.Wuse.PerformanceMeasurement.StopWatch(),
  dettachment: new window.Wuse.PerformanceMeasurement.StopWatch()
});

const makeWasteAnalyzers = () => ({
  main: new EqualityAnalyzer(window.Wuse.hashRoutine),
  style: new EqualityAnalyzer(window.Wuse.hashRoutine)
});

export default class BaseElement extends window.HTMLElement {

  // INSTANCE

  // PRIVATE

  // CONTENT HOLDERS
  #html = new window.String(); // RAW HTML
  #rules = new (class extends PartsHolder {
    getIndexOf = value => super.getIndexOf("selector", value)
    on_version_change = () => {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = extractReplacementsFromRule(this.last);
      }
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `rules list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `rules list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.owner.#options.mainDefinition.id);
    }
  })(this); // CSS RULES
  #children = new (class extends PartsHolder {
    getIndexOf = value => super.getIndexOf("id", value)
    on_version_change = () => {
      if (this.last !== null) {
        this.last.version = this.version;
        this.last.replacements = extractReplacementsFromChild(this.last);
      }
      if (!this.owner.#slotted) this.owner.#slotted |= this.some(child => child.kind === SLOTS_KIND);
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `children list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `children list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.owner.#options.mainDefinition.id);
    }
    on_recall_part = part => this.owner.#filiatedKeys.tryToRemember(part);
  })(this); // HTML ELEMENTS
  #fields = new (class extends PartsHolder {
    establish = (name, value) => {
      if (this.prepare()) {
        const idx = super.getIndexOf("name", name);
        idx > -1 ? this[idx].value = value : this.append({ name, value });
        return true;
      }
      return false;
    }
    snapshot = () => buildArray(instance => this.persist().forEach(
      item => instance.push({ name: item.name, value: item.value })
    ))
    getIndexOf = value => super.getIndexOf("name", value)
    on_version_change = () => {
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `fields list version change: ${this.version}`);
    }
    on_forbidden_change = () => {
      window.Wuse.DEBUG && this.owner.#identified && debug(this.owner, `fields list is locked and can not be changed`);
      RuntimeErrors.onLockedDefinition(this.owner.#options.mainDefinition.id);
    }
    on_snapshot_part = part => part.value = this.owner[part.name];
    on_recall_part = part => this.owner[part.name] = part.value;
  })(this); // INSTANCE FIELDS
  #reactives = new window.Set();

  // USER CUSTOMIZATION
  #options = makeUserOptions();
  #parameters = undefined;
  #elementEvents = new ElementEvents(this);

  // CONTENT FLAGS
  #initialized = false;
  #identified = false;
  #slotted = false;
  #styled = false;
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
    forget: child => {
      const wusekey = child.attributes[WUSEKEY_ATTRIBUTE];
      child.attributes[WUSEKEY_ATTRIBUTE] = "";
      return wusekey;
    },
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
      this.parameters = data.parameters;
      this.#options = data.options;
      this.#slotted = data.slotted;
      this.#identified = data.identified;
      this.#html = data.html;
      this.#children.restore(this, data.children);
      this.#rules.restore(this, data.rules);
      this.#fields.restore(this, data.fields);
      (this.#reactives = data.reactives).forEach(name => this.makeReactiveField(name, this[name]));
    }
  };
  #stateWriter = () => {
    return {
      parameters: this.#parameters,
      options: this.#options,
      slotted: this.#slotted,
      identified: this.#identified,
      html: this.#html,
      children: this.#children.persist(),
      rules: this.#rules.persist(),
      fields: this.#fields.persist(),
      reactives: this.#reactives
    }
  };
  #stateManager = new (class extends WuseStateManager {
    on_invalid_state() {
      RuntimeErrors.onInvalidState();
    }
    on_invalid_key() {
      RuntimeErrors.onInvalidKey();
    }
  })(newState, this.#stateReader, this.#stateWriter, window.Wuse.elementsStorage);

  // ELEMENTS BINDING
  #binder = id => {
    const el = getElementByIdFromRoot(this, id);
    if (el) this[id] = el;
  };
  #unbinder = id => delete this[id];
  #makeBindingPerformers = (event, doer) => ({
    event, key: () => {
      if (this.#identified) doer(this.#options.mainDefinition.id);
      return child => doer(child.id);
    }, handler: (id, evkind, capture) => {
      const hnd = this[`on_${id}_${evkind}`];
      if (typeof hnd === "function") {
        const el = getElementByIdFromRoot(this, id);
        if (el) el[event](evkind, hnd, capture);
      }
    }
  });
  #makeBindingHandlers = performers => ({
    key: this.#options.elementKeys && performers.key(),
    events: item => !!item.events.length && item.events.forEach(
      event => event && performers.handler(item.id, event.kind, event.capture)
    ),
    slots: () => this.on_slot_change && this.#root.querySelectorAll("slot").forEach(
      slot => slot[performers.event]("slotchange", this.on_slot_change)
    )
  });

  // RENDERING STATE
  #contents = {
    root: new ContentManager(
      content => this.innerHTML = content, // slot change promoter
      content => true
    ),
    style: new ContentManager(
      content => this.#style && this.#style.promote(content), // rule change promoter
      content => !this.#waste.style.compute(content)
    ),
    main: new ContentManager(
      content => this.#main.promote(content), // child change promoter
      content => !this.#waste.main.compute(content)
    ),
    renderizers: {
      replacer: (str, rep) => str.replace(rep.find, this[rep.field] !== undefined ? this[rep.field] : EMPTY_STRING),
      rule: rule => {
        const cts = this.#contents;
        return cts.style.append(rule.cache ? rule.cache : rule.cache = renderRule(cts.renderizers.replacer, rule));
      },
      children: {
        mixed: child => child.kind === SLOTS_KIND ? this.#contents.renderizers.children.slot(child) : this.#contents.renderizers.children.normal(child),
        slot: child => {
          if (!child.cache) {
            const cts = this.#contents;
            return cts.root.append(child.cache = renderChild(cts.renderizers.replacer, child), cts.root.verify());
          }
        },
        normal: child => {
          const cts = this.#contents;
          cts.main.append(child.cache ? child.cache : child.cache = renderChild(cts.renderizers.replacer, child));
          if (!!child.rules.length) child.rules.forEach(cts.renderizers.rule);
        }
      }
    }
  }

  // CONTENT ANALYSIS
  #waste = makeWasteAnalyzers();

  // PERFORMANCE MEASUREMENT
  #measurement = makePerformanceWatches();

  // ROUTINES

  // DOM ROUTINES
  #insertStyle() {
    if (this.#styled = (this.#style = !this.#rules.length ? null : new NodeManager(
      this.#root, makeStyleNode(this.#options.styleMedia, this.#options.styleType)
    ))) this.#style.affiliate();
  }

  #insertMain() {
    (this.#main = new NodeManager(
      this.#root, makeMainNode(this.#options.mainDefinition)
    )).affiliate();
  }

  #extirpateElements() {
    this.#main.disaffiliate();
    if (this.#styled) this.#style.disaffiliate();
    if (this.#slotted && this.#shadowed) removeChildren(this.#root);
  }

  #bind(value) {
    if ((this.#binded && !value) || (!this.#binded && value)) {
      const bindingHandlers = this.#makeBindingHandlers(value ?
        this.#makeBindingPerformers("addEventListener", this.#binder) :
        this.#makeBindingPerformers("removeEventListener", this.#unbinder)
      );
      if (this.#identified) bindingHandlers.events(this.#options.mainDefinition);
      if (!!this.#children.length) this.#children.forEach(child => {
        if (!child.included && value) return;
        if (bindingHandlers.key) bindingHandlers.key(child);
        bindingHandlers.events(child);
      });
      if (this.#slotted && this.#shadowed) bindingHandlers.slots();
      this.#binded = value;
    }
  }

  #clearContents() {
    if (!!this.#children.length) this.#children.forEach(cacheInvalidator);
    if (!!this.#rules.length) this.#rules.forEach(cacheInvalidator);
  }

  #prepareContents() {
    const cts = this.#contents;
    cts.root.reset(EMPTY_STRING);
    cts.style.reset(EMPTY_STRING);
    cts.main.reset(this.#html);
    const rdr = this.#slotted && this.#shadowed ? cts.renderizers.children.mixed : cts.renderizers.children.normal;
    if (!!this.#children.length) this.#children.forEach(child => child.included && rdr(child));
    if (!!this.#rules.length) this.#rules.forEach(cts.renderizers.rule);
    cts.main.verify();
    cts.style.verify();
  }

  #commitContents(forceRoot, forceStyle, forceMain) {
    const cts = this.#contents;
    cts.root.process(forceRoot);
    cts.style.process(forceStyle);
    cts.main.process(forceMain);
    window.Wuse.DEBUG && this.#identified && debug(this, `updated (root: ${cts.root.invalidated}, main: ${cts.main.invalidated}, style: ${cts.style.invalidated})`);
  }

  #render() {
    if (!this.#styled) this.#insertStyle();
    const opt = this.#options;
    const evs = this.#elementEvents;
    opt.enclosingEvents && evs.immediateTrigger("on_prerender");
    this.#prepareContents();
    const nfo = this.info;
    const cts = this.#contents;
    const result = cts.root.invalidated || cts.main.invalidated || cts.style.invalidated;
    if (result) {
      this.#bind(false);
      this.#commitContents(false, false, false);
      this.#bind(true);
      nfo.updatedRounds++;
      evs.immediateTrigger("on_update");
      this.#stateManager.writeState();
      evs.committedTrigger("on_refresh");
    } else {
      nfo.unmodifiedRounds++;
    }
    window.Wuse.DEBUG && this.#identified && debug(this,
      `unmodified: ${nfo.unmodifiedRounds} (main: ${this.#waste.main.rounds}, style: ${this.#waste.style.rounds}) | updated: ${nfo.updatedRounds}`
    );
    opt.enclosingEvents && evs.immediateTrigger("on_postrender");
    return result;
  }

  #inject(evs, event) {
    this.#clearContents();
    this.#insertStyle();
    this.#insertMain();
    this.#inserted = true;
    evs.immediateTrigger("on_inject");
    this.#prepareContents();
    // NOTE: on injection, due to it's optional nature the style element must be invalidated only if present
    this.#commitContents(false, this.#styled, true);
    this.#bind(true);
    evs.immediateTrigger(event);
    this.#stateManager.writeState();
  }

  #redraw() {
    this.#bind(false);
    if (this.#inserted) {
      this.#extirpateElements();
      this.#inserted = false;
    }
    const evs = this.#elementEvents;
    evs.immediateTrigger("on_unload");
    evs.detect();
    const opt = this.#options;
    this.#inject(evs, opt.redrawReload ? "on_reload" : "on_load");
    evs.committedTrigger(opt.redrawRepaint ? "on_repaint" : "on_refresh");
    return true;
  }

  #revise(partial) {
    if (window.Wuse.MEASURE) {
      const measure = partial ? this.#measurement.partial : this.#measurement.full;
      measure.start();
      const result = partial ? this.#render() : this.#redraw();
      measure.stop(window.Wuse.DEBUG);
      return result;
    } else {
      return partial ? this.#render() : this.#redraw();
    }
  }

  // PARTS ROUTINES
  #fieldRender(name, label = "$none") {
    if (this.#binded) {
      let hittedRules, hittedChildren;
      const rulesHits = scanRulesForReplacements(this.#rules, name);
      if (hittedRules = !!rulesHits.length) rulesHits.forEach(cacheInvalidator);
      const childrenHits = scanChildrenForReplacements(this.#children, name);
      if (hittedChildren = !!childrenHits.length) childrenHits.forEach(cacheInvalidator);
      window.Wuse.DEBUG && this.#identified && debug(this,
        `reactive render (label: ${label}, field: ${name}, children: ${childrenHits.length}, rules: ${rulesHits.length})`
      );
      if (hittedChildren || hittedRules) {
        if (childrenHits.some(x => !!x.kind.length)) {
          // NOTE: when a slot gets invalidated the replaceChild will drop all other slots,
          // so to avoid a full redraw, all other slots are required to be invalidated too.
          this.#children.forEach(slotsInvalidator);
        }
        this.render();
      }
    }
  }

  #createField(name, value, writable) {
    if (this.#validateField(name) && this.#fields.establish(name, value)) {
      window.Object.defineProperty(this, name, { value, writable });
    }
    return this;
  }

  #validateField(name) {
    if (this.#fields.getIndexOf(name) === -1 && isInvalidFieldName(name)) {
      RuntimeErrors.onMisnamedField(name);
      return false;
    }
    return true;
  }

  #filiateChild(tmp) {
    if (tmp !== null) {
      if (this.#initialized && getElementByIdFromRoot(this, tmp.id)) {
        return RuntimeErrors.onTakenId(tmp.id);
      }
      if (tmp.custom && this.#options.autokeyChildren && this.#stateManager.hasKey()) {
        this.#filiatedKeys.tryToName(tmp);
      }
    }
    return tmp;
  }

  // PUBLIC

  // CONSTRUCTORS

  constructor(mode) {
    super();
    defineReadOnlyMembers(this, {
      info: {
        instanceNumber: ++BaseElement.instancesCount,
        unmodifiedRounds: 0,
        updatedRounds: 0
      },
      render: () => window.Wuse.RENDERING && this.#rendering && this.#binded && this.#revise(true),
      redraw: () => window.Wuse.RENDERING && this.#rendering && this.#binded && this.#revise(false),
      suspendRender: () => {
        this.#rendering = false;
        return this;
      },
      resumeRender: (autorender = true) => {
        this.#rendering = true;
        autorender && window.Wuse.RENDERING && this.#rendering && this.#binded && this.#revise(true);
        return this;
      },
      isRenderSuspended: () => !this.#rendering
    });
    this.#root = mode === REGULAR ? this : this.shadowRoot || this.attachShadow({ mode: mode });
    const evs = this.#elementEvents;
    evs.detect();
    evs.immediateTrigger("on_create");
    if (this.#options.attributeKeys) {
      const ats = this.getAttributeNames();
      if (!!ats.length) for (let x in ats) {
        const attr = ats[x];
        this[attr] = this.getAttribute(attr);
      }
    }
    if (this.dataset.wusekey) this.setElementsStoreKey(this.dataset.wusekey);
    const stm = this.#stateManager;
    if (stm.initializeState() > 1) {
      stm.state.data.options.automaticallyRestore ?
        this.restoreFromElementsStore() :
        evs.immediateTrigger("on_reconstruct", stm.state);
    } else {
      evs.immediateTrigger("on_construct", stm.state);
    }
    stm.writeState();
    this.#initialized = true;
  }

  // PROPERTIES

  get parameters() {
    return this.#parameters;
  }

  set parameters(value) {
    if (isAssignedObject(this.#parameters = value)) forEachOwnProperty(value, name => this[name] = value[name]);
  }

  // SELECTION METHODS

  selectChildElement(x) {
    return this.#root.querySelector(x);
  }

  selectChildElements(x) {
    return this.#root.querySelectorAll(x);
  }

  // NODE EVENTS

  connectedCallback() {
    window.Wuse.MEASURE && this.#measurement.attachment.start();
    const evs = this.#elementEvents;
    evs.detect();
    evs.immediateTrigger("on_connect");
    this.#inject(evs, "on_load");
    window.Wuse.MEASURE && this.#measurement.attachment.stop(window.Wuse.DEBUG);
  }

  disconnectedCallback() {
    window.Wuse.MEASURE && this.#measurement.dettachment.start();
    this.#bind(false);
    this.#elementEvents.immediateTrigger("on_disconnect");
    this.#stateManager.writeState();
    window.Wuse.MEASURE && this.#measurement.dettachment.stop(window.Wuse.DEBUG);
  }

  // ELEMENT OPTIONS

  deriveChildrenStoreKey(value) {
    this.#options.autokeyChildren = value;
    return this;
  }

  restoreOnReconstruct(value) {
    this.#options.automaticallyRestore = value;
    return this;
  }

  encloseRenderingEvents(value) {
    this.#options.enclosingEvents = value;
    return this;
  }

  fireSpecificRedrawEvents(reload, repaint) {
    this.#options.redrawReload = !!reload;
    this.#options.redrawRepaint = !!repaint;
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

  setStyleOptions(media, type) {
    this.#options.styleMedia = isNonEmptyString(media) ? media : EMPTY_STRING;
    this.#options.styleType = isNonEmptyString(type) ? type : EMPTY_STRING;
    return this;
  }

  // ELEMENTS STORE

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
      if (this.#options.autokeyChildren && !!this.#children.length) {
        this.#children.forEach(child => {
          if (child.custom) {
            this.#filiatedKeys.forget(child);
            this.#filiatedKeys.tryToName(child);
            cacheInvalidator(child);
          }
        });
        this.redraw();
      }
      this.#stateManager.writeState();
    }
    return this;
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

  // MAIN NODE

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

  removeMainAttribute(key) {
    delete this.#options.mainDefinition.attributes[key];
    if (this.#inserted) this.#main.element.removeAttribute(key);
    return this;
  }

  addMainClass(klass) {
    const cls = this.#options.mainDefinition.classes;
    if (cls.indexOf(klass) === -1) {
      cls.push(klass);
      if (this.#inserted) this.#main.element.classList.add(klass);
    }
    return this;
  }

  removeMainClass(klass) {
    const cls = this.#options.mainDefinition.classes;
    const idx = cls.indexOf(klass);
    if (idx > -1) {
      cls.splice(idx, 1);
      if (this.#inserted) this.#main.element.classList.remove(klass);
    }
    return this;
  }

  toggleMainClass(klass) {
    const cls = this.#options.mainDefinition.classes;
    const idx = cls.indexOf(klass);
    idx > -1 ? cls.splice(idx, 1) : cls.push(klass);
    if (this.#inserted) this.#main.element.classList.toggle(klass);
    return this;
  }

  setMainElement(shorthandNotation) {
    const tmp = parseElement(shorthandNotation);
    if (tmp !== null) {
      if (isNonEmptyString(tmp.content)) return RuntimeErrors.onInvalidDefinition(shorthandNotation);
      const def = this.#options.mainDefinition;
      if (this.#identified = isNonEmptyString(tmp.id)) def.id = tmp.id;
      if (isNonEmptyString(tmp.tag)) def.tag = tmp.tag;
      if (isNonEmptyArray(tmp.classes)) def.classes = tmp.classes;
      if (isAssignedObject(tmp.style)) def.style = tmp.style;
      if (isAssignedObject(tmp.attributes)) def.attributes = tmp.attributes;
      if (isNonEmptyArray(tmp.events)) def.events = tmp.events;
    }
    return this;
  }

  // RAW CONTENT

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

  // CSS RULES

  lockCSSRules() {
    this.#rules.locked = true;
    return this;
  }

  unlockCSSRules() {
    this.#rules.locked = false;
    return this;
  }

  getCSSRulesCount() {
    return this.#rules.length;
  }

  appendCSSRule(selector, properties, nesting) {
    if (nesting) return this.appendCSSNestedRule(selector, properties, nesting);
    const sliced = this.#rules.slice(-1);
    const rule = newRule(selector, properties);
    if (!sliced.length || !tryToJoinRules(sliced[0], rule)) {
      this.#rules.append(rule);
    }
    return this;
  }

  prependCSSRule(selector, properties, nesting) {
    if (nesting) return this.prependCSSNestedRule(selector, properties, nesting);
    const sliced = this.#rules.slice(0, 1);
    const rule = newRule(selector, properties);
    if (!sliced.length || !tryToJoinRules(sliced[0], rule)) {
      this.#rules.prepend(rule);
    }
    return this;
  }

  appendCSSNestedRule(selector, subselector, properties) {
    const sliced = this.#rules.slice(-1);
    const rule = newNestedRule(selector, subselector, properties);
    if (!sliced.length || !tryToJoinNestedRules(sliced[0], rule)) {
      this.#rules.append(rule);
    }
    return this;
  }

  prependCSSNestedRule(selector, subselector, properties) {
    const sliced = this.#rules.slice(0, 1);
    const rule = newNestedRule(selector, subselector, properties);
    if (!sliced.length || !tryToJoinNestedRules(sliced[0], rule)) {
      this.#rules.prepend(rule);
    }
    return this;
  }

  hasCSSRuleBySelector(selector) {
    return this.#rules.getIndexOf(selector) > -1;
  }

  replaceCSSRuleBySelector(selector, properties) {
    this.#rules.replace(this.#rules.getIndexOf(selector), newRule(selector, properties));
    return this;
  }

  transferCSSRuleBySelector(selector, element) {
    if (isNonEmptyString(selector) && typeof element === "object" && typeof element.#rules === "object") {
      const rls = this.#rules;
      const idx = rls.getIndexOf(selector);
      if (idx > -1) {
        element.#rules.append(rls[idx]);
        rls.remove(idx);
        return true;
      }
    }
    return false;
  }

  removeCSSRuleBySelector(selector) {
    this.#rules.remove(this.#rules.getIndexOf(selector));
    return this;
  }

  removeAllCSSRules() {
    this.#rules.clear();
    return this;
  }

  adoptCSSStyleSheet(sheet) {
    if (sheet instanceof CSSStyleSheet) {
      const target = this.#shadowed ? this.#root : document;
      // NOTE: this method is much more compatible than using push, see
      // https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets
      target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
      return true;
    }
    return false;
  }

  // CHILD ELEMENTS

  lockChildElements() {
    this.#children.locked = true;
    return this;
  }

  unlockChildElements() {
    this.#children.locked = false;
    return this;
  }

  getChildElementsCount() {
    return this.#children.length;
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
    const tmp = parseElement(shorthandNotation, rules);
    const chn = this.#children;
    const idx = chn.getIndexOf(id);
    if (idx > -1 && tmp !== null) chn.replace(idx, tmp);
    return this;
  }

  transferChildElementById(id, element) {
    if (isNonEmptyString(id) && typeof element === "object" && typeof element.#filiateChild === "function") {
      const chn = this.#children;
      const idx = chn.getIndexOf(id);
      if (idx > -1) {
        const cel = chn[idx];
        const owa = this.#filiatedKeys.forget(cel);
        const tmp = element.#filiateChild(cel);
        if (tmp !== null) {
          element.#children.append(tmp);
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
    this.#children.remove(this.#children.getIndexOf(id));
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
    if (!!this.#children.length) this.#children.forEach(child => (child.id === id) && renderingIncluder(child));
    return this;
  }

  excludeChildElementById(id) {
    if (!!this.#children.length) this.#children.forEach(child => (child.id === id) && renderingExcluder(child));
    return this;
  }

  invalidateChildElementsById(ids) {
    if (!!this.#children.length) this.#children.forEach(child => (ids.indexOf(child.id) > -1) && cacheInvalidator(child));
    return this;
  }

  invalidateChildElements(childs) {
    if (isAssignedArray(childs)) childs.forEach(cacheInvalidator);
    return this;
  }

  // INSTANCE FIELDS

  lockInstanceFields() {
    this.#fields.locked = true;
    return this;
  }

  unlockInstanceFields() {
    this.#fields.locked = false;
    return this;
  }

  getInstanceFieldsCount() {
    return this.#fields.length;
  }

  makeField(name, value) {
    return this.#createField(name, value, true);
  }

  makeReadonlyField(name, value) {
    return this.#createField(name, value, false);
  }

  makeReactiveField(name, value, handler, initial = true) {
    if (this.#validateField(name)) {
      if (this.#fields.establish(name, value)) {
        createReactiveField(
          this, name, value, handler, (name, label) => this.#fieldRender(name, label || "$auto"), name => this.dropField(name)
        );
        this.#reactives.add(name);
      }
      if (initial) this.#fieldRender(name, "$init");
    }
    return this;
  }

  makeExternalReactiveField(mirror, name, value, handler, initial = true) {
    return this.makeReactiveField(name, mirror[name] || value, actions => { mirror[name] = this[name]; handler(actions) }, initial);
  }

  isReactiveField(name) {
    return this.#reactives.has(name);
  }

  hasField(name) {
    return this.#fields.getIndexOf(name) > -1;
  }

  dropField(name) {
    const fds = this.#fields;
    if (fds.prepare()) {
      const idx = fds.getIndexOf(name);
      if (idx > -1) {
        fds.splice(idx, 1);
        if (this.hasOwnProperty(name)) delete this[name];
        if (this.#reactives.has(name)) this.#reactives.delete(name);
        this.#stateManager.writeState();
        return true;
      }
    }
    return false;
  }

  dropAllFields() {
    const knames = [];
    const rnames = [];
    this.#fields.forEach(field => {
      const name = field.name;
      this.hasOwnProperty(name) && knames.push(name);
      this.#reactives.has(name) && rnames.push(name);
    });
    if (this.#fields.clear()) {
      knames.forEach(name => delete this[name]);
      rnames.forEach(name => this.#reactives.delete(name));
      this.#stateManager.writeState();
      return true;
    }
    return false;
  }

  snapshotInstanceFields() {
    return this.#fields.snapshot();
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
      RuntimeErrors.onMisnamedField = ensureFunction(options.onMisnamedField);
    }
  }

  static register() {
    return window.Wuse.register(this);
  }

  static create(parameters, at = "body") {
    return window.Wuse.create({
      element: { type: this },
      target: at instanceof window.HTMLElement ? { node: at } : (typeof at === "string" ? { selector: at } : at),
      instance: { parameters }
    });
  }

}

