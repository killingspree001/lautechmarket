/**
 * VerifiedBadge Component
 * 
 * Displays a shield with checkmark badge for verified vendors.
 * Shows "Verified Vendor" tooltip on hover.
 * Uses emerald green to match site theme.
 */

import { useState } from "react";

interface VerifiedBadgeProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function VerifiedBadge({ size = "md", className = "" }: VerifiedBadgeProps) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Size configurations
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
    };

    return (
        <div
            className={`relative inline-flex items-center ${className}`}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            {/* Shield with Checkmark SVG - Emerald Theme */}
            <svg
                className={`${sizeClasses[size]} flex-shrink-0`}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Shield outline - dark emerald */}
                <path
                    d="M12 2L4 6V12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12V6L12 2Z"
                    stroke="#047857"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="#d1fae5"
                />
                {/* Checkmark - emerald */}
                <path
                    d="M8.5 12L11 14.5L16 9"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-50 shadow-lg">
                    Verified Vendor
                    {/* Tooltip arrow */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
            )}
        </div>
    );
}
