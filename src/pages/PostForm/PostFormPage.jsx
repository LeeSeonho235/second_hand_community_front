import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ImageUploader from '../../components/post/ImageUploader'
import CategorySelect from '../../components/post/CategorySelect'
import LocationSelect from '../../components/post/LocationSelect'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { createPost, updatePost, fetchPostById, deletePost } from '../../api/posts'
import { useAuthStore } from '../../store/useAuthStore'

const INITIAL_FORM = { title: '', description: '', price: '', category: '', location: '', images: [] }

export default function PostFormPage() {
  const { postId } = useParams()
  const isEditMode = Boolean(postId)
  const navigate = useNavigate()
  const currentUser = useAuthStore((s) => s.user)

  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(isEditMode)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditMode) return
    fetchPostById(postId).then((post) => {
      setForm({
        title: post.title,
        description: post.description,
        price: String(post.price),
        category: post.category,
        location: post.location,
        images: post.images,
      })
      setLoading(false)
    })
  }, [postId, isEditMode])

  const update = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.images.length === 0) return setError('이미지를 1장 이상 등록해주세요.')
    if (!form.category) return setError('카테고리를 선택해주세요.')
    if (!form.location) return setError('거래 희망 장소를 선택해주세요.')
    setError('')
    setSubmitting(true)

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      location: form.location,
      images: form.images,
    }

    try {
      if (isEditMode) {
        await updatePost(postId, payload)
        navigate(`/posts/${postId}`)
      } else {
        const created = await createPost({ ...payload, sellerId: currentUser.id })
        navigate(`/posts/${created.id}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠어요?')) return
    await deletePost(postId)
    navigate('/mypage', { replace: true })
  }

  if (loading) {
    return (
      <div>
        <TopBar title="판매글 수정" />
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar title={isEditMode ? '판매글 수정' : '판매글 등록'} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-4 py-4">
        <div>
          <span className="mb-1 block text-sm font-medium text-gray-700">상품 이미지</span>
          <ImageUploader images={form.images} onChange={update('images')} />
        </div>

        <Input
          label="제목"
          placeholder="제목을 입력하세요"
          value={form.title}
          onChange={(e) => update('title')(e.target.value)}
          required
        />

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">설명</span>
          <textarea
            value={form.description}
            onChange={(e) => update('description')(e.target.value)}
            placeholder="상품 상태, 거래 방법 등을 자세히 적어주세요"
            rows={5}
            required
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
        </label>

        <Input
          label="가격"
          type="number"
          min="0"
          placeholder="숫자만 입력하세요"
          value={form.price}
          onChange={(e) => update('price')(e.target.value)}
          required
        />

        <CategorySelect value={form.category} onChange={update('category')} />
        <LocationSelect value={form.location} onChange={update('location')} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={submitting} className="mt-2">
          {submitting ? '저장 중...' : isEditMode ? '수정 완료' : '등록하기'}
        </Button>

        {isEditMode && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            삭제하기
          </Button>
        )}
      </form>
    </div>
  )
}
