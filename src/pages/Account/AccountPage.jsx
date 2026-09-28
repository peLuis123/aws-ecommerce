import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";
import { RecentOrders } from "../../components/account/RecentOrders";
import { Icon } from "../../components/ui/Icon";

export function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "No pudimos cerrar sesión.");
    }
  };

  return (
    <div className="account-page">
      <p className="eyebrow">TU PEQUEÑO ESPACIO</p>
      <h1>Qué bueno verte, {user?.displayName || "de nuevo"}.</h1>
      <p className="cart-message">
        Tus piezas favoritas, tus pedidos y todo lo que hace de tu casa un
        hogar.
      </p>
      <div className="account-welcome">
        <Icon name="leaf" size={27} />
        <div>
          <h2>Siempre hay algo por descubrir.</h2>
          <p>Encuentra un nuevo detalle para ese rincón tan tuyo.</p>
          <Link className="text-link" to="/tienda">
            Explorar la colección <Icon name="arrow" size={17} />
          </Link>
        </div>
      </div>
      <RecentOrders />
      <div className="account-actions">
        <button className="text-button" type="button" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
