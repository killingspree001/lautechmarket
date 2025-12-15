/**
 * Analytics Service
 * 
 * Tracks website visitors using Firestore and localStorage.
 * - Unique visitors: Identified by localStorage ID
 * - Total visits: Incremented on every page load
 */

import { db } from "../firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    Timestamp,
} from "firebase/firestore";

const ANALYTICS_DOC = "visitors";
const COLLECTION_NAME = "analytics";
const VISITOR_ID_KEY = "lautech_market_visitor_id";

interface AnalyticsData {
    uniqueVisitors: number;
    totalVisits: number;
    lastUpdated: Date;
}

/**
 * Generate a unique visitor ID
 */
const generateVisitorId = (): string => {
    return `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if this is a new unique visitor
 */
const isNewVisitor = (): boolean => {
    const existingId = localStorage.getItem(VISITOR_ID_KEY);
    if (existingId) {
        return false; // Returning visitor
    }
    // New visitor - save ID
    const newId = generateVisitorId();
    localStorage.setItem(VISITOR_ID_KEY, newId);
    return true;
};

/**
 * Track a visit - called on app load
 */
export const trackVisit = async (): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, ANALYTICS_DOC);
        const docSnap = await getDoc(docRef);

        const isNew = isNewVisitor();

        if (!docSnap.exists()) {
            // First ever visit - create document
            await setDoc(docRef, {
                uniqueVisitors: 1,
                totalVisits: 1,
                lastUpdated: Timestamp.now(),
            });
        } else {
            // Update existing document
            if (isNew) {
                // New unique visitor
                await updateDoc(docRef, {
                    uniqueVisitors: increment(1),
                    totalVisits: increment(1),
                    lastUpdated: Timestamp.now(),
                });
            } else {
                // Returning visitor - only increment total
                await updateDoc(docRef, {
                    totalVisits: increment(1),
                    lastUpdated: Timestamp.now(),
                });
            }
        }
    } catch (error) {
        console.error("Error tracking visit:", error);
        // Silent fail - don't break the app for analytics
    }
};

/**
 * Get analytics data for admin dashboard
 */
export const getAnalytics = async (): Promise<AnalyticsData> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, ANALYTICS_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                uniqueVisitors: data.uniqueVisitors || 0,
                totalVisits: data.totalVisits || 0,
                lastUpdated: data.lastUpdated?.toDate() || new Date(),
            };
        }

        return {
            uniqueVisitors: 0,
            totalVisits: 0,
            lastUpdated: new Date(),
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return {
            uniqueVisitors: 0,
            totalVisits: 0,
            lastUpdated: new Date(),
        };
    }
};
