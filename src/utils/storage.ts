import { Product } from '../types';
const PRODUCTS_FILE = '/data/products.json';
export const loadProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(PRODUCTS_FILE);
    if (!response.ok) throw new Error('Failed to load products');
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
};
export const saveProducts = async (products: Product[]): Promise<boolean> => {
  // Note: In a real application, this would make an API call to save to the server
  // For now, we'll store in localStorage as a fallback for the admin dashboard
  try {
    localStorage.setItem('products', JSON.stringify(products));
    return true;
  } catch (error) {
    console.error('Error saving products:', error);
    return false;
  }
};
export const getAllProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting products from localStorage:', error);
    return [];
  }
};