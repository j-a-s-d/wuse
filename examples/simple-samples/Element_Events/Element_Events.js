// Wuse (Web Using Shadow Elements) by j-a-s-d

function print(title, description) {
  console.log("%c" + new Date().toUTCString(), "color:white;background-color:silver");
  console.log("%c" + title, "color:black;font-weight:bold;");
  console.log("%c-- " + description, "color:gray");
}

const INFO = `<i>Open the development tools console (usually F12) to see the events flowing.</i>
  <hr>
  On start you will see:<br>
  <ul>
    <li>on_create</li>
    <li>on_construct</li>
    <li>on_connect</li>
    <li>on_inject</li>
    <li>on_load</li>
  </ul>
  <hr>
  After clicking <b>RENDER (UNMODIFIED)</b>, render() will be called in the buttons panel, and you will see:<br>
  <ul>
    <li><i>on_[element-id]_[event-type] (besides it's not part of the element event cycle, it's printed for your better understanding)</i></li>
    <li>on_prerender</li>
    <li>on_postrender</li>
  </ul>
  <hr>
  After clicking <b>RENDER (MODIFIED)</b>, render() will be called after a invalidating modification in the buttons panel, and you will see:<br>
  <ul>
    <li><i>on_[element-id]_[event-type] (besides it's not part of the element event cycle, it's printed for your better understanding)</i></li>
    <li>on_prerender</li>
    <li>on_update</li>
    <li>on_postrender</li>
    <li>on_refresh</li>
  </ul>
  <hr>
  After clicking <b>REDRAW</b>, redraw() will be called in the buttons panel, and you will see (changes in content don't matter, everything is redrawn):<br>
  <ul>
    <li><i>on_[element-id]_[event-type] (besides it's not part of the element event cycle, it's printed for your better understanding)</i></li>
    <li>on_unload</li>
    <li>on_inject</li>
    <li>on_reload (if you disable it via fireSpecificRedrawEvents then this event won't fire, on_load will be fired instead)</li>
    <li>on_repaint (if you disable it via fireSpecificRedrawEvents then this event won't fire, on_refresh will be fired instead)</li>
  </ul>
  <hr>
  After clicking <b>FORCE RECONSTRUCTION (CSS)</b>, render() will be called (in this demo that is done automatically via the reactive field change) after an invalidating modification (CSS element position change) on the parent element of the buttons panel causing it's reconstruction (in this demo the buttons panel is being persisted/recovered from the elements store), and you will see:<br>
  <ul>
    <li><i>on_[element-id]_[event-type] (besides it's not part of the element event cycle, it's printed for your better understanding)</i></li>
    <li>on_create</li>
    <li>on_reconstruct (if you set the restoreOnReconstruct behaviour then this event won't fire)</li>
    <li>on_disconnect</li>
    <li>on_connect</li>
    <li>on_inject</li>
    <li>on_load</li>
  </ul>
  <hr>
  After clicking <b>FORCE RECONSTRUCTION (HTM)</b>, render() will be called (in this demo that is done automatically via the reactive field change) after an invalidating modification (body inner HTML append) on the parent element of the buttons panel causing it's reconstruction (in this demo the buttons panel is being persisted/recovered from the elements store), and you will see:<br>
  <ul>
    <li><i>on_[element-id]_[event-type] (besides it's not part of the element event cycle, it's printed for your better understanding)</i></li>
    <li>on_create</li>
    <li>on_reconstruct (if you set the restoreOnReconstruct behaviour then this event won't fire)</li>
    <li>on_connect</li>
    <li>on_inject</li>
    <li>on_load</li>
    <li>on_create</li>
    <li>on_reconstruct (if you set the restoreOnReconstruct behaviour then this event won't fire)</li>
    <li>on_disconnect</li>
  </ul>
  <hr>
`;

class Buttons_Panel extends Wuse.ClosedShadowElement {

  on_create() {
    this
      .setElementsStoreKey("buttons")
      .allowRawContent(true)
      .setMainElement("div[style=font-family: monospace; margin-bottom: 3em;]");
    print("on_create", "after element creation and root node definition (after `this` availability and where handled events had been detected for the first time and the shadow attachment performed -basically when isShadowElement(this) is true-, also mention that after on_create returns the attribute keys will be added -if applies-)");
  }

