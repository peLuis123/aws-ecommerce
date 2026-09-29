import { axiosClient } from "./axiosClient";

export const productsApi = {
  list: (params) => axiosClient.get("/products", { params }),
  get: (id) => axiosClient.get(`/products/${id}`),
  create: (body) => axiosClient.post("/products", body),
  update: (id, body) => axiosClient.patch(`/products/${id}`, body),
  inventory: (id) => axiosClient.get(`/products/${id}/inventory`),
  updateInventory: (id, body) =>
    axiosClient.patch(`/products/${id}/inventory`, body),
};
