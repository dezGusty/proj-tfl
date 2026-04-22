import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayersApiService } from '../../../core/api/players-api.service';
import { Player } from '../../../core/models/player.model';
import { RatingBadgeComponent } from '../../../shared/components/rating-badge/rating-badge.component';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, RatingBadgeComponent],
  template: `
    @if (player()) {
      <div class="player-detail">
        <h2>{{ player()!.displayName || player()!.name }}</h2>
        <app-rating-badge [rating]="player()!.rating" />
        <p>Affinity: {{ player()!.affinity }}</p>
        <p>Status: {{ player()!.archived ? 'Archived' : 'Active' }}</p>
        <h3>Recent Results</h3>
        <ul>
          @for (entry of player()!.recentEntries; track entry.sortOrder) {
            <li>{{ entry.matchDate }}: {{ entry.diff > 0 ? '+' : '' }}{{ entry.diff.toFixed(3) }}</li>
          }
        </ul>
        <a routerLink="../..">Back to Players</a>
      </div>
    } @else {
      <p>Loading...</p>
    }
  `,
  styles: [`.player-detail { padding: 1rem; }`]
})
export class PlayerDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private playersApi = inject(PlayersApiService);
  player = signal<Player | null>(null);

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.player.set(await this.playersApi.getById(id));
  }
}
