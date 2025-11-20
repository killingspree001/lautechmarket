// src/services/auth.ts
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";

// List of authorized admin emails
const ADMIN_EMAILS = ["admin@markethub.com"]; // add more if needed

export const loginAdmin = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    // Logout immediately if user is not authorized
    await signOut(auth);
    throw new Error("Unauthorized: You are not an admin.");
  }

  return user;
};

export const logoutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
