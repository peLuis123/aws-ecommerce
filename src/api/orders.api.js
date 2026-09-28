import { axiosClient } from "./axiosClient";

export const ordersApi = {
  get: (id) => axiosClient.get(`/commercial-orders/${id}`),
  listMerchant: (merchantId) =>
    axiosClient.get(`/merchants/${merchantId}/orders`),
  list: () => axiosClient.get("/commercial-orders"),
  create: (payload) => axiosClient.post("/commercial-orders", payload),
  reserveInventory: (orderId) =>
    axiosClient.post(`/commercial-orders/${orderId}/inventory-reservations`),
  checkout: (orderId, payload, idempotencyKey) =>
    axiosClient.post(`/commercial-orders/${orderId}/checkout`, payload, {
      headers: { "Idempotency-Key": idempotencyKey },
    }),
};
