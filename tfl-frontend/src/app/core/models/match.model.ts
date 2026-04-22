export interface Match {
  dateKey: string;
  scoreTeam1: number;
  scoreTeam2: number;
  status: string;
  appliedResults: boolean;
  lastModified: string;
  players: MatchPlayer[];
}

export interface MatchPlayer {
  playerId: number;
  playerName?: string;
  team: number;
  ratingDiff?: number;
}

export interface CreateMatchRequest {
  dateKey: string;
  scoreTeam1: number;
  scoreTeam2: number;
  status: string;
  playerIds: { playerId: number; team: number }[];
}

export interface UpdateMatchRequest {
  scoreTeam1: number;
  scoreTeam2: number;
  status: string;
  appliedResults: boolean;
}
