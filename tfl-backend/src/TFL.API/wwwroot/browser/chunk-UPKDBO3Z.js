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

// src/app/core/api/players-api.service.ts
var PlayersApiService = class _PlayersApiService {
  http = inject(HttpClient);
  _players = signal([], ...ngDevMode ? [{ debugName: "_players" }] : (
    /* istanbul ignore next */
    []
  ));
  _loading = signal(false, ...ngDevMode ? [{ debugName: "_loading" }] : (
    /* istanbul ignore next */
    []
  ));
  players = this._players.asReadonly();
  loading = this._loading.asReadonly();
  async loadPlayers() {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get("/api/players"));
      this._players.set(result);
    } finally {
      this._loading.set(false);
    }
  }
  async loadArchived() {
    return firstValueFrom(this.http.get("/api/players/archived"));
  }
  async getById(id) {
    return firstValueFrom(this.http.get(`/api/players/${id}`));
  }
  async createPlayer(request) {
    const player = await firstValueFrom(this.http.post("/api/players", request));
    this._players.update((list) => [...list, player]);
    return player;
  }
  async updatePlayer(id, request) {
    const player = await firstValueFrom(this.http.put(`/api/players/${id}`, request));
    this._players.update((list) => list.map((p) => p.id === id ? player : p));
    return player;
  }
  async archivePlayer(id, archived) {
    const player = await firstValueFrom(this.http.patch(`/api/players/${id}/archive`, { archived }));
    this._players.update((list) => archived ? list.filter((p) => p.id !== id) : [...list, player]);
    return player;
  }
  async adjustRating(id, request) {
    const player = await firstValueFrom(this.http.patch(`/api/players/${id}/rating`, request));
    this._players.update((list) => list.map((p) => p.id === id ? player : p));
    return player;
  }
  static \u0275fac = function PlayersApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PlayersApiService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PlayersApiService, factory: _PlayersApiService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlayersApiService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  PlayersApiService
};
//# sourceMappingURL=chunk-UPKDBO3Z.js.map
