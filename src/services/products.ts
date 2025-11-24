import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Product } from "../types";

const generateProductId = (product: Product): string => {
  if (product.id && product.id.trim() !== "") {
    return product.id;
  }
  const baseId = `${product.name}-${product.vendorName}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${baseId}-${Date.now()}`;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  const products = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Product)
  );

  return products.map((product) => ({
    ...product,
    id: product.id || generateProductId(product),
  }));
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const product = { id: docSnap.id, ...docSnap.data() } as Product;
    return {
      ...product,
      id: product.id || generateProductId(product),
    };
  }
  return null;
};

export const addProduct = async (data: Product): Promise<Product> => {
  const productWithId = {
    ...data,
    id: data.id || generateProductId(data),
  };

  const { id, ...productData } = productWithId;
  const docRef = await addDoc(collection(db, "products"), productData);

  return { ...productWithId, id: docRef.id };
};

export const updateProduct = async (id: string, data: Product) => {
  const docRef = doc(db, "products", id);
  const { id: _, ...updateData } = data;
  await updateDoc(docRef, updateData);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};

export const getAllProducts = fetchProducts;
