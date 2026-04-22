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
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/core/api/users-api.service.ts
var UsersApiService = class _UsersApiService {
  http = inject(HttpClient);
  _users = signal([], ...ngDevMode ? [{ debugName: "_users" }] : (
    /* istanbul ignore next */
    []
  ));
  users = this._users.asReadonly();
  async loadUsers() {
    const result = await firstValueFrom(this.http.get("/api/users"));
    this._users.set(result);
  }
  async approve(id, approved) {
    return firstValueFrom(this.http.put(`/api/users/${id}/approve`, { approved }));
  }
  async updateRoles(id, roles) {
    return firstValueFrom(this.http.put(`/api/users/${id}/roles`, { roles }));
  }
  async deactivate(id) {
    return firstValueFrom(this.http.put(`/api/users/${id}/deactivate`, {}));
  }
  async linkPlayer(id, playerId) {
    return firstValueFrom(this.http.put(`/api/users/${id}/link-player`, { playerId }));
  }
  static \u0275fac = function UsersApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UsersApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UsersApiService, factory: _UsersApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UsersApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/admin/user-management/user-management.component.ts
var _forTrack0 = ($index, $item) => $item.id;
function UserManagementComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p");
    \u0275\u0275text(1, "No users found.");
    \u0275\u0275domElementEnd();
  }
}
function UserManagementComponent_Conditional_4_For_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "tr")(1, "td");
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(3, "td");
    \u0275\u0275text(4);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "td");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "td")(8, "button", 1);
    \u0275\u0275domListener("click", function UserManagementComponent_Conditional_4_For_13_Template_button_click_8_listener() {
      const user_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.toggleApprove(user_r2.id, !user_r2.approved));
    });
    \u0275\u0275text(9);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(10, "button", 1);
    \u0275\u0275domListener("click", function UserManagementComponent_Conditional_4_For_13_Template_button_click_10_listener() {
      const user_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r2.deactivate(user_r2.id));
    });
    \u0275\u0275text(11, "Deactivate");
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const user_r2 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r2.email);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r2.roles.join(", "));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(user_r2.approved ? "Yes" : "No");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", user_r2.approved ? "Revoke" : "Approve", " ");
  }
}
function UserManagementComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "table")(1, "thead")(2, "tr")(3, "th");
    \u0275\u0275text(4, "Email");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "th");
    \u0275\u0275text(6, "Roles");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(7, "th");
    \u0275\u0275text(8, "Approved");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(9, "th");
    \u0275\u0275text(10, "Actions");
    \u0275\u0275domElementEnd()()();
    \u0275\u0275domElementStart(11, "tbody");
    \u0275\u0275repeaterCreate(12, UserManagementComponent_Conditional_4_For_13_Template, 12, 4, "tr", null, _forTrack0);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r2 = \u0275\u0275nextContext();
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r2.usersApi.users());
  }
}
var UserManagementComponent = class _UserManagementComponent {
  usersApi = inject(UsersApiService);
  ngOnInit() {
    this.usersApi.loadUsers();
  }
  async toggleApprove(id, approved) {
    await this.usersApi.approve(id, approved);
    await this.usersApi.loadUsers();
  }
  async deactivate(id) {
    await this.usersApi.deactivate(id);
    await this.usersApi.loadUsers();
  }
  static \u0275fac = function UserManagementComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserManagementComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _UserManagementComponent, selectors: [["app-user-management"]], decls: 5, vars: 1, consts: [[1, "user-management"], [3, "click"]], template: function UserManagementComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h2");
      \u0275\u0275text(2, "User Management");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, UserManagementComponent_Conditional_3_Template, 2, 0, "p")(4, UserManagementComponent_Conditional_4_Template, 14, 0, "table");
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.usersApi.users().length === 0 ? 3 : 4);
    }
  }, dependencies: [CommonModule], styles: ["\n.user-management[_ngcontent-%COMP%] {\n  padding: 1rem;\n}\ntable[_ngcontent-%COMP%] {\n  width: 100%;\n  border-collapse: collapse;\n}\nth[_ngcontent-%COMP%], \ntd[_ngcontent-%COMP%] {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  text-align: left;\n}\nbutton[_ngcontent-%COMP%] {\n  margin: 0 0.2rem;\n  padding: 0.25rem 0.5rem;\n  font-size: 0.85rem;\n}\n/*# sourceMappingURL=user-management.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UserManagementComponent, [{
    type: Component,
    args: [{ selector: "app-user-management", standalone: true, imports: [CommonModule], template: `
    <div class="user-management">
      <h2>User Management</h2>
      @if (usersApi.users().length === 0) {
        <p>No users found.</p>
      } @else {
        <table>
          <thead><tr><th>Email</th><th>Roles</th><th>Approved</th><th>Actions</th></tr></thead>
          <tbody>
            @for (user of usersApi.users(); track user.id) {
              <tr>
                <td>{{ user.email }}</td>
                <td>{{ user.roles.join(', ') }}</td>
                <td>{{ user.approved ? 'Yes' : 'No' }}</td>
                <td>
                  <button (click)="toggleApprove(user.id, !user.approved)">
                    {{ user.approved ? 'Revoke' : 'Approve' }}
                  </button>
                  <button (click)="deactivate(user.id)">Deactivate</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      }
    </div>
  `, styles: ["/* angular:styles/component:css;67d2991c0f7035dd04a79a52577c68ae6f6cfc65c73b0a47d519040caba11654;/workspace/proj-tfl/tfl-frontend/src/app/features/admin/user-management/user-management.component.ts */\n.user-management {\n  padding: 1rem;\n}\ntable {\n  width: 100%;\n  border-collapse: collapse;\n}\nth,\ntd {\n  border: 1px solid #ccc;\n  padding: 0.5rem;\n  text-align: left;\n}\nbutton {\n  margin: 0 0.2rem;\n  padding: 0.25rem 0.5rem;\n  font-size: 0.85rem;\n}\n/*# sourceMappingURL=user-management.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(UserManagementComponent, { className: "UserManagementComponent", filePath: "src/app/features/admin/user-management/user-management.component.ts", lineNumber: 38 });
})();
export {
  UserManagementComponent
};
//# sourceMappingURL=chunk-IBEXFJW6.js.map
