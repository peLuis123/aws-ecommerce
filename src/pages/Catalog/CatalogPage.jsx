import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoriesApi } from "../../api/categories.api";
import { productsApi } from "../../api/products.api";
import { ProductCard } from "../../components/product/ProductCard";
import { Icon } from "../../components/ui/Icon";
import "./pagination.css";

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const query = params.get("q") || "";
  const requestedSort = params.get("orden");
  const sort = ["low", "high", "name"].includes(requestedSort) ? requestedSort : "featured";
  const rawPage = Number(params.get("pagina") || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 && rawPage <= 1000000 ? rawPage : 1;
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [retry, setRetry] = useState(0);
  const category = params.get("categoria") || "all";
  const update = (key, value) => {
    const next = new URLSearchParams(params);
    next.delete("pagina");
    if (value) next.set(key, value); else next.delete(key);
    if (next.toString() === params.toString()) return;
    setStatus("loading");
    setParams(next, { replace: key === "q" });
  };
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
    Promise.all([productsApi.list({ page, pageSize: 12, q: query, sort, category: category === "all" ? "" : category }), categoriesApi.list()])
      .then(([p, c]) => {
        if (active) {
          if (!Array.isArray(p.data.items)) throw new Error("El backend necesita la actualización de paginación.");
          setProducts(p.data.items);
          setPagination(p.data);
          setCategories(c.data);
          setStatus("success");
        }
      })
      .catch(() => {
        if (active) setStatus("error");
      });
    }, query ? 250 : 0);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [page, query, sort, category, retry]);
  const visible = products;
  return (
    <main className="catalog-page">
      <div className="breadcrumb">
        Inicio <span>/</span> La colección
      </div>
      <div className="catalog-heading">
        <div>
          <p className="eyebrow">OBJETOS PARA HABITAR</p>
          <h1>
            Tu próximo favorito
            <br />
            está <em>por aquí.</em>
          </h1>
        </div>
        <p>
          Materiales naturales, formas sencillas
          <br />y detalles que hacen la diferencia.
          <br />
          Elige lo que va contigo.
        </p>
      </div>
      <div className="catalog-toolbar">
        <div className="category-filter">
          <button
            className={category === "all" ? "is-active" : ""}
            onClick={() => update("categoria", "")}
          >
            Todo
          </button>
          {categories.map((c) => (
            <button
              key={c.categoryId}
              className={category === c.categoryId || category === c.slug ? "is-active" : ""}
              onClick={() => update("categoria", c.slug || c.categoryId)}
            >
              {c.name}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Encuentra algo especial"
            aria-label="Buscar productos"
            value={query}
            maxLength={200}
            onChange={(event) => update("q", event.target.value)}
            autoFocus={params.has("buscar")}
          />
        </label>
      </div>
      <div className="catalog-results">
        <span aria-live="polite">{status === "loading" ? "Cargando productos…" : `${pagination.total} objetos para tu hogar`}</span>
        <label>
          Ordenar por{" "}
          <select
            value={sort}
            onChange={(event) => update("orden", event.target.value)}
            aria-label="Ordenar productos"
          >
            <option value="featured">Nuestra selección</option>
            <option value="low">Precio: menor a mayor</option>
            <option value="high">Precio: mayor a menor</option>
            <option value="name">Nombre</option>
          </select>
        </label>
      </div>
      {status === "loading" ? (
        <div className="product-grid">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton" key={i} aria-label="Cargando producto" />
          ))}
        </div>
      ) : status === "error" ? (
        <div className="empty-state">
          <h2>La colección se está haciendo esperar.</h2>
          <p>No pudimos cargar los productos.</p>
          <button className="button button-dark" onClick={() => { setStatus("loading"); setRetry(value => value + 1); }}>
            Reintentar
          </button>
        </div>
      ) : visible.length ? (
        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard product={product} key={product.productId} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="search" size={36} />
          <h2>No encontramos esa pieza.</h2>
          <p>Prueba con otro nombre o explora todas las categorías.</p>
          <button
            className="button button-dark"
            onClick={() => {
              setStatus("loading");
              setParams({});
            }}
          >
            Ver toda la colección
          </button>
        </div>
      )}
      {status === "success" && pagination.total > 0 && (
        <nav className="catalog-pagination" aria-label="Paginación de productos">
          <span>Mostrando {(pagination.page - 1) * 12 + 1}–{Math.min(pagination.page * 12, pagination.total)} de {pagination.total}</span>
          <div>
            <button className="button button-outline" disabled={pagination.page <= 1} onClick={() => update("pagina", String(pagination.page - 1))}>Anterior</button>
            <span aria-live="polite">Página {pagination.page} de {pagination.totalPages}</span>
            <button className="button button-outline" disabled={pagination.page >= pagination.totalPages} onClick={() => update("pagina", String(pagination.page + 1))}>Siguiente</button>
          </div>
        </nav>
      )}
    </main>
  );
}
