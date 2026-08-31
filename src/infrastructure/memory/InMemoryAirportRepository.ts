import type { Airport } from "../../domain/entities/Airport";
import type { AirportRepository } from "../../domain/repositories/AirportRepository";
import { defaultAirports } from "../seed/defaultSeed";

export class InMemoryAirportRepository implements AirportRepository {
  private airports: Airport[] = [...defaultAirports];

  async findAll(): Promise<Airport[]> {
    return [...this.airports];
  }

  async findById(icao: string): Promise<Airport | null> {
    return this.airports.find((a) => a.icao === icao) ?? null;
  }
}
