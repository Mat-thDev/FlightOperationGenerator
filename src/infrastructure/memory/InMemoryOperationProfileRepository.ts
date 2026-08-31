import type { OperationProfile } from "../../domain/entities/OperationProfile";
import type { OperationProfileRepository } from "../../domain/repositories/OperationProfileRepository";
import { defaultProfiles } from "../seed/defaultSeed";

export class InMemoryOperationProfileRepository implements OperationProfileRepository {
  private profiles: OperationProfile[] = [...defaultProfiles];

  async findAll(): Promise<OperationProfile[]> {
    return [...this.profiles];
  }

  async findById(id: string): Promise<OperationProfile | null> {
    return this.profiles.find((p) => p.id === id) ?? null;
  }
}
