import type { Route } from "../entities/Route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
}
