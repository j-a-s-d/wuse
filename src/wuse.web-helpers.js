// Wuse (Web Using Shadow Elements) by j-a-s-d

import StringHashing from './wuse.string-hashing.js';
const hash = StringHashing.defaultRoutine;

const HTML_TAGS = [ // NOTE: it includes deprecated and non-standard ones
  "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio",
  "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button",
  "canvas", "caption", "center", "cite", "code", "content", "col", "colgroup",
  "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt",
  "em", "embed",
  "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset",
  "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html",
  "i", "iframe", "img", "input", "ins", "isindex",
  "kbd", "keygen",
  "label", "legend", "li", "link", "listing",
  "main", "map", "marquee", "mark", "menu", "menuitem", "meta", "meter", "multicol",
  "nav", "nextid", "nobr", "noembed", "noframes", "noscript",
  "object", "ol", "optgroup", "option", "output",
  "p", "param", "plaintext", "pre", "progress",
  "q",
  "rb", "rp", "rt", "rtc", "ruby",
  "s", "samp", "script", "section", "shadow", "select", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "sup", "summary",
  "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt",
  "u", "ul",
  "var", "video",
  "xmp",
  "wbr"
].map(hash);

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

  static isHTMLTag(tag) {
    return HTML_TAGS.indexOf(hash(tag)) > -1;
  }

  static htmlEncode(text = "") {
    return typeof text !== "string" ? null :
      text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  static getCSSVendorPrefix() {
    const bodyComputedStyle = window.getComputedStyle(window.document.body, "");
    const csPropertyNames = window.Array.prototype.slice.call(bodyComputedStyle);
    const cspnDashPrefixed = csPropertyNames.filter(x => x.charAt(0) === '-');
    return !!cspnDashPrefixed.length ? "-" + cspnDashPrefixed[0].split('-')[1] + "-" : "";
  }

}

