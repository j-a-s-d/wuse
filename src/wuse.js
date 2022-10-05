// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseInitializationRoutines from './wuse.initialization-routines.js';
import WuseJsHelpers from './wuse.javascript-helpers.js';
const { noop, isOf } = WuseJsHelpers;
import WuseWebHelpers from './wuse.web-helpers.js';
import WusePerformanceMeasurement from './wuse.performance-measurement.js';
import WuseSimpleStorage from './wuse.simple-storage.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseElementModes from './wuse.element-modes.js';
import WuseBaseElement from './wuse.base-element.js';
import WuseStringHashing from './wuse.string-hashing.js';
import { version } from '../package.json';

window.Wuse = window.Wuse || class {

  // READONLY PROPERTIES

  static get VERSION() { return version; } // version number

  static get elementCount() { return WuseBaseElement.instancesCount; } // element count

  // GLOBAL FLAGS

  static DEBUG = false; // debug mode

  static FATALS = false; // show-stopper errors

  static MEASURE = false; // performance monitoring

  static RENDERING = true; // committing updates

  // OVERRIDABLE FIELDS

  static hashRoutine = WuseStringHashing.defaultRoutine; // wuse string hashing

  static elementsStorage = new WuseSimpleStorage(); // wuse elements storage

  // UNWRITABLE PLACEHOLDERS

  static tmp = null; // convenience temporary object

  static WebHelpers = null; // utility web helpers

  static JsHelpers = null; // utility javascript helpers

  static PerformanceMeasurement = null; // performance measurement module

  static NonShadowElement = null; // non-shadow element class

  static OpenShadowElement = null; // open-shadow element class

  static ClosedShadowElement = null; // closed-shadow element class

  static debug = noop; // wuse console debug

  static blockUpdate = noop; // wuse block update

  static register = noop; // element registration

  static instantiate = noop; // element instantiation

  static create = noop; // element creation

  static isShadowElement = noop; // shadow presence

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
          if (isOf(task, Function)) {
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
        isShadowElement: instance => {
          const p = window.Object.getPrototypeOf(instance.constructor);
          return p === window.Wuse.OpenShadowElement || p === window.Wuse.ClosedShadowElement;
        },
        register: classes => WuseElementClasses.registerClasses(
          isOf(classes, window.Array) ? classes : new window.Array(classes)
        ),
        instantiate: (classes, target, events) => WuseElementClasses.instantiateClasses(
          isOf(classes, window.Array) ? classes : new window.Array(classes), target, events
        ),
        create: (configuration, option) => isOf(configuration, window.Object) ?
          WuseElementClasses.createInstance(
            configuration.element, configuration.target, configuration.instance
          ) : undefined
      }
    });
    WuseInitializationRoutines.detectFeatures(this);
    WuseInitializationRoutines.initializeModules(this);
  }

};

