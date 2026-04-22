import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchesApiService } from '../../../core/api/matches-api.service';

@Component({
  selector: 'app-match-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="match-history">
      <h2>Recent Matches</h2>
      @if (matchesApi.loading()) {
        <p>Loading...</p>
      } @else {
        @for (match of matchesApi.matches(); track match.dateKey) {
          <div class="match-card" [routerLink]="[match.dateKey]">
            <span>{{ match.dateKey }}</span>
            <span>{{ match.scoreTeam1 }} – {{ match.scoreTeam2 }}</span>
            <span class="status">{{ match.status }}</span>
          </div>
        }
      }
    </div>
  `,
  styles: [`.match-history { padding: 1rem; } .match-card { border: 1px solid #ccc; padding: 0.5rem; margin: 0.25rem; border-radius: 4px; display: flex; gap: 1rem; cursor: pointer; } .status { margin-left: auto; }`]
})
export class MatchHistoryComponent implements OnInit {
  matchesApi = inject(MatchesApiService);
  ngOnInit() { this.matchesApi.loadRecent(); }
}
