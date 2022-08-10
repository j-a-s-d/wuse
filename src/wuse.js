// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseJsHelpers from './wuse.javascript-helpers.js';
import WuseWebHelpers from './wuse.web-helpers.js';
import WuseRuntimeErrors from './wuse.runtime-errors.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseSimpleStorage from './wuse.simple-storage.js';
import WuseTemplateImporter from './wuse.template-importer.js';
import WusePerformanceMeasurement from './wuse.performance-measurement.js';
import WuseBaseElement from './wuse.base-element.js';

window.Wuse = class {

  static get VERSION() { return "0.4.5"; }

  static DEBUG = false; // debug mode

  static FATALS = false; // show-stopper errors

  static MEASURE = false; // performance monitoring

  static RENDERING = true; // global rendering flag

  static hashRoutine = str => {
    // NOTE: Java's classic String.hashCode()
    // style, multiplying by the odd prime 31
    // ('(h << 5) - h' was faster originally)
    var h = 0;
    for (let x = 0; x < str.length; x++) {
      h = (h = ((h << 5) - h) + str.charCodeAt(x)) & h;
    }
    return h;
  }

  static elementsStorage = new WuseSimpleStorage(); // wuse elements storage

  static get elementCount() { return WuseBaseElement.instancesCount; } // wuse element count

  // UNWRITABLE PLACEHOLDERS

  static tmp = null; // convenience temporary object

  static WebHelpers = null; // utility web helpers

  static JsHelpers = null; // utility javascript helpers

  static PerformanceMeasurement = null; // performance measurement module

  static NonShadowElement = null; // non-shadow element class

  static OpenShadowElement = null; // open-shadow element class

  static ClosedShadowElement = null; // closed-shadow element class

  static debug = WuseJsHelpers.noop; // wuse console debug

  static blockUpdate = WuseJsHelpers.noop; // wuse block update

  static register = WuseJsHelpers.noop; // element register

  static instantiate = WuseJsHelpers.noop; // element instantiation

  static isShadowElement = WuseJsHelpers.noop; // shadow presence

  // PRIVATE ROUTINES

  static #detectFeatures() {
    const detectFeature = (flag, msg) => !flag && WuseRuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
    try {
      detectFeature(WuseJsHelpers.isOf(window.document, window.HTMLDocument), "HTML Document");
      detectFeature(WuseJsHelpers.isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
      WuseWebHelpers.onDOMContentLoaded(() => detectFeature(WuseJsHelpers.isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
    } catch (e) {
      WuseRuntimeErrors.UNKNOWN_ERROR.emit();
    }
  }

  static #initializeModules() {
    WusePerformanceMeasurement.initialize((stopWatch, event) => window.Wuse.debug(JSON.stringify(WuseJsHelpers.buildArray(data => {
      data.push({ instances: window.Wuse.elementCount });
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
    WuseTemplateImporter.initialize({
      onExtinctTemplate: WuseRuntimeErrors.EXTINCT_TEMPLATE.emit,
      onInvalidTemplate: WuseRuntimeErrors.INVALID_TEMPLATE.emit
    });
    WuseElementClasses.initialize({
      onMisnamedClass: WuseRuntimeErrors.MISNAMED_CLASS.emit,
      onUnregistrableClass: WuseRuntimeErrors.UNREGISTRABLE_CLASS.emit,
      onUnregisteredClass: WuseRuntimeErrors.UNREGISTERED_CLASS.emit,
      onInvalidClass: WuseRuntimeErrors.INVALID_CLASS.emit,
      onDeferredInstantiation: WuseWebHelpers.onDOMContentLoaded
    });
    WuseBaseElement.initialize({
      onAllowHTML: WuseRuntimeErrors.ALLOW_HTML.emit,
      onInvalidKey: WuseRuntimeErrors.INVALID_KEY.emit,
      onInvalidDefinition: WuseRuntimeErrors.INVALID_DEFINITION.emit,
      onInexistentTemplate: WuseRuntimeErrors.INEXISTENT_TEMPLATE.emit,
      onUnespecifiedSlot: WuseRuntimeErrors.UNESPECIFIED_SLOT.emit,
      onInvalidId: WuseRuntimeErrors.INVALID_ID.emit,
      onFetchTemplate: WuseTemplateImporter.fetch
    });
  }

  static #declareUnwritable(items) {
    WuseJsHelpers.forEachOwnProperty(items, name => Object.defineProperty(
      this, name, { value: items[name], writable: false, configurable: false, enumerable: false }
    ));
  }

  // WUSE INITILIZATION

  static {
    this.#detectFeatures();
    const fields = {
      tmp: new window.Object(),
      WebHelpers: WuseWebHelpers,
      JsHelpers: WuseJsHelpers,
      PerformanceMeasurement: WusePerformanceMeasurement,
      NonShadowElement: WuseBaseElement.specializeClass(WuseBaseElement.RootMode.REGULAR),
      OpenShadowElement: WuseBaseElement.specializeClass(WuseBaseElement.RootMode.OPEN),
      ClosedShadowElement: WuseBaseElement.specializeClass(WuseBaseElement.RootMode.CLOSED)
    }
    this.#declareUnwritable(fields);
    const methods = {
      debug: (msg) => window.console.log("[WUSE:DEBUG]", msg),
      blockUpdate: (task, arg) => {
        if (WuseJsHelpers.isOf(task, Function)) {
          if (window.Wuse.DEBUG) window.Wuse.debug("blocking");
          window.Wuse.RENDERING = false;
          try {
            task(arg);
          } catch (e) {
            throw e;
          } finally {
            window.Wuse.RENDERING = true;
            if (window.Wuse.DEBUG) window.Wuse.debug("unblocking");
          }
        }
      },
      register: classes => WuseElementClasses.registerClasses(
        WuseJsHelpers.isOf(classes, window.Array) ? classes : new window.Array(classes)
      ),
      instantiate: (classes, target, events) => WuseElementClasses.instantiateClasses(
        WuseJsHelpers.isOf(classes, window.Array) ? classes : new window.Array(classes), target, events
      ),
      isShadowElement: instance => {
        const p = window.Object.getPrototypeOf(instance.constructor);
        return p === window.Wuse.OpenShadowElement || p === window.Wuse.ClosedShadowElement;
      }
    }
    this.#declareUnwritable(methods);
    this.#initializeModules();
  }

}

