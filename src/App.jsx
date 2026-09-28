import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import {
  ClientDashboardLayout,
  AdminDashboardLayout,
} from "./components/layout/DashboardLayout";
import { AdminRoute } from "./components/layout/AdminRoute";
import { StoreLayout } from "./components/layout/StoreLayout";
import { HomePage } from "./pages/Home/HomePage";

import { CatalogPage } from "./pages/Catalog/CatalogPage";
import { LoginPage } from "./pages/Auth/LoginPage";
import { RegisterPage } from "./pages/Auth/RegisterPage";
import { CartPage } from "./pages/Cart/CartPage";
import { AccountPage } from "./pages/Account/AccountPage";
import { OrderHistoryPage } from "./pages/Account/OrderHistoryPage";
import { AdminDashboardPage } from "./pages/Admin/AdminDashboardPage";
import { AdminProductsPage } from "./pages/Admin/AdminProductsPage";
import { AdminOrdersPage } from "./pages/Admin/AdminOrdersPage";
import { AdminBalancePage } from "./pages/Admin/AdminBalancePage";
import { CheckoutCancelPage } from "./pages/Checkout/CheckoutCancelPage";
import { CheckoutPage } from "./pages/Checkout/CheckoutPage";
import { CheckoutSuccessPage } from "./pages/Checkout/CheckoutSuccessPage";
import { ProductDetailPage } from "./pages/ProductDetail/ProductDetailPage";
import "./App.css";

function PlaceholderPage({ title, description }) {
  return (
    <main className="placeholder-page">
      <p className="eyebrow">Casa Nativa</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link className="button button-dark" to="/">
        Volver al inicio
      </Link>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <StoreLayout>
            <Toaster position="bottom-right" richColors />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tienda" element={<CatalogPage />} />
              <Route
                path="/productos/:productId"
                element={<ProductDetailPage />}
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/carrito" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/checkout/success"
                  element={<CheckoutSuccessPage />}
                />
                <Route
                  path="/checkout/cancel"
                  element={<CheckoutCancelPage />}
                />
                <Route element={<ClientDashboardLayout />}>
                  <Route path="/cuenta" element={<AccountPage />} />
                  <Route
                    path="/cuenta/ordenes"
                    element={<OrderHistoryPage />}
                  />
                </Route>
                <Route element={<AdminRoute />}>
                  <Route element={<AdminDashboardLayout />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route
                      path="/admin/productos"
                      element={<AdminProductsPage />}
                    />
                    <Route
                      path="/admin/ordenes"
                      element={<AdminOrdersPage />}
                    />
                    <Route
                      path="/admin/balance"
                      element={<AdminBalancePage />}
                    />
                  </Route>
                </Route>
              </Route>
              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="Página no encontrada"
                    description="La dirección que buscas no existe."
                  />
                }
              />
            </Routes>
          </StoreLayout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
