import { useEffect, useState } from "react";
import { config } from "../../config/env";
import { ordersApi } from "../../api/orders.api";
import { formatMoney } from "../../utils/money";

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    ordersApi
      .listMerchant(config.merchantId)
      .then((response) => {
        setOrders(response.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Órdenes</p>
        <h1>Cargando órdenes...</h1>
      </div>
    );
  if (state === "error")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Órdenes</p>
        <h1>No pudimos cargar las órdenes.</h1>
        <p className="cart-message">Vuelve a intentarlo en unos momentos.</p>
      </div>
    );
  if (!orders.length)
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Órdenes</p>
        <h1>No hay órdenes todavía.</h1>
      </div>
    );

  return (
    <div className="dashboard-page">
      <p className="eyebrow">Órdenes</p>
      <h1>Actividad reciente.</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div className="order-row" key={order.orderId}>
            <div>
              <strong>{order.orderId}</strong>
              <span>
                {order.orderStatus || order.status} / {order.userId}
              </span>
            </div>
            <strong>
              {formatMoney(
                order.totalAmount ?? order.total,
                order.currency || "USD",
              )}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}
