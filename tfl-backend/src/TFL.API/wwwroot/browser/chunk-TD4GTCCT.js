import "./chunk-GOMI4DH3.js";

// src/app/features/game-events/game-events.routes.ts
var GAME_EVENT_ROUTES = [
  { path: "", loadComponent: () => import("./chunk-CPI3S7DF.js").then((m) => m.GameEventsListComponent) },
  { path: "summary", loadComponent: () => import("./chunk-7Z3L5RLJ.js").then((m) => m.GameEventsSummaryComponent) },
  { path: ":name", loadComponent: () => import("./chunk-OYLPHUCO.js").then((m) => m.GameEventDetailComponent) }
];
export {
  GAME_EVENT_ROUTES
};
//# sourceMappingURL=chunk-TD4GTCCT.js.map
