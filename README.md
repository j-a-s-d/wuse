# WUSE

Wuse (Web Using Shadow Elements) is a Web Components library that encapsulates the usage of the Custom Elements Registry and the Shadow DOM features of ES6. Additionally, it offers an IoC event-driven lifecycle, a pure javascript approach to markup and styles generation, optional reactivity for fields, and much more.

> This is a work in progress, with a lot of things in an experimental stage. More documentation, tests and examples to come.

## MOTIVATION
> *"If you want more effective programmers, you will discover that they should not waste their time debugging, they should not introduce the bugs to starth with."*
- Edger Dijkstra, The Humble Programmer, 1972

## CHARACTERISTICS

* no external dependencies
* self-documenting api (descriptive long proc names)
* full unit testing [TODO]
* markdown documentation [TODO]

## FEATURES

* wraps the Custom Element Registry usage: just create your class extending from a Wuse HTML Element class, register it and then instantiate it as you need (class names are converted into valid custom elements, ex: 'My_Element' is converted into my-element)
* stablishes an functional structure over the Shadow DOM: a root element, a style element and a main element
* does not block or interfere with direct DOM access (good when dealing with legacy webs, allowing progressive migrations)
* allows all-in-one markup, styles and scripting definitions: you can define your custom element in a single es6 class file
* allows to retain control on the Element lifecycle: you can hook 14 different events
* allows optional field reactivity with full control on the behaviour
* no build step required

## HiSTORY

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

