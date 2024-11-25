export interface CartItem {
  id: string;
  quantity: number;
  isChecked?: boolean;
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image: string;
  };
}

export interface CartResponse {
  success: boolean;
  cartItems: CartItem[];
  grandTotal: number;
  shippingCost: number;
  totalPrice: number;
  error?: string;
}

export interface CartContextType {
  cartItems: CartItem[]; // Changed from CartResponse | null
  grandTotal: number;
  shippingCost: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItemToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  decreaseItemQuantity: (itemId: string) => Promise<void>;
  toggleItemCheck: (id: string, newCheckedStatus?: boolean) => void;
}
