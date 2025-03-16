export interface CartItem {
  productId: string;
  priceId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartState {
  cart: Cart;
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}