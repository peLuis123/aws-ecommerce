export const formatMoney = (minorUnits, currency = 'USD') =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency,
  }).format((minorUnits || 0) / 100)
