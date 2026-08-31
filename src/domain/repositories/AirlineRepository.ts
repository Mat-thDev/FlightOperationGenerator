import type { Airline } from "../entities/Airline";

export interface AirlineRepository {
  findAll(): Promise<Airline[]>;
  findById(id: string): Promise<Airline | null>;
}
