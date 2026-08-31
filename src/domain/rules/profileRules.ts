import type { Aircraft } from "../entities/Aircraft";
import type { OperationProfile } from "../entities/OperationProfile";
import type { Route } from "../entities/Route";

export function isRouteCompatibleWithProfile(
  route: Route,
  profile: OperationProfile,
): boolean {
  return (
    route.distanceNM >= profile.distance.minNM &&
    route.distanceNM <= profile.distance.maxNM
  );
}

export function isAircraftCompatibleWithProfile(
  aircraft: Aircraft,
  profile: OperationProfile,
): boolean {
  return profile.allowedCategories.includes(aircraft.category);
}
