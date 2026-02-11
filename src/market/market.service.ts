import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Market } from "./entities/market.entity";
import {
  CreateMarketDto,
  UpdateMarketDto,
  MarketResponseDto,
} from "./market.dto";

@Injectable()
export class MarketService {
  private readonly logger = new Logger(MarketService.name);

  constructor(
    @InjectRepository(Market)
    private readonly marketRepository: Repository<Market>,
  ) {}

  /**
   * Create market
   */
  async create(data: CreateMarketDto): Promise<Market> {
    const market = this.marketRepository.create({
      name: data.name,
      location: data.location ?? null,
      description: data.description ?? null,
    });
    return this.marketRepository.save(market);
  }

  /**
   * Find market by ID
   */
  async findById(id: number): Promise<Market | null> {
    return this.marketRepository.findOne({ where: { id } });
  }

  /**
   * Find all markets
   */
  async findAll(): Promise<Market[]> {
    return this.marketRepository.find({
      order: { name: "ASC" },
    });
  }

  /**
   * Update market
   */
  async update(id: number, data: UpdateMarketDto): Promise<Market | null> {
    const market = await this.findById(id);
    if (!market) return null;

    await this.marketRepository.update(id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.description !== undefined && { description: data.description }),
    });
    return this.findById(id);
  }

  /**
   * Delete market
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.marketRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(market: Market): MarketResponseDto {
    return {
      id: market.id,
      name: market.name,
      location: market.location,
      description: market.description,
      created_at: market.created_at,
      updated_at: market.updated_at,
    };
  }
}
