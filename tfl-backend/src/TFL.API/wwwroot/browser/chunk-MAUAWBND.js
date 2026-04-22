import {
  DefaultValueAccessor,
  FormsModule,
  MaxValidator,
  MinValidator,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NumberValueAccessor,
  ɵNgNoValidate
} from "./chunk-D3ZX7HFU.js";
import {
  CommonModule,
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
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-SFDL6MAX.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/core/api/settings-api.service.ts
var SettingsApiService = class _SettingsApiService {
  http = inject(HttpClient);
  _settings = signal(null, ...ngDevMode ? [{ debugName: "_settings" }] : (
    /* istanbul ignore next */
    []
  ));
  settings = this._settings.asReadonly();
  async loadSettings() {
    const result = await firstValueFrom(this.http.get("/api/settings"));
    this._settings.set(result);
  }
  async updateSettings(settings) {
    const result = await firstValueFrom(this.http.put("/api/settings", settings));
    this._settings.set(result);
    return result;
  }
  static \u0275fac = function SettingsApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SettingsApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SettingsApiService, factory: _SettingsApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SettingsApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/admin/admin-settings/admin-settings.component.ts
function AdminSettingsComponent_Conditional_3_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 4);
    \u0275\u0275text(1, "Settings saved!");
    \u0275\u0275elementEnd();
  }
}
function AdminSettingsComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 1);
    \u0275\u0275listener("ngSubmit", function AdminSettingsComponent_Conditional_3_Template_form_ngSubmit_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(1, "label");
    \u0275\u0275text(2, "Recent Matches to Store: ");
    \u0275\u0275elementStart(3, "input", 2);
    \u0275\u0275twoWayListener("ngModelChange", function AdminSettingsComponent_Conditional_3_Template_input_ngModelChange_3_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.recentMatches, $event) || (ctx_r1.recentMatches = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(4, "button", 3);
    \u0275\u0275text(5, "Save");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(6, AdminSettingsComponent_Conditional_3_Conditional_6_Template, 2, 0, "p", 4);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.recentMatches);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.saved ? 6 : -1);
  }
}
function AdminSettingsComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "Loading...");
    \u0275\u0275elementEnd();
  }
}
var AdminSettingsComponent = class _AdminSettingsComponent {
  settingsApi = inject(SettingsApiService);
  recentMatches = 6;
  saved = false;
  async ngOnInit() {
    await this.settingsApi.loadSettings();
    this.recentMatches = this.settingsApi.settings()?.recentMatchesToStore ?? 6;
  }
  async save() {
    const current = this.settingsApi.settings();
    await this.settingsApi.updateSettings(__spreadProps(__spreadValues({}, current), { recentMatchesToStore: this.recentMatches }));
    this.saved = true;
    setTimeout(() => this.saved = false, 3e3);
  }
  static \u0275fac = function AdminSettingsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminSettingsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminSettingsComponent, selectors: [["app-admin-settings"]], decls: 5, vars: 1, consts: [[1, "admin-settings"], [3, "ngSubmit"], ["type", "number", "name", "recentMatches", "min", "4", "max", "12", 3, "ngModelChange", "ngModel"], ["type", "submit"], [1, "saved"]], template: function AdminSettingsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "App Settings");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, AdminSettingsComponent_Conditional_3_Template, 7, 2)(4, AdminSettingsComponent_Conditional_4_Template, 2, 0, "p");
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.settingsApi.settings() ? 3 : 4);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgControlStatusGroup, MinValidator, MaxValidator, NgModel, NgForm], styles: ["\n.admin-settings[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\nlabel[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0.5rem 0;\n}\ninput[_ngcontent-%COMP%] {\n  width: 80px;\n  padding: 0.25rem;\n}\nbutton[_ngcontent-%COMP%] {\n  padding: 0.5rem 1rem;\n  margin-top: 1rem;\n}\n.saved[_ngcontent-%COMP%] {\n  color: green;\n}\n/*# sourceMappingURL=admin-settings.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminSettingsComponent, [{
    type: Component,
    args: [{ selector: "app-admin-settings", standalone: true, imports: [CommonModule, FormsModule], template: `
    <div class="admin-settings">
      <h2>App Settings</h2>
      @if (settingsApi.settings()) {
        <form (ngSubmit)="save()">
          <label>Recent Matches to Store:
            <input type="number" [(ngModel)]="recentMatches" name="recentMatches" min="4" max="12">
          </label>
          <button type="submit">Save</button>
        </form>
        @if (saved) {
          <p class="saved">Settings saved!</p>
        }
      } @else {
        <p>Loading...</p>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;43fb3aa58d93ecafc1e1de379d0be352715c27a0aa3221c7055d22acc0cdefbd;/workspace/proj-tfl/tfl-frontend/src/app/features/admin/admin-settings/admin-settings.component.ts */\n.admin-settings {\n  padding: 1rem;\n}\nlabel {\n  display: block;\n  margin: 0.5rem 0;\n}\ninput {\n  width: 80px;\n  padding: 0.25rem;\n}\nbutton {\n  padding: 0.5rem 1rem;\n  margin-top: 1rem;\n}\n.saved {\n  color: green;\n}\n/*# sourceMappingURL=admin-settings.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminSettingsComponent, { className: "AdminSettingsComponent", filePath: "src/app/features/admin/admin-settings/admin-settings.component.ts", lineNumber: 30 });
})();
export {
  AdminSettingsComponent
};
//# sourceMappingURL=chunk-MAUAWBND.js.map
