import {
  AuthService
} from "./chunk-BXXJ4XHH.js";
import {
  RatingBadgeComponent
} from "./chunk-QIYOPA2D.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-D3ZX7HFU.js";
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
  Directive,
  HostListener,
  Input,
  Pipe,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefinePipe,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/shared/directives/copy-clipboard.directive.ts
var CopyClipboardDirective = class _CopyClipboardDirective {
  appCopyClipboard;
  onClick(event) {
    event.stopPropagation();
    navigator.clipboard.writeText(this.appCopyClipboard).catch(() => {
    });
  }
  static \u0275fac = function CopyClipboardDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CopyClipboardDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _CopyClipboardDirective, selectors: [["", "appCopyClipboard", ""]], hostBindings: function CopyClipboardDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("click", function CopyClipboardDirective_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      });
    }
  }, inputs: { appCopyClipboard: "appCopyClipboard" } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CopyClipboardDirective, [{
    type: Directive,
    args: [{
      selector: "[appCopyClipboard]",
      standalone: true
    }]
  }], null, { appCopyClipboard: [{
    type: Input,
    args: [{ required: true }]
  }], onClick: [{
    type: HostListener,
    args: ["click", ["$event"]]
  }] });
})();

// src/app/shared/components/player-card/player-card.component.ts
var PlayerCardComponent = class _PlayerCardComponent {
  player;
  static \u0275fac = function PlayerCardComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayerCardComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PlayerCardComponent, selectors: [["app-player-card"]], inputs: { player: "player" }, decls: 6, vars: 3, consts: [[1, "player-card"], [1, "name"], [3, "rating"], ["title", "Copy name", 1, "copy", 3, "appCopyClipboard"]], template: function PlayerCardComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "span", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275element(3, "app-rating-badge", 2);
      \u0275\u0275elementStart(4, "span", 3);
      \u0275\u0275text(5, "\u{1F4CB}");
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.player.displayName || ctx.player.name);
      \u0275\u0275advance();
      \u0275\u0275property("rating", ctx.player.rating);
      \u0275\u0275advance();
      \u0275\u0275property("appCopyClipboard", ctx.player.name);
    }
  }, dependencies: [CommonModule, RatingBadgeComponent, CopyClipboardDirective], styles: ["\n.player-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem;\n  border: 1px solid #eee;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.name[_ngcontent-%COMP%] {\n  flex: 1;\n  font-weight: bold;\n}\n.copy[_ngcontent-%COMP%] {\n  cursor: pointer;\n  font-size: 0.8rem;\n}\n/*# sourceMappingURL=player-card.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayerCardComponent, [{
    type: Component,
    args: [{ selector: "app-player-card", standalone: true, imports: [CommonModule, RatingBadgeComponent, CopyClipboardDirective], template: `
    <div class="player-card">
      <span class="name">{{ player.displayName || player.name }}</span>
      <app-rating-badge [rating]="player.rating" />
      <span class="copy" [appCopyClipboard]="player.name" title="Copy name">\u{1F4CB}</span>
    </div>
  `, styles: ["/* angular:styles/component:css;8d46da446941bcd9d7c8f82fc8e22557b70eac25fc47e942a4b05eb1136d362d;/workspace/proj-tfl/tfl-frontend/src/app/shared/components/player-card/player-card.component.ts */\n.player-card {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.5rem;\n  border: 1px solid #eee;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.name {\n  flex: 1;\n  font-weight: bold;\n}\n.copy {\n  cursor: pointer;\n  font-size: 0.8rem;\n}\n/*# sourceMappingURL=player-card.component.css.map */\n"] }]
  }], null, { player: [{
    type: Input,
    args: [{ required: true }]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PlayerCardComponent, { className: "PlayerCardComponent", filePath: "src/app/shared/components/player-card/player-card.component.ts", lineNumber: 20 });
})();

// src/app/shared/pipes/player-filter.pipe.ts
var PlayerFilterPipe = class _PlayerFilterPipe {
  transform(players, searchTerm) {
    if (!searchTerm)
      return players;
    const lower = searchTerm.toLowerCase();
    return players.filter((p) => p.name.toLowerCase().includes(lower) || (p.displayName?.toLowerCase().includes(lower) ?? false));
  }
  static \u0275fac = function PlayerFilterPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayerFilterPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "playerFilter", type: _PlayerFilterPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayerFilterPipe, [{
    type: Pipe,
    args: [{ name: "playerFilter", standalone: true }]
  }], null, null);
})();

