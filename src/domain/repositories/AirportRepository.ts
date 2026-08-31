import type { Airport } from "../entities/Airport";

export interface AirportRepository {
  findAll(): Promise<Airport[]>;
  findById(icao: string): Promise<Airport | null>;
}
