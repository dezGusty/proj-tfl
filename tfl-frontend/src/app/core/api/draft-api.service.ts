import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Draft, SaveDraftRequest, GenerateTeamsRequest, TeamCombination } from '../models/draft.model';

@Injectable({ providedIn: 'root' })
export class DraftApiService {
  private http = inject(HttpClient);

  private _draft = signal<Draft | null>(null);
  private _combinations = signal<TeamCombination[]>([]);
  private _loading = signal(false);

  readonly draft = this._draft.asReadonly();
  readonly combinations = this._combinations.asReadonly();
  readonly loading = this._loading.asReadonly();

  async loadDraft(): Promise<void> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.get<Draft>('/api/draft'));
      this._draft.set(result);
    } finally {
      this._loading.set(false);
    }
  }

  async saveDraft(request: SaveDraftRequest): Promise<Draft> {
    const draft = await firstValueFrom(this.http.put<Draft>('/api/draft', request));
    this._draft.set(draft);
    return draft;
  }

  async generateTeams(request: GenerateTeamsRequest): Promise<TeamCombination[]> {
    this._loading.set(true);
    try {
      const result = await firstValueFrom(this.http.post<TeamCombination[]>('/api/draft/generate-teams', request));
      this._combinations.set(result);
      return result;
    } finally {
      this._loading.set(false);
    }
  }
}
