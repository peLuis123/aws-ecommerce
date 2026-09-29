import { axiosClient } from "./axiosClient";

export const categoriesApi = {
  list: (params) => axiosClient.get("/categories", { params }),
  create: (body, merchantId) =>
    axiosClient.post("/categories", body, { params: { merchantId } }),
  update: (id, body) => axiosClient.patch(`/categories/${id}`, body),
};
