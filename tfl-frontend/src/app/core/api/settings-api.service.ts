import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppSettings } from '../models/app-settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsApiService {
  private http = inject(HttpClient);

  private _settings = signal<AppSettings | null>(null);
  readonly settings = this._settings.asReadonly();

  async loadSettings(): Promise<void> {
    const result = await firstValueFrom(this.http.get<AppSettings>('/api/settings'));
    this._settings.set(result);
  }

  async updateSettings(settings: AppSettings): Promise<AppSettings> {
    const result = await firstValueFrom(this.http.put<AppSettings>('/api/settings', settings));
    this._settings.set(result);
    return result;
  }
}
