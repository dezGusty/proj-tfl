import {
  CommonModule
} from "./chunk-JCLEJJB5.js";
import {
  Component,
  Input,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-SFDL6MAX.js";

// src/app/shared/components/rating-badge/rating-badge.component.ts
var RatingBadgeComponent = class _RatingBadgeComponent {
  rating;
  badgeClass() {
    if (this.rating >= 5.5)
      return "high";
    if (this.rating >= 4.5)
      return "mid";
    return "low";
  }
  static \u0275fac = function RatingBadgeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RatingBadgeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _RatingBadgeComponent, selectors: [["app-rating-badge"]], inputs: { rating: "rating" }, decls: 2, vars: 3, consts: [[1, "rating-badge"]], template: function RatingBadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "span", 0);
      \u0275\u0275text(1);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classMap(ctx.badgeClass());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.rating.toFixed(2));
    }
  }, dependencies: [CommonModule], styles: ["\n.rating-badge[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.5rem;\n  border-radius: 3px;\n  font-size: 0.9rem;\n  font-weight: bold;\n}\n.high[_ngcontent-%COMP%] {\n  background: #28a745;\n  color: white;\n}\n.mid[_ngcontent-%COMP%] {\n  background: #ffc107;\n  color: black;\n}\n.low[_ngcontent-%COMP%] {\n  background: #dc3545;\n  color: white;\n}\n/*# sourceMappingURL=rating-badge.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RatingBadgeComponent, [{
    type: Component,
    args: [{ selector: "app-rating-badge", standalone: true, imports: [CommonModule], template: `<span class="rating-badge" [class]="badgeClass()">{{ rating.toFixed(2) }}</span>`, styles: ["/* angular:styles/component:css;010ea7255f2e58540c904920f0562fde1ad294d23dd3ad78fc11473a14b765f0;/workspace/proj-tfl/tfl-frontend/src/app/shared/components/rating-badge/rating-badge.component.ts */\n.rating-badge {\n  padding: 0.2rem 0.5rem;\n  border-radius: 3px;\n  font-size: 0.9rem;\n  font-weight: bold;\n}\n.high {\n  background: #28a745;\n  color: white;\n}\n.mid {\n  background: #ffc107;\n  color: black;\n}\n.low {\n  background: #dc3545;\n  color: white;\n}\n/*# sourceMappingURL=rating-badge.component.css.map */\n"] }]
  }], null, { rating: [{
    type: Input,
    args: [{ required: true }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(RatingBadgeComponent, { className: "RatingBadgeComponent", filePath: "src/app/shared/components/rating-badge/rating-badge.component.ts", lineNumber: 11 });
})();

export {
  RatingBadgeComponent
};
//# sourceMappingURL=chunk-QIYOPA2D.js.map
