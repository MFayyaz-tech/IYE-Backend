import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Store } from "./entities/store.entity";
import { CreateStoreDto, UpdateStoreDto, StoreResponseDto } from "./store.dto";

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  /**
   * Create store (vendor creates store)
   */
  async create(data: CreateStoreDto): Promise<Store> {
    const store = this.storeRepository.create({
      logo: data.logo ?? null,
      cover_image: data.cover_image ?? null,
      market_id: data.market_id,
      store_name: data.store_name,
      open_time: data.open_time ?? null,
      closed_time: data.closed_time ?? null,
      vendor_id: data.vendor_id,
      is_approved: data.is_approved ?? false,
    });
    return this.storeRepository.save(store);
  }

  /**
   * Find store by ID
   */
  async findById(id: number): Promise<Store | null> {
    return this.storeRepository.findOne({
      where: { id },
      relations: ["vendor", "market"],
    });
  }

  /**
   * Find all stores
   */
  async findAll(): Promise<Store[]> {
    return this.storeRepository.find({
      order: { created_at: "DESC" },
      relations: ["vendor", "market"],
    });
  }

  /**
   * Find all stores by vendor ID
   */
  async findByVendorId(vendorId: number): Promise<Store[]> {
    return this.storeRepository.find({
      where: { vendor_id: vendorId },
      order: { created_at: "DESC" },
      relations: ["vendor", "market"],
    });
  }

  /**
   * Find all stores by market ID
   */
  async findByMarketId(marketId: number): Promise<Store[]> {
    return this.storeRepository.find({
      where: { market_id: marketId },
      order: { created_at: "DESC" },
      relations: ["vendor", "market"],
    });
  }

  /**
   * Update store
   */
  async update(id: number, data: UpdateStoreDto): Promise<Store | null> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) return null;

    await this.storeRepository.update(id, {
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.cover_image !== undefined && { cover_image: data.cover_image }),
      ...(data.market_id !== undefined && { market_id: data.market_id }),
      ...(data.store_name !== undefined && { store_name: data.store_name }),
      ...(data.open_time !== undefined && { open_time: data.open_time }),
      ...(data.closed_time !== undefined && { closed_time: data.closed_time }),
      ...(data.is_approved !== undefined && { is_approved: data.is_approved }),
    });
    return this.findById(id);
  }

  /**
   * Delete store
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.storeRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(store: Store): StoreResponseDto {
    return {
      id: store.id,
      logo: store.logo,
      cover_image: store.cover_image,
      market_id: store.market_id,
      store_name: store.store_name,
      open_time: store.open_time,
      closed_time: store.closed_time,
      vendor_id: store.vendor_id,
      is_approved: store.is_approved,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }
}
