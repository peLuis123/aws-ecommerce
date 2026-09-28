import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { ordersApi } from "../../api/orders.api";
import { checkoutUrls } from "../../config/env";
import { useCart } from "../../hooks/useCart";
import { createIdempotencyKey } from "../../utils/idempotency";
import { formatMoney } from "../../utils/money";
import { demoMode } from "../../data/demo";
import { Icon } from "../../components/ui/Icon";

export function CheckoutPage() {
  const { cart } = useCart();
  const [provider, setProvider] = useState("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  if (!cart?.items?.length)
    return (
      <main className="checkout-page">
        <div className="empty-state">
          <Icon name="bag" size={40} />
          <h1>Tu bolsa está vacía.</h1>
          <Link className="button button-dark" to="/tienda">
            Explorar la colección
          </Link>
        </div>
      </main>
    );
  const total = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
  const handleCheckout = async () => {
    setIsSubmitting(true);
    const idempotencyKey = createIdempotencyKey();
    try {
      const { data: order } = await ordersApi.create({ cartId: cart.cartId });
      await ordersApi.reserveInventory(order.orderId);
      const response = await ordersApi.checkout(
        order.orderId,
        {
          paymentProvider: provider,
          successUrl: checkoutUrls.success,
          cancelUrl: checkoutUrls.cancel,
          idempotencyKey,
        },
        idempotencyKey,
      );
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      toast.error(
        error.response?.data?.error || "No pudimos iniciar el checkout.",
      );
      setIsSubmitting(false);
    }
  };
  return (
    <main className="checkout-page">
      <div className="checkout-steps">
        <Link to="/carrito">01 · Tu bolsa</Link>
        <span>—</span>
        <strong>02 · Confirmación</strong>
        <span>—</span>
        <span>03 · Listo</span>
      </div>
      <p className="eyebrow">CASI EN CASA</p>
      <h1>Un último paso.</h1>
      <div className="shopping-layout">
        <section>
          <h2>Todo listo para continuar.</h2>
          <p className="checkout-help">
            Revisa tu selección y elige cómo prefieres pagar.{" "}
            {demoMode
              ? "En esta demostración simularemos una compra aprobada. No necesitas tarjeta ni datos personales."
              : "Continuarás al sitio del proveedor para completar el pago."}
          </p>
          <fieldset className="provider-fieldset">
            <legend>Tu forma de pago</legend>
            <label>
              <input
                type="radio"
                name="provider"
                checked={provider === "stripe"}
                onChange={() => setProvider("stripe")}
              />
              Tarjeta · Stripe
            </label>
            <label>
              <input
                type="radio"
                name="provider"
                checked={provider === "paypal"}
                onChange={() => setProvider("paypal")}
              />
              PayPal
            </label>
          </fieldset>
          <div className="detail-note">
            <Icon name={demoMode ? "leaf" : "box"} />
            {demoMode
              ? "Modo demo · No se procesará ningún pago real."
              : "El estado final de tu pago se confirmará con el proveedor."}
          </div>
          <Link className="continue-shopping" to="/carrito">
            <Icon name="arrow" size={16} />
            Volver a mi bolsa
          </Link>
        </section>
        <aside className="summary-panel">
          <h2>Tu pedido</h2>
          {cart.items.map((item) => (
            <div className="cart-row" key={item.cartItemId}>
              <div>
                <strong>{item.productName || item.productId}</strong>
                <span>{item.quantity} unidad(es)</span>
              </div>
              <span>{formatMoney(item.totalAmount, cart.currency)}</span>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <strong>{formatMoney(total, cart.currency)}</strong>
          </div>
          <button
            className="button button-dark"
            disabled={isSubmitting}
            onClick={handleCheckout}
          >
            {isSubmitting
              ? "Preparando tu pedido…"
              : demoMode
                ? "Simular mi compra"
                : "Continuar al pago"}
            <Icon name="arrow" size={18} />
          </button>
          <p>
            {demoMode
              ? "Los productos y pedidos son de prueba."
              : "Confirma los detalles antes de finalizar."}
          </p>
        </aside>
      </div>
    </main>
  );
}
