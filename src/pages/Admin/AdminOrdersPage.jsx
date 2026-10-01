import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { formatMoney } from "../../utils/money";
import { adminError, statusLabel } from "../../utils/admin";
import { AdminFeedback } from "../../components/admin/AdminFeedback";
export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [search, setSearch] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await ordersApi.listAdmin();
      setOrders(data);
    } catch (e) {
      setError(adminError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    ordersApi
      .listAdmin()
      .then((response) => {
        if (active) {
          setOrders(response.data);
        }
      })
      .catch((e) => {
        if (active) setError(adminError(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const visible = orders.filter((o) =>
    `${o.orderId} ${o.userId}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="dashboard-page admin-workspace">
      <p className="eyebrow">Administración / Pedidos</p>
      <h1>Actividad de tu tienda.</h1>
      <AdminFeedback error={error} />
      <div className="admin-toolbar">
        <label>
          Buscar pedido o comprador
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <button
          className="button button-outline"
          onClick={load}
          disabled={loading}
        >
          Actualizar
        </button>
      </div>
      {loading ? (
        <p role="status">Cargando pedidos…</p>
      ) : (
        <div className="admin-cards">
          {visible.map((o) => (
            <article className="admin-panel" key={o.orderId}>
              <span className="admin-badge">
                {statusLabel(o.orderStatus || o.status)}
              </span>
              <h2 className="admin-id">{o.orderId}</h2>
              <p>
                {o.createdAt
                  ? new Date(o.createdAt).toLocaleString("es-PE")
                  : ""}
              </p>
              <p>
                {formatMoney(o.totalAmount ?? o.total, o.currency || "USD")}
              </p>
              <p className="admin-id admin-muted">Comprador: {o.userId}</p>
              <Link
                className="button button-outline"
                to={`/admin/ordenes/${o.orderId}`}
              >
                Ver pedido
              </Link>
            </article>
          ))}
          {!visible.length && (
            <p className="admin-empty">No hay pedidos que coincidan.</p>
          )}
        </div>
      )}
    </div>
  );
}
