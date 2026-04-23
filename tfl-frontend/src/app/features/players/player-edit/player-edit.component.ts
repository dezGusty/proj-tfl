import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlayersApiService } from '../../../core/api/players-api.service';
import { Player } from '../../../core/models/player.model';

@Component({
  selector: 'app-player-edit',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    @if (player()) {
      <div class="player-edit">
        <h2>Edit Player</h2>
        <form (ngSubmit)="save()">
          <label>Name <input type="text" [(ngModel)]="name" name="name" required></label>
          <label>Display Name <input type="text" [(ngModel)]="displayName" name="displayName"></label>
          <label>Affinity
            <select [(ngModel)]="affinity" name="affinity">
              <option [value]="0">None</option>
              <option [value]="1">Team 1</option>
              <option [value]="2">Team 2</option>
            </select>
          </label>
          <button type="submit">Save</button>
          <a routerLink="..">Cancel</a>
        </form>
      </div>
    }
  `,
  styles: [`.player-edit { padding: 1rem; } label { display: block; margin: 0.5rem 0; } input, select { width: 100%; padding: 0.25rem; } button { margin-top: 1rem; padding: 0.5rem 1rem; }`]
})
export class PlayerEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private playersApi = inject(PlayersApiService);
  player = signal<Player | null>(null);
  name = '';
  displayName = '';
  affinity = 0;

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const p = await this.playersApi.getById(id);
    this.player.set(p);
    this.name = p.name;
    this.displayName = p.displayName ?? '';
    this.affinity = p.affinity;
  }

  async save() {
    const id = this.player()!.id;
    await this.playersApi.updatePlayer(id, { name: this.name, displayName: this.displayName, affinity: this.affinity });
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
