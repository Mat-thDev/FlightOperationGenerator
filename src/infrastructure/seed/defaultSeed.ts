import type { Airline } from "../../domain/entities/Airline";
import type { Aircraft } from "../../domain/entities/Aircraft";
import type { Airport } from "../../domain/entities/Airport";
import type { Route } from "../../domain/entities/Route";
import type { OperationProfile } from "../../domain/entities/OperationProfile";

export const defaultAircraft: Aircraft[] = [
  { id: "b733", model: "Boeing 737-300", icaoType: "B733", category: "narrowbody", rangeNM: 2300 },
  { id: "b738", model: "Boeing 737-800", icaoType: "B738", category: "narrowbody", rangeNM: 2900 },
  { id: "a320", model: "Airbus A320-200", icaoType: "A320", category: "narrowbody", rangeNM: 3200 },
];

export const defaultAirlines: Airline[] = [
  { id: "vrg", name: "VARIG", icao: "VRG", iata: "RG", callsign: "VARIG", fleet: ["b733", "b738"], country: "BR" },
  { id: "tam", name: "LATAM Brasil", icao: "TAM", iata: "JJ", callsign: "TAM", fleet: ["a320", "b738"], country: "BR" },
  { id: "azu", name: "Azul Linhas Aéreas", icao: "AZU", iata: "AD", callsign: "AZUL", fleet: ["a320"], country: "BR" },
];

export const defaultAirports: Airport[] = [
  { icao: "SBGO", iata: "GYN", name: "Santa Genoveva", city: "Goiânia", country: "BR", region: "Centro-Oeste", lat: -16.632, lon: -49.22 },
  { icao: "SBBR", iata: "BSB", name: "Pres. Juscelino Kubitschek", city: "Brasília", country: "BR", region: "Centro-Oeste", lat: -15.871, lon: -47.918 },
  { icao: "SBGL", iata: "GIG", name: "Galeão - Antônio Carlos Jobim", city: "Rio de Janeiro", country: "BR", region: "Sudeste", lat: -22.81, lon: -43.25 },
  { icao: "SBGR", iata: "GRU", name: "Guarulhos - Gov. André Franco Montoro", city: "São Paulo", country: "BR", region: "Sudeste", lat: -23.435, lon: -46.473 },
  { icao: "SBSP", iata: "CGH", name: "Congonhas", city: "São Paulo", country: "BR", region: "Sudeste", lat: -23.626, lon: -46.655 },
];

export const defaultProfiles: OperationProfile[] = [
  {
    id: "domestic-short-haul",
    name: "Domestic Short Haul",
    description: "Operação doméstica curta, ideal para narrowbody em trechos regionais.",
    distance: { minNM: 100, maxNM: 600 },
    allowedCategories: ["narrowbody", "regional"],
    region: "domestic",
  },
  {
    id: "domestic-routine",
    name: "Domestic Routine",
    description: "Operação doméstica rotineira de média distância.",
    distance: { minNM: 400, maxNM: 900 },
    allowedCategories: ["narrowbody"],
    region: "domestic",
  },
];

// Distâncias aproximadas reais (NM) para plausibilidade
export const defaultRoutes: Route[] = [
  { id: "r1", originIcao: "SBGR", destinationIcao: "SBGL", distanceNM: 180, airlineId: "vrg" },
  { id: "r2", originIcao: "SBGR", destinationIcao: "SBBR", distanceNM: 470, airlineId: "tam" },
  { id: "r3", originIcao: "SBSP", destinationIcao: "SBBR", distanceNM: 480, airlineId: "azu" },
  { id: "r4", originIcao: "SBGO", destinationIcao: "SBBR", distanceNM: 110 },
  { id: "r5", originIcao: "SBGR", destinationIcao: "SBGO", distanceNM: 440 },
  { id: "r6", originIcao: "SBSP", destinationIcao: "SBGL", distanceNM: 190 },
  { id: "r7", originIcao: "SBGO", destinationIcao: "SBGR", distanceNM: 440, airlineId: "tam" },
  { id: "r8", originIcao: "SBGL", destinationIcao: "SBBR", distanceNM: 500, airlineId: "vrg" },
  { id: "r9", originIcao: "SBBR", destinationIcao: "SBGO", distanceNM: 110 },
  { id: "r10", originIcao: "SBBR", destinationIcao: "SBGL", distanceNM: 500 },
];
