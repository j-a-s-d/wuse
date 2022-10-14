// Wuse (Web Using Shadow Elements) by j-a-s-d

class Canvas_Text_Wrapper extends Wuse.ClosedShadowElement {

  #writeLine = line => this._context.fillText(line.text, line.x, line.y);

  #writeText = () => this._lines.forEach(this.#writeLine);

  #tooWide = (offset, text) => offset + this._context.measureText(text).width > this._canvas.width;

  #wrapText(content, x, y, lineHeight) {
    const SPACE = " ";
    let result = [];
    var text = "";
    var first = true;
    content.split(SPACE).forEach(word => {
      const tmp = text + word + SPACE;
      if (!first && this.#tooWide(x, tmp)) {
        result.push({ x, y, text });
        text = word + SPACE;
        y += lineHeight;
      } else {
        first = false;
        text = tmp;
      }
    });
    result.push({ x, y, text });
    return result;
  }

  #reset() {
    this._canvas.height = this._height;
    this._canvas.width = this._width;
    this._context.font = `${this._fontSize} ${this._fontFamily}`;
    this._context.fillStyle = this._fillStyle;
  }

  on_create() {
    this
      .setMainElement("canvas")
      .makeField("_lines", [])
      .makeField("_height", 0)
      .makeField("_width", 640)
      .makeField("_lineHeight", 20)
      .makeField("_fontSize", "16px")
      .makeField("_fontFamily", "serif")
      .makeField("_fillStyle", "black")
  }

  on_load() {
    this._context = (this._canvas = this.selectChildElement("canvas")).getContext("2d");
    const prs = this.parameters;
    if (prs) this.setup(prs.width, prs.fontSize, prs.fontFamily, prs.fillStyle, prs.lineHeight);
    this.#reset();
  }

  setup(width, fontSize, fontFamily, fillStyle, lineHeight) {
    this._height = 0;
    this._width = width;
    this._fontSize = fontSize;
    this._fontFamily = fontFamily;
    this._fillStyle = fillStyle;
    this._lineHeight = lineHeight;
  }

  setText(x = 0, y = 0, text = "") {
    this._lines = this.#wrapText(text, x, y, this._lineHeight);
    this._height = this._canvas.height + (
      !!this._lines.length ? this._lines[this._lines.length - 1].y : 0
    );
    this.#reset();
    this.#writeText();
  }

}

