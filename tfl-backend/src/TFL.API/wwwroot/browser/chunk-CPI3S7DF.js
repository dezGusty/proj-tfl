import {
  GameEventsApiService
} from "./chunk-UF7ID32Y.js";
import {
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
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/game-events/game-events-list/game-events-list.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.name;
function GameEventsListComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function GameEventsListComponent_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "a", 3);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "date");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const evt_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction1(7, _c0, evt_r1.name));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(evt_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(5, 4, evt_r1.date, "mediumDate"));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("", evt_r1.registrations.length, " registered");
  }
}
function GameEventsListComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, GameEventsListComponent_Conditional_6_For_1_Template, 8, 9, "div", 2, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.gameEventsApi.events());
  }
}
var GameEventsListComponent = class _GameEventsListComponent {
  gameEventsApi = inject(GameEventsApiService);
  ngOnInit() {
    this.gameEventsApi.loadAll();
  }
  static \u0275fac = function GameEventsListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GameEventsListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GameEventsListComponent, selectors: [["app-game-events-list"]], decls: 7, vars: 1, consts: [[1, "game-events-list"], ["routerLink", "summary"], [1, "event-card"], [3, "routerLink"]], template: function GameEventsListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Game Events");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "a", 1);
      \u0275\u0275text(4, "View Summary Matrix");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, GameEventsListComponent_Conditional_5_Template, 2, 0, "p")(6, GameEventsListComponent_Conditional_6_Template, 2, 0);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(5);
      \u0275\u0275conditional(ctx.gameEventsApi.loading() ? 5 : 6);
    }
  }, dependencies: [CommonModule, RouterLink, DatePipe], styles: ["\n.game-events-list[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.event-card[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n/*# sourceMappingURL=game-events-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameEventsListComponent, [{
    type: Component,
    args: [{ selector: "app-game-events-list", standalone: true, imports: [CommonModule, RouterLink], template: `
    <div class="game-events-list">
      <h2>Game Events</h2>
      <a routerLink="summary">View Summary Matrix</a>
      @if (gameEventsApi.loading()) {
        <p>Loading...</p>
      } @else {
        @for (evt of gameEventsApi.events(); track evt.name) {
          <div class="event-card">
            <a [routerLink]="[evt.name]">{{ evt.name }}</a>
            <span>{{ evt.date | date:'mediumDate' }}</span>
            <span>{{ evt.registrations.length }} registered</span>
          </div>
        }
      }
    </div>
  `, styles: ["/* angular:styles/component:css;7eadeb0773665b753e961d60abcd819da90e55b415f6becd5d68c55ad0b9cce3;/workspace/proj-tfl/tfl-frontend/src/app/features/game-events/game-events-list/game-events-list.component.ts */\n.game-events-list {\n  padding: 1rem;\n}\n.event-card {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}\n/*# sourceMappingURL=game-events-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GameEventsListComponent, { className: "GameEventsListComponent", filePath: "src/app/features/game-events/game-events-list/game-events-list.component.ts", lineNumber: 29 });
})();
export {
  GameEventsListComponent
};
//# sourceMappingURL=chunk-CPI3S7DF.js.map
