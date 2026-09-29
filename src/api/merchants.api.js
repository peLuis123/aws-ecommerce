import { axiosClient } from "./axiosClient";

export const merchantsApi = {
  balance: () => axiosClient.get("/admin/balance"),
};
