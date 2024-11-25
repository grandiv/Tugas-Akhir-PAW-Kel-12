export interface CartItem {
    id: string;
    name: string;
    productId: string;
    productName: string;
    productPrice: number;
    imageUrl: string;
    quantity: number;
    totalPrice: number;
    isChecked: boolean;
  }
  
  export interface CartResponse {
    success?: boolean;
    grandTotal: number;
    shippingCost: number;
    totalPrice: number;
    cartItems: CartItem[];
  }
  
  
  export interface CartContextType {
    cartItems: CartResponse | null | undefined;
    addItemToCart?: (item: CartItem, quantityChange: number) => void;
    updateServerCart?: (items: CartItem[]) => void;
    removeItem?: any;
    clearCart?: () => void;
    toggleItemChecked?: (name: string, newCheckedStatus?: boolean) => void;
  }
  