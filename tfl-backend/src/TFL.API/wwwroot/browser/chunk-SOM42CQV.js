import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  NgSelectOption,
  RequiredValidator,
  SelectControlValueAccessor,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-D3ZX7HFU.js";
import {
  PlayersApiService
} from "./chunk-UPKDBO3Z.js";
import {
  ActivatedRoute,
  Router,
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
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/players/player-edit/player-edit.component.ts
function PlayerEditComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 0)(1, "h2");
    \u0275\u0275text(2, "Edit Player");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "form", 1);
    \u0275\u0275listener("ngSubmit", function PlayerEditComponent_Conditional_0_Template_form_ngSubmit_3_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.save());
    });
    \u0275\u0275elementStart(4, "label");
    \u0275\u0275text(5, "Name ");
    \u0275\u0275elementStart(6, "input", 2);
    \u0275\u0275twoWayListener("ngModelChange", function PlayerEditComponent_Conditional_0_Template_input_ngModelChange_6_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.name, $event) || (ctx_r1.name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "label");
    \u0275\u0275text(8, "Display Name ");
    \u0275\u0275elementStart(9, "input", 3);
    \u0275\u0275twoWayListener("ngModelChange", function PlayerEditComponent_Conditional_0_Template_input_ngModelChange_9_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.displayName, $event) || (ctx_r1.displayName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "label");
    \u0275\u0275text(11, "Affinity ");
    \u0275\u0275elementStart(12, "select", 4);
    \u0275\u0275twoWayListener("ngModelChange", function PlayerEditComponent_Conditional_0_Template_select_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.affinity, $event) || (ctx_r1.affinity = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementStart(13, "option", 5);
    \u0275\u0275text(14, "None");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "option", 5);
    \u0275\u0275text(16, "Team 1");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "option", 5);
    \u0275\u0275text(18, "Team 2");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "button", 6);
    \u0275\u0275text(20, "Save");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "a", 7);
    \u0275\u0275text(22, "Cancel");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.name);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.displayName);
    \u0275\u0275advance(3);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.affinity);
    \u0275\u0275advance();
    \u0275\u0275property("value", 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 1);
    \u0275\u0275advance(2);
    \u0275\u0275property("value", 2);
  }
}
var PlayerEditComponent = class _PlayerEditComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  playersApi = inject(PlayersApiService);
  player = signal(null, ...ngDevMode ? [{ debugName: "player" }] : (
    /* istanbul ignore next */
    []
  ));
  name = "";
  displayName = "";
  affinity = 0;
  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get("id"));
    const p = await this.playersApi.getById(id);
    this.player.set(p);
    this.name = p.name;
    this.displayName = p.displayName ?? "";
    this.affinity = p.affinity;
  }
  async save() {
    const id = this.player().id;
    await this.playersApi.updatePlayer(id, { name: this.name, displayName: this.displayName, affinity: this.affinity });
    this.router.navigate([".."], { relativeTo: this.route });
  }
  static \u0275fac = function PlayerEditComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayerEditComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PlayerEditComponent, selectors: [["app-player-edit"]], decls: 1, vars: 1, consts: [[1, "player-edit"], [3, "ngSubmit"], ["type", "text", "name", "name", "required", "", 3, "ngModelChange", "ngModel"], ["type", "text", "name", "displayName", 3, "ngModelChange", "ngModel"], ["name", "affinity", 3, "ngModelChange", "ngModel"], [3, "value"], ["type", "submit"], ["routerLink", ".."]], template: function PlayerEditComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, PlayerEditComponent_Conditional_0_Template, 23, 6, "div", 0);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.player() ? 0 : -1);
    }
  }, dependencies: [CommonModule, FormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, RouterLink], styles: ["\n.player-edit[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\nlabel[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0.5rem 0;\n}\ninput[_ngcontent-%COMP%], \nselect[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.25rem;\n}\nbutton[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n}\n/*# sourceMappingURL=player-edit.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayerEditComponent, [{
    type: Component,
    args: [{ selector: "app-player-edit", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `
    @if (player()) {
      <div class="player-edit">
        <h2>Edit Player</h2>
        <form (ngSubmit)="save()">
          <label>Name <input type="text" [(ngModel)]="name" name="name" required></label>
          <label>Display Name <input type="text" [(ngModel)]="displayName" name="displayName"></label>
          <label>Affinity
            <select [(ngModel)]="affinity" name="affinity">
              <option [value]="0">None</option>
              <option [value]="1">Team 1</option>
              <option [value]="2">Team 2</option>
            </select>
          </label>
          <button type="submit">Save</button>
          <a routerLink="..">Cancel</a>
        </form>
      </div>
    }
  `, styles: ["/* angular:styles/component:css;36c741efef5e5f9392608daee7e422d93fb806d1ba23364939479c83eeb122a0;/workspace/proj-tfl/tfl-frontend/src/app/features/players/player-edit/player-edit.component.ts */\n.player-edit {\n  padding: 1rem;\n}\nlabel {\n  display: block;\n  margin: 0.5rem 0;\n}\ninput,\nselect {\n  width: 100%;\n  padding: 0.25rem;\n}\nbutton {\n  margin-top: 1rem;\n  padding: 0.5rem 1rem;\n}\n/*# sourceMappingURL=player-edit.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PlayerEditComponent, { className: "PlayerEditComponent", filePath: "src/app/features/players/player-edit/player-edit.component.ts", lineNumber: 34 });
})();
export {
  PlayerEditComponent
};
//# sourceMappingURL=chunk-SOM42CQV.js.map
