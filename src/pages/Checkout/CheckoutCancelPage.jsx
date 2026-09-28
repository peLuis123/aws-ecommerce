import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
export function CheckoutCancelPage() {
  return (
    <main className="checkout-page result-page">
      <div className="result-icon">
        <Icon name="bag" size={32} />
      </div>
      <p className="eyebrow">SIN PRISA</p>
      <h1>Tu selección sigue aquí.</h1>
      <p className="cart-message">
        No completaste este checkout. Puedes revisar tu bolsa y continuar cuando
        quieras.
      </p>
      <Link className="button button-dark" to="/carrito">
        Volver a mi bolsa <Icon name="arrow" size={18} />
      </Link>
    </main>
  );
}
