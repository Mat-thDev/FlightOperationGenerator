export interface Airline {
  id: string;
  name: string;
  icao: string;
  iata: string;
  callsign: string;
  fleet: string[]; // Aircraft ids
  country: string;
}
