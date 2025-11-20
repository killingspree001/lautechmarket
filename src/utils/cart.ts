import { CartItem, Product } from '../types';
const CART_KEY = 'shopping_cart';
export const getCart = (): CartItem[] => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
};
export const saveCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};
export const addToCart = (product: Product, quantity: number = 1): void => {
  const cart = getCart();
  const existingItem = cart.find(item => item.product.id === product.id);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      product,
      quantity
    });
  }
  saveCart(cart);
};
export const removeFromCart = (productId: string): void => {
  const cart = getCart().filter(item => item.product.id !== productId);
  saveCart(cart);
};
export const updateCartQuantity = (productId: string, quantity: number): void => {
  const cart = getCart();
  const item = cart.find(item => item.product.id === productId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
};
export const clearCart = (): void => {
  localStorage.removeItem(CART_KEY);
};
export const getCartItemsByVendor = (): Map<string, CartItem[]> => {
  const cart = getCart();
  const vendorMap = new Map<string, CartItem[]>();
  cart.forEach(item => {
    const vendor = item.product.vendorName;
    if (!vendorMap.has(vendor)) {
      vendorMap.set(vendor, []);
    }
    vendorMap.get(vendor)!.push(item);
  });
  return vendorMap;
};
export const generateWhatsAppLink = (items: CartItem[], whatsappNumber: string): string => {
  const message = items.map(item => `${item.product.name} (x${item.quantity}) - $${(item.product.price * item.quantity).toFixed(2)}`).join('%0A');
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const fullMessage = `Hello! I'd like to order:%0A%0A${message}%0A%0ATotal: $${total.toFixed(2)}`;
  return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${fullMessage}`;
};