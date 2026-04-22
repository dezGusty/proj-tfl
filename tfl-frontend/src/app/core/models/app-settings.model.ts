export interface AppSettings {
  recentMatchesToStore: number;
  defaultMatchSchedule: MatchDaySchedule[];
}

export interface MatchDaySchedule {
  dayOfWeek: number;
  hour: number;
  minute: number;
}
