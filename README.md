# WUSE

Wuse (Web Using Shadow Elements) is a Web Components library that encapsulates the usage of the Custom Elements Registry and the Shadow DOM features of ES6. Additionally, it offers an IoC event-driven lifecycle, a pure javascript approach to markup and styles generation, optional reactivity for fields, and much more.

> This is a work in progress, with a lot of things in an experimental stage. More documentation, tests and examples to come.

## MOTIVATION
> *"If you want more effective programmers, you will discover that they should not waste their time debugging, they should not introduce the bugs to starth with."*
- Edger Dijkstra, The Humble Programmer, 1972

## CHARACTERISTICS

* no external dependencies (none in runtime and only esbuild if you want to build from source)
* self-documenting api (descriptive "long" function names)
* full unit testing (630+ tests cases)
* [`markdown documentation`](docs/README.md) (public api)
* [`extensive example library`](examples/README.md) (39 demos: 16 simple samples and 23 with third party libraries)

## FEATURES

`#NATURAL-WAY`

Wuse exposes a more natural way of working with the browser instead of hiding the way it works:

	- wraps the Custom Element Registry usage: just create your class extending from a Wuse HTML Element class, register it and then instantiate it as you need (class names are converted into valid custom elements, ex: 'My_Element' class is converted into 'my-element' tag)
	- creates a functional structure over the Shadow DOM: a root element, a style element and a main element
	- does not block nor interfere with direct DOM access (for example, this is good when dealing with legacy webs, allowing progressive migrations)

`#FULL-CONTROL`

Wuse gives you the power to control everything in your web development:

	- allows all-in-one markup, styles and scripting definitions: you can define your custom element in a single ES6 class file
	- allows to retain control on the Element lifecycle: you can hook up to 14 different events
	- allows optional field reactivity with free control on the behaviour: you can structure the code the way you want

`#NO-BUILDS`

Wuse does not require any build step to be performed.

## HiSTORY

* [0.9.9] 2023-jan-16
  - added `hasCSSNestedRuleBySelectors` and `replaceCSSNestedRuleBySelectors` to the `BaseElement`
  - added Javascript & Web Helpers API initial documentation
  - added `Indeterminate_ProgressBar` demo
* [0.9.8] 2023-jan-11
  - renamed `BaseElement` to `StructuredElement`
  - added Structured Element API initial documentation
  - added `Spinner_Panel` demo
* [0.9.7] 2023-jan-04
  - added `getRawContent` to the `BaseElement`
  - moved testing related files into `tests` subdirectory inside `src` directory
* [0.9.6] 2022-dec-30
  - improved SVG support
  - added `SVG_ForeignObject` demo
  - added `test.unim` ubernim file to serve testing with enhanced capabilities (that means support for the `SHUTDOWN` button in the `tests.html` file)
* [0.9.5] 2022-dec-02
  - added `hasRawContent` to the `BaseElement`
  - added `docs` directory with some initial documentation
* [0.9.4] 2022-nov-23
  - added recursive element definition support via the walrus operator `:=`
  - added `Animate_JsFunction_Sample` demo
* [0.9.3] 2022-nov-19
  - added `next` getter to the `NodeManager` class
  - added `MetroUI_ShortcutButton_Sample` demo
* [0.9.2] 2022-nov-15
  - added `allowsRawContent` to the `BaseElement` class
  - added `Concise_AlertBox_Sample` demo
* [0.9.1] 2022-nov-13
  - added `htmlToShorthand` to the `CoreClass` class
  - now static `register` of the `BaseElement` class is fluent
  - added `Mini_MenuDrawer_Sample` demo
* [0.9.0] 2022-nov-11
  - extracted `ChildrenHolder` class to an external file
  - extracted `RulesHolder` class to an external file
  - extracted `FieldsHolder` class to an external file
  - now `setAttributesAsKeys` flag is set on by default
  - removed incorporated rules in children
* [0.8.9] 2022-nov-09
  - added `isMainIdentified` and `removeFromParent` to the `BaseElement` class
  - added `MDL_ContactChip_Sample` demo
* [0.8.8] 2022-nov-08
  - added `setMainEventHandler` and `dropMainEventHandler` to the `BaseElement` class
  - added `Materialize_FloatingButton_Sample` demo
