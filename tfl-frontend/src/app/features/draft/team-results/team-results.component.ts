import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DraftApiService } from '../../../core/api/draft-api.service';

@Component({
  selector: 'app-team-results',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="team-results">
      <h2>Team Combinations</h2>
      <a routerLink="..">Back to Draft</a>
      @for (combo of draftApi.combinations(); track combo.rank) {
        <div class="combo">
          <h3>Option {{ combo.rank }} — Diff: {{ combo.ratingDiffAbs.toFixed(3) }}</h3>
          <div class="teams">
            <div>
              <strong>Team 1 ({{ combo.team1TotalRating.toFixed(2) }})</strong>
              <ul>@for (p of combo.team1; track p.id) { <li>{{ p.displayName || p.name }}</li> }</ul>
            </div>
            <div>
              <strong>Team 2 ({{ combo.team2TotalRating.toFixed(2) }})</strong>
              <ul>@for (p of combo.team2; track p.id) { <li>{{ p.displayName || p.name }}</li> }</ul>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`.team-results { padding: 1rem; } .combo { border: 1px solid #ccc; margin: 0.5rem; padding: 1rem; border-radius: 4px; } .teams { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }`]
})
export class TeamResultsComponent {
  draftApi = inject(DraftApiService);
}
