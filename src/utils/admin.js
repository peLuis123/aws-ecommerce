export function adminError(error) {
  if (error.response?.status === 409)
    return "Los datos cambiaron. Actualiza antes de volver a guardar.";
  if (error.response?.status === 403)
    return "Tu cuenta no tiene permiso para realizar esta acción.";
  if (error.response?.status === 401)
    return "Tu sesión terminó. Vuelve a iniciar sesión.";
  return (
    error.response?.data?.error ||
    error.message ||
    "No pudimos completar la operación."
  );
}

export function minorUnits(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value)))
    throw new Error("Introduce un importe válido con hasta dos decimales.");
  const amount = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(amount) || amount <= 0)
    throw new Error("El importe debe ser mayor que cero.");
  return amount;
}

export const statusLabel = (status) =>
  ({
    active: "Activo",
    inactive: "Inactivo",
    pending: "Pendiente",
    approved: "Aprobado",
    paid: "Pagado",
    refunded: "Reembolsado",
    failed: "Fallido",
    completed: "Completado",
  })[status] ||
  status ||
  "Sin estado";
