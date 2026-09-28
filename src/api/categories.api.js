import { axiosClient } from './axiosClient'

export const categoriesApi = {
  list: () => axiosClient.get('/categories'),
}
