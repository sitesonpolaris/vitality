import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, CartState } from '../types/cart';
import { Product } from '../types/product';

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'RESTORE_CART'; payload: Cart }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  },
  isOpen: false,
  isLoading: false,
  error: null
};

const TAX_RATE = 0.0475; // 8% tax
const SHIPPING_THRESHOLD = 100; // Free shipping over $100
const SHIPPING_RATE = 10; // $15 shipping fee

function calculateTotals(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    items,
    subtotal,
    shipping,
    tax,
    total
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.items.find(item => item.productId === product.id);
      let newState;

      let newItems;
      if (existingItem) {
        newItems = state.cart.items.map(item =>
          item.productId === product.id
            ? { 
                ...item, 
                quantity: Math.min(item.quantity + quantity, 10),
                price: product.price // Update price in case it changed
              }
            : item
        );
      } else {
        newItems = [...state.cart.items, {
          productId: product.id,
          priceId: product.priceId,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images[0]
        }];
      }
      
      newState = {
        ...state,
        cart: calculateTotals(newItems),
        isOpen: true
      };
      
      return newState;
    }

    case 'RESTORE_CART':
      return {
        ...state,
        cart: action.payload,
        isOpen: false
      };

    case 'REMOVE_ITEM': {
      const newItems = state.cart.items.filter(item => item.productId !== action.payload);
      return {
        ...state,
        cart: calculateTotals(newItems)
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.cart.items.map(item =>
        item.productId === action.payload.productId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        cart: calculateTotals(newItems)
      };
    }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: initialState.cart
      };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [initialized, setInitialized] = React.useState(false);

  // Persist cart to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const { items } = JSON.parse(savedCart);
      const newItems = items.map((item: CartItem) => ({
        productId: item.productId,
        priceId: item.priceId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image
      }));
      
      dispatch({
        type: 'RESTORE_CART',
        payload: calculateTotals(newItems)
      });
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  }, [state.cart, initialized]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}