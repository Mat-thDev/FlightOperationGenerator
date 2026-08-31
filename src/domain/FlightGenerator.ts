import type { Aircraft } from "./entities/Aircraft";
import type { Airline } from "./entities/Airline";
import type { Flight } from "./entities/Flight";
import type { OperationProfile } from "./entities/OperationProfile";
import type { Route } from "./entities/Route";
import type { Logger } from "./logging/Logger";
import {
  isAircraftCompatibleWithProfile,
  isRouteCompatibleWithProfile,
} from "./rules/profileRules";

export interface FlightGeneratorCriteria {
  airlineIds?: string[];
  aircraftIds?: string[];
  originIcao?: string;
  destinationIcao?: string;
  profileId?: string;
}

export interface FlightGeneratorDeps {
  airlines: Airline[];
  aircraft: Aircraft[];
  routes: Route[];
  profiles: OperationProfile[];
}

export interface FlightGeneratorResult {
  flight: Flight | null;
  reason?: string;
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateFlightNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return String(num);
}

export function generateFlight(
  criteria: FlightGeneratorCriteria,
  deps: FlightGeneratorDeps,
  logger?: Logger,
): FlightGeneratorResult {
  // Seleção de perfil
  let candidatesProfiles = deps.profiles;
  if (criteria.profileId) {
    candidatesProfiles = candidatesProfiles.filter((p) => p.id === criteria.profileId);
  }
  if (candidatesProfiles.length === 0) {
    logger?.warn("flight_generation_no_profile", { criteria });
    return { flight: null, reason: "Nenhum perfil compatível encontrado." };
  }
  const profile = pickRandom(candidatesProfiles);

  // Candidatos de rota
  let candidateRoutes = deps.routes.filter((r) =>
    isRouteCompatibleWithProfile(r, profile),
  );

  if (criteria.originIcao) {
    candidateRoutes = candidateRoutes.filter((r) => r.originIcao === criteria.originIcao);
  }
  if (criteria.destinationIcao) {
    candidateRoutes = candidateRoutes.filter((r) => r.destinationIcao === criteria.destinationIcao);
  }
  if (criteria.airlineIds && criteria.airlineIds.length > 0) {
    candidateRoutes = candidateRoutes.filter(
      (r) => !r.airlineId || criteria.airlineIds!.includes(r.airlineId),
    );
  }

  if (candidateRoutes.length === 0) {
    logger?.warn("flight_generation_no_route", {
      profileId: profile.id,
      criteria,
    });
    return { flight: null, reason: "Nenhuma rota compatível com os critérios." };
  }

  const route = pickRandom(candidateRoutes);

  // Aeronaves compatíveis com perfil e frota da companhia se houver vínculo
  let candidateAircraft = deps.aircraft.filter((a) =>
    isAircraftCompatibleWithProfile(a, profile),
  );

  if (criteria.aircraftIds && criteria.aircraftIds.length > 0) {
    candidateAircraft = candidateAircraft.filter((a) =>
      criteria.aircraftIds!.includes(a.id),
    );
  }

  // Se rota tem airlineId, restringe à frota dela
  if (route.airlineId) {
    const airline = deps.airlines.find((al) => al.id === route.airlineId);
    if (airline) {
      candidateAircraft = candidateAircraft.filter((a) =>
        airline.fleet.includes(a.id),
      );
    }
  }

  // Se criteria tem airlineIds, restringe frota
  if (criteria.airlineIds && criteria.airlineIds.length > 0) {
    const allowedFleet = new Set(
      deps.airlines
        .filter((al) => criteria.airlineIds!.includes(al.id))
        .flatMap((al) => al.fleet),
    );
    candidateAircraft = candidateAircraft.filter((a) => allowedFleet.has(a.id));
  }

  if (candidateAircraft.length === 0) {
    logger?.warn("flight_generation_no_aircraft", {
      profileId: profile.id,
      routeId: route.id,
      criteria,
    });
    return { flight: null, reason: "Nenhuma aeronave compatível encontrada." };
  }

  const aircraft = pickRandom(candidateAircraft);

  // Determina companhia: da rota ou sorteio entre critérios/frota da aeronave
  let airlineId = route.airlineId;
  if (!airlineId) {
    if (criteria.airlineIds && criteria.airlineIds.length > 0) {
      const airlinesWithAircraft = deps.airlines.filter(
        (al) =>
          criteria.airlineIds!.includes(al.id) && al.fleet.includes(aircraft.id),
      );
      airlineId = airlinesWithAircraft.length > 0 ? pickRandom(airlinesWithAircraft).id : pickRandom(deps.airlines.filter((al) => al.fleet.includes(aircraft.id))).id;
    } else {
      const airlinesWithAircraft = deps.airlines.filter((al) =>
        al.fleet.includes(aircraft.id),
      );
      airlineId = airlinesWithAircraft.length > 0 ? pickRandom(airlinesWithAircraft).id : deps.airlines[0].id;
    }
  }

  // Fallback se ainda sem airlineId
  if (!airlineId) airlineId = deps.airlines[0].id;

  const flight: Flight = {
    id: crypto.randomUUID(),
    airlineId,
    flightNumber: generateFlightNumber(),
    originIcao: route.originIcao,
    destinationIcao: route.destinationIcao,
    aircraftId: aircraft.id,
    profileId: profile.id,
    distanceNM: route.distanceNM,
    precision: "Generated",
  };

  logger?.info("flight_generated", {
    flightId: flight.id,
    airlineId,
    routeId: route.id,
    aircraftId: aircraft.id,
    profileId: profile.id,
  });

  return { flight };
}
