import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatchesApiService } from '../../../core/api/matches-api.service';
import { Match } from '../../../core/models/match.model';

@Component({
  selector: 'app-match-detail',
  imports: [CommonModule, RouterLink],
  template: `
    @if (match()) {
      <div class="match-detail">
        <h2>Match: {{ match()!.dateKey }}</h2>
        <p>Score: {{ match()!.scoreTeam1 }} – {{ match()!.scoreTeam2 }}</p>
        <p>Status: {{ match()!.status }}</p>
        <div class="teams">
          <div>
            <h3>Team 1</h3>
            <ul>@for (p of team1(); track p.playerId) { <li>{{ p.playerName }}</li> }</ul>
          </div>
          <div>
            <h3>Team 2</h3>
            <ul>@for (p of team2(); track p.playerId) { <li>{{ p.playerName }}</li> }</ul>
          </div>
        </div>
        <a routerLink="..">Back</a>
      </div>
    }
  `,
  styles: [`.match-detail { padding: 1rem; } .teams { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }`]
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private matchesApi = inject(MatchesApiService);
  match = signal<Match | null>(null);
  team1 = signal<Match['players']>([]);
  team2 = signal<Match['players']>([]);

  async ngOnInit() {
    const dateKey = this.route.snapshot.paramMap.get('dateKey')!;
    const m = await this.matchesApi.getByDateKey(dateKey);
    this.match.set(m);
    this.team1.set(m.players.filter(p => p.team === 1));
    this.team2.set(m.players.filter(p => p.team === 2));
  }
}
