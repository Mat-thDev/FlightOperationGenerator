import type { Route } from "../../domain/entities/Route";
import type { RouteRepository } from "../../domain/repositories/RouteRepository";
import { defaultRoutes } from "../seed/defaultSeed";

export class InMemoryRouteRepository implements RouteRepository {
  private routes: Route[] = [...defaultRoutes];

  async findAll(): Promise<Route[]> {
    return [...this.routes];
  }
}
