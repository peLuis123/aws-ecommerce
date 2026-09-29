import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { formatMoney } from "../../utils/money";
import { Icon } from "../ui/Icon";

export function RecentOrders({ admin = false, merchantId }) {
  const [orders, setOrders] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    (admin ? ordersApi.listMerchant(merchantId) : ordersApi.list())
      .then(({ data }) => {
        if (active) setOrders(data.slice(0, 3));
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [admin, merchantId]);
  return (
    <section className="recent-orders">
      <div className="section-heading">
        <h2>{admin ? "Actividad reciente" : "Tus últimos pedidos"}</h2>
        <Link
          className="text-link"
          to={admin ? "/admin/ordenes" : "/cuenta/ordenes"}
        >
          Ver todos <Icon name="arrow" size={16} />
        </Link>
      </div>
      {failed ? (
        <p>No pudimos cargar tus pedidos. Inténtalo desde el historial.</p>
      ) : orders === null ? (
        <p>Cargando pedidos…</p>
      ) : orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-row" key={order.orderId}>
              <div>
                <strong>{order.orderId}</strong>
                <span>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                      })
                    : "Pedido recibido"}
                </span>
              </div>
              <span className="order-status">
                {order.orderStatus || order.status}
              </span>
              <strong>
                {formatMoney(
                  order.totalAmount ?? order.total,
                  order.currency || "USD",
                )}
              </strong>
            </div>
          ))}
        </div>
      ) : (
        <p>
          Todavía no hay pedidos. Tu próxima historia empieza en la colección.
        </p>
      )}
    </section>
  );
}
