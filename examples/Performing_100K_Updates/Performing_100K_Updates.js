// Wuse (Web Using Shadow Elements) by j-a-s-d

class Counter_Button extends Wuse.ClosedShadowElement {

  static { Wuse.register(this); }

  on_create() {
    this
      .setMainElement("a")
      .appendCSSRule("a", `
        width: 12rem;
        margin: 0.5rem 2.5rem;
        padding: 1rem 2rem;
        user-select: none;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        font-family: system-ui;
        background-color: navy;
        color: white
      `)
      .appendChildElement("span=~{counter}~")
      .makeReactiveField("counter", 0)
      .setAttributesAsKeys(true);
  }

}

class Performing_100K_Updates extends Wuse.NonShadowElement {

  on_create() {
    this
      .setMainElement("div")
      .appendChildElements(`
        hr
        i=Click any of the 1000 buttons to update 100 times each one!
        hr
      `)
      .buttonize(1000, 100);
  }

  buttonize(amount, changes) {
    const NAME_PREFIX = "btnCounter";
    const inform = spent => document.body.insertAdjacentHTML('afterbegin', `
      <pre>${spent.toFixed(2)} ms for ${amount * changes} total reactive render updates</pre>
    `);
    const update = () => {
      for (var y = 0; y < changes; y++) {
        Wuse.RENDERING = y === changes - 1;
        for (var z = 0; z < amount; z++) {
          this[`${NAME_PREFIX}${z}`].counter++;
        }
      }
    };
    for (var x = 0; x < amount; x++) this.appendChildElement(
      `counter-button[counter=${x}]#${NAME_PREFIX}${x}!click`
    )[`on_${NAME_PREFIX}${x}_click`] = e => {
      const begin = performance.now();
      update();
      inform(performance.now() - begin);
    }
  }

}