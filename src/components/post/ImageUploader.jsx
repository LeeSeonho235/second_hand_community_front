const MAX_IMAGES = 5

// 실제 백엔드 연동 시 여기서 서버 업로드 API를 호출해 URL을 받아오도록 바꾸면 됩니다.
const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

export default function ImageUploader({ images, onChange }) {
  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    const remaining = MAX_IMAGES - images.length
    const dataUrls = await Promise.all(files.slice(0, remaining).map(readAsDataUrl))
    onChange([...images, ...dataUrls])
  }

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto">
        {images.length < MAX_IMAGES && (
          <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-gray-200 text-gray-400">
            <span className="text-xl">📷</span>
            <span className="text-xs">{images.length}/{MAX_IMAGES}</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          </label>
        )}
        {images.map((src, index) => (
          <div key={index} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img src={src} alt={`업로드 이미지 ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-xs text-white"
              aria-label="이미지 삭제"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
