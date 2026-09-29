import { useEffect, useState } from "react";
import { merchantsApi } from "../../api/merchants.api";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ClientDashboardLayout() {
  return (
    <DashboardLayout
      title="Mi espacio"
      links={[
        ["/cuenta", "Resumen"],
        ["/cuenta/ordenes", "Mis órdenes"],
        ["/carrito", "Carrito"],
      ]}
    />
  );
}

export function AdminDashboardLayout() {
  const { user } = useAuth();
  return <MerchantDashboard key={user.userId} />;
}

function MerchantDashboard() {
  const [merchants, setMerchants] = useState(null);
  const [merchantId, setMerchantId] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let active = true;
    merchantsApi
      .listMine()
      .then(({ data }) => {
        if (!active) return;
        setMerchants(data);
        if (data.length === 1) setMerchantId(data[0].merchantId);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const selector =
    merchants?.length > 0 ? (
      <label>
        Comercio
        <select
          value={merchantId}
          onChange={(event) => setMerchantId(event.target.value)}
          style={{ width: "100%", marginTop: "0.5rem", padding: "0.7rem" }}
        >
          <option value="" disabled>
            Selecciona tu comercio
          </option>
          {merchants.map((merchant) => (
            <option key={merchant.merchantId} value={merchant.merchantId}>
              {merchant.name || merchant.merchantId}
            </option>
          ))}
        </select>
      </label>
    ) : null;
  const message = failed
    ? "No pudimos cargar tus comercios. Recarga la página para intentarlo de nuevo."
    : merchants === null
      ? "Cargando tus comercios…"
      : merchants.length === 0
        ? "Tu cuenta no tiene un comercio asignado. Solicita que te vinculen como administrador de tu tienda."
        : !merchantId
          ? "Selecciona un comercio para abrir su panel."
          : null;
  return (
    <DashboardLayout
      title="Panel admin"
      selector={selector}
      merchantId={merchantId}
      message={message}
      links={[
        ["/admin", "Resumen"],
        ["/admin/productos", "Productos"],
        ["/admin/ordenes", "Órdenes"],
        ["/admin/balance", "Balance"],
      ]}
    />
  );
}

function DashboardLayout({ title, links, selector, merchantId, message }) {
  const { user } = useAuth();

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <p className="eyebrow">{title}</p>
        <strong>{user?.displayName || user?.email}</strong>
        {selector}
        <nav aria-label={title}>
          {links.map(([path, label]) => (
            <NavLink key={path} to={path} end>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="dashboard-content">
        {message ? (
          <p role="status">{message}</p>
        ) : (
          <Outlet key={merchantId} context={{ merchantId }} />
        )}
      </section>
    </main>
  );
}
