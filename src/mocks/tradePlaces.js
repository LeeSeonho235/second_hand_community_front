export const TRADE_PLACES = [
  { id: 'main-gate', name: '정문', description: '정문 앞 안전거래존', sortOrder: 1 },
  { id: 'library', name: '중앙도서관', description: '도서관 1층 로비', sortOrder: 2 },
  { id: 'student-hall', name: '학생회관', description: '학생회관 앞 광장', sortOrder: 3 },
  { id: 'dorm', name: '기숙사 앞', description: '기숙사 정문 앞', sortOrder: 4 },
  { id: 'eng-building', name: '공학관', description: '공학관 1층 로비', sortOrder: 5 },
  { id: 'back-gate', name: '후문', description: '후문 앞', sortOrder: 6 },
]

export const findTradePlaceById = (id) => TRADE_PLACES.find((t) => t.id === id) ?? null
