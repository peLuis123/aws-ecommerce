import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { formatMoney } from "../../utils/money";

export function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState({ status: "loading", message: "" });

  const loadOrders = () => {
    setState({ status: "loading", message: "" });
    ordersApi
      .list()
      .then((response) => {
        setOrders(response.data);
        setState({ status: "success", message: "" });
      })
      .catch((error) =>
        setState({
          status: "error",
          message:
            error.response?.data?.error || "No pudimos cargar tus órdenes.",
        }),
      );
  };

  useEffect(() => {
    ordersApi
      .list()
      .then((response) => {
        setOrders(response.data);
        setState({ status: "success", message: "" });
      })
      .catch((error) =>
        setState({
          status: "error",
          message:
            error.response?.data?.error || "No pudimos cargar tus órdenes.",
        }),
      );
  }, []);

  if (state.status === "loading")
    return (
      <main className="account-page">
        <p className="eyebrow">Órdenes</p>
        <h1>Cargando tu historial...</h1>
      </main>
    );
  if (state.status === "error")
    return (
      <main className="account-page">
        <p className="eyebrow">Órdenes</p>
        <h1>No pudimos cargar tus órdenes.</h1>
        <p className="cart-message">{state.message}</p>
        <button
          className="button button-dark"
          type="button"
          onClick={loadOrders}
        >
          Reintentar
        </button>
      </main>
    );
  if (!orders.length)
    return (
      <main className="account-page">
        <p className="eyebrow">Órdenes</p>
        <h1>Aún no tienes órdenes.</h1>
        <Link className="button button-dark" to="/tienda">
          Ver la tienda
        </Link>
      </main>
    );

  return (
    <main className="account-page">
      <p className="eyebrow">Órdenes</p>
      <h1>Lo que has elegido.</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div className="order-row" key={order.orderId}>
            <div>
              <strong>Orden {order.orderId}</strong>
              <span>{order.orderStatus || order.status}</span>
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
    </main>
  );
}
