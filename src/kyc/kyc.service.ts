import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Kyc } from "./entities/kyc.entity";
import { CreateKycDto, UpdateKycDto, KycResponseDto } from "./kyc.dto";

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);

  constructor(
    @InjectRepository(Kyc)
    private readonly kycRepository: Repository<Kyc>,
  ) {}

  /**
   * Create KYC record
   */
  async create(data: CreateKycDto): Promise<Kyc> {
    const kyc = this.kycRepository.create({
      bvn: data.bvn ?? null,
      nin_front: data.nin_front ?? null,
      nin_back: data.nin_back ?? null,
      bvn_number: data.bvn_number ?? null,
    });
    return this.kycRepository.save(kyc);
  }

  /**
   * Find KYC by ID
   */
  async findById(id: number): Promise<Kyc | null> {
    return this.kycRepository.findOne({ where: { id } });
  }

  /**
   * Find all KYC records
   */
  async findAll(): Promise<Kyc[]> {
    return this.kycRepository.find({
      order: { created_at: "DESC" },
    });
  }

  /**
   * Update KYC record
   */
  async update(id: number, data: UpdateKycDto): Promise<Kyc | null> {
    const kyc = await this.findById(id);
    if (!kyc) return null;

    await this.kycRepository.update(id, {
      ...(data.bvn !== undefined && { bvn: data.bvn }),
      ...(data.nin_front !== undefined && { nin_front: data.nin_front }),
      ...(data.nin_back !== undefined && { nin_back: data.nin_back }),
      ...(data.bvn_number !== undefined && { bvn_number: data.bvn_number }),
    });
    return this.findById(id);
  }

  /**
   * Delete KYC record
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.kycRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(kyc: Kyc): KycResponseDto {
    return {
      id: kyc.id,
      bvn: kyc.bvn,
      nin_front: kyc.nin_front,
      nin_back: kyc.nin_back,
      bvn_number: kyc.bvn_number,
      created_at: kyc.created_at,
      updated_at: kyc.updated_at,
    };
  }
}
