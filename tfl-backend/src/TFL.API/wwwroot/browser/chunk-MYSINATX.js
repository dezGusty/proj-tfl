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

// src/app/core/api/draft-api.service.ts
var DraftApiService = class _DraftApiService {
  http = inject(HttpClient);
  _draft = signal(null, ...ngDevMode ? [{ debugName: "_draft" }] : (
    /* istanbul ignore next */
    []
  ));
  _combinations = signal([], ...ngDevMode ? [{ debugName: "_combinations" }] : (
    /* istanbul ignore next */
    []
  ));
  _loading = signal(false, ...ngDevMode ? [{ debugName: "_loading" }] : (
    /* istanbul ignore next */
    []
  ));
  draft = this._draft.asReadonly();
  combinations = this._combinations.asReadonly();
  loading = this._loading.asReadonly();
  async loadDraft() {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get("/api/draft"));
      this._draft.set(result);
    } finally {
      this._loading.set(false);
    }
  }
  async saveDraft(request) {
    const draft = await firstValueFrom(this.http.put("/api/draft", request));
    this._draft.set(draft);
    return draft;
  }
  async generateTeams(request) {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.post("/api/draft/generate-teams", request));
      this._combinations.set(result);
      return result;
    } finally {
      this._loading.set(false);
    }
  }
  static \u0275fac = function DraftApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DraftApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DraftApiService, factory: _DraftApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DraftApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  DraftApiService
};
//# sourceMappingURL=chunk-MYSINATX.js.map
