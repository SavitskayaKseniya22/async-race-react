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

export interface CarStartedResponse {
  code: number;
  message: EngineDataType;
}

export interface EngineDataType {
  velocity: number;
  distance: number;
}

export enum CarStatusType {
  STARTED = "started",
  STOPPED = "stopped",
  DRIVE = "drive",
}
