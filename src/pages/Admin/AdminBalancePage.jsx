import { useEffect, useState } from "react";
import { merchantsApi } from "../../api/merchants.api";
import { MissingRouteWarning } from "../../components/ui/MissingRouteWarning";
import { config } from "../../config/env";
import { formatMoney } from "../../utils/money";

export function AdminBalancePage() {
  const [balance, setBalance] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    merchantsApi
      .balance(config.merchantId)
      .then((response) => {
        setBalance(response.data);
        setState("success");
      })
      .catch(() => setState("error"));
  }, []);

  if (state === "loading")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Balance</p>
        <h1>Consultando balance...</h1>
      </div>
    );
  if (state === "error")
    return (
      <div className="dashboard-page">
        <p className="eyebrow">Balance</p>
        <h1>No pudimos consultar el balance.</h1>
        <p className="cart-message">Vuelve a intentarlo en unos momentos.</p>
      </div>
    );

  return (
    <div className="dashboard-page">
      <p className="eyebrow">Balance</p>
      <h1>El estado de tus fondos.</h1>
      <div className="balance-panel">
        <span>Disponible</span>
        <strong>{formatMoney(balance.available, balance.currency)}</strong>
        <small>
          Actualizado: {new Date(balance.updatedAt).toLocaleString("es-CL")}
        </small>
      </div>
      <MissingRouteWarning message="Consulta el balance de tu tienda. La gestión de retiros estará disponible próximamente." />
    </div>
  );
}
