import {
  MatchesApiService
} from "./chunk-L26AOSX2.js";
import {
  ActivatedRoute,
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
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/matches/match-detail/match-detail.component.ts
var _forTrack0 = ($index, $item) => $item.playerId;
function MatchDetailComponent_Conditional_0_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r1.playerName);
  }
}
function MatchDetailComponent_Conditional_0_For_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(p_r2.playerName);
  }
}
function MatchDetailComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 1)(8, "div")(9, "h3");
    \u0275\u0275text(10, "Team 1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul");
    \u0275\u0275repeaterCreate(12, MatchDetailComponent_Conditional_0_For_13_Template, 2, 1, "li", null, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div")(15, "h3");
    \u0275\u0275text(16, "Team 2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "ul");
    \u0275\u0275repeaterCreate(18, MatchDetailComponent_Conditional_0_For_19_Template, 2, 1, "li", null, _forTrack0);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(20, "a", 2);
    \u0275\u0275text(21, "Back");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Match: ", ctx_r2.match().dateKey);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("Score: ", ctx_r2.match().scoreTeam1, " \u2013 ", ctx_r2.match().scoreTeam2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Status: ", ctx_r2.match().status);
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.team1());
    \u0275\u0275advance(6);
    \u0275\u0275repeater(ctx_r2.team2());
  }
}
var MatchDetailComponent = class _MatchDetailComponent {
  route = inject(ActivatedRoute);
  matchesApi = inject(MatchesApiService);
  match = signal(null, ...ngDevMode ? [{ debugName: "match" }] : (
    /* istanbul ignore next */
    []
  ));
  team1 = signal([], ...ngDevMode ? [{ debugName: "team1" }] : (
    /* istanbul ignore next */
    []
  ));
  team2 = signal([], ...ngDevMode ? [{ debugName: "team2" }] : (
    /* istanbul ignore next */
    []
  ));
  async ngOnInit() {
    const dateKey = this.route.snapshot.paramMap.get("dateKey");
    const m = await this.matchesApi.getByDateKey(dateKey);
    this.match.set(m);
    this.team1.set(m.players.filter((p) => p.team === 1));
    this.team2.set(m.players.filter((p) => p.team === 2));
  }
  static \u0275fac = function MatchDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatchDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MatchDetailComponent, selectors: [["app-match-detail"]], decls: 1, vars: 1, consts: [[1, "match-detail"], [1, "teams"], ["routerLink", ".."]], template: function MatchDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, MatchDetailComponent_Conditional_0_Template, 22, 4, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.match() ? 0 : -1);
    }
  }, dependencies: [CommonModule, RouterLink], styles: ["\n.match-detail[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.teams[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n/*# sourceMappingURL=match-detail.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatchDetailComponent, [{
    type: Component,
    args: [{ selector: "app-match-detail", standalone: true, imports: [CommonModule, RouterLink], template: `
    @if (match()) {
      <div class="match-detail">
        <h2>Match: {{ match()!.dateKey }}</h2>
        <p>Score: {{ match()!.scoreTeam1 }} \u2013 {{ match()!.scoreTeam2 }}</p>
        <p>Status: {{ match()!.status }}</p>
        <div class="teams">
          <div>
            <h3>Team 1</h3>
            <ul>@for (p of team1(); track p.playerId) { <li>{{ p.playerName }}</li> }</ul>
          </div>
          <div>
            <h3>Team 2</h3>
            <ul>@for (p of team2(); track p.playerId) { <li>{{ p.playerName }}</li> }</ul>
          </div>
        </div>
        <a routerLink="..">Back</a>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;5d87c3ad558dd36480be0532093279635398af23610b74674cc558dddc4e29cd;/workspace/proj-tfl/tfl-frontend/src/app/features/matches/match-detail/match-detail.component.ts */\n.match-detail {\n  padding: 1rem;\n}\n.teams {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 1rem;\n}\n/*# sourceMappingURL=match-detail.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MatchDetailComponent, { className: "MatchDetailComponent", filePath: "src/app/features/matches/match-detail/match-detail.component.ts", lineNumber: 33 });
})();
export {
  MatchDetailComponent
};
//# sourceMappingURL=chunk-TVV5AC5J.js.map
