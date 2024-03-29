// Wuse (Web Using Shadow Elements) by j-a-s-d

import RuntimeErrors from './wuse.runtime-errors.mjs';
import TemplateImporter from './wuse.template-importer.mjs';
import ElementClasses from './wuse.element-classes.mjs';
import StructuredElement from './wuse.structured-element.mjs';
import JsHelpers from './wuse.javascript-helpers.mjs';
const { defineReadOnlyMembers, isOf, buildArray } = JsHelpers;

export default class InitializationRoutines {

  static detectFeatures(instance) {
    const detectFeature = (flag, msg) => !flag && RuntimeErrors.UNSUPPORTED_FEATURE.emit(msg);
    detectFeature(isOf(window.document, window.HTMLDocument), "HTML Document"); // for example, won't work with a root SVG and foreingObject
    detectFeature(isOf(window.customElements, window.CustomElementRegistry), "Custom Elements");
    instance.WebHelpers.onDOMContentLoaded(() => detectFeature(isOf(window.document.body.attachShadow, window.Function), "Shadow DOM"));
  }

  static initializeModules(instance) {
    instance.PerformanceMeasurement.initialize((stopWatch, event) => instance.debug(JSON.stringify(buildArray(data => {
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
    TemplateImporter.initialize({
      onExtinctTemplate: RuntimeErrors.EXTINCT_TEMPLATE.emit,
      onInvalidTemplate: RuntimeErrors.INVALID_TEMPLATE.emit
    });
    ElementClasses.initialize({
      onBadTarget: RuntimeErrors.BAD_TARGET.emit,
      onMisnamedClass: RuntimeErrors.MISNAMED_CLASS.emit,
      onUnregistrableClass: RuntimeErrors.UNREGISTRABLE_CLASS.emit,
      onUnregisteredClass: RuntimeErrors.UNREGISTERED_CLASS.emit,
      onAlreadyRegistered: RuntimeErrors.ALREADY_REGISTERED.emit,
      onInvalidClass: RuntimeErrors.INVALID_CLASS.emit,
      onDeferredInstantiation: instance.WebHelpers.onDOMContentLoaded
    });
    StructuredElement.initialize({
      onAllowHTML: RuntimeErrors.ALLOW_HTML.emit,
      onInvalidKey: RuntimeErrors.INVALID_KEY.emit,
      onInvalidDefinition: RuntimeErrors.INVALID_DEFINITION.emit,
      onLockedDefinition: RuntimeErrors.LOCKED_DEFINITION.emit,
      onInexistentTemplate: RuntimeErrors.INEXISTENT_TEMPLATE.emit,
      onUnespecifiedSlot: RuntimeErrors.UNESPECIFIED_SLOT.emit,
      onUnknownTag: RuntimeErrors.UNKNOWN_TAG.emit,
      onInvalidId: RuntimeErrors.INVALID_ID.emit,
      onTakenId: RuntimeErrors.TAKEN_ID.emit,
      onMisnamedField: RuntimeErrors.MISNAMED_FIELD.emit,
      onInvalidState: RuntimeErrors.INVALID_STATE.emit,
      onFetchTemplate: TemplateImporter.fetch
    });
  }

  static declareUnwritableMembers(instance, items) {
    defineReadOnlyMembers(instance, items.fields);
    defineReadOnlyMembers(instance, items.methods);
  }

}

