// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class ElementModes {

  static get REGULAR() { return "regular"; }

  static get OPEN() { return "open"; }

  static get CLOSED() { return "closed"; }

  static specializeClass = (elementClass, rootMode) => class extends elementClass {

    constructor() {
      super(rootMode);
    }

  }

}

