import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { GameEvent, CreateGameEventRequest, UpdateGameEventRequest } from '../models/game-event.model';

@Injectable({ providedIn: 'root' })
export class GameEventsApiService {
  private http = inject(HttpClient);

  private _events = signal<GameEvent[]>([]);
  private _loading = signal(false);

  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadAll(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get<GameEvent[]>('/api/game-events'));
      this._events.set(result);
    } finally {
      this._loading.set(false);
    }
  }

  async getByName(name: string): Promise<GameEvent> {
    return firstValueFrom(this.http.get<GameEvent>(`/api/game-events/${encodeURIComponent(name)}`));
  }

  async create(request: CreateGameEventRequest): Promise<GameEvent> {
    const evt = await firstValueFrom(this.http.post<GameEvent>('/api/game-events', request));
    this._events.update(list => [...list, evt]);
    return evt;
  }

  async update(name: string, request: UpdateGameEventRequest): Promise<GameEvent> {
    return firstValueFrom(this.http.put<GameEvent>(`/api/game-events/${encodeURIComponent(name)}`, request));
  }

  async join(name: string): Promise<void> {
    await firstValueFrom(this.http.post<void>(`/api/game-events/${encodeURIComponent(name)}/join`, {}));
  }

  async leave(name: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`/api/game-events/${encodeURIComponent(name)}/join`));
  }

  async transferToDraft(name: string): Promise<unknown> {
    return firstValueFrom(this.http.post(`/api/game-events/${encodeURIComponent(name)}/transfer-to-draft`, {}));
  }

  async getSummary(): Promise<unknown> {
    return firstValueFrom(this.http.get('/api/game-events/summary'));
  }
}
