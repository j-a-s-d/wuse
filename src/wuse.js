// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseJsHelpers from './wuse.javascript-helpers.js';
import WuseWebHelpers from './wuse.web-helpers.js';
import WuseRuntimeErrors from './wuse.runtime-errors.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseSimpleStorage from './wuse.simple-storage.js';
import WuseTemplateImporter from './wuse.template-importer.js';
import WusePerformanceMeasurement from './wuse.performance-measurement.js';
import WuseBaseElement from './wuse.base-element.js';

class Wuse {

  static get VERSION() { return "0.4.3"; }

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

  static instantiate(classes, target, events) {
    return WuseElementClasses.instantiateClasses(WuseJsHelpers.isOf(classes, window.Array) ? classes : new window.Array(classes), target, events);
  }

  static isShadowElement(instance) {
    const p = window.Object.getPrototypeOf(instance.constructor);
    return p === Wuse.OpenShadowElement || p === Wuse.ClosedShadowElement;
  }

  static NonShadowElement = WuseBaseElement.specializeClass(WuseBaseElement.RootMode.REGULAR);

  static OpenShadowElement = WuseBaseElement.specializeClass(WuseBaseElement.RootMode.OPEN);

  static ClosedShadowElement = WuseBaseElement.specializeClass(WuseBaseElement.RootMode.CLOSED);

  static get elementCount() { return WuseBaseElement.instancesCount; }

  static elementsStorage = new WuseSimpleStorage();

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
    WuseBaseElement.initialize({ onFetchTemplate: WuseTemplateImporter.fetch });
  }

}

window.Wuse = Wuse;

