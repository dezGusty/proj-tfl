import { Routes } from '@angular/router';

export const GAME_EVENT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./game-events-list/game-events-list.component').then(m => m.GameEventsListComponent) },
  { path: 'summary', loadComponent: () => import('./game-events-summary/game-events-summary.component').then(m => m.GameEventsSummaryComponent) },
  { path: ':name', loadComponent: () => import('./game-event-detail/game-event-detail.component').then(m => m.GameEventDetailComponent) },
];
