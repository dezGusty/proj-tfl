export interface Draft {
  id: number;
  players: DraftPlayer[];
  lastModified: string;
}

export interface DraftPlayer {
  playerId: number;
  playerName?: string;
  affinity: number;
}

export interface SaveDraftRequest { playerIds: number[]; }

export interface GenerateTeamsRequest {
  playerIds: number[];
  affinityOverrides?: { [playerId: number]: number };
}

export interface TeamCombination {
  rank: number;
  team1: TeamPlayer[];
  team2: TeamPlayer[];
  team1TotalRating: number;
  team2TotalRating: number;
  ratingDiffAbs: number;
}

export interface TeamPlayer {
  id: number;
  name: string;
  displayName?: string;
  rating: number;
}
