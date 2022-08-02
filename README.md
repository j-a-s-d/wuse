# WUSE

Wuse (Web Using Shadow Elements) is a Web Components library that encapsulates the usage of the Custom Elements Registry and the Shadow DOM features of ES6. Additionally, it offers an IoC event-driven lifecycle, a pure javascript approach to markup and styles generation, optional reactivity for fields, and much more.

> This is a work in progress, with a lot of things in an experimental stage. More documentation, tests and examples to come.

## MOTIVATION
> *"If you want more effective programmers, you will discover that they should not waste their time debugging, they should not introduce the bugs to starth with."*
- Edger Dijkstra, The Humble Programmer, 1972

## CHARACTERISTICS

* no external dependencies
* self-documenting api (descriptive "long" function names)
* full unit testing [IN-PROGRESS]
* markdown documentation [TODO]

## FEATURES

`#NATURAL-WAY`

Wuse exposes a more natural way of working with the browser instead of hiding the way it works:

	- wraps the Custom Element Registry usage: just create your class extending from a Wuse HTML Element class, register it and then instantiate it as you need (class names are converted into valid custom elements, ex: 'My_Element' class is converted into 'my-element' tag)
	- creates a functional structure over the Shadow DOM: a root element, a style element and a main element
	- does not block nor interfere with direct DOM access (for example, this is good when dealing with legacy webs, allowing progressive migrations)

`#FULL-CONTROL`

Wuse gives you the power to control everything in your web development:

	- allows all-in-one markup, styles and scripting definitions: you can define your custom element in a single es6 class file
	- allows to retain control on the Element lifecycle: you can hook 14 different events
	- allows optional field reactivity with free control on the behaviour

`#NO-BUILDS`

Wuse does not require any build step to be performed.

## HiSTORY

* [0.4.1] 2022-ago-02
  - added `cloneObject` and `forEachOwnProperty` to `JavascriptHelpers` class
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
  - updated `package.json` file
* [0.3.7] 2022-jul-26
  - extracted `ElementClasses` class to an external file
  - added `ElementClasses` class unit test
  - added `ensureFunction`, `isAssignedObject`, `isAssignedArray`, `isNonEmptyArray` and `noop` to `JavascriptHelpers` class
  - added `UNREGISTRABLE_CLASS` error to `RuntimeErrors` class
  - improved custom browser tester
  - added `package.json` file
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
  - added `removeChildren` and `htmlEncode` routines to `WebHelpers` class
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

