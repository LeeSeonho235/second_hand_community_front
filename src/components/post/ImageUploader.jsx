import { useState } from 'react'
import { uploadImage, deleteImage } from '../../api/images'
import { CloseIcon, ImageIcon } from '../common/Icons'

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
      // 이미 글에 연결된 이미지는 서버가 IMAGE_IN_USE로 거절합니다. 저장 시 imageIds에서 빠지면 미연결 처리됩니다.
      deleteImage(target.id).catch(() => {})
    }
  }

  return (
    <div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {images.length < MAX_IMAGES && (
          <label
            className={`flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-ink text-body transition-colors hover:bg-primary-pale ${
              uploading ? 'opacity-50' : ''
            }`}
          >
            <ImageIcon />
            <span className="text-xs font-semibold">
              {images.length}/{MAX_IMAGES}
            </span>
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
          <div key={image.id ?? index} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-canvas-soft">
            <img src={image.url} alt={`업로드 이미지 ${index + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-canvas"
              aria-label="이미지 삭제"
            >
              <CloseIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      {uploading && <p className="mt-2 text-sm text-mute">업로드 중...</p>}
      {error && <p className="mt-2 text-sm text-negative">{error}</p>}
      <p className="mt-2 text-xs text-mute">JPEG·PNG·WebP, 장당 최대 10MB</p>
    </div>
  )
}
