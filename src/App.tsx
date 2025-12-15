import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Cart } from "./pages/Cart";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/AdminDashboard";
import { ProductDetail } from "./pages/ProductDetail";
import { Contact } from "./pages/Contact";
import { FAQ } from "./pages/FAQ";
import { VendorRegister } from "./pages/vendor/VendorRegister";
import { VendorLogin } from "./pages/vendor/VendorLogin";
import { VendorDashboard } from "./pages/vendor/VendorDashboard";
import { VendorStore } from "./pages/vendor/VendorStore";
import { authStateListener } from "./services/auth";
import { vendorAuthStateListener } from "./services/vendorAuth";
import { trackVisit } from "./services/analytics";
import { ChatbotButton } from "./components/ChatbotButton";
import ScrollToTop from "./components/ScrollToTop";

// Track visit on app load
trackVisit();

/**
 * AdminProtectedRoute Component
 * 
 * Protects admin routes by checking authentication state.
 * Redirects to login if not authenticated.
 */
function AdminProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = authStateListener((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}

/**
 * VendorProtectedRoute Component
 * 
 * Protects vendor routes by checking authentication state.
 * Redirects to vendor login if not authenticated.
 */
function VendorProtectedRoute({ children }: { children: JSX.Element }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = vendorAuthStateListener((vendor) => {
      if (vendor) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/vendor/login" />;
  }

  return children;
}

/**
 * App Component
 * 
 * Main application component with routing configuration.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* Vendor Routes */}
        <Route path="/vendor/register" element={<VendorRegister />} />
        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route
          path="/vendor/dashboard"
          element={
            <VendorProtectedRoute>
              <VendorDashboard />
            </VendorProtectedRoute>
          }
        />

        {/* Public Vendor Store */}
        <Route path="/store/:vendorId" element={<VendorStore />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ChatbotButton />
    </BrowserRouter>
  );
}
