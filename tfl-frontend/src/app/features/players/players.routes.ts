import { Routes } from '@angular/router';

export const PLAYER_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./player-list/player-list.component').then(m => m.PlayerListComponent) },
  { path: ':id', loadComponent: () => import('./player-detail/player-detail.component').then(m => m.PlayerDetailComponent) },
  { path: ':id/edit', loadComponent: () => import('./player-edit/player-edit.component').then(m => m.PlayerEditComponent) },
];
