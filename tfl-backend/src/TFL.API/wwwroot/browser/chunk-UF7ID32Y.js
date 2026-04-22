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

// src/app/core/api/game-events-api.service.ts
var GameEventsApiService = class _GameEventsApiService {
  http = inject(HttpClient);
  _events = signal([], ...ngDevMode ? [{ debugName: "_events" }] : (
    /* istanbul ignore next */
    []
  ));
  _loading = signal(false, ...ngDevMode ? [{ debugName: "_loading" }] : (
    /* istanbul ignore next */
    []
  ));
  events = this._events.asReadonly();
  loading = this._loading.asReadonly();
  async loadAll() {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get("/api/game-events"));
      this._events.set(result);
    } finally {
      this._loading.set(false);
    }
  }
  async getByName(name) {
    return firstValueFrom(this.http.get(`/api/game-events/${encodeURIComponent(name)}`));
  }
  async create(request) {
    const evt = await firstValueFrom(this.http.post("/api/game-events", request));
    this._events.update((list) => [...list, evt]);
    return evt;
  }
  async update(name, request) {
    return firstValueFrom(this.http.put(`/api/game-events/${encodeURIComponent(name)}`, request));
  }
  async join(name) {
    await firstValueFrom(this.http.post(`/api/game-events/${encodeURIComponent(name)}/join`, {}));
  }
  async leave(name) {
    await firstValueFrom(this.http.delete(`/api/game-events/${encodeURIComponent(name)}/join`));
  }
  async transferToDraft(name) {
    return firstValueFrom(this.http.post(`/api/game-events/${encodeURIComponent(name)}/transfer-to-draft`, {}));
  }
  async getSummary() {
    return firstValueFrom(this.http.get("/api/game-events/summary"));
  }
  static \u0275fac = function GameEventsApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GameEventsApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GameEventsApiService, factory: _GameEventsApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GameEventsApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  GameEventsApiService
};
//# sourceMappingURL=chunk-UF7ID32Y.js.map
