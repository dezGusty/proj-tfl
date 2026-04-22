export interface AppUser {
  id: string;
  email: string;
  photoUrl?: string;
  roles: string[];
  approved: boolean;
  isActive: boolean;
  linkedPlayerId?: number;
}

export interface ApproveUserRequest { approved: boolean; }
export interface UpdateRolesRequest { roles: string[]; }
export interface LinkPlayerRequest { playerId: number; }
