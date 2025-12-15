/**
 * Announcements Service
 * 
 * Handles CRUD operations for homepage announcements/banners.
 * Stored in Firestore 'announcements' collection.
 */

import { db } from "../firebase";
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { Announcement } from "../types";

const COLLECTION_NAME = "announcements";

/**
 * Get all active announcements (for homepage display)
 */
export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
    try {
        // Fetch all and filter/sort in code to avoid composite index requirement
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));

        const announcements = snapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            }) as Announcement)
            .filter((a) => a.active === true)
            .sort((a, b) => a.order - b.order);

        return announcements;
    } catch (error) {
        console.error("Error fetching active announcements:", error);
        return [];
    }
};

/**
 * Get all announcements (for admin management)
 */
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
    try {
        // Fetch all and sort in code
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));

        const announcements = snapshot.docs
            .map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
            }) as Announcement)
            .sort((a, b) => a.order - b.order);

        return announcements;
    } catch (error) {
        console.error("Error fetching all announcements:", error);
        return [];
    }
};

/**
 * Add a new announcement
 */
export const addAnnouncement = async (
    announcement: Omit<Announcement, "id" | "createdAt">
): Promise<Announcement> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...announcement,
            createdAt: Timestamp.now(),
        });

        return {
            id: docRef.id,
            ...announcement,
            createdAt: new Date(),
        };
    } catch (error) {
        console.error("Error adding announcement:", error);
        throw error;
    }
};

/**
 * Update an existing announcement
 */
export const updateAnnouncement = async (
    id: string,
    updates: Partial<Omit<Announcement, "id" | "createdAt">>
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating announcement:", error);
        throw error;
    }
};

/**
 * Delete an announcement
 */
export const deleteAnnouncement = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting announcement:", error);
        throw error;
    }
};
