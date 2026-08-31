import type { Flight } from "../domain/entities/Flight";
import { generateFlight, type FlightGeneratorCriteria } from "../domain/FlightGenerator";
import type { Logger } from "../domain/logging/Logger";
import type { AircraftRepository } from "../domain/repositories/AircraftRepository";
import type { AirlineRepository } from "../domain/repositories/AirlineRepository";
import type { FlightHistoryRepository } from "../domain/repositories/FlightHistoryRepository";
import type { OperationProfileRepository } from "../domain/repositories/OperationProfileRepository";
import type { RouteRepository } from "../domain/repositories/RouteRepository";

export interface GenerateFlightDeps {
  airlineRepo: AirlineRepository;
  aircraftRepo: AircraftRepository;
  routeRepo: RouteRepository;
  profileRepo: OperationProfileRepository;
  historyRepo: FlightHistoryRepository;
  logger: Logger;
}

export async function generateFlightUseCase(
  criteria: FlightGeneratorCriteria,
  deps: GenerateFlightDeps,
): Promise<Flight | null> {
  deps.logger.info("generate_flight_started", { criteria } as unknown as Record<string, unknown>);

  try {
    const [airlines, aircraft, routes, profiles] = await Promise.all([
      deps.airlineRepo.findAll(),
      deps.aircraftRepo.findAll(),
      deps.routeRepo.findAll(),
      deps.profileRepo.findAll(),
    ]);

    deps.logger.info("seed_loaded", {
      airlines: airlines.length,
      aircraft: aircraft.length,
      routes: routes.length,
      profiles: profiles.length,
    });

    const result = generateFlight(criteria, { airlines, aircraft, routes, profiles }, deps.logger);

    if (!result.flight) {
      deps.logger.warn("generate_flight_no_result", { reason: result.reason, criteria } as unknown as Record<string, unknown>);
      return null;
    }

    await deps.historyRepo.save(result.flight);

    deps.logger.info("flight_saved_to_history", {
      flightId: result.flight.id,
      flightNumber: result.flight.flightNumber,
      origin: result.flight.originIcao,
      destination: result.flight.destinationIcao,
    });

    return result.flight;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    deps.logger.error("generate_flight_failed", { message, criteria } as unknown as Record<string, unknown>);
    throw err;
  }
}
