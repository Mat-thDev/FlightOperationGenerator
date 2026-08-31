export type AircraftCategory = "narrowbody" | "regional" | "widebody";

export interface Aircraft {
  id: string;
  model: string;
  icaoType: string;
  category: AircraftCategory;
  rangeNM: number;
}
