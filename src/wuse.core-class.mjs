// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseInitializationRoutines from './wuse.initialization-routines.mjs';
import WuseWebHelpers from './wuse.web-helpers.mjs';
import WuseJsHelpers from './wuse.javascript-helpers.mjs';
const { noop, isOf } = WuseJsHelpers;
import WuseElementParts from './wuse.element-parts.mjs';
const { convertHTMLTagToShorthandNotation } = WuseElementParts;
import WuseElementModes from './wuse.element-modes.mjs';
const { specializeClass, REGULAR, OPEN, CLOSED } = WuseElementModes;
import WuseElementClasses from './wuse.element-classes.mjs';
import WusePerformanceMeasurement from './wuse.performance-measurement.mjs';
import WuseSimpleStorage from './wuse.simple-storage.mjs';
import WuseStringHashing from './wuse.string-hashing.mjs';
import WuseBaseElement from './wuse.base-element.mjs';

const fields = {
  tmp: new window.Object(),
  WebHelpers: WuseWebHelpers,
  JsHelpers: WuseJsHelpers,
  PerformanceMeasurement: WusePerformanceMeasurement,
  NonShadowElement: specializeClass(WuseBaseElement, REGULAR),
  OpenShadowElement: specializeClass(WuseBaseElement, OPEN),
  ClosedShadowElement: specializeClass(WuseBaseElement, CLOSED)
};

const methods = {
  debug: msg => window.console.log("[WUSE:DEBUG]", msg),
  blockUpdate: (task, onDone) => {
    if (isOf(task, Function)) {
      const gww = window.Wuse;
      if (gww.DEBUG) gww.debug("blocking rendering");
      gww.RENDERING = false;
      try {
        task();
      } catch (err) {
        throw err;
      } finally {
        gww.RENDERING = true;
        if (gww.DEBUG) gww.debug("unblocking rendering");
        if (isOf(onDone, Function)) onDone();
      }
    }
  },
  isShadowElement: instance => {
    const p = window.Object.getPrototypeOf(instance.constructor);
    return p === window.Wuse.OpenShadowElement || p === window.Wuse.ClosedShadowElement;
  },
  htmlToShorthand: html => convertHTMLTagToShorthandNotation(html),
  register: classes => WuseElementClasses.registerClasses(
    isOf(classes, window.Array) ? classes : new window.Array(classes)
  ),
  create: configuration => isOf(configuration, window.Object) ?
    WuseElementClasses.createInstance(
      configuration.element, configuration.target, configuration.instance
    ) : undefined
};

export default function makeCoreClass(version) { return class CoreClass {

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

  static WebHelpers = null; // utility web helpers module

  static JsHelpers = null; // utility javascript helpers module

  static PerformanceMeasurement = null; // performance measurement module

  static NonShadowElement = null; // non-shadow element class

  static OpenShadowElement = null; // open-shadow element class

  static ClosedShadowElement = null; // closed-shadow element class

  static debug = noop; // wuse console debug

  static blockUpdate = noop; // wuse block update

  static htmlToShorthand = noop; // element definition helper

  static isShadowElement = noop; // shadow presence checker

  static register = noop; // element registration

  static create = noop; // element creation

  // WUSE INITILIZATION

  static {
    WuseInitializationRoutines.declareUnwritableMembers(this, { fields, methods });
    WuseInitializationRoutines.detectFeatures(this);
    WuseInitializationRoutines.initializeModules(this);
  }

}};

