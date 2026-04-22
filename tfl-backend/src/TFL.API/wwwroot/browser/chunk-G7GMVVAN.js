import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/about/about.component.ts
var AboutComponent = class _AboutComponent {
  static \u0275fac = function AboutComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AboutComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AboutComponent, selectors: [["app-about"]], decls: 7, vars: 0, consts: [[1, "about-page"]], template: function AboutComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Thursday Football League");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p");
      \u0275\u0275text(4, "TFL is a weekly football league organiser. Track player ratings, manage game day registrations, and balance teams fairly.");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(5, "p");
      \u0275\u0275text(6, "Use the navigation to access players, matches, game events, and the draft tool.");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n.about-page[_ngcontent-%COMP%] {\n  padding: 2rem;\n  max-width: 600px;\n  margin: 0 auto;\n}\n/*# sourceMappingURL=about.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AboutComponent, [{
    type: Component,
    args: [{ selector: "app-about", standalone: true, template: `
    <div class="about-page">
      <h1>Thursday Football League</h1>
      <p>TFL is a weekly football league organiser. Track player ratings, manage game day registrations, and balance teams fairly.</p>
      <p>Use the navigation to access players, matches, game events, and the draft tool.</p>
    </div>
  `, styles: ["/* angular:styles/component:css;10ac2fae6ed35d4177c307c8cd5dcc908221181bfe03e72b0ec7ad551da94370;/workspace/proj-tfl/tfl-frontend/src/app/features/about/about.component.ts */\n.about-page {\n  padding: 2rem;\n  max-width: 600px;\n  margin: 0 auto;\n}\n/*# sourceMappingURL=about.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AboutComponent, { className: "AboutComponent", filePath: "src/app/features/about/about.component.ts", lineNumber: 15 });
})();
export {
  AboutComponent
};
//# sourceMappingURL=chunk-G7GMVVAN.js.map
