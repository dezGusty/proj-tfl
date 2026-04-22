import {
  RatingBadgeComponent
} from "./chunk-QIYOPA2D.js";
import {
  PlayersApiService
} from "./chunk-UPKDBO3Z.js";
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
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate3
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/players/player-detail/player-detail.component.ts
var _forTrack0 = ($index, $item) => $item.sortOrder;
function PlayerDetailComponent_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const entry_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate3("", entry_r1.matchDate, ": ", entry_r1.diff > 0 ? "+" : "", "", entry_r1.diff.toFixed(3));
  }
}
function PlayerDetailComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "app-rating-badge", 1);
    \u0275\u0275elementStart(4, "p");
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3");
    \u0275\u0275text(9, "Recent Results");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ul");
    \u0275\u0275repeaterCreate(11, PlayerDetailComponent_Conditional_0_For_12_Template, 2, 3, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "a", 2);
    \u0275\u0275text(14, "Back to Players");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.player().displayName || ctx_r1.player().name);
    \u0275\u0275advance();
    \u0275\u0275property("rating", ctx_r1.player().rating);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Affinity: ", ctx_r1.player().affinity);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Status: ", ctx_r1.player().archived ? "Archived" : "Active");
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r1.player().recentEntries);
  }
}
function PlayerDetailComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
var PlayerDetailComponent = class _PlayerDetailComponent {
  route = inject(ActivatedRoute);
  playersApi = inject(PlayersApiService);
  player = signal(null, ...ngDevMode ? [{ debugName: "player" }] : (
    /* istanbul ignore next */
    []
  ));
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    this.player.set(await this.playersApi.getById(id));
  }
  static \u0275fac = function PlayerDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayerDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PlayerDetailComponent, selectors: [["app-player-detail"]], decls: 2, vars: 1, consts: [[1, "player-detail"], [3, "rating"], ["routerLink", "../.."]], template: function PlayerDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PlayerDetailComponent_Conditional_0_Template, 15, 4, "div", 0)(1, PlayerDetailComponent_Conditional_1_Template, 2, 0, "p");
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.player() ? 0 : 1);
    }
  }, dependencies: [CommonModule, RouterLink, RatingBadgeComponent], styles: ["\n.player-detail[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n/*# sourceMappingURL=player-detail.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayerDetailComponent, [{
    type: Component,
    args: [{ selector: "app-player-detail", standalone: true, imports: [CommonModule, RouterLink, RatingBadgeComponent], template: `
    @if (player()) {
      <div class="player-detail">
        <h2>{{ player()!.displayName || player()!.name }}</h2>
        <app-rating-badge [rating]="player()!.rating" />
        <p>Affinity: {{ player()!.affinity }}</p>
        <p>Status: {{ player()!.archived ? 'Archived' : 'Active' }}</p>
        <h3>Recent Results</h3>
        <ul>
          @for (entry of player()!.recentEntries; track entry.sortOrder) {
            <li>{{ entry.matchDate }}: {{ entry.diff > 0 ? '+' : '' }}{{ entry.diff.toFixed(3) }}</li>
          }
        </ul>
        <a routerLink="../..">Back to Players</a>
      </div>
    } @else {
      <p>Loading...</p>
    }
  `, styles: ["/* angular:styles/component:css;d9f05499bc83d63368299911ef5f17e1d66326b84c676c1a39292589194a11bf;/workspace/proj-tfl/tfl-frontend/src/app/features/players/player-detail/player-detail.component.ts */\n.player-detail {\n  padding: 1rem;\n}\n/*# sourceMappingURL=player-detail.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PlayerDetailComponent, { className: "PlayerDetailComponent", filePath: "src/app/features/players/player-detail/player-detail.component.ts", lineNumber: 33 });
})();
export {
  PlayerDetailComponent
};
//# sourceMappingURL=chunk-AGIHQ3W6.js.map
