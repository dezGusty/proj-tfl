import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SyncStatus, SyncConflict, SyncRunSummary, ResolveConflictRequest } from '../models/sync.model';

@Injectable({ providedIn: 'root' })
export class SyncApiService {
  private http = inject(HttpClient);

  private _status = signal<SyncStatus | null>(null);
  private _conflicts = signal<SyncConflict[]>([]);
  private _loading = signal(false);

  readonly status = this._status.asReadonly();
  readonly conflicts = this._conflicts.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadStatus(): Promise<void> {
    const result = await firstValueFrom(this.http.get<SyncStatus>('/api/sync/status'));
    this._status.set(result);
  }

  async loadConflicts(): Promise<void> {
    const result = await firstValueFrom(this.http.get<SyncConflict[]>('/api/sync/conflicts'));
    this._conflicts.set(result);
  }

  async syncAll(): Promise<{ [key: string]: SyncRunSummary }> {
    this._loading.set(true);
    try {
      return await firstValueFrom(this.http.post<{ [key: string]: SyncRunSummary }>('/api/sync', {}));
    } finally {
      this._loading.set(false);
      await this.loadStatus();
    }
  }

  async syncEntityType(entityType: string): Promise<SyncRunSummary> {
    return firstValueFrom(this.http.post<SyncRunSummary>(`/api/sync/${entityType}`, {}));
  }

  async resolveConflict(id: number, winner: 'sqlite' | 'firestore'): Promise<void> {
    await firstValueFrom(this.http.put<void>(`/api/sync/conflicts/${id}/resolve`, { winner } as ResolveConflictRequest));
    this._conflicts.update(list => list.filter(c => c.id !== id));
  }
}
