import { apiClient, USE_MOCK, mockDelay, unwrap } from './client'
import { TRADE_PLACES } from '../mocks/tradePlaces'

export const fetchTradePlaces = async () => {
  if (USE_MOCK) {
    await mockDelay(100)
    return [...TRADE_PLACES].sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const response = await apiClient.get('/trade-places')
  return unwrap(response).items
}
