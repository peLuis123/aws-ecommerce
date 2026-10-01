import { useEffect, useState } from "react";
import { merchantsApi } from "../../api/merchants.api";
import { adminPaymentsApi } from "../../api/adminPayments.api";
import { formatMoney } from "../../utils/money";
import { adminError, minorUnits } from "../../utils/admin";
import { AdminFeedback } from "../../components/admin/AdminFeedback";
import { FinancialAction } from "../../components/admin/FinancialAction";
export function AdminBalancePage() {
  const [balance, setBalance] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [amount, setAmount] = useState(""),
    [provider, setProvider] = useState("stripe"),
    [destination, setDestination] = useState("");
  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await merchantsApi.balance();
      setBalance(data);
    } catch (e) {
      setError(adminError(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    let active = true;
    merchantsApi
      .balance()
      .then((response) => {
        if (active) {
          setBalance(response.data);
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
  function build() {
    const value = minorUnits(amount);
    if (value > balance.available)
      throw new Error("El importe supera tu saldo disponible.");
    const account = destination.trim();
    if (provider === "stripe" && !/^acct_[a-zA-Z0-9]+$/.test(account))
      throw new Error(
        "Introduce el ID de cuenta conectada de Stripe (acct_…).",
      );
    if (provider === "paypal" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account))
      throw new Error("Introduce el correo del destinatario PayPal.");
    return {
      payoutId: crypto.randomUUID(),
      amount: value,
      currency: balance.currency,
      provider,
      merchantAccountId: account,
    };
  }
  return (
    <div className="dashboard-page admin-workspace">
      <p className="eyebrow">Administración / Balance</p>
      <div className="admin-heading">
        <h1>El estado de tus fondos.</h1>
        <button
          className="button button-outline"
          onClick={load}
          disabled={loading}
        >
          Actualizar
        </button>
      </div>
      <AdminFeedback error={error} />
      {loading && <p role="status">Consultando balance…</p>}
      {balance && (
        <>
          <div className="balance-panel">
            <span>Disponible</span>
            <strong>{formatMoney(balance.available, balance.currency)}</strong>
            <small>
              {balance.updatedAt
                ? `Actualizado: ${new Date(balance.updatedAt).toLocaleString("es-PE")}`
                : ""}
            </small>
          </div>
          <FinancialAction
            kind="payout"
            build={build}
            send={adminPaymentsApi.payout}
            onSuccess={load}
          >
            <div className="admin-form-grid">
              <label>
                Importe ({balance.currency})
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={balance.available / 100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </label>
              <label>
                Proveedor
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                >
                  <option value="stripe">Stripe Connect</option>
                  <option value="paypal">PayPal</option>
                </select>
              </label>
              <label className="admin-wide">
                {provider === "stripe"
                  ? "Cuenta conectada de Stripe"
                  : "Correo del destinatario PayPal"}
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  type={provider === "paypal" ? "email" : "text"}
                  placeholder={
                    provider === "stripe" ? "acct_…" : "correo@ejemplo.com"
                  }
                  required
                />
              </label>
            </div>
            <p>
              El proveedor debe estar habilitado en el backend. Stripe
              transfiere a una cuenta conectada; PayPal envía al destinatario
              indicado.
            </p>
          </FinancialAction>
        </>
      )}
    </div>
  );
}
