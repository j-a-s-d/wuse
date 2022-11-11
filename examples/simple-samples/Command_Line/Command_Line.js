// Wuse (Web Using Shadow Elements) by j-a-s-d

Wuse.register(class Text_Box extends Wuse.NonShadowElement {

  on_create() {
    this
      .setMainElement("div[style=border:0px]")
      .appendCSSRule("#txtEdit", `
        border: 0px;
        border-radius: 0.5em;
        margin: 0.1%;
        width: 99.6%;
        font-family: monospace;
      `)
      .appendCSSRule("#txtEdit:focus", "outline:none")
      .appendChildElement("input#txtEdit[type=text]");
  }

});

class Command_Line extends Wuse.ClosedShadowElement {

  static { Wuse.register(this); }

  on_create() {
    this
      .setMainElement("div")
      .appendCSSRule("div", `
        border: 1px solid silver;
        border-radius: 0.5em;
        padding: 0.1%;
      `)
      .appendChildElement("text-box#txtBox");
  }

  #processLine() {
    const [cmd, ...args] = this.txtBox.txtEdit.value.split(" ");
    Wuse.JsHelpers.ensureFunction(this.on_process_command)(cmd.toUpperCase(), args);
    this.txtBox.txtEdit.value = "";
  }

  #setEventHandlers() {
    this.txtBox.txtEdit.onkeypress = e => e.charCode !== 13 ? undefined : this.#processLine();
  }

  on_load() {
    this.#setEventHandlers();
  }

}

