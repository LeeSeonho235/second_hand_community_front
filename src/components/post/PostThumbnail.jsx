import { ImageIcon } from '../common/Icons'

// 썸네일이 없는 판매글(thumbnailUrl: null)도 깨진 이미지 대신 빈 타일을 보여줍니다.
export default function PostThumbnail({ src, alt, className = '' }) {
  return (
    <div className={`overflow-hidden bg-canvas-soft ${className}`}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-mute">
          <ImageIcon className="h-6 w-6" />
        </div>
      )}
    </div>
  )
}
