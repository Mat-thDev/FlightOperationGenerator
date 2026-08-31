import type { OperationProfile } from "../entities/OperationProfile";

export interface OperationProfileRepository {
  findAll(): Promise<OperationProfile[]>;
  findById(id: string): Promise<OperationProfile | null>;
}
