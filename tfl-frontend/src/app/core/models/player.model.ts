export interface Player {
  id: number;
  name: string;
  displayName?: string;
  rating: number;
  affinity: number;
  archived: boolean;
  lastModified: string;
  recentEntries: RecentEntry[];
  linkedUserId?: string;
}

export interface RecentEntry {
  matchDate: string;
  diff: number;
  entryType: string;
  sortOrder: number;
}

export interface CreatePlayerRequest { name: string; displayName?: string; }
export interface UpdatePlayerRequest { name: string; displayName?: string; affinity: number; }
export interface ArchivePlayerRequest { archived: boolean; }
export interface RatingAdjustmentRequest { adjustment: number; note?: string; }