// src/app/features/players/player-list/player-list.component.ts
var _c0 = (a0) => [a0];
var _forTrack0 = ($index, $item) => $item.id;
function PlayerListComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2);
    \u0275\u0275text(1, "Add Player");
    \u0275\u0275elementEnd();
  }
}
function PlayerListComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
function PlayerListComponent_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-player-card", 5);
  }
  if (rf & 2) {
    const player_r1 = ctx.$implicit;
    \u0275\u0275property("player", player_r1)("routerLink", \u0275\u0275pureFunction1(2, _c0, player_r1.id));
  }
}
function PlayerListComponent_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4);
    \u0275\u0275repeaterCreate(1, PlayerListComponent_Conditional_7_For_2_Template, 1, 4, "app-player-card", 5, _forTrack0);
    \u0275\u0275pipe(3, "playerFilter");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pipeBind2(3, 0, ctx_r1.playersApi.players(), ctx_r1.searchTerm));
  }
}
var PlayerListComponent = class _PlayerListComponent {
  playersApi = inject(PlayersApiService);
  auth = inject(AuthService);
  searchTerm = "";
  ngOnInit() {
    this.playersApi.loadPlayers();
  }
  static \u0275fac = function PlayerListComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayerListComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PlayerListComponent, selectors: [["app-player-list"]], decls: 8, vars: 3, consts: [[1, "player-list"], [1, "header"], ["routerLink", "new", 1, "btn-primary"], ["type", "text", "placeholder", "Filter players...", 1, "search-input", 3, "ngModelChange", "ngModel"], [1, "player-grid"], [3, "player", "routerLink"]], template: function PlayerListComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h2");
      \u0275\u0275text(3, "Players");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, PlayerListComponent_Conditional_4_Template, 2, 0, "a", 2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "input", 3);
      \u0275\u0275twoWayListener("ngModelChange", function PlayerListComponent_Template_input_ngModelChange_5_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.searchTerm, $event) || (ctx.searchTerm = $event);
        return $event;
      });
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(6, PlayerListComponent_Conditional_6_Template, 2, 0, "p")(7, PlayerListComponent_Conditional_7_Template, 4, 3, "div", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.auth.isOrganizer() ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275twoWayProperty("ngModel", ctx.searchTerm);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.playersApi.loading() ? 6 : 7);
    }
  }, dependencies: [CommonModule, RouterLink, PlayerCardComponent, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, PlayerFilterPipe], styles: ["\n.player-list[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.btn-primary[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 4px;\n}\n.search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.5rem;\n  margin: 0.5rem 0;\n  box-sizing: border-box;\n}\n.player-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 1rem;\n}\n/*# sourceMappingURL=player-list.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayerListComponent, [{
    type: Component,
    args: [{ selector: "app-player-list", standalone: true, imports: [CommonModule, RouterLink, PlayerCardComponent, PlayerFilterPipe, FormsModule], template: `
    <div class="player-list">
      <div class="header">
        <h2>Players</h2>
        @if (auth.isOrganizer()) {
          <a routerLink="new" class="btn-primary">Add Player</a>
        }
      </div>
      <input type="text" [(ngModel)]="searchTerm" placeholder="Filter players..." class="search-input">
      @if (playersApi.loading()) {
        <p>Loading...</p>
      } @else {
        <div class="player-grid">
          @for (player of playersApi.players() | playerFilter:searchTerm; track player.id) {
            <app-player-card [player]="player" [routerLink]="[player.id]" />
          }
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;d613dfc3f9aa12aebb6fba29e5c5e16d5589226000181d9706ec784e7161628c;/workspace/proj-tfl/tfl-frontend/src/app/features/players/player-list/player-list.component.ts */\n.player-list {\n  padding: 1rem;\n}\n.header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.btn-primary {\n  padding: 0.5rem 1rem;\n  background: #007bff;\n  color: white;\n  text-decoration: none;\n  border-radius: 4px;\n}\n.search-input {\n  width: 100%;\n  padding: 0.5rem;\n  margin: 0.5rem 0;\n  box-sizing: border-box;\n}\n.player-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 1rem;\n}\n/*# sourceMappingURL=player-list.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PlayerListComponent, { className: "PlayerListComponent", filePath: "src/app/features/players/player-list/player-list.component.ts", lineNumber: 36 });
})();
export {
  PlayerListComponent
};
//# sourceMappingURL=chunk-PXQBXPGK.js.map
