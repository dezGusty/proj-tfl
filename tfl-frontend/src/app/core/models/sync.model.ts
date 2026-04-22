export interface SyncStatus {
  lastSyncAt: { [entityType: string]: string | null };
  unresolvedConflicts: number;
  lastRunSummaries: { [entityType: string]: SyncRunSummary | null };
}

export interface SyncRunSummary {
  created: number;
  updated: number;
  skipped: number;
  conflicts: number;
  softDeleted: number;
  durationMs: number;
}

export interface SyncConflict {
  id: number;
  entityType: string;
  entityKey: string;
  sqliteSnapshot: unknown;
  firestoreSnapshot: unknown;
  detectedAt: string;
}

export interface ResolveConflictRequest { winner: 'sqlite' | 'firestore'; }
