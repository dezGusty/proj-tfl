import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DraftApiService } from '../../../core/api/draft-api.service';
import { PlayersApiService } from '../../../core/api/players-api.service';

@Component({
  selector: 'app-draft-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="draft-page">
      <h2>Next Draft</h2>
      @if (draftApi.loading()) {
        <p>Loading...</p>
      } @else if (draftApi.draft()) {
        <p>{{ draftApi.draft()!.players.length }} players in draft</p>
        <ul>
          @for (p of draftApi.draft()!.players; track p.playerId) {
            <li>{{ p.playerName }} (Affinity: {{ p.affinity }})</li>
          }
        </ul>
        <button (click)="generateTeams()" [disabled]="draftApi.loading()">Generate Teams</button>
        <a routerLink="results">View Team Results</a>
      }
    </div>
  `,
  styles: [`.draft-page { padding: 1rem; } button { padding: 0.5rem 1rem; margin: 0.5rem; }`]
})
export class DraftPageComponent implements OnInit {
  draftApi = inject(DraftApiService);
  playersApi = inject(PlayersApiService);

  ngOnInit() { this.draftApi.loadDraft(); }

  async generateTeams() {
    const draft = this.draftApi.draft();
    if (!draft) return;
    await this.draftApi.generateTeams({ playerIds: draft.players.map(p => p.playerId) });
  }
}
