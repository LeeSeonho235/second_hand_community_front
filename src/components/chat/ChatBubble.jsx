import { formatChatTime } from '../../utils/format'

export default function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-4 py-1`}>
      <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : ''}`}>
        <div
          className={`max-w-[70vw] rounded-2xl px-3.5 py-2 text-sm ${
            isMine ? 'rounded-br-sm bg-brand-500 text-white' : 'rounded-bl-sm bg-gray-100 text-gray-800'
          }`}
        >
          {message.text}
        </div>
        <span className="shrink-0 text-[10px] text-gray-400">{formatChatTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
