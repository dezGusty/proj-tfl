import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Player, CreatePlayerRequest, UpdatePlayerRequest, ArchivePlayerRequest, RatingAdjustmentRequest } from '../models/player.model';

@Injectable({ providedIn: 'root' })
export class PlayersApiService {
  private http = inject(HttpClient);

  private _players = signal<Player[]>([]);
  private _loading = signal(false);

  readonly players = this._players.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadPlayers(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get<Player[]>('/api/players'));
      this._players.set(result);
    } finally {
      this._loading.set(false);
    }
  }

  async loadArchived(): Promise<Player[]> {
    return firstValueFrom(this.http.get<Player[]>('/api/players/archived'));
  }

  async getById(id: number): Promise<Player> {
    return firstValueFrom(this.http.get<Player>(`/api/players/${id}`));
  }

  async createPlayer(request: CreatePlayerRequest): Promise<Player> {
    const player = await firstValueFrom(this.http.post<Player>('/api/players', request));
    this._players.update(list => [...list, player]);
    return player;
  }

  async updatePlayer(id: number, request: UpdatePlayerRequest): Promise<Player> {
    const player = await firstValueFrom(this.http.put<Player>(`/api/players/${id}`, request));
    this._players.update(list => list.map(p => p.id === id ? player : p));
    return player;
  }

  async archivePlayer(id: number, archived: boolean): Promise<Player> {
    const player = await firstValueFrom(this.http.patch<Player>(`/api/players/${id}/archive`, { archived } as ArchivePlayerRequest));
    this._players.update(list => archived ? list.filter(p => p.id !== id) : [...list, player]);
    return player;
  }

  async adjustRating(id: number, request: RatingAdjustmentRequest): Promise<Player> {
    const player = await firstValueFrom(this.http.patch<Player>(`/api/players/${id}/rating`, request));
    this._players.update(list => list.map(p => p.id === id ? player : p));
    return player;
  }
}
