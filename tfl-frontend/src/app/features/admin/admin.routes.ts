import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'settings', pathMatch: 'full' },
  { path: 'settings', loadComponent: () => import('./admin-settings/admin-settings.component').then(m => m.AdminSettingsComponent) },
  { path: 'users', loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent) },
  { path: 'sync', loadComponent: () => import('./sync/sync-page.component').then(m => m.SyncPageComponent) },
];
