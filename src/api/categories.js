import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'
import { CATEGORIES } from '../mocks/categories'

export const fetchCategories = async () => {
  if (USE_MOCK) {
    await mockDelay(100)
    return [...CATEGORIES].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const response = await apiClient.get('/categories')
  return unwrap(response).items
}
