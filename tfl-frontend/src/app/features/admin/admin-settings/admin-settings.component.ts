import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsApiService } from '../../../core/api/settings-api.service';

@Component({
  selector: 'app-admin-settings',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-settings">
      <h2>App Settings</h2>
      @if (settingsApi.settings()) {
        <form (ngSubmit)="save()">
          <label>Recent Matches to Store:
            <input type="number" [(ngModel)]="recentMatches" name="recentMatches" min="4" max="12">
          </label>
          <button type="submit">Save</button>
        </form>
        @if (saved) {
          <p class="saved">Settings saved!</p>
        }
      } @else {
        <p>Loading...</p>
      }
    </div>
  `,
  styles: [`.admin-settings { padding: 1rem; } label { display: block; margin: 0.5rem 0; } input { width: 80px; padding: 0.25rem; } button { padding: 0.5rem 1rem; margin-top: 1rem; } .saved { color: green; }`]
})
export class AdminSettingsComponent implements OnInit {
  settingsApi = inject(SettingsApiService);
  recentMatches = 6;
  saved = false;

  async ngOnInit() {
    await this.settingsApi.loadSettings();
    this.recentMatches = this.settingsApi.settings()?.recentMatchesToStore ?? 6;
  }

  async save() {
    const current = this.settingsApi.settings()!;
    await this.settingsApi.updateSettings({ ...current, recentMatchesToStore: this.recentMatches });
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }
}
