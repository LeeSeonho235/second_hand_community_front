export const MOCK_USERS = [
  {
    id: 'u1',
    email: 'sunny95@campus.ac.kr',
    password: '1234',
    nickname: '햇살가득',
    createdAt: '2026-08-01T09:00:00+09:00',
  },
  {
    id: 'u2',
    email: 'jinho@campus.ac.kr',
    password: '1234',
    nickname: '진호',
    createdAt: '2026-08-02T09:00:00+09:00',
  },
  {
    id: 'u3',
    email: 'yuna@campus.ac.kr',
    password: '1234',
    nickname: '유나',
    createdAt: '2026-08-03T09:00:00+09:00',
  },
]

export const findUserById = (id) => MOCK_USERS.find((u) => u.id === id)
export const findUserByEmail = (email) => MOCK_USERS.find((u) => u.email === email)

// 응답에는 PublicUser({ id, nickname })만 노출합니다.
export const toPublicUser = (user) => (user ? { id: user.id, nickname: user.nickname } : null)
