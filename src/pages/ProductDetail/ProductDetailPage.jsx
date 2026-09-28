import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { productsApi } from "../../api/products.api";
import { useCart } from "../../hooks/useCart";
import { formatMoney } from "../../utils/money";
import { placeholderImage } from "../../utils/placeholderImage";
import { Icon } from "../../components/ui/Icon";
import { ProductCard } from "../../components/product/ProductCard";

export function ProductDetailPage() {
  const { productId } = useParams();
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    let active = true;
    productsApi
      .list()
      .then(({ data }) => {
        if (active) {
          setProducts(data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    return () => {
      active = false;
    };
  }, []);
  const product = products.find((item) => item.productId === productId);
  if (status === "loading")
    return (
      <main className="product-detail">
        <div className="detail-grid">
          <div className="skeleton" />
          <p>Cargando tu próxima pieza favorita…</p>
        </div>
      </main>
    );
  if (!product)
    return (
      <main className="product-detail">
        <div className="empty-state">
          <h1>
            {status === "error"
              ? "No pudimos cargar esta pieza."
              : "Esta pieza no está disponible."}
          </h1>
          <Link className="button button-dark" to="/tienda">
            Volver a la colección
          </Link>
        </div>
      </main>
    );
  const maxQuantity = Math.max(product.stock || 0, 1);
  const actualQuantity = Math.min(quantity, maxQuantity);
  async function add() {
    setBusy(true);
    try {
      await addItem(product.productId, actualQuantity);
      toast.success(`${product.name} está en tu bolsa`);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "No pudimos agregar el producto.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="product-detail">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/tienda">La colección</Link>
        <span>/</span>
        {product.name}
      </div>
      <div className="detail-grid">
        <div className="detail-image-wrap">
          <img
            src={
              product.imageUrl ||
              placeholderImage(product.productId, 1000, 1000)
            }
            alt={product.name}
          />
          {product.badge && (
            <span className="product-badge">{product.badge}</span>
          )}
        </div>
        <div className="detail-copy">
          <p className="eyebrow">LA SELECCIÓN NATIVA</p>
          <h1>{product.name}</h1>
          <p className="detail-price">
            {formatMoney(product.price, product.currency)}
          </p>
          <p className="detail-description">
            {product.description ||
              "Una pieza elegida para acompañar tu día a día."}
          </p>
          <div className="product-color">
            <i style={{ background: product.color || "#c3b29a" }} />
            <span>Tono natural</span>
          </div>
          <p className="detail-stock">
            <Icon name="check" size={15} />
            {product.stock === 0
              ? "Agotado por ahora"
              : `${product.stock} unidades disponibles`}
          </p>
          <div className="purchase-row">
            <div className="quantity-control">
              <button
                aria-label="Reducir cantidad"
                disabled={actualQuantity <= 1}
                onClick={() => setQuantity(actualQuantity - 1)}
              >
                −
              </button>
              <input
                aria-label="Cantidad"
                type="number"
                min="1"
                max={maxQuantity}
                value={actualQuantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      maxQuantity,
                      Math.max(1, Math.trunc(Number(e.target.value)) || 1),
                    ),
                  )
                }
              />
              <button
                aria-label="Aumentar cantidad"
                disabled={actualQuantity >= maxQuantity}
                onClick={() => setQuantity(actualQuantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="button button-dark"
              disabled={busy || product.stock === 0}
              onClick={add}
            >
              {busy ? "Agregando…" : "Agregar a mi bolsa"}
              <Icon name="bag" size={18} />
            </button>
          </div>
          <p className="detail-note">
            <Icon name="leaf" size={17} />
            Un pequeño detalle. Una nueva sensación.
          </p>
          <div className="detail-facts">
            <details open>
              <summary>Los detalles</summary>
              <p>
                {product.material ||
                  product.subtitle ||
                  "Consulta la descripción del producto."}
                {product.dimensions && (
                  <>
                    <br />
                    Medidas: {product.dimensions}
                  </>
                )}
                <br />
                Referencia: {product.sku || product.productId}
              </p>
            </details>
            <details>
              <summary>Una pieza para tu hogar</summary>
              <p>
                Revisa las medidas y los materiales para encontrar el lugar
                ideal en tu espacio. Las fotografías son referenciales.
              </p>
            </details>
          </div>
        </div>
      </div>
      <section className="related-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MEJOR EN COMPAÑÍA</p>
            <h2>También van contigo.</h2>
          </div>
          <Link className="text-link" to="/tienda">
            Ver la colección <Icon name="arrow" size={18} />
          </Link>
        </div>
        <div className="product-grid">
          {products
            .filter((p) => p.productId !== productId)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.productId} product={p} />
            ))}
        </div>
      </section>
    </main>
  );
}
