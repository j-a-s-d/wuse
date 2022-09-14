// Wuse (Web Using Shadow Elements) by j-a-s-d

import WuseRuntimeErrors from './wuse.runtime-errors.js';
import WuseTemplateImporter from './wuse.template-importer.js';
import WuseElementClasses from './wuse.element-classes.js';
import WuseBaseElement from './wuse.base-element.js';

const defineReadOnlyMembers = (instance, items) => window.Object.getOwnPropertyNames(items).forEach(
  name => Object.defineProperty(instance, name, {
    value: items[name], writable: false, configurable: false, enumerable: false
  })
);

export default class InitializationRoutines {

  static detectFeatures(instance) {
    const detectFeature = (flag, msg) => !flag && WuseRuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
    try {
      detectFeature(instance.JsHelpers.isOf(window.document, window.HTMLDocument), "HTML Document");
      detectFeature(instance.JsHelpers.isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
      instance.WebHelpers.onDOMContentLoaded(() => detectFeature(instance.JsHelpers.isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
    } catch (e) {
      WuseRuntimeErrors.UNKNOWN_ERROR.emit();
    }
  }

  static initializeModules(instance) {
    instance.PerformanceMeasurement.initialize((stopWatch, event) => instance.debug(JSON.stringify(instance.JsHelpers.buildArray(data => {
      data.push({ instances: instance.elementCount });
      data.push(stopWatch.getDebugInfo());
      switch (event) {
        case "stop":
          data.push(instance.PerformanceMeasurement.DOMUpdate.overall.getDebugInfo());
          break;
        case "finish":
          data.push(instance.PerformanceMeasurement.BrowserRender.overall.getDebugInfo());
          break;
      }
    }))));
    WuseTemplateImporter.initialize({
      onExtinctTemplate: WuseRuntimeErrors.EXTINCT_TEMPLATE.emit,
      onInvalidTemplate: WuseRuntimeErrors.INVALID_TEMPLATE.emit
    });
    WuseElementClasses.initialize({
      onBadTarget: WuseRuntimeErrors.BAD_TARGET.emit,
      onMisnamedClass: WuseRuntimeErrors.MISNAMED_CLASS.emit,
      onUnregistrableClass: WuseRuntimeErrors.UNREGISTRABLE_CLASS.emit,
      onUnregisteredClass: WuseRuntimeErrors.UNREGISTERED_CLASS.emit,
      onAlreadyRegistered: WuseRuntimeErrors.ALREADY_REGISTERED.emit,
      onInvalidClass: WuseRuntimeErrors.INVALID_CLASS.emit,
      onDeferredInstantiation: instance.WebHelpers.onDOMContentLoaded
    });
    WuseBaseElement.initialize({
      onAllowHTML: WuseRuntimeErrors.ALLOW_HTML.emit,
      onInvalidKey: WuseRuntimeErrors.INVALID_KEY.emit,
      onInvalidDefinition: WuseRuntimeErrors.INVALID_DEFINITION.emit,
      onLockedDefinition: WuseRuntimeErrors.LOCKED_DEFINITION.emit,
      onInexistentTemplate: WuseRuntimeErrors.INEXISTENT_TEMPLATE.emit,
      onUnespecifiedSlot: WuseRuntimeErrors.UNESPECIFIED_SLOT.emit,
      onUnknownTag: WuseRuntimeErrors.UNKNOWN_TAG.emit,
      onInvalidId: WuseRuntimeErrors.INVALID_ID.emit,
      onInvalidState: WuseRuntimeErrors.INVALID_STATE.emit,
      onFetchTemplate: WuseTemplateImporter.fetch
    });
  }

  static declareUnwritableMembers(instance, items) {
    defineReadOnlyMembers(instance, items.fields);
    defineReadOnlyMembers(instance, items.methods);
  }

}

