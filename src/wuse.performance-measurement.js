// Wuse (Web Using Shadow Elements) by j-a-s-d

const formatTime = time => time > 1000 ? (time / 1000).toFixed(2) + "s" : time.toFixed(2) + "ms";

class MeasureRound {

  round = 0;
  domTime = window.Number.MAX_SAFE_INTEGER;
  renderTime = window.Number.MAX_SAFE_INTEGER;

  getDebugInfo() {
    var result = new window.Object();
    result.round = this.round;
    result.domTime = formatTime(this.domTime);
    if (this.renderTime !== window.Number.MAX_SAFE_INTEGER) {
      result.renderTime = formatTime(this.renderTime);
    }
    return result;
  }

}

class MeasureOverall {

  name = "";
  rounds = 0;
  time = 0;
  average = 0;

  constructor(name) {
    this.name = name;
  }

  compute(last) {
    this.rounds++;
    this.time += last;
    this.average = this.time / this.rounds;
  }

  getDebugInfo() {
    const spent = formatTime(this.time);
    const average = formatTime(this.average);
    return { name: this.name, rounds: this.rounds, spent, average };
  }

}

export default class PerformanceMeasurement {

  static #debugCallback = () => {};

  static StopWatch = class {

    // NOTE: remember this metrics are element-based.

    _begin = 0;
    _end = {
      dom: 0,
      render: 0
    }
    rounds = 0;
    last = new MeasureRound();
    best = new MeasureRound();
    averages = {
      dom: 0,
      render: 0
    }

    start() {
      if (PerformanceMeasurement.DOMUpdate.check || PerformanceMeasurement.BrowserRender.check) {
        this.last.round = ++this.rounds;
        this._begin = performance.now();
      }
    }

    stop(debug) {
      if (PerformanceMeasurement.DOMUpdate.check) {
        if (this.best.domTime > (this.last.domTime = (this._end.dom = performance.now()) - this._begin)) {
          this.best.round = this.last.round;
          this.best.domTime = this.last.domTime;
        }
        this.averages.dom = ((this.averages.dom * (this.rounds - 1)) + this.last.domTime) / this.rounds;
        PerformanceMeasurement.DOMUpdate.overall.compute(this.last.domTime);
      }
      PerformanceMeasurement.BrowserRender.check ?
        setTimeout(() => this.#finish.bind(this)(debug)) :
        debug && PerformanceMeasurement.#debugCallback(this, "stop");
    }

    #finish(debug) {
      if (this.best.renderTime > (this.last.renderTime = (this._end.render = performance.now()) - this._begin)) {
        this.best.round = this.last.round;
        this.best.renderTime = this.last.renderTime;
      }
      this.averages.render = ((this.averages.render * (this.rounds - 1)) + this.last.renderTime) / this.rounds;
      PerformanceMeasurement.BrowserRender.overall.compute(this.last.renderTime);
      debug && PerformanceMeasurement.#debugCallback(this, "finish");
    }

    getDebugInfo() {
      return {
        rounds: this.rounds,
        last: this.last.getDebugInfo(),
        best: this.best.getDebugInfo(),
        averages: this.averages
      }
    }

  }

  static DOMUpdate = class {

    // NOTE: this checks how much time was spent updating the
    // dom with the necessary changes.
    static check = true;
    static overall = null;

  }

  static BrowserRender = class {

    // NOTE: this checks how much time was spent processing
    // all the requested changes to the dom, and it's
    // disabled by default since the only way to check that
    // (when the browser render finishes) is via a setTimeout
    // to capture the moment when the script execution is
    // resumed after all the dom changes were processed.
    static check = false;
    static overall = null;

  }

  static initialize(dbgCb) {
    if (typeof dbgCb === "function") PerformanceMeasurement.#debugCallback = dbgCb;
    PerformanceMeasurement.DOMUpdate.overall = new MeasureOverall("overall-dom-update");
    PerformanceMeasurement.BrowserRender.overall = new MeasureOverall("overall-browser-render");
  }

}

