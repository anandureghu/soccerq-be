export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  datetime: string;
  court: string;
  goal_team1: number;
  goal_team2: number;
  team1: Team;
  team2: Team;
}
