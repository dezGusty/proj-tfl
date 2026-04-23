import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

interface NavCard {
  label: string;
  description: string;
  route: string;
  icon: string;
}

const AUTHENTICATED_CARDS: NavCard[] = [
  { label: 'Players', description: 'Browse and manage the player roster with ratings.', route: '/players', icon: '👥' },
  { label: 'Draft', description: 'Build and balance teams for the next match.', route: '/nextdraft', icon: '📋' },
  { label: 'Games', description: 'View upcoming game events and register players.', route: '/games', icon: '📅' },
  { label: 'Recent', description: 'Review recent match results and score history.', route: '/recent', icon: '🏆' },
];

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home-page">
      <section class="hero" aria-labelledby="hero-heading">
        <span class="hero-icon" aria-hidden="true">⚽</span>
        <h1 id="hero-heading">Thursday Football League</h1>
        <p class="hero-tagline">
          Organise weekly matches, balance teams, track player ratings and results —
          all in one place.
        </p>

        @if (!isAuthenticated()) {
          <a routerLink="/signin" class="cta-btn">Sign in with Google to get started</a>
        }
      </section>

      @if (isAuthenticated()) {
        <section class="nav-cards" aria-label="Quick navigation">
          @for (card of cards; track card.route) {
            <a [routerLink]="card.route" class="nav-card">
              <span class="card-icon" aria-hidden="true">{{ card.icon }}</span>
              <div class="card-body">
                <h2 class="card-title">{{ card.label }}</h2>
                <p class="card-desc">{{ card.description }}</p>
              </div>
            </a>
          }
          @if (isAdmin()) {
            <a routerLink="/admin" class="nav-card nav-card--admin">
              <span class="card-icon" aria-hidden="true">⚙️</span>
              <div class="card-body">
                <h2 class="card-title">Admin</h2>
                <p class="card-desc">Manage users, settings, and data sync.</p>
              </div>
            </a>
          }
        </section>
      } @else {
        <section class="features" aria-label="Application features">
          <div class="feature">
            <span aria-hidden="true">📊</span>
            <h2>Player Ratings</h2>
            <p>Track each player's ability with a dynamic rating that updates after every match.</p>
          </div>
          <div class="feature">
            <span aria-hidden="true">⚖️</span>
            <h2>Balanced Teams</h2>
            <p>Automatically generate fair two-team splits from any set of available players.</p>
          </div>
          <div class="feature">
            <span aria-hidden="true">📅</span>
            <h2>Game Events</h2>
            <p>Schedule matches, manage player registrations, and keep everyone informed.</p>
          </div>
        </section>
      }
    </div>
  `,
  styles: [`
    .home-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem 3rem;
    }

    .hero {
      text-align: center;
      padding: 3rem 1rem 2.5rem;
    }

    .hero-icon {
      font-size: 3.5rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .hero h1 {
      font-size: clamp(1.75rem, 5vw, 2.75rem);
      color: var(--color-text);
      margin-bottom: 1rem;
    }

    .hero-tagline {
      font-size: 1.1rem;
      color: var(--color-text-muted);
      max-width: 520px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .cta-btn {
      display: inline-block;
      padding: 0.75rem 1.75rem;
      background: var(--color-primary);
      color: #fff;
      text-decoration: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      transition: background 0.15s;
    }

    .cta-btn:hover {
      background: var(--color-primary-dark);
    }

    /* Nav cards (authenticated) */
    .nav-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .nav-card {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1.25rem;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      text-decoration: none;
      color: var(--color-text);
      transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
    }

    .nav-card:hover {
      border-color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .nav-card--admin {
      border-color: #d1d5db;
      background: #f9fafb;
    }

    .card-icon {
      font-size: 1.75rem;
      flex-shrink: 0;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .card-desc {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.4;
    }

    /* Feature grid (unauthenticated) */
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .feature {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 0.75rem;
      padding: 1.5rem;
      text-align: center;
    }

    .feature span {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.75rem;
    }

    .feature h2 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .feature p {
      font-size: 0.875rem;
      color: var(--color-text-muted);
      margin: 0;
    }
  `],
})
export class AboutComponent {
  private authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly isAdmin = this.authService.isAdmin;
  readonly cards = AUTHENTICATED_CARDS;
}

