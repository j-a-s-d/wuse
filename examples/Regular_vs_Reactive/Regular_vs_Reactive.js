// Wuse (Web Using Shadow Elements) by j-a-s-d

class A_Button extends Wuse.ClosedShadowElement {
  on_create() {
    this
      .appendCSSRule(":host", `
        user-select: none;
        text-align: center;
        display: inline-block;
      `)
      .appendCSSRule("a", `
        padding: 1rem;
        letter-spacing: .15rem;
        cursor: pointer;
        font-weight: 600;
        font-style: normal;
        font-family: system-ui;
        text-transform: uppercase;
      `)
  }
}

Wuse.register(class Regular_Button extends A_Button {
  on_create() {
    super.on_create();
    this.appendChildElement("a#lblText=Click me!");
  }
});

Wuse.register(class Reactive_Button extends A_Button {
  on_create() {
    super.on_create();
    this
      .appendChildElement("a#lblText=~{text}~")
      .appendCSSRule("#lblText", "color: ~{textcolor}~")
      .makeReactiveField("textcolor", "white")
      .makeReactiveField("text", "Click me!");
  }
});

class Regular_vs_Reactive extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement("#pnlSimple")
      .appendCSSRule("#pnlSimple", `
        border-radius: 8px;
        background-color: white;
        border: thin solid silver;
        margin: 2rem;
        padding: 2rem;
        min-height: 2rem;
      `)
      .appendChildElement("regular-button#btnRegular!click")
      .appendCSSRule("#btnRegular", `
        float: left;
        background-color: red;
        border: thick solid maroon;
      `)
      .appendChildElement("reactive-button#btnReactive!click")
      .appendCSSRule("#btnReactive", `
        float: right;
        background-color: yellowgreen;
        border: thick solid green;
      `)
  }

  on_btnRegular_click = () => {
    this.btnRegular.lblText.textContent = "regular";
    this.btnRegular.style.color = "pink";
  }

  on_btnReactive_click = () => {
    this.btnReactive.text = "reactive";
    this.btnReactive.textcolor = "yellow";
  }

}

