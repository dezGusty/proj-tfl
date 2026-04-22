import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../core/models/player.model';
import { RatingBadgeComponent } from '../rating-badge/rating-badge.component';
import { CopyClipboardDirective } from '../../directives/copy-clipboard.directive';

@Component({
  selector: 'app-player-card',
  standalone: true,
  imports: [CommonModule, RatingBadgeComponent, CopyClipboardDirective],
  template: `
    <div class="player-card">
      <span class="name">{{ player.displayName || player.name }}</span>
      <app-rating-badge [rating]="player.rating" />
      <span class="copy" [appCopyClipboard]="player.name" title="Copy name">📋</span>
    </div>
  `,
  styles: [`.player-card { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border: 1px solid #eee; border-radius: 4px; cursor: pointer; } .name { flex: 1; font-weight: bold; } .copy { cursor: pointer; font-size: 0.8rem; }`]
})
export class PlayerCardComponent {
  @Input({ required: true }) player!: Player;
}
