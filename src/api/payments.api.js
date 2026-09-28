import { axiosClient } from './axiosClient'

export const paymentsApi = {
  get: (paymentId) => axiosClient.get(`/payments/${paymentId}`),
}
