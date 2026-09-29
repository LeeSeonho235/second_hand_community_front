import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, ImageIcon } from '../common/Icons'

const NAV_BUTTON_CLASS =
  'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-canvas text-ink shadow-sm'

export default function ImageSlider({ images, className = '' }) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className={`flex aspect-square w-full flex-col items-center justify-center gap-2 bg-canvas text-mute ${className}`}>
        <ImageIcon className="h-8 w-8" />
        <span className="text-sm">등록된 이미지가 없어요</span>
      </div>
    )
  }

  return (
    <div className={`relative aspect-square w-full overflow-hidden bg-canvas ${className}`}>
      <img src={images[index].url} alt={`상품 이미지 ${index + 1}`} className="h-full w-full object-cover" />

      {images.length > 1 && (
        <>
          {index > 0 && (
            <button onClick={() => setIndex((i) => i - 1)} className={`${NAV_BUTTON_CLASS} left-3`} aria-label="이전 이미지">
              <ChevronLeftIcon />
            </button>
          )}
          {index < images.length - 1 && (
            <button onClick={() => setIndex((i) => i + 1)} className={`${NAV_BUTTON_CLASS} right-3`} aria-label="다음 이미지">
              <ChevronRightIcon />
            </button>
          )}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-2 bg-canvas/70'}`} />
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-canvas">
            {index + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  )
}
