import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { categoriesApi } from "../../api/categories.api";
import { productsApi } from "../../api/products.api";
import { ProductCard } from "../../components/product/ProductCard";
import { Icon } from "../../components/ui/Icon";

export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const category = params.get("categoria") || "all";
  const load = () => {
    setStatus("loading");
    Promise.all([productsApi.list(), categoriesApi.list()])
      .then(([p, c]) => {
        setProducts(p.data);
        setCategories(c.data);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  };
  useEffect(() => {
    let active = true;
    Promise.all([productsApi.list(), categoriesApi.list()])
      .then(([p, c]) => {
        if (active) {
          setProducts(p.data);
          setCategories(c.data);
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
  const visible = products
    .filter(
      (p) =>
        (category === "all" || p.categoryId === category) &&
        `${p.name} ${p.description || ""}`
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "name"
            ? a.name.localeCompare(b.name)
            : 0,
    );
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
            onClick={() => setParams({})}
          >
            Todo
          </button>
          {categories.map((c) => (
            <button
              key={c.categoryId}
              className={category === c.categoryId ? "is-active" : ""}
              onClick={() => setParams({ categoria: c.categoryId })}
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
            onChange={(event) => setQuery(event.target.value)}
            autoFocus={params.has("buscar")}
          />
        </label>
      </div>
      <div className="catalog-results">
        <span>{visible.length} objetos para tu hogar</span>
        <label>
          Ordenar por{" "}
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
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
          <button className="button button-dark" onClick={load}>
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
              setQuery("");
              setParams({});
            }}
          >
            Ver toda la colección
          </button>
        </div>
      )}
    </main>
  );
}
