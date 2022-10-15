// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class StringHashing {

  static defaultRoutine(str = "") {
    // NOTE: Java's classic String.hashCode()
    // style, multiplying by the odd prime 31
    // ('(h << 5) - h' was faster originally)
    var h = 0;
    for (let idx = 0; idx < str.length; idx++) {
      h = (h = ((h << 5) - h) + str.charCodeAt(idx)) & h;
    }
    return h;
  }

}

