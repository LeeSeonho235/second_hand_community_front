export const MOCK_CHAT_ROOMS = [
  {
    id: 'room1',
    postId: 'p1',
    buyerId: 'u1',
    sellerId: 'u2',
    createdAt: '2026-09-11T13:00:00+09:00',
    updatedAt: '2026-09-11T13:05:00+09:00',
    messages: [
      {
        id: 'm1',
        senderId: 'u1',
        content: '안녕하세요! 자료구조 책 아직 판매하시나요?',
        sequence: 1,
        clientMessageId: 'seed-m1',
        createdAt: '2026-09-11T13:00:00+09:00',
      },
      {
        id: 'm2',
        senderId: 'u2',
        content: '네 판매 중입니다~ 도서관 앞에서 거래 가능해요.',
        sequence: 2,
        clientMessageId: 'seed-m2',
        createdAt: '2026-09-11T13:02:00+09:00',
      },
      {
        id: 'm3',
        senderId: 'u1',
        content: '좋아요, 내일 오후 2시 어떠세요?',
        sequence: 3,
        clientMessageId: 'seed-m3',
        createdAt: '2026-09-11T13:05:00+09:00',
      },
    ],
  },
  {
    id: 'room2',
    postId: 'p3',
    buyerId: 'u1',
    sellerId: 'u3',
    createdAt: '2026-09-08T19:00:00+09:00',
    updatedAt: '2026-09-08T19:10:00+09:00',
    messages: [
      {
        id: 'm4',
        senderId: 'u1',
        content: '책상 세트 아직 있나요?',
        sequence: 1,
        clientMessageId: 'seed-m4',
        createdAt: '2026-09-08T19:00:00+09:00',
      },
      {
        id: 'm5',
        senderId: 'u3',
        content: '네 있습니다! 후문 쪽으로 오실 수 있으세요?',
        sequence: 2,
        clientMessageId: 'seed-m5',
        createdAt: '2026-09-08T19:10:00+09:00',
      },
    ],
  },
]

export const AUTO_REPLIES = [
  '네 확인했습니다!',
  '알겠습니다 :)',
  '좋아요, 그때 뵐게요!',
  '넵 감사합니다.',
]
