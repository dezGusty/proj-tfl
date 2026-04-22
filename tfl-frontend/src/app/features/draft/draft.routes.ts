import { Routes } from '@angular/router';

export const DRAFT_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./draft-page/draft-page.component').then(m => m.DraftPageComponent) },
  { path: 'results', loadComponent: () => import('./team-results/team-results.component').then(m => m.TeamResultsComponent) },
];
