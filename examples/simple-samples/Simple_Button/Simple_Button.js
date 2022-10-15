// Wuse (Web Using Shadow Elements) by j-a-s-d

class Simple_Button extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement(`a#lnkMain`)
      .appendChildElement("span=~{text}~")
      .appendCSSRule("#lnkMain", `
        width: 12.5rem;
        margin: 0.5rem 2.5rem;
        padding: 1rem 2rem;
        user-select: none;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        border-radius: 2rem;
        letter-spacing: .15rem;
        font-weight: 600;
        font-style: normal;
        font-family: system-ui;
        background-color: ~{backgroundcolor}~;
        color: ~{foregroundcolor}~
      `)
      .makeReactiveField("backgroundcolor", "navy")
      .makeReactiveField("foregroundcolor", "white")
      .makeReactiveField("text", "This is a button");
  }

}

