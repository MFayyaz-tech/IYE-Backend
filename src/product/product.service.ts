import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
} from "./product.dto";

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Create product
   */
  async create(data: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      name: data.name,
      category_id: data.category_id,
      store_id: data.store_id,
      price: data.price,
      quantity: data.quantity ?? 0,
      description: data.description ?? null,
      purity: data.purity ?? null,
      unit: data.unit ?? null,
      main_image: data.main_image ?? null,
      additional_images: data.additional_images ?? null,
    });
    return this.productRepository.save(product);
  }

  /**
   * Find product by ID
   */
  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOne({
      where: { id },
      relations: ["category", "store"],
    });
  }

  /**
   * Find all products (optional filter by store_id or category_id)
   */
  async findAll(storeId?: number, categoryId?: number): Promise<Product[]> {
    const qb = this.productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.store", "store")
      .orderBy("product.created_at", "DESC");

    if (storeId != null) {
      qb.andWhere("product.store_id = :storeId", { storeId });
    }
    if (categoryId != null) {
      qb.andWhere("product.category_id = :categoryId", { categoryId });
    }
    return qb.getMany();
  }

  /**
   * Find all products by store ID
   */
  async findByStoreId(storeId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { store_id: storeId },
      order: { created_at: "DESC" },
      relations: ["category", "store"],
    });
  }

  /**
   * Update product
   */
  async update(id: number, data: UpdateProductDto): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) return null;

    await this.productRepository.update(id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category_id !== undefined && { category_id: data.category_id }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.purity !== undefined && { purity: data.purity }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.main_image !== undefined && { main_image: data.main_image }),
      ...(data.additional_images !== undefined && {
        additional_images: data.additional_images,
      }),
    });
    return this.findById(id);
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.productRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO (ensure price is number for JSON)
   */
  mapToResponse(product: Product): ProductResponseDto {
    const ratingCount = product.rating_count ?? 0;
    const ratingTotal = Number(product.rating_total ?? 0);
    const averageRating =
      ratingCount > 0 ? Math.round((ratingTotal / ratingCount) * 100) / 100 : 0;
    return {
      id: product.id,
      name: product.name,
      category_id: product.category_id,
      store_id: product.store_id,
      price: Number(product.price),
      quantity: product.quantity,
      description: product.description,
      purity: product.purity,
      unit: product.unit,
      main_image: product.main_image,
      additional_images: product.additional_images,
      rating_count: ratingCount,
      average_rating: averageRating,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
