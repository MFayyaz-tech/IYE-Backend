import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import {
  CreateOrderDto,
  UpdateOrderDto,
  OrderResponseDto,
  OrderItemResponseDto,
  AddressRefResponseDto,
} from "./order.dto";
import { OrderStatus } from "./entities/order.entity";

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Create order with items (transaction)
   */
  async create(data: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = queryRunner.manager.create(Order, {
        store_id: data.store_id,
        user_id: data.user_id,
        status: data.status ?? OrderStatus.PENDING,
        is_paid: data.is_paid ?? false,
        total_bill: data.total_bill,
        discount: data.discount ?? 0,
        payment_method: data.payment_method ?? null,
        address_id: data.address_id ?? null,
      });
      const savedOrder = await queryRunner.manager.save(Order, order);

      for (const item of data.items) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          order_id: savedOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        });
        await queryRunner.manager.save(OrderItem, orderItem);
      }

      await queryRunner.commitTransaction();
      return this.findById(savedOrder.id) as Promise<Order>;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find order by ID with items
   */
  async findById(id: number): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ["store", "user", "address", "items", "items.product"],
      order: { items: { id: "ASC" } },
    });
  }

  /**
   * Find all orders with items
   */
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { created_at: "DESC" },
      relations: ["store", "user", "address", "items", "items.product"],
    });
  }

  /**
   * Find orders by user ID
   */
  async findByUserId(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user_id: userId },
      order: { created_at: "DESC" },
      relations: ["store", "user", "address", "items", "items.product"],
    });
  }

  /**
   * Find orders by store ID
   */
  async findByStoreId(storeId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { store_id: storeId },
      order: { created_at: "DESC" },
      relations: ["store", "user", "address", "items", "items.product"],
    });
  }

  /**
   * Update order
   */
  async update(id: number, data: UpdateOrderDto): Promise<Order | null> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) return null;

    await this.orderRepository.update(id, {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.is_paid !== undefined && { is_paid: data.is_paid }),
      ...(data.total_bill !== undefined && { total_bill: data.total_bill }),
      ...(data.discount !== undefined && { discount: data.discount }),
      ...(data.payment_method !== undefined && {
        payment_method: data.payment_method,
      }),
      ...(data.address_id !== undefined && { address_id: data.address_id }),
    });
    return this.findById(id);
  }

  /**
   * Delete order (cascade deletes items)
   */
  async delete(id: number): Promise<boolean> {
    const result = await this.orderRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  /**
   * Map order item to response DTO
   */
  mapItemToResponse(item: OrderItem): OrderItemResponseDto {
    return {
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
      created_at: item.created_at,
      updated_at: item.updated_at,
    };
  }

  /**
   * Map order entity to response DTO
   */
  mapToResponse(order: Order): OrderResponseDto {
    let addressRef: AddressRefResponseDto | null | undefined;
    if (order.address) {
      addressRef = {
        id: order.address.id,
        user_id: order.address.user_id,
        phone: order.address.phone,
        address: order.address.address,
        title: order.address.title,
      };
    }
    return {
      id: order.id,
      store_id: order.store_id,
      user_id: order.user_id,
      status: order.status,
      is_paid: order.is_paid,
      total_bill: Number(order.total_bill),
      discount: Number(order.discount),
      payment_method: order.payment_method,
      address_id: order.address_id,
      address: addressRef,
      items: order.items?.map((i) => this.mapItemToResponse(i)),
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
