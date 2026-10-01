import { axiosClient } from "./axiosClient";
export const adminPaymentsApi = {
  payout: (body, key) =>
    axiosClient.post("/payouts", body, { headers: { "Idempotency-Key": key } }),
  refund: (body, key) =>
    axiosClient.post("/refunds", body, { headers: { "Idempotency-Key": key } }),
};
