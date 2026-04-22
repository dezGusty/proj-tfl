import {
  Injectable,
  computed,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-SFDL6MAX.js";

// src/app/core/auth/auth.service.ts
var AuthService = class _AuthService {
  _currentUser = signal(null, ...ngDevMode ? [{ debugName: "_currentUser" }] : (
    /* istanbul ignore next */
    []
  ));
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = computed(() => this._currentUser() !== null, ...ngDevMode ? [{ debugName: "isAuthenticated" }] : (
    /* istanbul ignore next */
    []
  ));
  isOrganizer = computed(() => this._currentUser()?.roles.includes("organizer") ?? false, ...ngDevMode ? [{ debugName: "isOrganizer" }] : (
    /* istanbul ignore next */
    []
  ));
  isAdmin = computed(() => this._currentUser()?.roles.includes("admin") ?? false, ...ngDevMode ? [{ debugName: "isAdmin" }] : (
    /* istanbul ignore next */
    []
  ));
  initialize() {
    const token = localStorage.getItem("tfl_token");
    if (token && !this.isTokenExpired(token)) {
      this._currentUser.set(this.parseToken(token));
    }
  }
  storeToken(token) {
    localStorage.setItem("tfl_token", token);
    this._currentUser.set(this.parseToken(token));
  }
  signOut() {
    localStorage.removeItem("tfl_token");
    this._currentUser.set(null);
  }
  getToken() {
    return localStorage.getItem("tfl_token");
  }
  parseToken(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return {
        id: payload.sub,
        email: payload.email,
        roles: Array.isArray(payload.roles) ? payload.roles : [payload.roles].filter(Boolean),
        approved: payload.approved === "true",
        isActive: true
      };
    } catch {
      return null;
    }
  }
  isTokenExpired(token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return payload.exp < Math.floor(Date.now() / 1e3);
    } catch {
      return true;
    }
  }
  static \u0275fac = function AuthService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AuthService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AuthService, factory: _AuthService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  AuthService
};
//# sourceMappingURL=chunk-BXXJ4XHH.js.map
