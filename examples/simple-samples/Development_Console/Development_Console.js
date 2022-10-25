// Wuse (Web Using Shadow Elements) by j-a-s-d

const { isNonEmptyString, isAssignedArray, isIntegerNumber } = window.Wuse.JsHelpers;
const evaluateJavascript = code => window.eval(code);
const toJsonString = x => window.JSON.stringify(x);
const lazyExecute = fn => window.requestAnimationFrame(fn);
const hookConsoleMethod = (method, hook) => window.console[method] = (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) => {
  let args = [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9];
  let index = args.length;
  while (index-- && args[index] === undefined);
  if (index > -1) args.splice(index + 1);
  hook(args);
};

class Text_Panel extends Wuse.ClosedShadowElement {

  static { this.register(); }

  #format = line => isAssignedArray(line) && line.length > 1 ? line.join(" ") : line;

  #append = html => {
    this.lines += html;
    this.scrollToBottom();
  }

  on_construct() {
    this
      .appendChildElement("pre#pnlLines=~{lines}~")
      .appendCSSRule("pre", `
        font-family: monospace;
        font-size: ~{fontHeight}~;
        max-height: ~{maxHeight}~;
        overflow-y: scroll;
        margin: 0px;
      `)
      .appendCSSRule("hr", `
        border-top: 1px dotted silver;
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      `)
      .appendCSSRule("span", `
        user-select: none;
        font-weight: bold;
      `)
      .makeField("counters", {})
      .makeReactiveField("lines", "")
      .makeReactiveField("maxHeight", 400)
      .makeReactiveField("fontHeight", 16)
  }

  on_load() {
    this.scrollToBottom();
  }

  pushText = line => this.#append(`<span style='color: gray'>&gt;&nbsp;</span>${line}<br/>`);

  pushInfo = line => this.#append(`<div><span>&nbsp;&nbsp;</span>${this.#format(line)}</div>`);

  pushWarning = line => this.#append(`<div style='background-color: lightyellow'><span style='color: goldenrod'>&#x26A0;&nbsp;</span>${this.#format(line)}</div>`);

  pushError = line => this.#append(`<div style='background-color: lavenderblush; color: red'><span>&#x2BBE;&nbsp;</span>${this.#format(line)}</div>`);

  pushResult = line => this.#append(`<div style='color: silver'><span>&lt;&nbsp;</span>${toJsonString(line)}</div><hr/>`);

  invokeCounter = label => {
    let lbl = isAssignedArray(label) ? label[0] : label;
    if (!isNonEmptyString(lbl)) lbl = "default";
    if (!isIntegerNumber(this.counters[lbl])) this.counters[lbl] = 0;
    this.#append(`<div><span>&nbsp;&nbsp;</span>${lbl}: ${++this.counters[lbl]}</div>`);
  };

  resetCounter = label => {
    let lbl = isAssignedArray(label) ? label[0] : label;
    if (!isNonEmptyString(lbl)) lbl = "default";
    this.counters[lbl] = 0;
    this.#append(`<div><span>&nbsp;&nbsp;</span>${lbl}: ${++this.counters[lbl]}</div>`);
  };

  clearLines = () => this.lines = "<div><span>&nbsp;&nbsp;</span><i>Console was cleared</i></div>";

  scrollToBottom = () => this.pnlLines.scrollTop = this.pnlLines.scrollHeight;

}

class Text_Box extends Wuse.ClosedShadowElement {

  static { this.register(); }

  #index = -1;

  on_construct() {
    this
      .setMainAttribute("style", "display: flex")
      .appendCSSRule("input", `
        font-family: monospace;
        font-size: ~{fontHeight}~;
        border: 0px;
        margin: 0.1em;
        min-width: 0;
        flex: 1;
      `)
      .appendCSSRule("input:focus", "outline: none")
      .appendChildElement("input#txtEdit[type=text]")
      .makeReactiveField("fontHeight", 16)
      .makeField("history", [])
  }

  setFocus = () => {
    const edit = this.txtEdit;
    edit.focus();
    lazyExecute(() => edit.setSelectionRange(edit.value.length, edit.value.length));
  }

  pullLine = () => {
    const result = this.txtEdit.value;
    this.txtEdit.value = "";
    const his = this.history;
    if (!his.length || his[his.length - 1] !== result) his.push(result);
    this.#index = -1;
    return result;
  }

  restorePrevious = () => {
    if (this.#index === 0) return;
    const his = this.history;
    if (this.#index === -1) {
      const nextIndex = his.length - 1;
      if (nextIndex > -1) {
        if (!!this.txtEdit.value.length) his.push(this.txtEdit.value);
        this.#index = nextIndex;
      }
    } else {
      this.#index--;
    }
    if (this.#index > -1) {
      this.txtEdit.value = his[this.#index];
      this.setFocus();
    }
  }

  restoreNext = () => {
    if (this.#index === -1) return;
    const his = this.history;
    if (this.#index === his.length - 1) {
      this.txtEdit.value = "";
      this.#index = -1;
    } else {
      this.txtEdit.value = his[++this.#index];
      this.setFocus();
    }
  }

}

class Development_Console extends Wuse.ClosedShadowElement {

  static { this.register(); }

  #processLine() {
    const line = this.txtBox.pullLine();
    if (!!line.length && !this.onConsumeLine(line)) {
      const pnl = this.pnlText;
      pnl.pushText(line);
      try {
        pnl.pushResult(evaluateJavascript(line));
      } catch (e) {
        pnl.pushError(e);
      }
    }
  }

  on_construct() {
    this
      .setMainAttribute("style", "border: 1px solid silver; border-radius: 0.25em")
      .appendChildElements(`
        text-panel#pnlText
        text-box#txtBox!keydown
      `)
  }

  on_load() {
    if (isAssignedArray(this.consoleHooks)) this.consoleHooks.forEach(method => {
      switch (method) {
        case "log": hookConsoleMethod("log", this.pnlText.pushInfo); break;
        case "info": hookConsoleMethod("info", this.pnlText.pushInfo); break;
        case "debug": hookConsoleMethod("debug", this.pnlText.pushInfo); break;
        case "error": hookConsoleMethod("error", this.pnlText.pushError); break;
        case "warn": hookConsoleMethod("warn", this.pnlText.pushWarning); break;
        case "count": hookConsoleMethod("count", this.pnlText.invokeCounter); break;
        case "countReset": hookConsoleMethod("countReset", this.pnlText.resetCounter); break;
        case "clear": hookConsoleMethod("clear", this.pnlText.clearLines); break;
      }
    });
    const fh = isIntegerNumber(this.fontHeight) ? +this.fontHeight : 0;
    if (fh > 0) {
      this.txtBox.fontHeight = fh + "px";
      this.pnlText.fontHeight = fh + "px";
    }
    if (isIntegerNumber(this.maxHeight)) {
      this.pnlText.maxHeight = ((+this.maxHeight) - fh) + "px";
    }
    this.txtBox.setFocus();
  }

  on_txtBox_keydown = e => {
    switch (e.keyCode) {
      case 13:
        this.#processLine();
        break;
      case 38:
        this.txtBox.restorePrevious();
        break;
      case 40:
        this.txtBox.restoreNext();
        break;
    }
  }

  onConsumeLine = line => false;

}

