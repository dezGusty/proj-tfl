import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameEventsApiService } from '../../../core/api/game-events-api.service';

@Component({
  selector: 'app-game-events-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="game-events-list">
      <h2>Game Events</h2>
      <a routerLink="summary">View Summary Matrix</a>
      @if (gameEventsApi.loading()) {
        <p>Loading...</p>
      } @else {
        @for (evt of gameEventsApi.events(); track evt.name) {
          <div class="event-card">
            <a [routerLink]="[evt.name]">{{ evt.name }}</a>
            <span>{{ evt.date | date:'mediumDate' }}</span>
            <span>{{ evt.registrations.length }} registered</span>
          </div>
        }
      }
    </div>
  `,
  styles: [`.game-events-list { padding: 1rem; } .event-card { border: 1px solid #ccc; padding: 0.5rem; margin: 0.25rem; border-radius: 4px; display: flex; gap: 1rem; align-items: center; }`]
})
export class GameEventsListComponent implements OnInit {
  gameEventsApi = inject(GameEventsApiService);
  ngOnInit() { this.gameEventsApi.loadAll(); }
}
