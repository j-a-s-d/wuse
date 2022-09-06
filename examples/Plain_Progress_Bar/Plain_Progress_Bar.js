// Wuse (Web Using Shadow Elements) by j-a-s-d

class Plain_Progress_Bar extends Wuse.OpenShadowElement {

  on_create() {
    const vpfx = Wuse.WebHelpers.getCSSVendorPrefix();
    const elid = Wuse.WebHelpers.getUniqueId();
    this
      .setMainElement("progress#" + elid)
      .appendCSSRule("#" + elid, `
        border: none;
        background-size: auto;
        height: 2em;
        width: 100%;
        direction: ~{direction}~
      `)
      .appendCSSRule(`#${elid}::${vpfx}progress-bar`, "background: ~{barcolor}~")
      .appendCSSRule(`#${elid}::${vpfx}progress-value`, "background: ~{valuecolor}~")
      .makeReactiveField("direction", "ltr")
      .makeReactiveField("barcolor", "silver")
      .makeReactiveField("valuecolor", "orange")
      .makeField("maximum", 100)
      .makeField("percentage", 0)
  }

  #updateValues = () => this
    .setMainAttribute("max", this.maximum)
    .setMainAttribute("value", this.percentage);

  on_reconstruct(state) {
    this.restoreFromElementsStore();
  }

  on_load() {
    this.#updateValues();
  }

  on_reload() {
    this.#updateValues();
  }

}

