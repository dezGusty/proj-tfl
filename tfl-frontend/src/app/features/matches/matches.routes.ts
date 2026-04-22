import { Routes } from '@angular/router';

export const MATCH_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./match-history/match-history.component').then(m => m.MatchHistoryComponent) },
  { path: ':dateKey', loadComponent: () => import('./match-detail/match-detail.component').then(m => m.MatchDetailComponent) },
];
