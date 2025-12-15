import { Product } from "../types";
import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

export const fetchProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, "products"));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Product)
  );
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? ({ id: docSnap.id, ...docSnap.data() } as Product)
    : null;
};

export const addProduct = async (data: Product): Promise<Product> => {
  const { id, ...productData } = data;
  const docRef = await addDoc(collection(db, "products"), productData);
  return { id: docRef.id, ...productData };
};

export const updateProduct = async (id: string, data: Partial<Product>) => {
  const docRef = doc(db, "products", id);
  const { id: _, ...updateData } = data;
  await updateDoc(docRef, updateData);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, "products", id);
  await deleteDoc(docRef);
};

export const getVendorProducts = async (vendorId: string): Promise<Product[]> => {
  const allProducts = await fetchProducts();
  return allProducts.filter((p) => p.vendorId === vendorId);
};

export const getAllProducts = fetchProducts;