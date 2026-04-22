import {
  DraftApiService
} from "./chunk-MYSINATX.js";
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
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/draft/team-results/team-results.component.ts
var _forTrack0 = ($index, $item) => $item.rank;
var _forTrack1 = ($index, $item) => $item.id;
function TeamResultsComponent_For_6_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r1.displayName || p_r1.name);
  }
}
function TeamResultsComponent_For_6_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2.displayName || p_r2.name);
  }
}
function TeamResultsComponent_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "h3");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 3)(4, "div")(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "ul");
    \u0275\u0275repeaterCreate(8, TeamResultsComponent_For_6_For_9_Template, 2, 1, "li", null, _forTrack1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div")(11, "strong");
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "ul");
    \u0275\u0275repeaterCreate(14, TeamResultsComponent_For_6_For_15_Template, 2, 1, "li", null, _forTrack1);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const combo_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Option ", combo_r3.rank, " \u2014 Diff: ", combo_r3.ratingDiffAbs.toFixed(3));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Team 1 (", combo_r3.team1TotalRating.toFixed(2), ")");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(combo_r3.team1);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1("Team 2 (", combo_r3.team2TotalRating.toFixed(2), ")");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(combo_r3.team2);
  }
}
var TeamResultsComponent = class _TeamResultsComponent {
  draftApi = inject(DraftApiService);
  static \u0275fac = function TeamResultsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TeamResultsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TeamResultsComponent, selectors: [["app-team-results"]], decls: 7, vars: 0, consts: [[1, "team-results"], ["routerLink", ".."], [1, "combo"], [1, "teams"]], template: function TeamResultsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Team Combinations");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 1);
      \u0275\u0275text(4, "Back to Draft");
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(5, TeamResultsComponent_For_6_Template, 16, 4, "div", 2, _forTrack0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.draftApi.combinations());
    }
  }, dependencies: [CommonModule, RouterLink], styles: ["\n.team-results[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.combo[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  margin: 0.5rem;\n  padding: 1rem;\n  border-radius: 4px;\n}\n.teams[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n/*# sourceMappingURL=team-results.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TeamResultsComponent, [{
    type: Component,
    args: [{ selector: "app-team-results", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="team-results">
      <h2>Team Combinations</h2>
      <a routerLink="..">Back to Draft</a>
      @for (combo of draftApi.combinations(); track combo.rank) {
        <div class="combo">
          <h3>Option {{ combo.rank }} \u2014 Diff: {{ combo.ratingDiffAbs.toFixed(3) }}</h3>
          <div class="teams">
            <div>
              <strong>Team 1 ({{ combo.team1TotalRating.toFixed(2) }})</strong>
              <ul>@for (p of combo.team1; track p.id) { <li>{{ p.displayName || p.name }}</li> }</ul>
            </div>
            <div>
              <strong>Team 2 ({{ combo.team2TotalRating.toFixed(2) }})</strong>
              <ul>@for (p of combo.team2; track p.id) { <li>{{ p.displayName || p.name }}</li> }</ul>
            </div>
          </div>
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;d30ab8e1f97bf40468b93ba4f46729519f2d5695621eb31af4c41ef20d4c05be;/workspace/proj-tfl/tfl-frontend/src/app/features/draft/team-results/team-results.component.ts */\n.team-results {\n  padding: 1rem;\n}\n.combo {\n  border: 1px solid #ccc;\n  margin: 0.5rem;\n  padding: 1rem;\n  border-radius: 4px;\n}\n.teams {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n/*# sourceMappingURL=team-results.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TeamResultsComponent, { className: "TeamResultsComponent", filePath: "src/app/features/draft/team-results/team-results.component.ts", lineNumber: 33 });
})();
export {
  TeamResultsComponent
};
//# sourceMappingURL=chunk-WDVLLDKU.js.map
