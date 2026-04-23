import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SyncApiService } from '../../../core/api/sync-api.service';

@Component({
  selector: 'app-sync-page',
  imports: [CommonModule],
  template: `
    <div class="sync-page">
      <h2>Firebase Sync</h2>
      @if (syncApi.status()) {
        <div class="status-panel">
          <h3>Last Sync Times</h3>
          @for (entry of getEntries(); track entry.key) {
            <div>{{ entry.key }}: {{ entry.value ? (entry.value | date:'medium') : 'Never' }}</div>
          }
          <p>Unresolved conflicts: {{ syncApi.status()!.unresolvedConflicts }}</p>
        </div>
      }
      <div class="controls">
        <button (click)="syncAll()" [disabled]="syncApi.loading()">
          {{ syncApi.loading() ? 'Syncing...' : 'Sync All' }}
        </button>
        @for (entityType of entityTypes; track entityType) {
          <button (click)="syncOne(entityType)" [disabled]="syncApi.loading()">Sync {{ entityType }}</button>
        }
      </div>
      @if (syncApi.conflicts().length > 0) {
        <div class="conflicts">
          <h3>Conflicts</h3>
          @for (conflict of syncApi.conflicts(); track conflict.id) {
            <div class="conflict">
              <p>{{ conflict.entityType }} / {{ conflict.entityKey }}</p>
              <button (click)="resolve(conflict.id, 'sqlite')">Use SQLite</button>
              <button (click)="resolve(conflict.id, 'firestore')">Use Firebase</button>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`.sync-page { padding: 1rem; } .controls { margin: 1rem 0; } button { margin: 0.25rem; padding: 0.5rem 1rem; } .conflict { border: 1px solid orange; padding: 0.5rem; margin: 0.25rem; border-radius: 4px; }`]
})
export class SyncPageComponent implements OnInit {
  syncApi = inject(SyncApiService);
  entityTypes = ['players', 'matches', 'game-events', 'draft'];

  ngOnInit() {
    this.syncApi.loadStatus();
    this.syncApi.loadConflicts();
  }

  async syncAll() {
    await this.syncApi.syncAll();
    this.syncApi.loadConflicts();
  }

  async syncOne(entityType: string) {
    await this.syncApi.syncEntityType(entityType);
    await this.syncApi.loadStatus();
  }

  async resolve(id: number, winner: 'sqlite' | 'firestore') {
    await this.syncApi.resolveConflict(id, winner);
  }

  getEntries(): { key: string; value: string | null }[] {
    const status = this.syncApi.status();
    if (!status) return [];
    return Object.entries(status.lastSyncAt).map(([key, value]) => ({ key, value }));
  }
}
