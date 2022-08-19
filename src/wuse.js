// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseInitializationRoutines from './wuse.initialization-routines.js';
import WuseJsHelpers from './wuse.javascript-helpers.js';
import WuseWebHelpers from './wuse.web-helpers.js';
import WusePerformanceMeasurement from './wuse.performance-measurement.js';
import WuseSimpleStorage from './wuse.simple-storage.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseElementModes from './wuse.element-modes.js';
import WuseBaseElement from './wuse.base-element.js';

window.Wuse = class {

  // READONLY PROPERTIES

  static get VERSION() { return "0.5.3"; } // version number

  static get elementCount() { return WuseBaseElement.instancesCount; } // element count

  // GLOBAL FLAGS

  static DEBUG = false; // debug mode

  static FATALS = false; // show-stopper errors

  static MEASURE = false; // performance monitoring

  static RENDERING = true; // committing updates

  // OVERRIDABLE FIELDS

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

  // WUSE INITILIZATION

  static {
    WuseInitializationRoutines.declareUnwritableMembers(this, {
      fields: {
        tmp: new window.Object(),
        WebHelpers: WuseWebHelpers,
        JsHelpers: WuseJsHelpers,
        PerformanceMeasurement: WusePerformanceMeasurement,
        NonShadowElement: WuseElementModes.specializeClass(WuseBaseElement, WuseElementModes.REGULAR),
        OpenShadowElement: WuseElementModes.specializeClass(WuseBaseElement, WuseElementModes.OPEN),
        ClosedShadowElement: WuseElementModes.specializeClass(WuseBaseElement, WuseElementModes.CLOSED)
      },
      methods: {
        debug: msg => window.console.log("[WUSE:DEBUG]", msg),
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
    });
    WuseInitializationRoutines.detectFeatures(this);
    WuseInitializationRoutines.initializeModules(this);
  }

}

