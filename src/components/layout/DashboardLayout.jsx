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
  return (
    <DashboardLayout
      title="Panel admin"
      links={[
        ["/admin", "Resumen"],
        ["/admin/productos", "Productos"],
        ["/admin/ordenes", "Órdenes"],
        ["/admin/balance", "Balance"],
      ]}
    />
  );
}

function DashboardLayout({ title, links }) {
  const { user } = useAuth();

  return (
    <main className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <p className="eyebrow">{title}</p>
        <strong>{user?.displayName || user?.email}</strong>
        <nav aria-label={title}>
          {links.map(([path, label]) => (
            <NavLink key={path} to={path} end>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="dashboard-content">
        <Outlet />
      </section>
    </main>
  );
}