* [0.8.7] 2022-nov-07
  - added main element events support in the `BaseElement` class
  - added `Wing_Grid960_Sample` demo
* [0.8.6] 2022-nov-03
  - added `defineReadOnlyMembers` to the `JavascriptHelpers` class
  - added `changeDOMElementTag` to the `WebHelpers` class
  - added `Turret_FormInputs_Sample` demo
* [0.8.5] 2022-oct-31
  - added `adoptCSSStyleSheet` to the `BaseElement` class
  - added `Picnic_StackToggle_Sample` demo
* [0.8.4] 2022-oct-28
  - added `getChildElementsCount`, `getCSSRulesCount` and `getInstanceFieldsCount` to the `BaseElement` class
  - added `buildDOMElement` and `buildDOMFragment` to the `WebHelpers` class
  - added `Primer_SideNavigation_Sample` demo
* [0.8.3] 2022-oct-27
  - added `selectChildElements` to the `BaseElement` class
  - added `Progressive_List` demo
* [0.8.2] 2022-oct-25
  - added `isReactiveField` to the `BaseElement` class
  - added `Tachyons_BasicBanner_Sample` demo
* [0.8.1] 2022-oct-24
  - added `removeMainAttribute` to the `BaseElement` class
  - added `Development_Console` demo
* [0.8.0] 2022-oct-22
  - added `encloseRenderingEvents` to the `BaseElement` class (this implies no `on_prerender` and `on_postrender` events by default)
  - now `restoreOnReconstruct` flag is set on by default (this means no `on_reconstruct` event by default)
  - now `fireSpecificRedrawEvents` flags are not set by default (this means no `on_reload` and `on_repaint` events by default)
  - removed `instantiate` from `CoreClass` in favor of `create` usage and the `BaseElement` own `create` routine
* [0.7.9] 2022-oct-21
  - extracted `CoreClass` class to an external file
  - added `CoreClass` class unit test
  - added `transferCSSRuleBySelector` to the `BaseElement` class
  - added `UIkit_Sortable_Group` demo
* [0.7.8] 2022-oct-19
  - added `isHTMLVoidTag` to the `WebHelpers` class
  - added `transferChildElementById` to the `BaseElement` class
  - added `Transfer_Child` demo
* [0.7.7] 2022-oct-17
  - added `fireSpecificRedrawEvents` to the `BaseElement` class
  - added `Spectre_Timeline_Sample` demo
* [0.7.6] 2022-oct-15
  - renamed all the es6 modules to the .mjs file extension
  - splitted demos at directory examples into simple-samples and third-party subdirectories
  - added `Siimple_SignIn_Sample` example
* [0.7.5] 2022-oct-14
  - added `snapshotInstanceFields` to the `BaseElement` class
  - added `Canvas_Text_Wrapper` example
