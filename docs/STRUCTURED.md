# Wuse

## Structured Element Documentation

Following, the documentation on the Wuse Structured Element API.

## Structured Element API

### Information Read-Only Properties
  instanceNumber
  unmodifiedRounds
  updatedRounds

### Parameters Accesing Property
  parameters

### Rendering Read-Only Methods
  render
  redraw
  suspendRender
  resumeRender
  isRenderSuspended

### General Methods
  removeFromParent
  setElementsAsKeys
  setAttributesAsKeys
  setStyleOptions

### Node Callbacks
  connectedCallback
  disconnectedCallback

### Elements Store
  getElementsStore
  setElementsStore
  hasElementsStoreKey
  getElementsStoreKey
  setElementsStoreKey
  deriveChildrenStoreKey
  persistToElementsStore
  restoreFromElementsStore
  removeFromElementsStore

### Main Element
  isMainIdentified
  getMainAttribute
  setMainAttribute
  removeMainAttribute
  addMainClass
  removeMainClass
  toggleMainClass
  setMainEventHandler
  dropMainEventHandler
  setMainElement

### Raw Content
  allowsRawContent
  allowRawContent
  setRawContent
  appendRawContent
  prependRawContent
  hasRawContent
  getRawContent

### CSS Rules
  lockCSSRules
  unlockCSSRules
  getCSSRulesCount
  appendCSSRule
  prependCSSRule
  appendCSSNestedRule
  prependCSSNestedRule
  hasCSSRuleBySelector
  replaceCSSRuleBySelector
  transferCSSRuleBySelector
  removeCSSRuleBySelector
  removeAllCSSRules
  adoptCSSStyleSheet

### Instance Fields
  lockInstanceFields
  unlockInstanceFields
  getInstanceFieldsCount
  makeField
  makeReadonlyField
  makeReactiveField
  makeExternalReactiveField
  isReactiveField
  hasField
  dropField
  dropAllFields
  snapshotInstanceFields

### Events Related
  restoreOnReconstruct
  encloseRenderingEvents
  fireSpecificRedrawEvents

### Children Methods
  selectChildElement
  selectChildElements
  lockChildElements
  unlockChildElements
  getChildElementsCount
  appendChildElement
  prependChildElement
  appendChildElements
  prependChildElements
  replaceChildElementById
  transferChildElementById
  removeChildElementById
  removeAllChildElements
  checkChildElementIsIncludedById
  includeChildElementById
  excludeChildElementById
  invalidateChildElementsById
  invalidateChildElements

