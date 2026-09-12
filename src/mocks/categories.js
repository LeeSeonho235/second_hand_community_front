export const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'book', label: '전공책/교재' },
  { id: 'electronics', label: '전자기기' },
  { id: 'furniture', label: '가구/생활' },
  { id: 'clothes', label: '의류' },
  { id: 'ticket', label: '기프티콘/티켓' },
  { id: 'etc', label: '기타' },
]

export const getCategoryLabel = (id) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? '기타'
