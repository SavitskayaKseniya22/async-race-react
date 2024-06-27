export interface CarType {
  id: number;
  wins: number;
  time: number;
  name: string;
  color: string;
}

export enum WinnersSortType {
  NAME = "name",
  WINS = "wins",
  TIME = "time",
}

export enum WinnersOrderType {
  DESC = "desc",
  ASC = "ask",
}
