import { axiosClient } from './axiosClient'

export const merchantsApi = {
  balance: (merchantId) => axiosClient.get(`/merchants/${merchantId}/balance`),
}
