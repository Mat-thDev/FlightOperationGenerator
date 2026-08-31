import type { Aircraft } from "../entities/Aircraft";

export interface AircraftRepository {
  findAll(): Promise<Aircraft[]>;
  findById(id: string): Promise<Aircraft | null>;
}
