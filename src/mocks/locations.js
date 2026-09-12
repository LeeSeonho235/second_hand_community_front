export const LOCATIONS = [
  { id: 'main-gate', label: '정문' },
  { id: 'library', label: '중앙도서관' },
  { id: 'student-hall', label: '학생회관' },
  { id: 'dorm', label: '기숙사 앞' },
  { id: 'eng-building', label: '공학관' },
  { id: 'back-gate', label: '후문' },
]

export const getLocationLabel = (id) =>
  LOCATIONS.find((l) => l.id === id)?.label ?? '미정'
