import { useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentsApi } from "../../api/payments.api";
import { usePolling } from "../../hooks/usePolling";
import { demoMode } from "../../data/demo";
import { Icon } from "../../components/ui/Icon";

const resolvedStatuses = [
  "approved",
  "rejected",
  "cancelled",
  "refunded",
  "disputed",
];
export function CheckoutSuccessPage() {
  const [params] = useSearchParams();
  const paymentId = params.get("paymentId");
  const fetchPayment = useCallback(
    () => paymentsApi.get(paymentId).then((response) => response.data),
    [paymentId],
  );
  const isDone = useCallback(
    (payment) => resolvedStatuses.includes(payment.status),
    [],
  );
  const state = usePolling(fetchPayment, {
    enabled: Boolean(paymentId),
    isDone,
  });
  let title = "Confirmando tu pedido…";
  let description =
    "Estamos esperando la confirmación del proveedor. Tu historial estará disponible en tu cuenta.";
  if (!paymentId) {
    title = "No encontramos el pago.";
    description = "Puedes consultar tus compras desde tu cuenta.";
  } else if (state.status === "timeout") {
    title = "Tu pago sigue en proceso.";
    description =
      "La confirmación tarda un poco más de lo habitual. Revisa tu historial en unos minutos.";
  } else if (state.status === "error") {
    title = "No pudimos consultar el pago.";
    description =
      "Revisa el estado de tu pedido desde tu cuenta antes de volver a pagar.";
  } else if (state.data) {
    title =
      state.data.status === "approved"
        ? "Algo bonito está en camino."
        : "El pago no se completó.";
    description =
      state.data.status === "approved"
        ? demoMode
          ? "¡Tu compra de prueba está lista! Puedes encontrarla en tus pedidos. No se ha realizado ningún cobro ni se enviarán productos."
          : "Tu pago fue aprobado. Consulta el estado de tu pedido desde tu cuenta."
        : "Consulta el estado de tu compra antes de intentarlo de nuevo.";
  }
  return (
    <main className="checkout-page result-page">
      <div className="result-icon">
        <Icon
          name={state.data?.status === "approved" ? "check" : "bag"}
          size={32}
        />
      </div>
      <p className="eyebrow">
        {demoMode ? "COMPRA DE DEMOSTRACIÓN" : "TU PEDIDO"}
      </p>
      <h1>{title}</h1>
      <p className="cart-message">{description}</p>
      <Link className="button button-dark" to="/cuenta/ordenes">
        Ver mis pedidos <Icon name="arrow" size={18} />
      </Link>
    </main>
  );
}
