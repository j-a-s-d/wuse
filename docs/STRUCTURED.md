# Wuse

## Structured Element Documentation

Following, the documentation on the Wuse Structured Element API.

## Structured Element API

### Information Read-Only Properties

* instanceNumber, *structured element instance number*
* unmodifiedRounds, *number of render rounds that made no updates*
* updatedRounds, *nomber of render rounds that made real updates*

### Parameters Accesing Property

* parameters, *received arguments*

### Rendering Read-Only Methods

* render, *try partial render instruction*
* redraw, *force full render instruction*
* suspendRender, *start ignoring future render invokations*
* resumeRender, *stop ignoring future render invokations*
* isRenderSuspended, *check if it is ignoring render invokations*

### Node Callbacks

* connectedCallback, *node connection event*
* disconnectedCallback, *node disconnection event*

### Element Events

* encloseRenderingEvents, *pre and post render events switch*
* fireSpecificRedrawEvents, *redraw and repaint events switch*

### Element Keys

* setElementsAsKeys, *elements as keys switch*
* setAttributesAsKeys, *attributes as keys switch*

### Element Styles

* setStyleOptions, *style options setter*
* adoptCSSStyleSheet, *css stylesheet adopter*

### Elements Store

* getElementsStore, *elements store getter*
* setElementsStore, *elements store setter*
* hasElementsStoreKey, *elements store key checker*
* getElementsStoreKey, *elements store key getter*
* setElementsStoreKey, *elements store key setter*
* deriveChildrenStoreKey, *elements store key deriver*
* persistToElementsStore, *elements store persistor*
* restoreFromElementsStore, *elements store restorer*
* removeFromElementsStore, *elements store remover*

### Main Element

* isMainIdentified, *element identifier checker*
* getMainAttribute, *main element attribute getter*
* setMainAttribute, *main element attribute setter*
* removeMainAttribute, *main element attribute remover*
* addMainClass, *main element class adder*
* removeMainClass, *main element class remover*
* toggleMainClass, *main element class toggler*
* setMainEventHandler, *main element event handler setter*
* dropMainEventHandler, *main element event handler dropper*
* setMainElement, *main element definition setter*

### Raw Content

* allowsRawContent, *raw content enablement checker*
* allowRawContent, *raw content enabler*
* setRawContent, *raw content setter*
* appendRawContent, *raw content appender*
* prependRawContent, *raw content prepender*
* hasRawContent, *raw content existence checker*
* getRawContent, *raw content getter*

### Children Methods

* lockChildElements, *child elements locker*
* unlockChildElements, *child elements unlocker*
* getChildElementsCount, *child elements count getter*
* appendChildElement, *single child element appender*
* prependChildElement, *single child element prepender*
* appendChildElements, *multiple child elements appender*
* prependChildElements, *multiple child elements prepender*
* replaceChildElementById, *child element replacer*
* transferChildElementById, *child element transferer*
* removeChildElementById, *single child element remover*
* removeAllChildElements, *all child elements remover*
* checkChildElementIsIncludedById, *child element existence checker*
* includeChildElementById, *child element render includer*
* excludeChildElementById, *child element render excluder*
* invalidateChildElementsById, *single child element render invalidator*
* invalidateChildElements, *all child elements render invalidator*
* selectChildElement, *single child element selector*
* selectChildElements, *multiple child element selector*

### CSS Rules

* lockCSSRules, *css rules locker*
* unlockCSSRules, *css rules unlocker*
* getCSSRulesCount, *css rules count getter*
* appendCSSRule, *css rule appender*
* prependCSSRule, *css rule prepender*
* appendCSSNestedRule, *css nested rule appender*
* prependCSSNestedRule, *css nested rule prepender*
* hasCSSRuleBySelector, *css rule existence checker*
* hasCSSNestedRuleBySelectors, *css nested rule existence checker*
* replaceCSSRuleBySelector, *css rule replacer*
* replaceCSSNestedRuleBySelectors, *css nested rule replacer*
* transferCSSRuleBySelector, *css rule transferer*
* removeCSSRuleBySelector, *single css rule remover*
* removeAllCSSRules, *all css rules remover*

### Instance Fields

* lockInstanceFields, *instance fields locker*
* unlockInstanceFields, *instance fields unlocker*
* getInstanceFieldsCount, *instance fields count getter*
* makeField, *instance field maker*
* makeReadonlyField, *instance read-only field maker*
* makeReactiveField, *instance reactive field maker*
* makeExternalReactiveField, *external reactive field maker*
* isReactiveField, *instance reactive field existence checker*
* hasField, *instance field existence checker*
* dropField, *single instance field dropper*
* dropAllFields, *all instance fields dropper*
* snapshotInstanceFields, *instance fields snapshotter*

### General Methods

* removeFromParent, *element from parent remover*
* restoreOnReconstruct, *element restoring on reconstruction switch*

