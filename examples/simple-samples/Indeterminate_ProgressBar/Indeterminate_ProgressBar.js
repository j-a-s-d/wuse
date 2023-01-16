// Wuse (Web Using Shadow Elements) by j-a-s-d

class Indeterminate_ProgressBar extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement("div#pnlBar.hidden")
      .appendChildElement("div#pnlProgress.animate")
      .appendCSSRule("#pnlBar", `
        height: ~{heightSize}~;
        width: 100%;
        z-index: 2147483647;
        background-color: ~{backgroundColor}~;
        overflow: hidden;
      `)
      .appendCSSRule("#pnlProgress", `
        width: 100%;
        height: 100%;
        background-color: ~{foregroundColor}~;
        transform-origin: 0% 50%;
      `)
      .appendCSSRule(".hidden", "visibility: hidden")
      .appendCSSRule(".animate", "animation: indeterminate 1.0s linear infinite")
      .appendCSSRule(".absolute-top", `
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: 0;
      `)
      .appendCSSNestedRule("@keyframes indeterminate", "0%", "transform: translateX(0) scaleX(0)")
      .appendCSSNestedRule("@keyframes indeterminate", "40%", "transform: translateX(0) scaleX(0.4)")
      .appendCSSNestedRule("@keyframes indeterminate", "100%", "transform: translateX(100%) scaleX(0.6)")
      .makeReactiveField("backgroundColor", "lightsteelblue")
      .makeReactiveField("foregroundColor", "steelblue")
      .makeReactiveField("heightSize", "4px")
  }

  show() {
    this.removeMainClass("hidden");
  }

  hide() {
    this.addMainClass("hidden");
  }

  showFor(ms, content) {
    this.show(content);
    setTimeout(() => this.hide(), ms);
  }

  stickToTop() {
    this.addMainClass("absolute-top");
  }

  unstickFromTop() {
    this.removeMainClass("absolute-top");
  }

}

