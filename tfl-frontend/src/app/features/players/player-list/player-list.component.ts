import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlayersApiService } from '../../../core/api/players-api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PlayerCardComponent } from '../../../shared/components/player-card/player-card.component';
import { PlayerFilterPipe } from '../../../shared/pipes/player-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, RouterLink, PlayerCardComponent, PlayerFilterPipe, FormsModule],
  template: `
    <div class="player-list">
      <div class="header">
        <h2>Players</h2>
        @if (auth.isOrganizer()) {
          <a routerLink="new" class="btn-primary">Add Player</a>
        }
      </div>
      <input type="text" [(ngModel)]="searchTerm" placeholder="Filter players..." class="search-input">
      @if (playersApi.loading()) {
        <p>Loading...</p>
      } @else {
        <div class="player-grid">
          @for (player of playersApi.players() | playerFilter:searchTerm; track player.id) {
            <app-player-card [player]="player" [routerLink]="[player.id]" />
          }
        </div>
      }
    </div>
  `,
  styles: [`.player-list { padding: 1rem; } .header { display: flex; justify-content: space-between; align-items: center; } .btn-primary { padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; } .search-input { width: 100%; padding: 0.5rem; margin: 0.5rem 0; box-sizing: border-box; } .player-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }`]
})
export class PlayerListComponent implements OnInit {
  playersApi = inject(PlayersApiService);
  auth = inject(AuthService);
  searchTerm = '';

  ngOnInit() { this.playersApi.loadPlayers(); }
}