  on_construct() {
    this
      .appendCSSRule("#btnRenderUnmodified", `
        cursor: pointer;
        color: white;
        background-color: blue;
        padding: 1em;
      `)
      .appendCSSRule("#btnRenderModified", `
        cursor: pointer;
        color: white;
        background-color: green;
        padding: 1em;
      `)
      .appendCSSRule("#btnRedraw", `
        cursor: pointer;
        color: white;
        background-color: red;
        padding: 1em;
      `)
      .appendChildElement("span#btnRenderUnmodified!click=RENDER (UNMODIFIED)")
      .appendChildElement("span#btnRenderModified!click=RENDER (MODIFIED)")
      .appendChildElement("span#btnRedraw!click=REDRAW");
    print("on_construct", "after the element state has been created for the first time (if it has a store key, otherwise it's called every time the element is recreated)");
  }

  on_reconstruct() {
    this.restoreFromElementsStore();
    print("on_reconstruct", "after the element state has been loaded from a previous existence (if it has a store key, otherwise it's never called, and also note that if you set the restoreOnReconstruct behaviour then this event won't fire neither)");
  }

  on_connect() {
    print("on_connect", "on connectedCallback (this event is called right after handled events had been redetected)");
  }

  on_inject() {
    print("on_inject", "right after the elements insertion and before content generation (it's fired both, before on_load and before on_reload)");
  }

  on_load() {
    print("on_load", "after the initial elements insertion is performed (first moment where you can find the render and redraw methods published, and where you have the element keys binded -if applies-)");
  }

  on_prerender() {
    print("on_prerender", "before the render process start");
  }

  on_update() {
    print("on_update", "after an actual dom update occurs (if there is nothing to update it's not called)");
  }

  on_postrender() {
    print("on_postrender", "after the render process finishes (dom updated or not)");
  }

  on_refresh() {
    print("on_refresh", "after the browser paints the content after a render() call");
  }

  on_unload() {
    print("on_unload", "after elements got removed");
  }

  on_reload() {
    print("on_reload", "after any time the elements are reinserted (except the initial time, also by now handled events had been redetected again)");
  }

  on_repaint() {
    print("on_repaint", "after the browser paints the content after a redraw() call");
  }

  on_disconnect() {
    print("on_disconnect", "on disconnectedCallback");
  }

  on_btnRenderUnmodified_click = () => {
    print("on_[element-id]_[event-type]", "on element event");
    this.render();
  }

  on_btnRenderModified_click = () => {
    print("on_[element-id]_[event-type]", "on element event");
    this.appendRawContent("<hr><br>");
    this.render();
  }

  on_btnRedraw_click = () => {
    print("on_[element-id]_[event-type]", "on element event");
    this.redraw();
  }

}

class Element_Events extends Wuse.NonShadowElement {

  on_create() {
    this
      .setMainElement("div[style=font-family: monospace; padding: 1em;]")
      .appendCSSRule("li", "color: darkorange;")
      .allowRawContent(true)
      .appendRawContent(INFO)
      .appendChildElement("br")
      .appendChildElement("buttons-panel")
      .appendCSSRule(".rel", "position: relative")
      .appendCSSRule(".abs", "position: absolute")
      .appendCSSRule("#btnReconstructViaCSS", `
        cursor: pointer;
        color: white;
        background-color: purple;
        padding: 1em;
      `)
      .appendCSSRule("#btnReconstructViaHTM", `
        cursor: pointer;
        color: white;
        background-color: maroon;
        padding: 1em;
      `)
      .appendChildElements(`
        span#btnReconstructViaHTM.~{pos}~!click=FORCE RECONSTRUCTION (VIA HTM)
        hr[style=margin:2em]
        span#btnReconstructViaCSS.~{pos}~!click=FORCE RECONSTRUCTION (VIA CSS)
      `)
      .makeReactiveField("pos", "rel");
  }

  on_btnReconstructViaCSS_click = () => {
    print("on_[element-id]_[event-type]", "on element event");
    this.pos = this.pos === "rel" ? "abs" : "rel";
  }

  on_btnReconstructViaHTM_click = () => {
    print("on_[element-id]_[event-type]", "on element event");
    window.document.body.innerHTML += "<hr style='margin: 2em'/>";
  }

}

