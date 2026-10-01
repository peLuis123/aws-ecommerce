import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ordersApi } from "../../api/orders.api";
import { paymentsApi } from "../../api/payments.api";
import { adminPaymentsApi } from "../../api/adminPayments.api";
import { formatMoney } from "../../utils/money";
import { adminError, minorUnits, statusLabel } from "../../utils/admin";
import { AdminFeedback } from "../../components/admin/AdminFeedback";
import { FinancialAction } from "../../components/admin/FinancialAction";
export function AdminOrderDetailPage() {
  const { orderId } = useParams();
  return <OrderDetail key={orderId} orderId={orderId} />;
}
function OrderDetail({ orderId }) {
  const [order, setOrder] = useState(null),
    [payment, setPayment] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [paymentError, setPaymentError] = useState(""),
    [amount, setAmount] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    setPaymentError("");
    try {
      const { data } = await ordersApi.get(orderId);
      setOrder(data);
      setPayment(null);
      if (data.paymentId) {
        try {
          const p = await paymentsApi.get(data.paymentId);
          setPayment(p.data);
        } catch (e) {
          setPaymentError(adminError(e));
        }
      }
    } catch (e) {
      setError(adminError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    async function initial() {
      try {
        const { data } = await ordersApi.get(orderId);
        if (!active) return;
        setOrder(data);
        if (data.paymentId) {
          try {
            const p = await paymentsApi.get(data.paymentId);
            if (active) setPayment(p.data);
          } catch (e) {
            if (active) setPaymentError(adminError(e));
          }
        }
      } catch (e) {
        if (active) setError(adminError(e));
      } finally {
        if (active) setLoading(false);
      }
    }
    initial();
    return () => {
      active = false;
    };
  }, [orderId]);
  function build() {
    const value = minorUnits(amount);
    if (value > payment.amount)
      throw new Error("El importe supera el pago original.");
    return {
      paymentId: order.paymentId,
      amount: value,
      currency: payment.currency || order.currency,
    };
  }
  return (
    <div className="dashboard-page admin-workspace">
      <Link to="/admin/ordenes">← Volver a pedidos</Link>
      <div className="admin-heading">
        <h1>Detalle del pedido.</h1>
        <button
          className="button button-outline"
          onClick={load}
          disabled={loading}
        >
          Actualizar
        </button>
      </div>
      <AdminFeedback error={error} />
      {loading && <p role="status">Cargando pedido…</p>}
      {order && (
        <>
          <p className="admin-id">{order.orderId}</p>
          <div className="admin-panel">
            <dl className="admin-facts">
              <div>
                <dt>Pedido</dt>
                <dd>{statusLabel(order.orderStatus || order.status)}</dd>
              </div>
              <div>
                <dt>Pago</dt>
                <dd>{statusLabel(payment?.status || order.paymentStatus)}</dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleString("es-PE")
                    : "—"}
                </dd>
              </div>
              <div>
                <dt>Comprador</dt>
                <dd className="admin-id">{order.userId}</dd>
              </div>
            </dl>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption>Productos del pedido</caption>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((i, index) => (
                  <tr key={i.lineItemId || index}>
                    <td>
                      {i.productName || i.productId}
                      <small>{i.sku}</small>
                    </td>
                    <td>{i.quantity}</td>
                    <td>{formatMoney(i.unitAmount, order.currency)}</td>
                    <td>
                      {formatMoney(
                        i.totalAmount ?? i.unitAmount * i.quantity,
                        order.currency,
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!order.items?.length && (
            <p>Este pedido no tiene líneas disponibles.</p>
          )}
          <dl className="admin-totals">
            {[
              ["Subtotal", order.subtotal],
              ["Descuento", order.discount],
              ["Impuestos", order.tax],
              ["Envío", order.shippingAmount],
              ["Total", order.totalAmount ?? order.total],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatMoney(value, order.currency)}</dd>
              </div>
            ))}
          </dl>
          <AdminFeedback
            error={
              paymentError
                ? `No se pudo consultar el pago: ${paymentError}`
                : ""
            }
          />
          {payment && ["approved", "disputed"].includes(payment.status) && (
            <FinancialAction
              kind="refund"
              scope={orderId}
              build={build}
              send={adminPaymentsApi.refund}
              onSuccess={load}
            >
              <label>
                Importe a reembolsar ({payment.currency || order.currency})
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={payment.amount / 100}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </label>
              <p>
                Pago original: {formatMoney(payment.amount, payment.currency)}.
                Comprueba los reembolsos anteriores antes de solicitar otro
                parcial.
              </p>
            </FinancialAction>
          )}
        </>
      )}
    </div>
  );
}
