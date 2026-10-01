import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productsApi } from "../../api/products.api";
import { categoriesApi } from "../../api/categories.api";
import { formatMoney } from "../../utils/money";
import { adminError, minorUnits, statusLabel } from "../../utils/admin";
import { uploadProductImage } from "../../services/productImages";
import { AdminFeedback } from "../../components/admin/AdminFeedback";
import { placeholderImage } from "../../utils/placeholderImage";
const empty = {
  name: "",
  description: "",
  price: "",
  currency: "USD",
  categoryId: "",
  sku: "",
  slug: "",
  imageUrl: "",
  stock: "0",
  status: "active",
};
export function AdminProductsPage() {
  const [products, setProducts] = useState([]),
    [categories, setCategories] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all"),
    [editor, setEditor] = useState(null),
    [inventory, setInventory] = useState(null),
    [busy, setBusy] = useState(false);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const [p, c] = await Promise.all([
        productsApi.list({ includeInactive: true }),
        categoriesApi.list({ includeInactive: true }),
      ]);
      setProducts(p.data);
      setCategories(c.data);
    } catch (e) {
      setError(adminError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    Promise.all([
      productsApi.list({ includeInactive: true }),
      categoriesApi.list({ includeInactive: true }),
    ])
      .then((response) => {
        if (active) {
          setProducts(response[0].data);
          setCategories(response[1].data);
        }
      })
      .catch((e) => {
        if (active) setError(adminError(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function openInventory(p) {
    setBusy(true);
    setError("");
    try {
      const { data } = await productsApi.inventory(p.productId);
      setInventory({ ...data, productName: p.name });
    } catch (e) {
      if (e.response?.status === 404)
        setInventory({
          productId: p.productId,
          productName: p.name,
          availableQuantity: 0,
          reservedQuantity: 0,
          uninitialized: true,
        });
      else setError(adminError(e));
    } finally {
      setBusy(false);
    }
  }
  const visible = products.filter(
    (p) =>
      (filter === "all" || p.status === filter) &&
      `${p.name} ${p.sku || ""}`.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="dashboard-page admin-workspace">
      <p className="eyebrow">Administración / Productos</p>
      <div className="admin-heading">
        <div>
          <h1>Tu catálogo.</h1>
          <p>Publica, edita y controla las existencias de cada pieza.</p>
        </div>
        <button
          className="button button-dark"
          disabled={busy || !!editor || !!inventory}
          onClick={() => {
            setEditor({ ...empty });
            setMessage("");
          }}
        >
          Nuevo producto
        </button>
      </div>
      <AdminFeedback error={error} message={message} />
      {editor && (
        <ProductEditor
          key={editor.productId || "new"}
          product={editor}
          categories={categories}
          onCancel={() => setEditor(null)}
          onSaved={(p) => {
            setProducts((all) => [
              p,
              ...all.filter((x) => x.productId !== p.productId),
            ]);
            setEditor(null);
            setMessage("Producto guardado.");
          }}
        />
      )}
      {inventory && (
        <InventoryEditor
          key={inventory.productId}
          inventory={inventory}
          onCancel={() => setInventory(null)}
          onSaved={(i) => {
            setProducts((all) =>
              all.map((p) =>
                p.productId === i.productId
                  ? { ...p, stock: i.availableQuantity }
                  : p,
              ),
            );
            setInventory(null);
            setMessage("Existencias actualizadas.");
          }}
        />
      )}
      <div className="admin-toolbar">
        <label>
          Buscar
          <input
            type="search"
            placeholder="Nombre o SKU"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label>
          Estado
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </label>
        <button
          className="button button-outline"
          disabled={loading || busy}
          onClick={load}
        >
          Actualizar
        </button>
        <Link to="/admin/categorias">Gestionar categorías</Link>
      </div>
      {loading ? (
        <p role="status">Cargando catálogo…</p>
      ) : (
        <>
          <p className="admin-muted">{visible.length} productos</p>
          <div className="admin-cards">
            {visible.map((p) => (
              <article className="admin-item" key={p.productId}>
                <img
                  src={p.imageUrl || placeholderImage(p.productId, 120, 120)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = placeholderImage(
                      p.productId,
                      120,
                      120,
                    );
                  }}
                />
                <div className="admin-item-content">
                  <span
                    className={`admin-badge ${p.status === "inactive" ? "is-inactive" : ""}`}
                  >
                    {statusLabel(p.status)}
                  </span>
                  <h2>{p.name}</h2>
                  <p>
                    {formatMoney(p.price, p.currency)} · {p.stock ?? 0}{" "}
                    disponibles
                  </p>
                  <small>
                    {categories.find((c) => c.categoryId === p.categoryId)
                      ?.name || "Sin categoría"}
                    {p.sku ? ` · ${p.sku}` : ""}
                  </small>
                  <div className="admin-actions">
                    <button
                      disabled={busy || !!editor || !!inventory}
                      onClick={() =>
                        setEditor({
                          ...empty,
                          ...p,
                          price: (p.price / 100).toFixed(2),
                        })
                      }
                    >
                      Editar
                    </button>
                    <button
                      disabled={busy || !!editor || !!inventory}
                      onClick={() => openInventory(p)}
                    >
                      Inventario
                    </button>
                    {p.status === "active" && (
                      <Link to={`/productos/${p.productId}`}>
                        Ver en tienda
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!visible.length && (
            <p className="admin-empty">
              No hay productos que coincidan. Crea uno o cambia los filtros.
            </p>
          )}
        </>
      )}
    </div>
  );
}
function ProductEditor({ product, categories, onCancel, onSaved }) {
  const [form, setForm] = useState(product),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false),
    [progress, setProgress] = useState(0),
    [error, setError] = useState("");
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  async function upload(e) {
    const input = e.target,
      file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setProgress(0);
    try {
      const url = await uploadProductImage(file, setProgress);
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch (err) {
      setError(adminError(err));
    } finally {
      setUploading(false);
      input.value = "";
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        name: form.name.trim(),
        description: form.description,
        price: minorUnits(form.price),
        currency: form.currency,
        sku: form.sku,
        status: form.status,
      };
      if (form.slug.trim()) body.slug = form.slug.trim();
      if (
        form.categoryId &&
        (!product.productId || form.categoryId !== product.categoryId)
      )
        body.categoryId = form.categoryId;
      if (form.imageUrl.trim()) body.imageUrl = form.imageUrl.trim();
      if (!product.productId) {
        const stock = Number(form.stock);
        if (form.stock === "" || !Number.isSafeInteger(stock) || stock < 0)
          throw new Error(
            "Las existencias deben ser un entero igual o mayor que cero.",
          );
        body.stock = stock;
      }
      const { data } = product.productId
        ? await productsApi.update(product.productId, body)
        : await productsApi.create(body);
      onSaved(data);
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-panel admin-form" onSubmit={save}>
      <h2>{product.productId ? "Editar producto" : "Nuevo producto"}</h2>
      <AdminFeedback error={error} />
      <fieldset disabled={busy || uploading}>
        <div className="admin-form-grid">
          <label>
            Nombre
            <input
              name="name"
              value={form.name}
              onChange={change}
              required
              maxLength={200}
            />
          </label>
          <label>
            SKU
            <input
              name="sku"
              value={form.sku}
              onChange={change}
              maxLength={200}
            />
          </label>
          <label>
            Precio
            <input
              name="price"
              type="number"
              step="0.01"
              min="0.01"
              value={form.price}
              onChange={change}
              required
            />
          </label>
          <label>
            Moneda
            <select name="currency" value={form.currency} onChange={change}>
              {[...new Set(["USD", "PEN", "EUR", form.currency])].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Categoría
            <select name="categoryId" value={form.categoryId} onChange={change}>
              <option value="" disabled={!!product.categoryId}>
                Sin categoría
              </option>
              {categories
                .filter(
                  (c) =>
                    c.status === "active" ||
                    c.categoryId === product.categoryId,
                )
                .map((c) => (
                  <option
                    key={c.categoryId}
                    value={c.categoryId}
                    disabled={c.status !== "active"}
                  >
                    {c.name}
                    {c.status !== "active" ? " (inactiva)" : ""}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Estado
            <select name="status" value={form.status} onChange={change}>
              <option value="active">Activo · visible en tienda</option>
              <option value="inactive">Inactivo · oculto en tienda</option>
            </select>
          </label>
          {!product.productId && (
            <label>
              Existencias iniciales
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={change}
                required
              />
            </label>
          )}
          <label>
            Slug (opcional)
            <input
              name="slug"
              value={form.slug}
              onChange={change}
              maxLength={200}
            />
          </label>
          <label className="admin-wide">
            Descripción
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              maxLength={10000}
              rows={4}
            />
          </label>
          <label className="admin-wide">
            Imagen del producto
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={upload}
            />
            <small>
              JPG, PNG o WebP, hasta 5 MB. La imagen se sube al seleccionarla;
              guarda el producto para asociarla.
            </small>
          </label>
          <label className="admin-wide">
            URL de la imagen
            <input
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={change}
              placeholder="https://…"
              required={!!product.imageUrl}
            />
          </label>
        </div>
      </fieldset>
      {uploading && (
        <p role="status">
          Subiendo imagen… {progress}% <progress max="100" value={progress} />
        </p>
      )}
      {form.imageUrl && (
        <img
          className="admin-preview"
          src={form.imageUrl}
          alt="Vista previa del producto"
        />
      )}
      <div className="admin-actions">
        <button className="button button-dark" disabled={busy || uploading}>
          {busy ? "Guardando…" : "Guardar producto"}
        </button>
        <button
          type="button"
          className="button button-outline"
          disabled={busy || uploading}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
function InventoryEditor({ inventory, onCancel, onSaved }) {
  const [current, setCurrent] = useState(inventory),
    [quantity, setQuantity] = useState(String(inventory.availableQuantity)),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const value = Number(quantity);
      if (quantity === "" || !Number.isSafeInteger(value) || value < 0)
        throw new Error(
          "Introduce una cantidad entera igual o mayor que cero.",
        );
      const { data } = await productsApi.updateInventory(current.productId, {
        availableQuantity: value,
        expectedAvailableQuantity: current.availableQuantity,
      });
      onSaved(data);
    } catch (err) {
      if (err.response?.status === 409) {
        try {
          const { data } = await productsApi.inventory(current.productId);
          setCurrent(data);
          setQuantity(String(data.availableQuantity));
        } catch {
          /* Preserve snapshot to prevent overwriting concurrent changes. */
        }
      }
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="admin-panel admin-form" onSubmit={save}>
      <h2>Inventario · {inventory.productName}</h2>
      <p>
        Disponibles: {current.availableQuantity} · Reservadas:{" "}
        {current.reservedQuantity ?? 0}
      </p>
      {inventory.uninitialized && (
        <p>
          Este producto aún no tiene inventario. Guardar inicializará sus
          existencias.
        </p>
      )}
      <p>
        Introduce el total disponible, no la cantidad que deseas sumar. Las
        reservas no se modifican.
      </p>
      <AdminFeedback error={error} />
      <label>
        Nueva cantidad disponible
        <input
          type="number"
          min="0"
          step="1"
          required
          value={quantity}
          disabled={busy}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>
      <div className="admin-actions">
        <button className="button button-dark" disabled={busy}>
          {busy ? "Guardando…" : "Guardar existencias"}
        </button>
        <button
          type="button"
          className="button button-outline"
          disabled={busy}
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
