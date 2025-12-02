import React, { useState, useRef, useEffect } from "react";
import {
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { Product } from "../types";

interface ShareButtonProps {
  product: Product;
  variant?: "icon" | "button";
}

export function ShareButton({ product, variant = "icon" }: ShareButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${window.location.origin}/product/${product.id}`;
  const shareMessage = `Check out ${
    product.name
  } on MarketHub - ₦${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(product.price)}`;
  const hashtags = "MarketHub,Shopping";

  const shareOptions = [
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4 text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-4 h-4 text-blue-400" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareMessage
      )}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtags}`,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4 text-green-500" />,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${shareMessage}\n\n${shareUrl}`
      )}`,
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
      setShowDropdown(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: shareMessage,
          url: shareUrl,
        })
        .catch(() => {
          setShowDropdown(!showDropdown);
        });
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const handleShareOptionClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setShowDropdown(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {variant === "icon" ? (
        <button
          onClick={handleShareClick}
          className="p-2 text-gray-600 hover:text-emerald-600 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Share product"
        >
          <Share2 className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={handleShareClick}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      )}

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900">
              Share this product
            </h4>
          </div>

          <div className="py-2">
            {shareOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => handleShareOptionClick(option.url)}
                className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-sm transition-colors text-left"
              >
                {option.icon}
                <span>Share on {option.name}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 text-sm transition-colors"
            >
              <div className="flex items-center space-x-3">
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <LinkIcon className="w-4 h-4 text-gray-600" />
                )}
                <span>{copied ? "Copied!" : "Copy link"}</span>
              </div>
              {copied && (
                <span className="text-xs text-green-600 font-medium">✓</span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
