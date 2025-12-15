// Cloudinary image upload service
// Supports MULTIPLE Cloudinary accounts for extended free tier limits
// Uses round-robin rotation with fallback on failure
// 
// HOW TO ADD MORE ACCOUNTS:
// 1. Add new env variables in .env file:
//    VITE_CLOUDINARY_CLOUD_NAME_2=friend1-cloud-name
//    VITE_CLOUDINARY_UPLOAD_PRESET_2=friend1-preset
//    VITE_CLOUDINARY_CLOUD_NAME_3=friend2-cloud-name
//    VITE_CLOUDINARY_UPLOAD_PRESET_3=friend2-preset
// 2. Restart the dev server
//
// HOW IT WORKS:
// - Round-robin rotation: Account 1 → Account 2 → Account 3 → Account 1...
// - If one account fails (quota exceeded), automatically tries next account
// - Distributes uploads evenly across all accounts

interface CloudinaryAccount {
    cloudName: string;
    uploadPreset: string;
}

// Build accounts array from environment variables
// Supports up to 10 accounts (can be extended)
const buildAccountsFromEnv = (): CloudinaryAccount[] => {
    const accounts: CloudinaryAccount[] = [];

    // Primary account (no suffix)
    const primaryCloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const primaryPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    if (primaryCloud && primaryPreset) {
        accounts.push({ cloudName: primaryCloud, uploadPreset: primaryPreset });
    }

    // Additional accounts (_2 through _10)
    for (let i = 2; i <= 10; i++) {
        const cloudName = import.meta.env[`VITE_CLOUDINARY_CLOUD_NAME_${i}`];
        const uploadPreset = import.meta.env[`VITE_CLOUDINARY_UPLOAD_PRESET_${i}`];
        if (cloudName && uploadPreset) {
            accounts.push({ cloudName, uploadPreset });
        }
    }

    return accounts;
};

const CLOUDINARY_ACCOUNTS = buildAccountsFromEnv();

// Track current account index for round-robin
let currentAccountIndex = 0;

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
    width: number;
    height: number;
}

/**
 * Get next Cloudinary account (round-robin)
 */
const getNextAccount = (): CloudinaryAccount => {
    if (CLOUDINARY_ACCOUNTS.length === 0) {
        throw new Error("No Cloudinary accounts configured. Check your .env file.");
    }
    const account = CLOUDINARY_ACCOUNTS[currentAccountIndex];
    currentAccountIndex = (currentAccountIndex + 1) % CLOUDINARY_ACCOUNTS.length;
    return account;
};

/**
 * Upload to a specific Cloudinary account
 */
const uploadToAccount = async (
    file: File,
    account: CloudinaryAccount,
    folder: string = "products"
): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", account.uploadPreset);
    formData.append("folder", folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${account.cloudName}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();

    return {
        url: data.secure_url,
        publicId: data.public_id,
        width: data.width,
        height: data.height,
    };
};

/**
 * Upload an image file to Cloudinary
 * Automatically rotates between accounts and retries on failure
 * @param file - The image file to upload
 * @param folder - Folder to store in (default: "products")
 * @returns Promise with the uploaded image URL and details
 */
export const uploadImage = async (
    file: File,
    folder: string = "products"
): Promise<CloudinaryUploadResult> => {
    const totalAccounts = CLOUDINARY_ACCOUNTS.length;

    if (totalAccounts === 0) {
        throw new Error("No Cloudinary accounts configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.");
    }

    // Try each account until one succeeds
    for (let attempt = 0; attempt < totalAccounts; attempt++) {
        const account = getNextAccount();

        try {
            console.log(`[Cloudinary] Uploading to account: ${account.cloudName} (${attempt + 1}/${totalAccounts})`);
            const result = await uploadToAccount(file, account, folder);
            console.log(`[Cloudinary] Upload successful!`);
            return result;
        } catch (error) {
            console.warn(`[Cloudinary] Failed for ${account.cloudName}:`, error);

            // If this was the last account, throw the error
            if (attempt === totalAccounts - 1) {
                throw error;
            }
            console.log("[Cloudinary] Trying next account...");
        }
    }

    throw new Error("All Cloudinary accounts failed");
};

/**
 * Get optimized image URL with transformations
 */
export const getOptimizedUrl = (
    url: string,
    width: number = 400,
    quality: string = "auto"
): string => {
    if (!url.includes("cloudinary.com")) {
        return url;
    }
    return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
};

/**
 * Get the number of configured Cloudinary accounts
 */
export const getAccountCount = (): number => {
    return CLOUDINARY_ACCOUNTS.length;
};

// Log configured accounts on startup (for debugging)
console.log(`[Cloudinary] Configured accounts: ${CLOUDINARY_ACCOUNTS.length}`);
if (CLOUDINARY_ACCOUNTS.length > 0) {
    console.log(`[Cloudinary] Accounts: ${CLOUDINARY_ACCOUNTS.map(a => a.cloudName).join(", ")}`);
}
