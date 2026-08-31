import type { Airline } from "../../domain/entities/Airline";
import type { AirlineRepository } from "../../domain/repositories/AirlineRepository";
import { defaultAirlines } from "../seed/defaultSeed";

export class InMemoryAirlineRepository implements AirlineRepository {
  private airlines: Airline[] = [...defaultAirlines];

  async findAll(): Promise<Airline[]> {
    return [...this.airlines];
  }

  async findById(id: string): Promise<Airline | null> {
    return this.airlines.find((a) => a.id === id) ?? null;
  }
}
