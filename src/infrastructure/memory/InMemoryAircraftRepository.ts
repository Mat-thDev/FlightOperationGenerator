import type { Aircraft } from "../../domain/entities/Aircraft";
import type { AircraftRepository } from "../../domain/repositories/AircraftRepository";
import { defaultAircraft } from "../seed/defaultSeed";

export class InMemoryAircraftRepository implements AircraftRepository {
  private aircraft: Aircraft[] = [...defaultAircraft];

  async findAll(): Promise<Aircraft[]> {
    return [...this.aircraft];
  }

  async findById(id: string): Promise<Aircraft | null> {
    return this.aircraft.find((a) => a.id === id) ?? null;
  }
}
