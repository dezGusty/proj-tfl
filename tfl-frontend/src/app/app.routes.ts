import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'signin', loadComponent: () => import('./features/signin/signin.component').then(m => m.SigninComponent) },
  { path: 'privacy', loadComponent: () => import('./features/privacy/privacy.component').then(m => m.PrivacyComponent) },
  { path: 'players', canActivate: [authGuard], loadChildren: () => import('./features/players/players.routes').then(m => m.PLAYER_ROUTES) },
  { path: 'nextdraft', canActivate: [authGuard], loadChildren: () => import('./features/draft/draft.routes').then(m => m.DRAFT_ROUTES) },
  { path: 'games', canActivate: [authGuard], loadChildren: () => import('./features/game-events/game-events.routes').then(m => m.GAME_EVENT_ROUTES) },
  { path: 'recent', canActivate: [authGuard], loadChildren: () => import('./features/matches/matches.routes').then(m => m.MATCH_ROUTES) },
  { path: 'admin', canActivate: [adminGuard], loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES) },
];
