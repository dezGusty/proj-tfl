import {
  GameEventsApiService
} from "./chunk-UF7ID32Y.js";
import {
  RouterLink
} from "./chunk-H3UJIETU.js";
import {
  CommonModule
} from "./chunk-JCLEJJB5.js";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵtext
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/game-events/game-events-summary/game-events-summary.component.ts
var GameEventsSummaryComponent = class _GameEventsSummaryComponent {
  gameEventsApi = inject(GameEventsApiService);
  summary = signal(null, ...ngDevMode ? [{ debugName: "summary" }] : (
    /* istanbul ignore next */
    []
  ));
  ngOnInit() {
    this.gameEventsApi.getSummary().then((s) => this.summary.set(s));
  }
  static \u0275fac = function GameEventsSummaryComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GameEventsSummaryComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GameEventsSummaryComponent, selectors: [["app-game-events-summary"]], decls: 7, vars: 0, consts: [[1, "summary-page"], ["routerLink", ".."]], template: function GameEventsSummaryComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Game Events Summary");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 1);
      \u0275\u0275text(4, "Back");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "p");
      \u0275\u0275text(6, "Summary matrix coming soon.");
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [CommonModule, RouterLink], styles: ["\n.summary-page[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n/*# sourceMappingURL=game-events-summary.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameEventsSummaryComponent, [{
    type: Component,
    args: [{ selector: "app-game-events-summary", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="summary-page">
      <h2>Game Events Summary</h2>
      <a routerLink="..">Back</a>
      <p>Summary matrix coming soon.</p>
    </div>
  `, styles: ["/* angular:styles/component:css;c10ad40b2258121ad53342dfe15b4ab5e103e1ab7eba0bc03f885bc75d3f7b5f;/workspace/proj-tfl/tfl-frontend/src/app/features/game-events/game-events-summary/game-events-summary.component.ts */\n.summary-page {\n  padding: 1rem;\n}\n/*# sourceMappingURL=game-events-summary.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GameEventsSummaryComponent, { className: "GameEventsSummaryComponent", filePath: "src/app/features/game-events/game-events-summary/game-events-summary.component.ts", lineNumber: 19 });
})();
export {
  GameEventsSummaryComponent
};
//# sourceMappingURL=chunk-7Z3L5RLJ.js.map
