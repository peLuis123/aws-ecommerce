import { useEffect, useState } from "react";
import { productsApi } from "../../api/products.api";
import { MissingRouteWarning } from "../../components/ui/MissingRouteWarning";
import { formatMoney } from "../../utils/money";
import { placeholderImage } from "../../utils/placeholderImage";

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    productsApi
      .list({ includeInactive: true })
      .then((response) => {
        setProducts(response.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Productos</p>
        <h1>Cargando catálogo...</h1>
      </div>
    );
  if (state === "error")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Productos</p>
        <h1>No pudimos cargar los productos.</h1>
        <p className="cart-message">Vuelve a intentarlo en unos momentos.</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <p className="eyebrow">Productos</p>
      <div className="dashboard-title-row">
        <h1>Tu catálogo.</h1>
      </div>
      <MissingRouteWarning message="Tu colección, de un vistazo. La edición de productos estará disponible en una próxima versión." />
      <div className="admin-product-list">
        {products.map((product) => (
          <article className="admin-product-row" key={product.productId}>
            <img
              src={
                product.imageUrl ||
                placeholderImage(product.productId, 120, 120)
              }
              alt=""
            />
            <div>
              <strong>{product.name}</strong>
              <span>
                {formatMoney(product.price, product.currency)} / stock:{" "}
                {product.stock}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
