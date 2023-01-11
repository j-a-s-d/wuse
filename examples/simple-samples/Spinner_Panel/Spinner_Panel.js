// Wuse (Web Using Shadow Elements) by j-a-s-d

class Spinner_Panel extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement("div#pnlSpinner.hidden")
      .appendChildElement("span#spnSpinner.rotate")
      .appendChildElement("p#parContent")
      .appendCSSRule("#pnlSpinner", `
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: 0;
        height: 100%;
        width: 100%;
        text-align: center;
        z-index: 2147483647;
        background-color: ~{backgroundColor}~;
        opacity: 1.0;
        overflow: hidden;
      `)
      .appendCSSRule("#spnSpinner", `
        display: inline-block;
        border-radius: 50%;
        box-shadow: inset -0.2em 0 0 0.2em ~{spinnerColor}~;
      `)
      .appendCSSRule("#parContent", `
        user-select: none;
        color: ~{contentColor}~;
      `)
      .appendCSSRule(".hidden", "visibility: hidden")
      .appendCSSRule(".rotate", "animation: rotate 1.0s linear infinite")
      .appendCSSNestedRule("@keyframes rotate", "to", "transform: rotate(360deg)")
      .makeReactiveField("backgroundColor", "rgba(127, 127, 127, 0.5)")
      .makeReactiveField("spinnerColor", "gray")
      .makeReactiveField("contentColor", "gray")
  }

  #setSpinnerPixelStyle(key, value) {
    this.spnSpinner.style[key] = `${value}px`;
  }

  show(content) {
    this.parContent.innerHTML = content || "";
    const mch = this.pnlSpinner.clientHeight;
    const side = mch / 10;
    this.#setSpinnerPixelStyle("height", side);
    this.#setSpinnerPixelStyle("width", side);
    this.#setSpinnerPixelStyle("marginTop", mch / 2 - side);
    this.removeMainClass("hidden");
  }

  hide() {
    this.addMainClass("hidden");
  }

  showFor(ms, content) {
    this.show(content);
    setTimeout(() => this.hide(), ms);
  }

}

