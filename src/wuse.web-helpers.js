// Wuse (Web Using Shadow Elements) by j-a-s-d

export default class WebHelpers {

  static onDOMContentLoaded(callback) {
    if (callback && callback.constructor === window.Function) {
      const loader = () => {
        callback();
        setTimeout(() => window.removeEventListener("DOMContentLoaded", loader), 100);
      }
      window.addEventListener("DOMContentLoaded", loader);
    }
  }

  static getUniqueId(prefix = "WUSE") {
    const pfx = "_" + (prefix ? prefix : "") + "_";
    var result;
    while (window.document.getElementById(result = pfx + ("" + window.Math.random()).substring(2)) !== null);
    return result;
  }

  static removeChildren(element) {
    if (element) while (element.firstChild) element.removeChild(element.firstChild);
  }

  static htmlEncode(text = "") {
    return typeof text === "string" ? text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;
  }

  static getCSSVendorPrefix() {
    const bodyComputedStyle = window.getComputedStyle(window.document.body, "");
    const csPropertyNames = window.Array.prototype.slice.call(bodyComputedStyle);
    const cspnDashPrefixed = csPropertyNames.filter(x => x.charAt(0) === '-');
    return !!cspnDashPrefixed.length ? "-" + cspnDashPrefixed[0].split('-')[1] + "-" : "";
  }

}

