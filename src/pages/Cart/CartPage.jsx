import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "../../utils/money";
import { useCart } from "../../hooks/useCart";
import { demoMode } from "../../data/demo";
import { Icon } from "../../components/ui/Icon";

export function CartPage() {
  const { cart, isLoading, updateItem, removeItem } = useCart();
  const [busy, setBusy] = useState(false);
  async function change(action) {
    setBusy(true);
    try {
      await action();
    } catch (error) {
      toast.error(
        error.response?.data?.error || "No pudimos actualizar la bolsa.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (isLoading && !cart)
    return (
      <main className="cart-page">
        <p>Cargando tu bolsa…</p>
      </main>
    );
  if (!cart?.items?.length)
    return (
      <main className="cart-page">
        <div className="empty-state">
          <Icon name="bag" size={44} />
          <p className="eyebrow">TU BOLSA</p>
          <h1>Aquí empieza algo bonito.</h1>
          <p>Tu bolsa está vacía. Encuentra esa pieza que se siente como tú.</p>
          <Link className="button button-dark" to="/tienda">
            Explorar la colección <Icon name="arrow" />
          </Link>
        </div>
      </main>
    );
  const total = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
  return (
    <main className="cart-page">
      <div className="breadcrumb">
        <Link to="/tienda">La colección</Link>
        <span>/</span>Mi bolsa
      </div>
      <p className="eyebrow">ELEGIDO POR TI</p>
      <h1>Una bolsa de cosas bonitas.</h1>
      <div className="shopping-layout">
        <div>
          <div className="cart-list">
            {cart.items.map((item) => (
              <article className="cart-item" key={item.cartItemId}>
                {item.imageUrl ? (
                  <Link to={`/productos/${item.productId}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.productName || item.productId}
                    />
                  </Link>
                ) : (
                  <Icon name="bag" size={40} />
                )}
                <div>
                  <Link to={`/productos/${item.productId}`}>
                    <h3>{item.productName || item.productId}</h3>
                  </Link>
                  <p>{formatMoney(item.unitAmount, cart.currency)} / unidad</p>
                  {demoMode ? (
                    <div className="quantity-control">
                      <button
                        aria-label={`Reducir ${item.productName}`}
                        disabled={busy || item.quantity <= 1}
                        onClick={() =>
                          change(() =>
                            updateItem(item.productId, item.quantity - 1),
                          )
                        }
                      >
                        −
                      </button>
                      <input
                        aria-label={`Cantidad de ${item.productName}`}
                        readOnly
                        value={item.quantity}
                      />
                      <button
                        aria-label={`Aumentar ${item.productName}`}
                        disabled={busy}
                        onClick={() =>
                          change(() =>
                            updateItem(item.productId, item.quantity + 1),
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <span>{item.quantity} unidades</span>
                  )}
                </div>
                <div className="cart-item-actions">
                  <strong>
                    {formatMoney(item.totalAmount, cart.currency)}
                  </strong>
                  {demoMode && (
                    <button
                      className="remove-button"
                      disabled={busy}
                      onClick={() => change(() => removeItem(item.productId))}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Link className="continue-shopping" to="/tienda">
            <Icon name="arrow" size={16} />
            Seguir explorando
          </Link>
        </div>
        <aside className="summary-panel">
          <h2>Tu selección</h2>
          <div className="summary-line">
            <span>Subtotal</span>
            <span>{formatMoney(total, cart.currency)}</span>
          </div>
          <div className="summary-line">
            <span>Envío</span>
            <span>{demoMode ? "No aplica en demo" : "Por confirmar"}</span>
          </div>
          <div className="cart-total">
            <span>Total estimado</span>
            <strong>{formatMoney(total, cart.currency)}</strong>
          </div>
          <Link className="button button-dark" to="/checkout">
            Continuar al checkout <Icon name="arrow" size={18} />
          </Link>
          <p>
            {demoMode
              ? "Compra de demostración. No se realizará ningún cobro."
              : "Revisa tu selección antes de continuar al pago."}
          </p>
        </aside>
      </div>
    </main>
  );
}
