import { Injectable, computed, signal } from '@angular/core';
import { AppUser } from '../models/app-user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<AppUser | null>(null);

  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly isOrganizer = computed(() => this._currentUser()?.roles.includes('organizer') ?? false);
  readonly isAdmin = computed(() => this._currentUser()?.roles.includes('admin') ?? false);

  initialize(): void {
    const token = localStorage.getItem('tfl_token');
    if (token && !this.isTokenExpired(token)) {
      this._currentUser.set(this.parseToken(token));
    }
  }

  storeToken(token: string): void {
    localStorage.setItem('tfl_token', token);
    this._currentUser.set(this.parseToken(token));
  }

  signOut(): void {
    localStorage.removeItem('tfl_token');
    this._currentUser.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem('tfl_token');
  }

  private parseToken(token: string): AppUser | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return {
        id: payload.sub,
        email: payload.email,
        roles: Array.isArray(payload.roles) ? payload.roles : [payload.roles].filter(Boolean),
        approved: payload.approved === 'true',
        isActive: true
      };
    } catch {
      return null;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp < Math.floor(Date.now() / 1000);
    } catch {
      return true;
    }
  }
}
