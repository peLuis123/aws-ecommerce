import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "../../hooks/useCart";
import { placeholderImage } from "../../utils/placeholderImage";
import { formatMoney } from "../../utils/money";
import { Icon } from "../ui/Icon";
import { useState } from "react";

export function ProductCard({ product }) {
  const { addItem } = useCart();
  const [busy, setBusy] = useState(false);
  async function add() {
    setBusy(true);
    try {
      await addItem(product.productId, 1);
      toast.success(`${product.name} está en tu bolsa`);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Inicia sesión para agregar productos.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link
          to={`/productos/${product.productId}`}
          tabIndex={-1}
          aria-label={product.name}
        >
          <img
            src={
              product.imageUrl || placeholderImage(product.productId, 700, 700)
            }
            alt={product.name}
            loading="lazy"
          />
        </Link>
        {(product.badge || product.stock === 0) && (
          <span className="product-badge">
            {product.stock === 0 ? "Agotado" : product.badge}
          </span>
        )}
        <button
          className="quick-add"
          type="button"
          disabled={busy || product.stock === 0}
          onClick={add}
          aria-label={`Agregar ${product.name} a la bolsa`}
        >
          <Icon name={busy ? "check" : "bag"} size={18} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <Link to={`/productos/${product.productId}`}>
            <h3>{product.name}</h3>
          </Link>
          <p>{product.subtitle || product.sku || "Selección Casa Nativa"}</p>
        </div>
        <span>{formatMoney(product.price, product.currency)}</span>
      </div>
      <div className="product-color" aria-label="Color del producto">
        <i style={{ background: product.color || "#c3b29a" }} />
        <span>Tono natural</span>
      </div>
    </article>
  );
}
