import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              About LAUTECH Market
            </h3>
            <p className="text-sm leading-relaxed">
              Lautech Market is the #1 online directory for student vendors in
              Ogbomoso. We replace the chaos of messy WhatsApp groups with a
              clean, searchable platform.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              {/*
              <li>
                <Link to="/category/electronics" className="text-sm hover:text-emerald-400 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/fabric" className="text-sm hover:text-emerald-400 transition-colors">
                  Fabric
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="text-sm hover:text-emerald-400 transition-colors">
                  Accessories
                </Link>
              </li>
              */}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://wa.me/2348151993706"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  Contact Support
                </a>
              </li>
              <li className="flex items-center space-x-3 py-0.5">
                <a
                  href="mailto:support@markethub.com"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  support@lautechmarket.com
                </a>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="inline-flex items-center space-x-2 text-sm text-gray-500 cursor-not-allowed"
                >
                  Shipping Info
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold ml-1">
                    SOON
                  </span>
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center space-x-2 text-sm text-gray-500 cursor-not-allowed">
                  <span>Track Order</span>
                  <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                    SOON
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Make Money
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 py-0.5">
                <a
                  href="https://wa.me/2348151993706"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  Sell on LAUTECH Market
                </a>
              </li>
              <li className="flex items-center space-x-3 py-0.5">
                <a
                  href="https://chat.whatsapp.com/J8tSxuYVX5ZJKy8WESiE6T"
                  className="text-sm hover:text-emerald-400 transition-colors"
                >
                  Vendor Hub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {new Date().getFullYear()} LAUTECH Market. All rights reserved.
            </p>

            <div className="flex items-center space-x-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
