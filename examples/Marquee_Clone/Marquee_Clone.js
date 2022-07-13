// Wuse (Web Using Shadow Elements) by j-a-s-d

class Marquee_Clone extends Wuse.OpenShadowElement {

  on_create() {
    const vpfx = Wuse.WebHelpers.getCSSVendorPrefix();
    this
      .setMainElement("div")
      .setStyleOptions("", "")
      .appendCSSRule(":host", `
        width: ${vpfx}fill-available;
      `)
      .appendCSSRule(":host div", `
        height: 40px;
        overflow: hidden;
        position: relative;
      `)
      .appendCSSRule(":host p", `
        position: absolute;
        width: 100%;
        height: 100%;
        margin: 0;
        text-align: center;
        ${vpfx}transform: translateX(100%);
        ${vpfx}animation: scroll-left 30s linear infinite;
      `)
      .appendCSSNestedRule(`@${vpfx}keyframes scroll-left`, "0%", "transform: translateX(60%);")
      .appendCSSNestedRule(`@${vpfx}keyframes scroll-left`, "100%", "transform: translateX(-60%);")
      .appendChildElement("p=<slot name='text'></slot>")
      .appendChildElement("%slots%p[slot=text]=This is a marquee clone.");
  }

}

