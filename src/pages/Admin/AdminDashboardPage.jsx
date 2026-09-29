import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoriesApi } from "../../api/categories.api";
import { merchantsApi } from "../../api/merchants.api";
import { productsApi } from "../../api/products.api";
import { formatMoney } from "../../utils/money";
import { RecentOrders } from "../../components/account/RecentOrders";

export function AdminDashboardPage() {
  const [summary, setSummary] = useState({
    status: "loading",
    products: 0,
    categories: 0,
    balance: null,
  });

  useEffect(() => {
    Promise.all([
      productsApi.list({ includeInactive: true }),
      categoriesApi.list({ includeInactive: true }),
      merchantsApi.balance(),
    ])
      .then(([products, categories, balance]) =>
        setSummary({
          status: "success",
          products: products.data.length,
          categories: categories.data.length,
          balance: balance.data,
        }),
      )
      .catch(() => setSummary((current) => ({ ...current, status: "error" })));
  }, []);

  if (summary.status === "loading")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Panel admin</p>
        <h1>Cargando resumen...</h1>
      </div>
    );
  if (summary.status === "error")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Panel admin</p>
        <h1>No pudimos cargar el resumen.</h1>
        <p>Vuelve a intentarlo en unos momentos.</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <p className="eyebrow">PANEL DE LA TIENDA</p>
      <h1>El pulso de tu tienda.</h1>
      <p className="cart-message">
        Un vistazo a tu colección y a la actividad de Casa Nativa.
      </p>
      <div className="dashboard-metrics">
        <Link to="/admin/productos">
          <span>Productos en la colección</span>
          <strong>{summary.products}</strong>
        </Link>
        <Link to="/admin/productos">
          <span>Categorías</span>
          <strong>{summary.categories}</strong>
        </Link>
        <Link to="/admin/balance">
          <span>Balance disponible</span>
          <strong>
            {formatMoney(summary.balance?.available, summary.balance?.currency)}
          </strong>
        </Link>
      </div>
      <RecentOrders admin />
    </div>
  );
}
