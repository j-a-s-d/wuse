// Wuse (Web Using Shadow Elements) by j-a-s-d

const EVENT_NAMES =
  // NOTE: this are element root-level events, that means it does not include other events
  // like those related to: children (click, mouseoout, etc), slots (change), document, etc.
  [
    "on_create", // after element creation and root node definition (after `this` availability and where handled events had been detected for the first time and the shadow attachment performed -basically when isShadowElement(this) is true-, also mention that after on_create returns the attribute keys will be added -if applies-)
    "on_construct", // after the element state has been created for the first time (if it has a store key, otherwise it's called every time the element is recreated)
    "on_reconstruct", // after the element state has been loaded from a previous existence (if it has a store key, otherwise it's never called)
    "on_connect", // on connectedCallback (this event is called right after handled events had been redetected)
    "on_inject", // right after the elements insertion and before content generation (it's fired both, before on_load and before on_reload)
    "on_load", // after the initial elements insertion is performed (first moment where you can find the render and redraw methods published, and where you have the element keys binded -if applies-)
    "on_prerender", // before the render process start
    "on_update", // after an actual dom update occurs
    "on_postrender", // after the render process finishes (dom updated or not)
    "on_refresh", // after the browser paints the content after a render() call
    "on_unload", // after elements got removed
    "on_reload", // after any time the elements are reinserted (except the initial time, also by now handled events had been redetected again)
    "on_repaint", // after the browser paints the content after a redraw() call
    "on_disconnect" // on disconnectedCallback
  ];

export default class ElementEvents {

  #owner = null;
  #events = new window.Object();

  constructor(owner) {
    this.#owner = owner;
  }

  detect() {
    EVENT_NAMES.forEach(event => this.#events[event] = typeof this.#owner[event] === "function");
  }

  immediateTrigger(event, argument) {
    this.#events[event] && this.#owner[event].call(this.#owner, argument);
  }

  committedTrigger(event, argument) {
    this.#events[event] && window.requestAnimationFrame(() => this.#owner[event].call(this.#owner, argument));
  }

}

