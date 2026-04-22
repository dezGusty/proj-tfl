import {
  AuthService
} from "./chunk-BXXJ4XHH.js";
import {
  ActivatedRoute,
  Router
} from "./chunk-H3UJIETU.js";
import "./chunk-JCLEJJB5.js";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵnextContext,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-SFDL6MAX.js";
import "./chunk-GOMI4DH3.js";

// src/app/features/signin/signin.component.ts
function SigninComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p", 1);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.errorMessage);
  }
}
var SigninComponent = class _SigninComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  error = false;
  errorMessage = "";
  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get("token");
    const err = this.route.snapshot.queryParamMap.get("error");
    if (token) {
      this.authService.storeToken(token);
      this.router.navigate(["/players"]);
    } else if (err) {
      this.error = true;
      this.errorMessage = `Sign-in failed: ${err.replace(/_/g, " ")}`;
    }
  }
  static \u0275fac = function SigninComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SigninComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SigninComponent, selectors: [["app-signin"]], decls: 6, vars: 1, consts: [[1, "signin-page"], [1, "error"], ["href", "/api/auth/google", 1, "btn-google"]], template: function SigninComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1");
      \u0275\u0275text(2, "Sign In");
      \u0275\u0275domElementEnd();
      \u0275\u0275conditionalCreate(3, SigninComponent_Conditional_3_Template, 2, 1, "p", 1);
      \u0275\u0275domElementStart(4, "a", 2);
      \u0275\u0275text(5, "Sign in with Google");
      \u0275\u0275domElementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.error ? 3 : -1);
    }
  }, styles: ["\n.signin-page[_ngcontent-%COMP%] {\n  padding: 2rem;\n  text-align: center;\n}\n.error[_ngcontent-%COMP%] {\n  color: red;\n}\n.btn-google[_ngcontent-%COMP%] {\n  display: inline-block;\n  padding: 0.75rem 1.5rem;\n  background: #4285f4;\n  color: white;\n  text-decoration: none;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=signin.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SigninComponent, [{
    type: Component,
    args: [{ selector: "app-signin", standalone: true, template: `
    <div class="signin-page">
      <h1>Sign In</h1>
      @if (error) {
        <p class="error">{{ errorMessage }}</p>
      }
      <a href="/api/auth/google" class="btn-google">Sign in with Google</a>
    </div>
  `, styles: ["/* angular:styles/component:css;3cab968f8a52fbe1b624f2a4586cf1a0847acea92850b8aef9a75fdbbe858fa6;/workspace/proj-tfl/tfl-frontend/src/app/features/signin/signin.component.ts */\n.signin-page {\n  padding: 2rem;\n  text-align: center;\n}\n.error {\n  color: red;\n}\n.btn-google {\n  display: inline-block;\n  padding: 0.75rem 1.5rem;\n  background: #4285f4;\n  color: white;\n  text-decoration: none;\n  border-radius: 4px;\n}\n/*# sourceMappingURL=signin.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SigninComponent, { className: "SigninComponent", filePath: "src/app/features/signin/signin.component.ts", lineNumber: 19 });
})();
export {
  SigninComponent
};
//# sourceMappingURL=chunk-SVUXIWS3.js.map
