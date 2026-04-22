import "./chunk-GOMI4DH3.js";

// src/app/features/admin/admin.routes.ts
var ADMIN_ROUTES = [
  { path: "", redirectTo: "settings", pathMatch: "full" },
  { path: "settings", loadComponent: () => import("./chunk-MAUAWBND.js").then((m) => m.AdminSettingsComponent) },
  { path: "users", loadComponent: () => import("./chunk-IBEXFJW6.js").then((m) => m.UserManagementComponent) },
  { path: "sync", loadComponent: () => import("./chunk-C3VVZZHR.js").then((m) => m.SyncPageComponent) }
];
export {
  ADMIN_ROUTES
};
//# sourceMappingURL=chunk-YBIFHF4V.js.map
