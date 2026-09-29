const env = import.meta.env;

export const config = {
  apiBaseUrl: env.VITE_API_BASE_URL,
  appUrl: env.VITE_APP_URL || window.location.origin,
};

export const checkoutUrls = {
  success: `${config.appUrl}/checkout/success?paymentId={paymentId}`,
  cancel: `${config.appUrl}/checkout/cancel`,
};
