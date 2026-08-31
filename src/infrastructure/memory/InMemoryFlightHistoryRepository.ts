import type { Flight } from "../../domain/entities/Flight";
import type { FlightHistoryRepository } from "../../domain/repositories/FlightHistoryRepository";

export class InMemoryFlightHistoryRepository implements FlightHistoryRepository {
  private flights: Flight[] = [];

  async findAll(): Promise<Flight[]> {
    return [...this.flights];
  }

  async save(flight: Flight): Promise<void> {
    this.flights.unshift(flight);
  }
}
