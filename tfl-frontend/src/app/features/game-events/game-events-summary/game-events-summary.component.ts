import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameEventsApiService } from '../../../core/api/game-events-api.service';

@Component({
  selector: 'app-game-events-summary',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="summary-page">
      <h2>Game Events Summary</h2>
      <a routerLink="..">Back</a>
      <p>Summary matrix coming soon.</p>
    </div>
  `,
  styles: [`.summary-page { padding: 1rem; }`]
})
export class GameEventsSummaryComponent implements OnInit {
  private gameEventsApi = inject(GameEventsApiService);
  summary = signal<unknown>(null);
  ngOnInit() { this.gameEventsApi.getSummary().then(s => this.summary.set(s)); }
}
