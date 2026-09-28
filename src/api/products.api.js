import { axiosClient } from './axiosClient'

export const productsApi = {
  list: () => axiosClient.get('/products'),
}
