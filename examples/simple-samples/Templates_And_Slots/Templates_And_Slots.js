// Wuse (Web Using Shadow Elements) by j-a-s-d

class Card_Content_Template extends Wuse.NonShadowElement {

  on_create() {
    this
      .setMainElement("template#tmplCardContent")
      .appendCSSRule("p", {
        "font-family": "system-ui",
        "color": "#f90202"
      })
      .appendChildElements(`
        slot[name=sltSymbol]=*
        slot[name=sltCaption]=CAPTION!
        slot[name=sltDescription]=DESCRIPTION!
      `)
  }

}

class Sample_Card extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement("div#cardBox")
      .appendCSSRule("#cardBox", `
        border-radius: 4px;
        border: 1px solid silver;
        margin: 2em;
        padding: 2em;
      `)
      .appendChildElement("%templates%#tmplCardContent")
      .appendChildElement("%slots%span[slot=sltSymbol|style=float:right]=~{symbol}~")
      .appendChildElement("%slots%h1[slot=sltCaption]=~{caption}~")
      .appendChildElement("%slots%p[slot=sltDescription]=~{description}~")
      .makeReactiveField("symbol", "*")
      .makeReactiveField("caption", "Caption")
      .makeReactiveField("description", "Description")
      .setAttributesAsKeys(true)
  }

}

class Templates_And_Slots extends Wuse.NonShadowElement {

  on_create() {
    this
      .setMainElement("div")
      .appendChildElement("sample-card[caption='Caption 0'|description='Description 0']")
      .appendChildElement("sample-card[caption='Caption 1'|description='Description 1'|symbol='_']")
      .appendChildElement("sample-card[caption='Caption 2'|description='Description 2'|symbol='x']")
  }

}

