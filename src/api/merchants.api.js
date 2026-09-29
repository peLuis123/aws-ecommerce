import { axiosClient } from "./axiosClient";

export const merchantsApi = {
  listMine: () => axiosClient.get("/me/merchants"),
  balance: (merchantId) => axiosClient.get(`/merchants/${merchantId}/balance`),
};
