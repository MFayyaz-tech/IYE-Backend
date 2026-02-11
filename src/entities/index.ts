import { Address } from "../address/entities/address.entity";
import { Category } from "../category/entities/category.entity";
import { Kyc } from "../kyc/entities/kyc.entity";
import { Market } from "../market/entities/market.entity";
import { Order } from "../order/entities/order.entity";
import { OrderItem } from "../order/entities/order-item.entity";
import { Product } from "../product/entities/product.entity";
import { Review } from "../review/entities/review.entity";
import { Store } from "../store/entities/store.entity";
import { OrderTransaction } from "../transaction/entities/order-transaction.entity";
import { User } from "../users/entities/user.entity";
import { Wallet } from "../wallet/entities/wallet.entity";
import { WalletTransaction } from "../wallet/entities/wallet-transaction.entity";

export const entities = [
  User,
  Kyc,
  Market,
  Store,
  Address,
  Order,
  OrderItem,
  OrderTransaction,
  Category,
  Product,
  Review,
  Wallet,
  WalletTransaction,
];
