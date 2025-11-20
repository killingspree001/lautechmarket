export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  whatsappNumber: string;
  vendorName: string;
}
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface CategoryStats {
  category: string;
  count: number;
  inStock: number;
  outOfStock: number;
}
export interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
}