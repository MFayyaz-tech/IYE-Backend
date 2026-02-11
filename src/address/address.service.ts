import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Address } from "./entities/address.entity";
import {
  CreateAddressDto,
  UpdateAddressDto,
  AddressResponseDto,
} from "./address.dto";

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  /**
   * Create user address
   */
  async create(data: CreateAddressDto): Promise<Address> {
    const address = this.addressRepository.create({
      user_id: data.user_id,
      phone: data.phone,
      address: data.address,
      title: data.title,
    });
    return this.addressRepository.save(address);
  }

  /**
   * Find address by ID
   */
  async findById(id: number): Promise<Address | null> {
    return this.addressRepository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  /**
   * Find all addresses
   */
  async findAll(): Promise<Address[]> {
    return this.addressRepository.find({
      order: { created_at: "DESC" },
      relations: ["user"],
    });
  }

  /**
   * Find all addresses by user ID
   */
  async findByUserId(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
      relations: ["user"],
    });
  }

  /**
   * Update address
   */
  async update(id: number, data: UpdateAddressDto): Promise<Address | null> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) return null;

    await this.addressRepository.update(id, {
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.title !== undefined && { title: data.title }),
    });
    return this.findById(id);
  }

  /**
   * Delete address
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.addressRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(address: Address): AddressResponseDto {
    return {
      id: address.id,
      user_id: address.user_id,
      phone: address.phone,
      address: address.address,
      title: address.title,
      created_at: address.created_at,
      updated_at: address.updated_at,
    };
  }
}
