import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Match, CreateMatchRequest, UpdateMatchRequest } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchesApiService {
  private http = inject(HttpClient);

  private _matches = signal<Match[]>([]);
  private _loading = signal(false);

  readonly matches = this._matches.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadRecent(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get<Match[]>('/api/matches/recent'));
      this._matches.set(result);
    } finally {
      this._loading.set(false);
    }
  }

  async getByDateKey(dateKey: string): Promise<Match> {
    return firstValueFrom(this.http.get<Match>(`/api/matches/${dateKey}`));
  }

  async createMatch(request: CreateMatchRequest): Promise<Match> {
    return firstValueFrom(this.http.post<Match>('/api/matches', request));
  }

  async updateMatch(dateKey: string, request: UpdateMatchRequest): Promise<Match> {
    return firstValueFrom(this.http.put<Match>(`/api/matches/${dateKey}`, request));
  }
}
