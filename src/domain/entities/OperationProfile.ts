import type { AircraftCategory } from "./Aircraft";

export interface OperationProfile {
  id: string;
  name: string;
  description: string;
  distance: {
    minNM: number;
    maxNM: number;
  };
  allowedCategories: AircraftCategory[];
  region?: string; // ex: "domestic" - por enquanto só doméstico
}
