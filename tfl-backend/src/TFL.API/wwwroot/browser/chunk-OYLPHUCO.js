import {
  GameEventsApiService
} from "./chunk-UF7ID32Y.js";
import {
  ActivatedRoute,
  RouterLink
} from "./chunk-H3UJIETU.js";
import {
  CommonModule,
  DatePipe
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/game-events/game-event-detail/game-event-detail.component.ts
var _forTrack0 = ($index, $item) => $item.playerId;
function GameEventDetailComponent_Conditional_0_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const r_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(r_r1.playerName);
  }
}
function GameEventDetailComponent_Conditional_0_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 2);
    \u0275\u0275listener("click", function GameEventDetailComponent_Conditional_0_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.join());
    });
    \u0275\u0275text(1, "Join");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "button", 2);
    \u0275\u0275listener("click", function GameEventDetailComponent_Conditional_0_Conditional_13_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.leave());
    });
    \u0275\u0275text(3, "Leave");
    \u0275\u0275elementEnd();
  }
}
function GameEventDetailComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "h2");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3");
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "ul");
    \u0275\u0275repeaterCreate(11, GameEventDetailComponent_Conditional_0_For_12_Template, 2, 1, "li", null, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(13, GameEventDetailComponent_Conditional_0_Conditional_13_Template, 4, 0);
    \u0275\u0275elementStart(14, "a", 1);
    \u0275\u0275text(15, "Back");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r2.event().name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Date: ", \u0275\u0275pipeBind2(5, 5, ctx_r2.event().date, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Status: ", ctx_r2.event().isActive ? "Active" : "Closed");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("Registrations (", ctx_r2.event().registrations.length, ")");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r2.event().registrations);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r2.event().isActive ? 13 : -1);
  }
}
var GameEventDetailComponent = class _GameEventDetailComponent {
  route = inject(ActivatedRoute);
  gameEventsApi = inject(GameEventsApiService);
  event = signal(null, ...ngDevMode ? [{ debugName: "event" }] : (
    /* istanbul ignore next */
    []
  ));
  async ngOnInit() {
    const name = this.route.snapshot.paramMap.get("name");
    this.event.set(await this.gameEventsApi.getByName(name));
  }
  async join() {
    const name = this.event().name;
    await this.gameEventsApi.join(name);
    this.event.set(await this.gameEventsApi.getByName(name));
  }
  async leave() {
    const name = this.event().name;
    await this.gameEventsApi.leave(name);
    this.event.set(await this.gameEventsApi.getByName(name));
  }
  static \u0275fac = function GameEventDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GameEventDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GameEventDetailComponent, selectors: [["app-game-event-detail"]], decls: 1, vars: 1, consts: [[1, "event-detail"], ["routerLink", ".."], [3, "click"]], template: function GameEventDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, GameEventDetailComponent_Conditional_0_Template, 16, 8, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.event() ? 0 : -1);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], styles: ["\n.event-detail[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\nbutton[_ngcontent-%COMP%] {\n  margin: 0.25rem;\n  padding: 0.5rem 1rem;\n}\n/*# sourceMappingURL=game-event-detail.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameEventDetailComponent, [{
    type: Component,
    args: [{ selector: "app-game-event-detail", standalone: true, imports: [CommonModule, RouterLink], template: `
    @if (event()) {
      <div class="event-detail">
        <h2>{{ event()!.name }}</h2>
        <p>Date: {{ event()!.date | date:'mediumDate' }}</p>
        <p>Status: {{ event()!.isActive ? 'Active' : 'Closed' }}</p>
        <h3>Registrations ({{ event()!.registrations.length }})</h3>
        <ul>
          @for (r of event()!.registrations; track r.playerId) {
            <li>{{ r.playerName }}</li>
          }
        </ul>
        @if (event()!.isActive) {
          <button (click)="join()">Join</button>
          <button (click)="leave()">Leave</button>
        }
        <a routerLink="..">Back</a>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;766d4ad4c386309ed164eebd8fa923b86a5c61fc72c54bc1f232db5c8af7579f;/workspace/proj-tfl/tfl-frontend/src/app/features/game-events/game-event-detail/game-event-detail.component.ts */\n.event-detail {\n  padding: 1rem;\n}\nbutton {\n  margin: 0.25rem;\n  padding: 0.5rem 1rem;\n}\n/*# sourceMappingURL=game-event-detail.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GameEventDetailComponent, { className: "GameEventDetailComponent", filePath: "src/app/features/game-events/game-event-detail/game-event-detail.component.ts", lineNumber: 33 });
})();
export {
  GameEventDetailComponent
};
//# sourceMappingURL=chunk-OYLPHUCO.js.map
