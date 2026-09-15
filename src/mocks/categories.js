export const CATEGORIES = [
  { id: 'book', name: '전공책/교재', sortOrder: 1 },
  { id: 'electronics', name: '전자기기', sortOrder: 2 },
  { id: 'furniture', name: '가구/생활', sortOrder: 3 },
  { id: 'clothes', name: '의류', sortOrder: 4 },
  { id: 'ticket', name: '기프티콘/티켓', sortOrder: 5 },
  { id: 'etc', name: '기타', sortOrder: 6 },
]

export const findCategoryById = (id) => CATEGORIES.find((c) => c.id === id) ?? null
