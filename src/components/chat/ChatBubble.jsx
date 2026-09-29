import { formatChatTime } from '../../utils/format'

export default function ChatBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} px-4 py-1`}>
      <div className={`flex items-end gap-1.5 ${isMine ? 'flex-row-reverse' : ''}`}>
        <div
          className={`max-w-[70vw] whitespace-pre-wrap break-words rounded-3xl px-4 py-2.5 text-base sm:max-w-[300px] ${
            isMine ? 'rounded-br-md bg-primary text-ink' : 'rounded-bl-md bg-canvas text-ink'
          }`}
        >
          {message.content}
        </div>
        <span className="shrink-0 text-[11px] text-mute">{formatChatTime(message.createdAt)}</span>
      </div>
    </div>
  )
}
