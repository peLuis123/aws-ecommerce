import { axiosClient } from "./axiosClient";

export const categoriesApi = {
  list: (params) => axiosClient.get("/categories", { params }),
  create: (body) => axiosClient.post("/categories", body),
  update: (id, body) => axiosClient.patch(`/categories/${id}`, body),
};
