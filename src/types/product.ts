export interface Product {	
  id: string;	
  priceId: string;	
  name: string;	
  category: 'baskets' | 'paraphernalia' | 'dried' | 'gel';	
  price: number;	
  dimensions: {	
  length?: number;	
  width?: number;	
  depth?: number;	
  diameter?: number;	
  size?: string;	
  };	
  description: string;	
  images: string[];	
  inStock: boolean;	
  }	