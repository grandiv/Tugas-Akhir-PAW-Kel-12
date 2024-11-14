export interface OrderItem {
  _id: string;
  orderId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  status: "pending" | "completed" | "cancelled";
  totalAmount: number;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}
