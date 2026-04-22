import {
  DraftApiService
} from "./chunk-MYSINATX.js";
import {
  PlayersApiService
} from "./chunk-UPKDBO3Z.js";
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/draft/draft-page/draft-page.component.ts
var _forTrack0 = ($index, $item) => $item.playerId;
function DraftPageComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function DraftPageComponent_Conditional_4_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const p_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", p_r2.playerName, " (Affinity: ", p_r2.affinity, ")");
  }
}
function DraftPageComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "ul");
    \u0275\u0275repeaterCreate(3, DraftPageComponent_Conditional_4_For_4_Template, 2, 2, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 1);
    \u0275\u0275listener("click", function DraftPageComponent_Conditional_4_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.generateTeams());
    });
    \u0275\u0275text(6, "Generate Teams");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 2);
    \u0275\u0275text(8, "View Team Results");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("", ctx_r2.draftApi.draft().players.length, " players in draft");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.draftApi.draft().players);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r2.draftApi.loading());
  }
}
var DraftPageComponent = class _DraftPageComponent {
  draftApi = inject(DraftApiService);
  playersApi = inject(PlayersApiService);
  ngOnInit() {
    this.draftApi.loadDraft();
  }
  async generateTeams() {
    const draft = this.draftApi.draft();
    if (!draft)
      return;
    await this.draftApi.generateTeams({ playerIds: draft.players.map((p) => p.playerId) });
  }
  static \u0275fac = function DraftPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DraftPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DraftPageComponent, selectors: [["app-draft-page"]], decls: 5, vars: 1, consts: [[1, "draft-page"], [3, "click", "disabled"], ["routerLink", "results"]], template: function DraftPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Next Draft");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, DraftPageComponent_Conditional_3_Template, 2, 0, "p")(4, DraftPageComponent_Conditional_4_Template, 9, 2);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.draftApi.loading() ? 3 : ctx.draftApi.draft() ? 4 : -1);
    }
  }, dependencies: [CommonModule, RouterLink], styles: ["\n.draft-page[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\nbutton[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  margin: 0.5rem;\n}\n/*# sourceMappingURL=draft-page.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DraftPageComponent, [{
    type: Component,
    args: [{ selector: "app-draft-page", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="draft-page">
      <h2>Next Draft</h2>
      @if (draftApi.loading()) {
        <p>Loading...</p>
      } @else if (draftApi.draft()) {
        <p>{{ draftApi.draft()!.players.length }} players in draft</p>
        <ul>
          @for (p of draftApi.draft()!.players; track p.playerId) {
            <li>{{ p.playerName }} (Affinity: {{ p.affinity }})</li>
          }
        </ul>
        <button (click)="generateTeams()" [disabled]="draftApi.loading()">Generate Teams</button>
        <a routerLink="results">View Team Results</a>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;c127218dc5b7f7745054d921bfb578bc80dfb001e8756a289bd17a52bb9bea2b;/workspace/proj-tfl/tfl-frontend/src/app/features/draft/draft-page/draft-page.component.ts */\n.draft-page {\n  padding: 1rem;\n}\nbutton {\n  padding: 0.5rem 1rem;\n  margin: 0.5rem;\n}\n/*# sourceMappingURL=draft-page.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DraftPageComponent, { className: "DraftPageComponent", filePath: "src/app/features/draft/draft-page/draft-page.component.ts", lineNumber: 30 });
})();
export {
  DraftPageComponent
};
//# sourceMappingURL=chunk-6G6JQHSW.js.map
