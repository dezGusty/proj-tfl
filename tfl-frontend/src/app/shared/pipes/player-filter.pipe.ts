import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../core/models/player.model';

@Pipe({ name: 'playerFilter', standalone: true })
export class PlayerFilterPipe implements PipeTransform {
  transform(players: Player[], searchTerm: string): Player[] {
    if (!searchTerm) return players;
    const lower = searchTerm.toLowerCase();
    return players.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      (p.displayName?.toLowerCase().includes(lower) ?? false)
    );
  }
}
