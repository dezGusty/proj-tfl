import {
  HttpClient
} from "./chunk-JCLEJJB5.js";
import {
  Injectable,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵɵdefineInjectable
} from "./chunk-SFDL6MAX.js";

// src/app/core/api/matches-api.service.ts
var MatchesApiService = class _MatchesApiService {
  http = inject(HttpClient);
  _matches = signal([], ...ngDevMode ? [{ debugName: "_matches" }] : (
    /* istanbul ignore next */
    []
  ));
  _loading = signal(false, ...ngDevMode ? [{ debugName: "_loading" }] : (
    /* istanbul ignore next */
    []
  ));
  matches = this._matches.asReadonly();
  loading = this._loading.asReadonly();
  async loadRecent() {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get("/api/matches/recent"));
      this._matches.set(result);
    } finally {
      this._loading.set(false);
    }
  }
  async getByDateKey(dateKey) {
    return firstValueFrom(this.http.get(`/api/matches/${dateKey}`));
  }
  async createMatch(request) {
    return firstValueFrom(this.http.post("/api/matches", request));
  }
  async updateMatch(dateKey, request) {
    return firstValueFrom(this.http.put(`/api/matches/${dateKey}`, request));
  }
  static \u0275fac = function MatchesApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatchesApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MatchesApiService, factory: _MatchesApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatchesApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  MatchesApiService
};
//# sourceMappingURL=chunk-L26AOSX2.js.map
