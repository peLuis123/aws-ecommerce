import { useEffect, useState } from "react";
import { categoriesApi } from "../../api/categories.api";
import { AdminFeedback } from "../../components/admin/AdminFeedback";
import { AdminModal } from "../../components/admin/AdminModal";
import { adminError, statusLabel } from "../../utils/admin";
export function AdminCategoriesPage() {
  const [items, setItems] = useState([]),
    [form, setForm] = useState(null),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await categoriesApi.list({ includeInactive: true });
      setItems(data);
    } catch (e) {
      setError(adminError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    categoriesApi
      .list({ includeInactive: true })
      .then((response) => {
        if (active) {
          setItems(response.data);
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
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = {
        name: form.name.trim(),
        description: form.description,
        status: form.status,
      };
      if (form.slug.trim()) body.slug = form.slug.trim();
      const { data } = form.categoryId
        ? await categoriesApi.update(form.categoryId, body)
        : await categoriesApi.create(body);
      setItems((all) => [
        data,
        ...all.filter((c) => c.categoryId !== data.categoryId),
      ]);
      setForm(null);
      setMessage("Categoría guardada.");
    } catch (err) {
      setError(adminError(err));
    } finally {
      setBusy(false);
    }
  }
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  return (
    <div className="dashboard-page admin-workspace">
      <p className="eyebrow">Administración / Categorías</p>
      <div className="admin-heading">
        <div>
          <h1>Organiza tu colección.</h1>
          <p>
            Las categorías inactivas dejan de ofrecerse para nuevos productos.
          </p>
        </div>
        <button
          className="button button-dark"
          disabled={busy || !!form}
          onClick={() => {
            setForm({ name: "", slug: "", description: "", status: "active" });
            setError("");
            setMessage("");
          }}
        >
          Nueva categoría
        </button>
      </div>
      <AdminFeedback error={form ? "" : error} message={message} />
      {form && (
        <AdminModal title={form.categoryId ? "Editar categoría" : "Nueva categoría"} busy={busy} onClose={() => setForm(null)}>
        <form className="admin-panel admin-form" onSubmit={save}>
          <AdminFeedback error={error} />
          <fieldset disabled={busy}>
            <div className="admin-form-grid">
              <label>
                Nombre
                <input
                  name="name"
                  value={form.name}
                  onChange={change}
                  maxLength={200}
                  required
                />
              </label>
              <label>
                Slug (opcional)
                <input
                  name="slug"
                  value={form.slug}
                  onChange={change}
                  maxLength={200}
                />
              </label>
              <label>
                Estado
                <select name="status" value={form.status} onChange={change}>
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </label>
              <label className="admin-wide">
                Descripción
                <textarea
                  name="description"
                  value={form.description}
                  onChange={change}
                  rows={3}
                  maxLength={10000}
                />
              </label>
            </div>
          </fieldset>
          <p className="admin-muted">
            Desactivar una categoría no desactiva sus productos.
          </p>
          <div className="admin-actions">
            <button className="button button-dark" disabled={busy}>
              {busy ? "Guardando…" : "Guardar categoría"}
            </button>
            <button
              type="button"
              className="button button-outline"
              disabled={busy}
              onClick={() => setForm(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
        </AdminModal>
      )}
      <button
        className="button button-outline"
        onClick={load}
        disabled={loading || busy}
      >
        Actualizar
      </button>
      {loading ? (
        <p role="status">Cargando categorías…</p>
      ) : (
        <div className="admin-cards">
          {items.map((c) => (
            <article className="admin-panel" key={c.categoryId}>
              <span
                className={`admin-badge ${c.status === "inactive" ? "is-inactive" : ""}`}
              >
                {statusLabel(c.status)}
              </span>
              <h2>{c.name}</h2>
              <p>{c.description}</p>
              <button
                disabled={busy || !!form}
                onClick={() => {
                  setForm({ description: "", slug: "", ...c });
                  setError("");
                  setMessage("");
                }}
              >
                Editar categoría
              </button>
            </article>
          ))}
          {!items.length && (
            <p className="admin-empty">
              Todavía no hay categorías. Crea la primera para organizar tus
              productos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
