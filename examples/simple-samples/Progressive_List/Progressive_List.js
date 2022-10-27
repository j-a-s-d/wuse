// Wuse (Web Using Shadow Elements) by j-a-s-d

class List_AddButton extends Wuse.ClosedShadowElement {

  static { this.register(); }

  on_create() {
    this
      .setMainElement("span")
      .appendChildElement("a=+")
      .appendCSSRule("a", `
        padding: 0rem 0.5rem 0rem 0.5rem;
        border-radius: 1rem;
        font-size: 1.5rem;
        font-weight: bold;
        font-family: monospace;
        background-color: darkseagreen;
        color: white;
        cursor: pointer;
        user-select: none;
        float: right;
      `)
  }

}

class List_Item extends Wuse.NonShadowElement {

  static { this.register(); }

  on_create() {
    this
      .setAttributesAsKeys(true)
      .setMainElement("li")
      .appendChildElement("span=~{text}~")
      .appendChildElement(`a#btnEdit.hidden!click=&&nbsp;&#9998;`)
      .appendChildElement(`a#btnRemove.hidden!click=&&nbsp;&#x2A2F;`)
      .appendCSSRule("li", `
        font-family: monospace;
        font-size: 1.5rem;
      `)
      .appendCSSRule(".hidden", "display: none")
      .appendCSSRule("li:hover .hidden", "display: inline-block")
      .appendCSSRule("a", `
        font-weight: bold;
        cursor: pointer;
        user-select: none;
      `)
      .appendCSSRule("#btnEdit", "color: orange")
      .appendCSSRule("#btnRemove", "color: red")
      .makeReactiveField("text", "")
  }

  on_btnEdit_click = () => {
    let txt = window.prompt("Edit item text", this.text);
    if (txt !== null) this.text = txt;
  }

  on_btnRemove_click = e => {
    if (window.confirm("Do you really want to remove this item?"))
      this.performItemDeletion(e.currentTarget.parentElement.parentElement.id);
  }

  performItemDeletion(id) {}

}

class Progressive_List extends Wuse.ClosedShadowElement {

  static { this.register(); }

  #appendItem = (number, text) => this.appendChildElement(`list-item#item${number}[text='${text}']`).redraw();

  #removeItem = id => this.removeChildElementById(id).redraw();

  #eachItem = treater => this.selectChildElements("list-item").forEach(treater);

  on_create() {
    this
      .setMainElement("ul")
      .appendCSSRule("ul", `
        list-style-type: square;
        min-height: 4rem;
        border: 1px solid silver;
        border-radius: 0.25rem;
        padding: 1rem 1rem 1rem 2rem;
      `)
      .appendChildElement("list-addbutton#btnAdd!click")
      .makeField("counter", 0)
  }

  on_btnAdd_click = e => this.#appendItem(++this.counter, `New text (${this.counter})`);

  on_load() {
    this.#eachItem(item => item.performItemDeletion = id => this.#removeItem(id));
  }

  getItems() {
    return Wuse.JsHelpers.buildArray(result => this.#eachItem(item => result.push(item.text)));
  }

  addItems(values) {
    Wuse.JsHelpers.isNonEmptyArray(values) && values.forEach(value => this.#appendItem(++this.counter, value));
  }

  clearItems() {
    this.#eachItem(item => this.#removeItem(item.id));
  }

}

