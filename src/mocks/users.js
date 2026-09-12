export const MOCK_USERS = [
  {
    id: 'u1',
    username: 'sunny95',
    password: '1234',
    nickname: '햇살가득',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    id: 'u2',
    username: 'jinho',
    password: '1234',
    nickname: '진호',
    avatar: 'https://i.pravatar.cc/100?img=33',
  },
  {
    id: 'u3',
    username: 'yuna',
    password: '1234',
    nickname: '유나',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
]

export const findUserById = (id) => MOCK_USERS.find((u) => u.id === id)
