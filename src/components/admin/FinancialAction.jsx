import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { adminError, statusLabel } from "../../utils/admin";
import { AdminFeedback } from "./AdminFeedback";
import { formatMoney } from "../../utils/money";
// Persist the exact request before sending so a network retry reuses its identity.
export function FinancialAction({
  kind,
  scope = "",
  build,
  send,
  children,
  onSuccess,
}) {
  const { user } = useAuth();
  const storageKey = `admin-operation:${user.userId}:${kind}:${scope}`;
  const [operation, setOperation] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  });
  const [review, setReview] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  function prepare(e) {
    e.preventDefault();
    setError("");
    try {
      setReview(build());
    } catch (err) {
      setError(adminError(err));
    }
  }
  async function execute() {
    setBusy(true);
    setError("");
    try {
      const next = operation || { key: crypto.randomUUID(), body: review };
      sessionStorage.setItem(storageKey, JSON.stringify(next));
      setOperation(next);
      const { data } = await send(next.body, next.key);
      const done = { ...next, result: data };
      sessionStorage.setItem(storageKey, JSON.stringify(done));
      setOperation(done);
      setReview(null);
      onSuccess?.();
    } catch (err) {
      setError(
        adminError(err) +
          " Si no recibiste confirmación, reintenta esta misma solicitud.",
      );
    } finally {
      setBusy(false);
    }
  }
  const body = operation?.body || review;
  return (
    <form className="admin-panel admin-form" onSubmit={prepare}>
      <h2>{kind === "payout" ? "Solicitar retiro" : "Solicitar reembolso"}</h2>
      <AdminFeedback error={error} />
      {operation?.result ? (
        <>
          <p role="status">
            Solicitud registrada:{" "}
            {statusLabel(
              operation.result.status ||
                operation.result.payout?.status ||
                operation.result.refund?.status,
            )}
          </p>
          <p className="admin-id">Referencia: {operation.key}</p>
          <button
            type="button"
            className="button button-outline"
            onClick={() => {
              sessionStorage.removeItem(storageKey);
              setOperation(null);
            }}
          >
            Preparar otra solicitud
          </button>
        </>
      ) : (
        <>
          <fieldset disabled={busy || !!body}>{children}</fieldset>
          {body ? (
            <div className="admin-review">
              <h3>Revisa antes de confirmar</h3>
              <p>
                Importe:{" "}
                <strong>{formatMoney(body.amount, body.currency)}</strong>
              </p>
              {body.merchantAccountId && (
                <p className="admin-id">
                  Destino: {body.merchantAccountId} ({body.provider})
                </p>
              )}
              {body.paymentId && (
                <p className="admin-id">Pago: {body.paymentId}</p>
              )}
              <p>Esta acción enviará una solicitud al proveedor de pagos.</p>
              <div className="admin-actions">
                <button
                  className="button button-dark"
                  type="button"
                  disabled={busy}
                  onClick={execute}
                >
                  {busy
                    ? "Enviando…"
                    : operation
                      ? "Reintentar la misma solicitud"
                      : "Confirmar solicitud"}
                </button>
                {!operation && (
                  <button
                    className="button button-outline"
                    type="button"
                    onClick={() => setReview(null)}
                  >
                    Volver a editar
                  </button>
                )}
              </div>
              {operation && (
                <p className="admin-muted">
                  Conservamos la referencia para evitar duplicar la operación al
                  reintentar. No crees otra solicitud hasta confirmar el
                  resultado.
                </p>
              )}
            </div>
          ) : (
            <button className="button button-dark">Revisar solicitud</button>
          )}
        </>
      )}
    </form>
  );
}
