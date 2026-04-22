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

// src/app/features/privacy/privacy.component.ts
var PrivacyComponent = class _PrivacyComponent {
  static \u0275fac = function PrivacyComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PrivacyComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PrivacyComponent, selectors: [["app-privacy"]], decls: 5, vars: 0, consts: [[1, "privacy-page"]], template: function PrivacyComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Privacy Policy");
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(3, "p");
      \u0275\u0275text(4, "TFL collects your Google account email and profile photo to identify you within the app. No data is shared with third parties.");
      \u0275\u0275domElementEnd()();
    }
  }, styles: ["\n.privacy-page[_ngcontent-%COMP%] {\n  padding: 2rem;\n  max-width: 600px;\n  margin: 0 auto;\n}\n/*# sourceMappingURL=privacy.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrivacyComponent, [{
    type: Component,
    args: [{ selector: "app-privacy", standalone: true, template: `
    <div class="privacy-page">
      <h1>Privacy Policy</h1>
      <p>TFL collects your Google account email and profile photo to identify you within the app. No data is shared with third parties.</p>
    </div>
  `, styles: ["/* angular:styles/component:css;b339be2c51a77d1311cfa3013461e83886e69e68d1e0727c3f3ec382d0c80ef9;/workspace/proj-tfl/tfl-frontend/src/app/features/privacy/privacy.component.ts */\n.privacy-page {\n  padding: 2rem;\n  max-width: 600px;\n  margin: 0 auto;\n}\n/*# sourceMappingURL=privacy.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PrivacyComponent, { className: "PrivacyComponent", filePath: "src/app/features/privacy/privacy.component.ts", lineNumber: 14 });
})();
export {
  PrivacyComponent
};
//# sourceMappingURL=chunk-FPHSP5O6.js.map
