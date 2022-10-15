// Wuse (Web Using Shadow Elements) by j-a-s-d

class Wuse_Status_Line extends Wuse.NonShadowElement {

  static get CRT_COLOUR_BLACK() { return "#282828"; }

  static get CRT_COLOUR_AMBER() { return "rgb(255, 204, 0)"; }

  get WUSE_FLAGS() { return ["DEBUG", "FATALS", "MEASURE", "RENDERING"]; }

  get wuseInfo() {
    const flagPrinter = z => z.charAt(0) + ':' + +!!Wuse[z];
    const flagsDisplay = this.WUSE_FLAGS.map(flagPrinter).join('|');
    return `Wuse/${Wuse.VERSION} [${flagsDisplay}]`;
  }

  on_create() {
    this
      .setMainElement(`pre[style=
        user-select: none;
        font-size: 16px;
        background-color: ${Wuse_Status_Line.CRT_COLOUR_BLACK};
        color: ${Wuse_Status_Line.CRT_COLOUR_AMBER};
        padding: 8px 16px;
        margin-left: 5%;
        width: 90%
      ]`)
      .allowRawContent(true)
      .setRawContent(`${this.wuseInfo} @ ${navigator.userAgent}`);
  }

}