* [0.7.4] 2022-oct-12
  - added `restoreOnReconstruct` to the `BaseElement` class (if you set this behaviour then `on_reconstruct` won't fire)
  - added `prepare` to the `PartsHolder` class
  - added `isHTMLAttribute` to the `WebHelpers` class
  - added `MISNAMED_FIELD` error to the `RuntimeErrors` class
  - added `ChartJS_VerticalBars_Sample` example
* [0.7.3] 2022-oct-10
  - added `dropAllFields`, `addMainClass`, `removeMainClass` and `toggleMainClass` to the `BaseElement` class
  - added `FomanticUI_Messages_Sample` example
* [0.7.2] 2022-oct-08
  - added `removeAllChildElements` and `removeAllCSSRules` to the `BaseElement` class
  - added `clear` to the `PartsHolder` class
  - added `element` setter to the `NodeManager` class
  - now the instantiators methods accept an HTMLElement node as the targeted parent
  - added `Foundation_Accordion_Sample` example
* [0.7.1] 2022-oct-05
  - added `on_content_verification` to the `ContentManager` class
  - added `wuse.dbg.js` to the build generation and distribution directory (comes unmified and with DEBUG and MEASURE flags turned on by default)
  - added `Milligram_Form_Sample` example
* [0.7.0] 2022-oct-03
  - added `create` to the `Wuse` class
  - added static `register` and `create` to the `BaseElement` class
  - added `createInstance` to the `ElementClasses` class
  - now you can pass parameters to manually instantiated elements
  - added `areOf` to the `JavascriptHelpers` class
  - added `getIndexOf` to the `PartsHolder` class
  - removed freeze and defreeze from the reactive field actions
  - added `Skeleton_Grid_Sample` example
* [0.6.9] 2022-sep-30
  - added `makeReadonlyField` to the `BaseElement` class
  - added `Bulma_Breadcrumb_Sample` example
* [0.6.8] 2022-sep-28
  - added `isIntegerNumber` to the `JavascriptHelpers` class
  - added `Regular_vs_Reactive` example
* [0.6.7] 2022-sep-26
  - added `on_snapshot_part` and `on_recall_part` to the `PartsHolder` class
  - added `TAKEN_ID` error to the `RuntimeErrors` class
* [0.6.6] 2022-sep-22
  - added `dropField` to the `BaseElement` class
  - extracted `ReactiveField` class to an external file
  - added `ReactiveField` class unit test
* [0.6.5] 2022-sep-20
  - added `nameFiliatedKey`, `rememberFiliatedKey` and `hasFiliatedKey` to the `StateManager` class
  - added `deriveChildrenStoreKey` to the `BaseElement` class
  - now children custom elements are assumed to be Wuse elements so automatically by default a filiated wusekey is added if not already present
* [0.6.4] 2022-sep-18
  - added `slotsInvalidator` to the `WuseRenderingRoutines` class
  - added `PureCSS_DropdownMenu_Sample` example
* [0.6.3] 2022-sep-15
  - added `Bootstrap_Radiogroup_Sample` example
  - changed `ALREADY_REGISTERED` error to a warning
* [0.6.2] 2022-sep-14
  - added `BAD_TARGET` warning to the `RuntimeErrors` class
  - added `jQueryUI_Datepicker_Sample` example
* [0.6.1] 2022-sep-10
  - extracted `StateManager` class to an external file
  - added `StateManager` class unit test
  - added `replaceCSSRuleBySelector` to the `BaseElement` class
* [0.6.0] 2022-sep-06
  - improved state management
  - adjusted instantiation process events nomenclature renaming them to `on_element_instantiated` and `on_bad_target`
  - added `WUSEKEY_ATTRIBUTE` and `WUSENODE_ATTRIBUTE` to the `StringConstants` class
* [0.5.9] 2022-aug-31
  - added `hasField`, `hasCSSRuleBySelector` and `removeCSSRuleBySelector` to the `BaseElement` class
* [0.5.8] 2022-aug-30
  - added `isHTMLTag` to the `WebHelpers` class
  - added `UNKNOWN_TAG` warning to the `RuntimeErrors` class
  - added `getMainAttribute` to the `BaseElement` class
  - extracted `ElementEvents` class to an external file
  - added `ElementEvents` class unit test
  - added `Plain_Progress_Bar` example
* [0.5.7] 2022-aug-26
  - added `removeChildElementById` to the `BaseElement` class
  - added `remove` to the `PartsHolder` class
* [0.5.6] 2022-aug-23
  - added `ALREADY_REGISTERED` error to the `RuntimeErrors` class
  - added `Command_Line` example
  - now version constant is been taken from the `package.json` file
* [0.5.5] 2022-aug-22
  - extracted `StringHashing` class to an external file
  - added `StringHashing` class unit test
* [0.5.4] 2022-aug-20
  - added `lockChildElements`, `unlockChildElements`, `lockCSSRules`, `unlockCSSRules`, `lockFields` and `unlockFields` to the `BaseElement` class
  - added `locked` and `on_forbidden_change` to the `PartsHolder` class
  - added `LOCKED_DEFINITION` error to the `RuntimeErrors` class
* [0.5.3] 2022-aug-19
  - added `suspendRender`, `resumeRender` and `isRenderSuspended` to the `BaseElement` class
* [0.5.2] 2022-aug-16
  - extracted `InitializationRoutines` class to an external file
  - added `Templates_And_Slots` example
* [0.5.1] 2022-aug-13
  - extracted `ElementModes` class to an external file
  - added `ElementModes` class unit test
  - added `Performing_100K_Updates` example
* [0.5.0] 2022-aug-12
  - added `removeFromElementsStore` to the `BaseElement` class
  - removed `keepDataStored` to the `restoreFromElementsStore` method of the `BaseElement` class
  - added `makeState` to the `ElementParts` class
  - added `INVALID_STATE` error to the `RuntimeErrors` class
  - added `Element_Events` example
* [0.4.5] 2022-aug-10
  - added `force` argument to the `process` method of the `ContentManager` class
  - refactored `Wuse` class
* [0.4.4] 2022-aug-08
  - added `EMPTY_STRING` to the `JavascriptHelpers` class
  - improved `BaseElement` class
* [0.4.3] 2022-aug-05
  - extracted `BaseElement` class to an external file
* [0.4.2] 2022-aug-04
  - added `ElementParts` class unit test
  - added `PartsHolder` class unit test
* [0.4.1] 2022-aug-02
  - added `cloneObject` and `forEachOwnProperty` to the `JavascriptHelpers` class
  - extracted `ElementParts` class to an external file
  - extracted `PartsHolder` class to an external file
* [0.4.0] 2022-jul-31
  - extracted `TextReplacements` class to an external file
  - added `TextReplacements` class unit test
* [0.3.9] 2022-jul-28
  - added `onElementInstantiated` and `onBadTarget` events to the instantiation process
  - added `Simple_Button` example
  - extracted `RenderingRoutines` class to an external file
  - added `RenderingRoutines` class unit test
* [0.3.8] 2022-jul-27
  - extracted `TemplateImporter` class to an external file
  - added `TemplateImporter` class unit test
  - improved custom browser tester
  - updated the `package.json` file
* [0.3.7] 2022-jul-26
  - extracted `ElementClasses` class to an external file
  - added `ElementClasses` class unit test
  - added `ensureFunction`, `isAssignedObject`, `isAssignedArray`, `isNonEmptyArray` and `noop` to the `JavascriptHelpers` class
  - added `UNREGISTRABLE_CLASS` error to the `RuntimeErrors` class
  - improved custom browser tester
  - added the `package.json` file
  - published on npm registry
* [0.3.6] 2022-jul-22
  - extracted `StringConstants` class to an external file
  - extracted `JavascriptHelpers` class to an external file
  - added `JavascriptHelpers` class unit test
  - extracted `PerformanceMeasurement` class to an external file
  - added `PerformanceMeasurement` class unit test
  - improved custom browser tester
* [0.3.5] 2022-jul-20
  - extracted `NodeManager` class to an external file
  - added `NodeManager` class unit test
  - extracted `ContentManager` class to an external file
  - added `ContentManager` class unit test
  - improved custom browser tester
* [0.3.4] 2022-jul-18
  - extracted `EqualityAnalyzer` class to an external file
  - added `EqualityAnalyzer` class unit test
  - extracted `SimpleStorage` class to an external file
  - added `SimpleStorage` class unit test
* [0.3.3] 2022-jul-15
  - added support for text nodes in the shorthand notation via `^text^` pseudo-node type (ex. '^text^=this is a text node'; note that this, of course, does not combine with named slots)
  - added support for html encoded text in the shorthand notation via the `&` content prefix (ex. 'label=&<b>this tags will be read as plain text</b>', note if you need start a content with '&' use double '&&')
  - added `removeChildren` and `htmlEncode` routines to the `WebHelpers` class
  - added `INVALID_TEMPLATE` runtime error
* [0.3.2] 2022-jul-14
  - extracted `WebHelpers` class to an external file
  - added `WebHelpers` class unit test
  - extracted `RuntimeErrors` class to an external file
  - added `RuntimeErrors` class unit test
  - added custom browser tester
* [0.3.1] 2022-jul-13
  - added `appendCSSNestedRule` and `prependCSSNestedRule` to support flat nested css rules
  - now appended/prepended css rules are joined up to the last/first rule in the list respectively if the selector is the same
  - added `getCSSVendorPrefix` to the `WebHelpers` class
  - added `Marquee_Clone` to the `examples` directory
* [0.3.0] 2022-jul-11
  - initial release
* [0.2.0] 2022-jul-02
  - more features
* [0.1.0] 2022-jun-22
  - started coding

