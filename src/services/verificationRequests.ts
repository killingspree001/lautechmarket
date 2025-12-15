/**
 * Verification Requests Service
 * 
 * Handles CRUD operations for vendor verification requests in Firestore.
 */

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export interface VerificationRequest {
    id: string;
    vendorId: string;
    vendorName: string;
    vendorEmail: string;
    whatsappNumber: string;
    location: string;
    receiptUrl: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    reviewedAt?: Date;
}

const COLLECTION_NAME = "verificationRequests";

// Get all verification requests
export const getAllVerificationRequests = async (): Promise<VerificationRequest[]> => {
    try {
        const requestsQuery = query(
            collection(db, COLLECTION_NAME),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(requestsQuery);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            vendorId: doc.data().vendorId,
            vendorName: doc.data().vendorName,
            vendorEmail: doc.data().vendorEmail,
            whatsappNumber: doc.data().whatsappNumber || "",
            location: doc.data().location,
            receiptUrl: doc.data().receiptUrl,
            status: doc.data().status,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            reviewedAt: doc.data().reviewedAt?.toDate() || undefined,
        }));
    } catch (error) {
        // If orderBy fails (no index), fetch all and sort in code
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        const requests = snapshot.docs.map((doc) => ({
            id: doc.id,
            vendorId: doc.data().vendorId,
            vendorName: doc.data().vendorName,
            vendorEmail: doc.data().vendorEmail,
            whatsappNumber: doc.data().whatsappNumber || "",
            location: doc.data().location,
            receiptUrl: doc.data().receiptUrl,
            status: doc.data().status,
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            reviewedAt: doc.data().reviewedAt?.toDate() || undefined,
        }));
        return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
};

// Get pending verification requests
export const getPendingVerificationRequests = async (): Promise<VerificationRequest[]> => {
    const allRequests = await getAllVerificationRequests();
    return allRequests.filter((r) => r.status === 'pending');
};

// Submit a verification request
export const submitVerificationRequest = async (
    vendorId: string,
    vendorName: string,
    vendorEmail: string,
    whatsappNumber: string,
    location: string,
    receiptUrl: string
): Promise<VerificationRequest> => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        vendorId,
        vendorName,
        vendorEmail,
        whatsappNumber,
        location,
        receiptUrl,
        status: 'pending',
        createdAt: Timestamp.now(),
    });

    return {
        id: docRef.id,
        vendorId,
        vendorName,
        vendorEmail,
        whatsappNumber,
        location,
        receiptUrl,
        status: 'pending',
        createdAt: new Date(),
    };
};

// Update verification request status
export const updateVerificationRequestStatus = async (
    requestId: string,
    status: 'approved' | 'rejected'
): Promise<void> => {
    const docRef = doc(db, COLLECTION_NAME, requestId);
    await updateDoc(docRef, {
        status,
        reviewedAt: Timestamp.now(),
    });
};

// Delete/dismiss a verification request
export const deleteVerificationRequest = async (requestId: string): Promise<void> => {
    await deleteDoc(doc(db, COLLECTION_NAME, requestId));
};

// Check if vendor has pending request
export const hasPendingRequest = async (vendorId: string): Promise<boolean> => {
    const allRequests = await getAllVerificationRequests();
    return allRequests.some((r) => r.vendorId === vendorId && r.status === 'pending');
};
