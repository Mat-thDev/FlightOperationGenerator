import type { Flight } from "../entities/Flight";

export interface FlightHistoryRepository {
  findAll(): Promise<Flight[]>;
  save(flight: Flight): Promise<void>;
}
