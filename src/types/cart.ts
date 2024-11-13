export interface CartItem {
  productId?: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
  isChecked: boolean;
}

export interface CartContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem, quantityChange?: number) => void;
  removeItem: (name: string) => void;
  updateServerCart: (items: CartItem[]) => void;
  clearCart: () => void;
  toggleItemChecked: (name: string, newCheckedStatus?: boolean) => void;
}

export interface CartResponse {
  success: boolean;
  items: CartItem[];
  error?: string;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface CartUpdateRequest {
  userId: string;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}
