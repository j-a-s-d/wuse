# Wuse

## Core Class Documentation

Following, the documentation on the Wuse Core API.

## Core Class API

### Read-Only Properties

* VERSION, *version number*
* elementCount, *element count*

### Global Flags

* DEBUG, *debug mode*
* FATALS, *show-stopper errors*
* MEASURE, *performance monitoring*
* RENDERING, *committing updates*

### Overwridable Fields

* hashRoutine, *string hashing*
* elementsStorage, *elements storage*

### General Fields

* tmp, *convenience temporary object*
* [`WebHelpers`](WEBHELPERS.md), *utility web helpers module*
* [`JsHelpers`](JSHELPERS.md), *utility javascript helpers module*
* PerformanceMeasurement, *performance measurement module*

### Element Classes

* [`NonShadowElement`](STRUCTURED.md), *non-shadow element class*
* [`OpenShadowElement`](STRUCTURED.md), *open-shadow element class*
* [`ClosedShadowElement`](STRUCTURED.md), *closed-shadow element class*

### Element Methods

* register, *element registration*
* create, *element creation*

### Convenience Methods

* debug, *wuse console debug*
* blockUpdate, *wuse block update*
* isShadowElement, *shadow presence checker*
* htmlToShorthand, *element definition helper*

