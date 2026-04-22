import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameEventsApiService } from '../../../core/api/game-events-api.service';
import { GameEvent } from '../../../core/models/game-event.model';

@Component({
  selector: 'app-game-event-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (event()) {
      <div class="event-detail">
        <h2>{{ event()!.name }}</h2>
        <p>Date: {{ event()!.date | date:'mediumDate' }}</p>
        <p>Status: {{ event()!.isActive ? 'Active' : 'Closed' }}</p>
        <h3>Registrations ({{ event()!.registrations.length }})</h3>
        <ul>
          @for (r of event()!.registrations; track r.playerId) {
            <li>{{ r.playerName }}</li>
          }
        </ul>
        @if (event()!.isActive) {
          <button (click)="join()">Join</button>
          <button (click)="leave()">Leave</button>
        }
        <a routerLink="..">Back</a>
      </div>
    }
  `,
  styles: [`.event-detail { padding: 1rem; } button { margin: 0.25rem; padding: 0.5rem 1rem; }`]
})
export class GameEventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gameEventsApi = inject(GameEventsApiService);
  event = signal<GameEvent | null>(null);

  async ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name')!;
    this.event.set(await this.gameEventsApi.getByName(name));
  }

  async join() {
    const name = this.event()!.name;
    await this.gameEventsApi.join(name);
    this.event.set(await this.gameEventsApi.getByName(name));
  }

  async leave() {
    const name = this.event()!.name;
    await this.gameEventsApi.leave(name);
    this.event.set(await this.gameEventsApi.getByName(name));
  }
}
