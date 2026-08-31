export interface Route {
  id: string;
  originIcao: string;
  destinationIcao: string;
  airlineId?: string;
  distanceNM: number;
}
