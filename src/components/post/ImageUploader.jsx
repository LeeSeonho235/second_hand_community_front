import { useState } from 'react'
import { uploadImage, deleteImage } from '../../api/images'

const MAX_IMAGES = 10

export default function ImageUploader({ images, onChange }) {
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    const remaining = MAX_IMAGES - images.length
    if (remaining <= 0) return

    setError('')
    setUploading(true)
    try {
      const uploaded = await Promise.all(files.slice(0, remaining).map((file) => uploadImage(file)))
      onChange([...images, ...uploaded])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (index) => {
    const target = images[index]
    onChange(images.filter((_, i) => i !== index))
    if (target?.id) {
      deleteImage(target.id).catch(() => {})
    }
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto">
        {images.length < MAX_IMAGES && (
          <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg border border-gray-200 text-gray-400">
            <span className="text-xl">📷</span>
            <span className="text-xs">{images.length}/{MAX_IMAGES}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleFiles}
              disabled={uploading}
            />
          </label>
        )}
        {images.map((image, index) => (
          <div key={image.id ?? index} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img src={image.url} alt={`업로드 이미지 ${index + 1}`} className="h-full w-full object-cover" />
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
      {uploading && <p className="mt-1 text-xs text-gray-400">업로드 중...</p>}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
