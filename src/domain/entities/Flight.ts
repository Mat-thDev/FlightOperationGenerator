import type { Precision } from "./Precision";

export interface Flight {
  id: string;
  airlineId: string;
  flightNumber: string;
  originIcao: string;
  destinationIcao: string;
  aircraftId: string;
  profileId: string;
  distanceNM: number;
  precision: Precision;
}
