// Wuse (Web Using Shadow Elements) by j-a-s-d

Wuse.register([class Clxme_Button extends Wuse.ClosedShadowElement {
  on_create() {
    this
      .appendCSSRule(":host", `
        user-select: none;
        text-align: center;
        display: inline-block;
      `)
      .appendCSSRule("a", `
        letter-spacing: .15rem;
        cursor: pointer;
        font-weight: 600;
        font-style: normal;
        font-family: system-ui;
        padding: 1rem;
        background-color: black;
        color: white;
      `)
      .appendChildElement("a=Click me!");
  }
},
class Simple_Panel extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setMainElement("#main")
      .appendCSSRule("#main", `
        border-radius: 8px;
        background-color: white;
        border: thin solid silver;
        margin: 4rem;
        padding: 2rem;
        min-height: 1.25rem;
      `)
  }

}]);

const transferChild = (origin, destination, id) => {
  if (typeof destination[`on_${id}_click`] === "function") {
    const tmp = destination;
    destination = origin;
    origin = tmp;
  }
  if (origin.transferChildElementById(id, destination)) {
    origin.render();
    destination.render();
  }
};

class Transfer_Child extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .appendChildElement("simple-panel#pnlSimple")
      .appendChildElement("simple-panel#pnlSimple2")
  }

  #setup(origin, destination, id) {
    origin.appendChildElement(`clxme-button#${id}!click`);
    origin[`on_${id}_click`] = () => transferChild(origin, destination, id);
    origin.render();
  }

  on_load() {
    this.#setup(this.pnlSimple, this.pnlSimple2, "btnTransfer");
  }

}

