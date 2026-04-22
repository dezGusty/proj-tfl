import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<span class="rating-badge" [class]="badgeClass()">{{ rating.toFixed(2) }}</span>`,
  styles: [`.rating-badge { padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.9rem; font-weight: bold; } .high { background: #28a745; color: white; } .mid { background: #ffc107; color: black; } .low { background: #dc3545; color: white; }`]
})
export class RatingBadgeComponent {
  @Input({ required: true }) rating!: number;

  badgeClass() {
    if (this.rating >= 5.5) return 'high';
    if (this.rating >= 4.5) return 'mid';
    return 'low';
  }
}
