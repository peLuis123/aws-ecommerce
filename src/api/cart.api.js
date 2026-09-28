import { axiosClient } from "./axiosClient";

export const cartApi = {
  create: (payload) => axiosClient.post("/carts", payload),
  get: (cartId) => axiosClient.get(`/carts/${cartId}`),
  addItem: (cartId, payload) =>
    axiosClient.post(`/carts/${cartId}/items`, payload),
  updateItem: (cartId, productId, quantity) =>
    axiosClient.patch(`/carts/${cartId}/items/${productId}`, { quantity }),
  removeItem: (cartId, productId) =>
    axiosClient.delete(`/carts/${cartId}/items/${productId}`),
};
