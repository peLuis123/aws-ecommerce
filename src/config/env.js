const env = import.meta.env

export const config = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  appUrl: env.VITE_APP_URL || window.location.origin,
  merchantId: env.VITE_MERCHANT_ID,
  merchantApiKey: env.VITE_MERCHANT_API_KEY,
}

export const checkoutUrls = {
  success: `${config.appUrl}/checkout/success?paymentId={paymentId}`,
  cancel: `${config.appUrl}/checkout/cancel`,
}
