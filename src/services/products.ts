// src/services/products.ts
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

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {  // ✅ Make sure this export exists
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
};

// Get single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Product) : null;
};

// Add product
export const addProduct = async (data: Product): Promise<Product> => {
  const docRef = await addDoc(collection(db, "products"), data);
  return { ...data, id: docRef.id };
};

// Update product
export const updateProduct = async (id: string, data: Product) => {
  const docRef = doc(db, "products", id);
  const { id: _, ...updateData } = data;
  await updateDoc(docRef, updateData);
};

// Delete product
export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};

// For backward compatibility - remove this if you don't need it
export const getAllProducts = fetchProducts;