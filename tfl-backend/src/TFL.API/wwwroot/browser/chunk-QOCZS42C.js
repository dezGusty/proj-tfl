import {
  MatchesApiService
} from "./chunk-L26AOSX2.js";
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
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate2
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/matches/match-history/match-history.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.dateKey;
function MatchHistoryComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function MatchHistoryComponent_Conditional_4_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1)(1, "span");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 2);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const match_r1 = ctx.$implicit;
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(5, _c0, match_r1.dateKey));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(match_r1.dateKey);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", match_r1.scoreTeam1, " \u2013 ", match_r1.scoreTeam2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(match_r1.status);
  }
}
function MatchHistoryComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, MatchHistoryComponent_Conditional_4_For_1_Template, 7, 7, "div", 1, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.matchesApi.matches());
  }
}
var MatchHistoryComponent = class _MatchHistoryComponent {
  matchesApi = inject(MatchesApiService);
  ngOnInit() {
    this.matchesApi.loadRecent();
  }
  static \u0275fac = function MatchHistoryComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatchHistoryComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MatchHistoryComponent, selectors: [["app-match-history"]], decls: 5, vars: 1, consts: [[1, "match-history"], [1, "match-card", 3, "routerLink"], [1, "status"]], template: function MatchHistoryComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Recent Matches");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, MatchHistoryComponent_Conditional_3_Template, 2, 0, "p")(4, MatchHistoryComponent_Conditional_4_Template, 2, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.matchesApi.loading() ? 3 : 4);
    }
  }, dependencies: [CommonModule, RouterLink], styles: ["\n.match-history[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.match-card[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n  display: flex;\n  gap: 1rem;\n  cursor: pointer;\n}\n.status[_ngcontent-%COMP%] {\n  margin-left: auto;\n}\n/*# sourceMappingURL=match-history.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatchHistoryComponent, [{
    type: Component,
    args: [{ selector: "app-match-history", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="match-history">
      <h2>Recent Matches</h2>
      @if (matchesApi.loading()) {
        <p>Loading...</p>
      } @else {
        @for (match of matchesApi.matches(); track match.dateKey) {
          <div class="match-card" [routerLink]="[match.dateKey]">
            <span>{{ match.dateKey }}</span>
            <span>{{ match.scoreTeam1 }} \u2013 {{ match.scoreTeam2 }}</span>
            <span class="status">{{ match.status }}</span>
          </div>
        }
      }
    </div>
  `, styles: ["/* angular:styles/component:css;81ab108de7b5f24068b56e74777a42b2a206cb6db4db894cec88c5069f573432;/workspace/proj-tfl/tfl-frontend/src/app/features/matches/match-history/match-history.component.ts */\n.match-history {\n  padding: 1rem;\n}\n.match-card {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n  display: flex;\n  gap: 1rem;\n  cursor: pointer;\n}\n.status {\n  margin-left: auto;\n}\n/*# sourceMappingURL=match-history.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MatchHistoryComponent, { className: "MatchHistoryComponent", filePath: "src/app/features/matches/match-history/match-history.component.ts", lineNumber: 28 });
})();
export {
  MatchHistoryComponent
};
//# sourceMappingURL=chunk-QOCZS42C.js.map
