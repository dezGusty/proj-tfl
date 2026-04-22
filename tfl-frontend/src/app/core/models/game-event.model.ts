export interface GameEvent {
  name: string;
  date: string;
  isActive: boolean;
  registrations: Registration[];
}

export interface Registration {
  playerId: number;
  playerName?: string;
  registeredAt: string;
}

export interface CreateGameEventRequest { name: string; date: string; }
export interface UpdateGameEventRequest { name: string; date: string; isActive: boolean; }
