import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryResponseDto,
} from "./category.dto";

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * Create category
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      name: data.name,
      description: data.description ?? null,
      icon: data.icon ?? null,
      image: data.image ?? null,
    });
    return this.categoryRepository.save(category);
  }

  /**
   * Find category by ID
   */
  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id } });
  }

  /**
   * Find all categories
   */
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { name: "ASC" },
    });
  }

  /**
   * Update category
   */
  async update(id: number, data: UpdateCategoryDto): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) return null;

    await this.categoryRepository.update(id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.image !== undefined && { image: data.image }),
    });
    return this.findById(id);
  }

  /**
   * Delete category
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map entity to response DTO
   */
  mapToResponse(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      image: category.image,
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }
}
