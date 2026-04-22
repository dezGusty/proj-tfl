import {
  CommonModule,
  DatePipe,
  HttpClient
} from "./chunk-JCLEJJB5.js";
import {
  Component,
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/core/api/sync-api.service.ts
var SyncApiService = class _SyncApiService {
  http = inject(HttpClient);
  _status = signal(null, ...ngDevMode ? [{ debugName: "_status" }] : (
    /* istanbul ignore next */
    []
  ));
  _conflicts = signal([], ...ngDevMode ? [{ debugName: "_conflicts" }] : (
    /* istanbul ignore next */
    []
  ));
  _loading = signal(false, ...ngDevMode ? [{ debugName: "_loading" }] : (
    /* istanbul ignore next */
    []
  ));
  status = this._status.asReadonly();
  conflicts = this._conflicts.asReadonly();
  loading = this._loading.asReadonly();
  async loadStatus() {
    const result = await firstValueFrom(this.http.get("/api/sync/status"));
    this._status.set(result);
  }
  async loadConflicts() {
    const result = await firstValueFrom(this.http.get("/api/sync/conflicts"));
    this._conflicts.set(result);
  }
  async syncAll() {
    this._loading.set(true);
    try {
      return await firstValueFrom(this.http.post("/api/sync", {}));
    } finally {
      this._loading.set(false);
      await this.loadStatus();
    }
  }
  async syncEntityType(entityType) {
    return firstValueFrom(this.http.post(`/api/sync/${entityType}`, {}));
  }
  async resolveConflict(id, winner) {
    await firstValueFrom(this.http.put(`/api/sync/conflicts/${id}/resolve`, { winner }));
    this._conflicts.update((list) => list.filter((c) => c.id !== id));
  }
  static \u0275fac = function SyncApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SyncApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SyncApiService, factory: _SyncApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SyncApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/admin/sync/sync-page.component.ts
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.id;
function SyncPageComponent_Conditional_3_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "date");
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const entry_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", entry_r1.key, ": ", entry_r1.value ? \u0275\u0275pipeBind2(2, 2, entry_r1.value, "medium") : "Never");
  }
}
function SyncPageComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 1)(1, "h3");
    \u0275\u0275text(2, "Last Sync Times");
    \u0275\u0275domElementEnd();
    \u0275\u0275repeaterCreate(3, SyncPageComponent_Conditional_3_For_4_Template, 3, 5, "div", null, _forTrack0);
    \u0275\u0275domElementStart(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.getEntries());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1("Unresolved conflicts: ", ctx_r1.syncApi.status().unresolvedConflicts);
  }
}
function SyncPageComponent_For_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 3);
    \u0275\u0275domListener("click", function SyncPageComponent_For_8_Template_button_click_0_listener() {
      const entityType_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.syncOne(entityType_r4));
    });
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const entityType_r4 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275domProperty("disabled", ctx_r1.syncApi.loading());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Sync ", entityType_r4);
  }
}
function SyncPageComponent_Conditional_9_For_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 6)(1, "p");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "button", 7);
    \u0275\u0275domListener("click", function SyncPageComponent_Conditional_9_For_4_Template_button_click_3_listener() {
      const conflict_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resolve(conflict_r6.id, "sqlite"));
    });
    \u0275\u0275text(4, "Use SQLite");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "button", 7);
    \u0275\u0275domListener("click", function SyncPageComponent_Conditional_9_For_4_Template_button_click_5_listener() {
      const conflict_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.resolve(conflict_r6.id, "firestore"));
    });
    \u0275\u0275text(6, "Use Firebase");
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const conflict_r6 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", conflict_r6.entityType, " / ", conflict_r6.entityKey);
  }
}
function SyncPageComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 5)(1, "h3");
    \u0275\u0275text(2, "Conflicts");
    \u0275\u0275domElementEnd();
    \u0275\u0275repeaterCreate(3, SyncPageComponent_Conditional_9_For_4_Template, 7, 2, "div", 6, _forTrack1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275repeater(ctx_r1.syncApi.conflicts());
  }
}
var SyncPageComponent = class _SyncPageComponent {
  syncApi = inject(SyncApiService);
  entityTypes = ["players", "matches", "game-events", "draft"];
  ngOnInit() {
    this.syncApi.loadStatus();
    this.syncApi.loadConflicts();
  }
  async syncAll() {
    await this.syncApi.syncAll();
    this.syncApi.loadConflicts();
  }
  async syncOne(entityType) {
    await this.syncApi.syncEntityType(entityType);
    await this.syncApi.loadStatus();
  }
  async resolve(id, winner) {
    await this.syncApi.resolveConflict(id, winner);
  }
  getEntries() {
    const status = this.syncApi.status();
    if (!status)
      return [];
    return Object.entries(status.lastSyncAt).map(([key, value]) => ({ key, value }));
  }
  static \u0275fac = function SyncPageComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SyncPageComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SyncPageComponent, selectors: [["app-sync-page"]], decls: 10, vars: 4, consts: [[1, "sync-page"], [1, "status-panel"], [1, "controls"], [3, "click", "disabled"], [3, "disabled"], [1, "conflicts"], [1, "conflict"], [3, "click"]], template: function SyncPageComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "Firebase Sync");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, SyncPageComponent_Conditional_3_Template, 7, 1, "div", 1);
      \u0275\u0275domElementStart(4, "div", 2)(5, "button", 3);
      \u0275\u0275domListener("click", function SyncPageComponent_Template_button_click_5_listener() {
        return ctx.syncAll();
      });
      \u0275\u0275text(6);
      \u0275\u0275domElementEnd();
      \u0275\u0275repeaterCreate(7, SyncPageComponent_For_8_Template, 2, 2, "button", 4, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(9, SyncPageComponent_Conditional_9_Template, 5, 0, "div", 5);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.syncApi.status() ? 3 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275domProperty("disabled", ctx.syncApi.loading());
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.syncApi.loading() ? "Syncing..." : "Sync All", " ");
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.entityTypes);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.syncApi.conflicts().length > 0 ? 9 : -1);
    }
  }, dependencies: [CommonModule, DatePipe], styles: ["\n.sync-page[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\n.controls[_ngcontent-%COMP%] {\n  margin: 1rem 0;\n}\nbutton[_ngcontent-%COMP%] {\n  margin: 0.25rem;\n  padding: 0.5rem 1rem;\n}\n.conflict[_ngcontent-%COMP%] {\n  border: 1px solid orange;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=sync-page.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SyncPageComponent, [{
    type: Component,
    args: [{ selector: "app-sync-page", standalone: true, imports: [CommonModule], template: `
    <div class="sync-page">
      <h2>Firebase Sync</h2>
      @if (syncApi.status()) {
        <div class="status-panel">
          <h3>Last Sync Times</h3>
          @for (entry of getEntries(); track entry.key) {
            <div>{{ entry.key }}: {{ entry.value ? (entry.value | date:'medium') : 'Never' }}</div>
          }
          <p>Unresolved conflicts: {{ syncApi.status()!.unresolvedConflicts }}</p>
        </div>
      }
      <div class="controls">
        <button (click)="syncAll()" [disabled]="syncApi.loading()">
          {{ syncApi.loading() ? 'Syncing...' : 'Sync All' }}
        </button>
        @for (entityType of entityTypes; track entityType) {
          <button (click)="syncOne(entityType)" [disabled]="syncApi.loading()">Sync {{ entityType }}</button>
        }
      </div>
      @if (syncApi.conflicts().length > 0) {
        <div class="conflicts">
          <h3>Conflicts</h3>
          @for (conflict of syncApi.conflicts(); track conflict.id) {
            <div class="conflict">
              <p>{{ conflict.entityType }} / {{ conflict.entityKey }}</p>
              <button (click)="resolve(conflict.id, 'sqlite')">Use SQLite</button>
              <button (click)="resolve(conflict.id, 'firestore')">Use Firebase</button>
            </div>
          }
        </div>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;abac56467488fc9498f200ce69a0a41b4e80eeca16b9ee202e7e07d614600e7e;/workspace/proj-tfl/tfl-frontend/src/app/features/admin/sync/sync-page.component.ts */\n.sync-page {\n  padding: 1rem;\n}\n.controls {\n  margin: 1rem 0;\n}\nbutton {\n  margin: 0.25rem;\n  padding: 0.5rem 1rem;\n}\n.conflict {\n  border: 1px solid orange;\n  padding: 0.5rem;\n  margin: 0.25rem;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=sync-page.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SyncPageComponent, { className: "SyncPageComponent", filePath: "src/app/features/admin/sync/sync-page.component.ts", lineNumber: 45 });
})();
export {
  SyncPageComponent
};
//# sourceMappingURL=chunk-C3VVZZHR.js.map
