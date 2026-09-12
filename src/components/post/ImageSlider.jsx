import { useState } from 'react'

export default function ImageSlider({ images }) {
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) {
    return <div className="aspect-square w-full bg-gray-100" />
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
      <img src={images[index]} alt={`상품 이미지 ${index + 1}`} className="h-full w-full object-cover" />

      {images.length > 1 && (
        <>
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => i - 1)}
              className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
              aria-label="이전 이미지"
            >
              ‹
            </button>
          )}
          {index < images.length - 1 && (
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white"
              aria-label="다음 이미지"
            >
              ›
            </button>
          )}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
            {index + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  )
}
