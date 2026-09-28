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
import { fetchCategories } from '../../api/categories'
import { fetchTradePlaces } from '../../api/tradePlaces'

const INITIAL_FORM = { title: '', description: '', price: '', categoryId: '', tradePlaceId: '', images: [] }

export default function PostFormPage() {
  const { postId } = useParams()
  const isEditMode = Boolean(postId)
  const navigate = useNavigate()

  const [form, setForm] = useState(INITIAL_FORM)
  const [version, setVersion] = useState(null)
  const [categories, setCategories] = useState([])
  const [tradePlaces, setTradePlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetchCategories(),
      fetchTradePlaces(),
      isEditMode ? fetchPostById(postId) : Promise.resolve(null),
    ])
      .then(([categoryList, tradePlaceList, post]) => {
        setCategories(categoryList)
        setTradePlaces(tradePlaceList)
        if (post) {
          setForm({
            title: post.title,
            description: post.description,
            price: String(post.price),
            categoryId: post.category?.id ?? '',
            tradePlaceId: post.tradePlace?.id ?? '',
            images: post.images,
          })
          setVersion(post.version)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [postId, isEditMode])

  const update = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.images.length === 0) return setError('이미지를 1장 이상 등록해주세요.')
    if (!form.categoryId) return setError('카테고리를 선택해주세요.')
    if (!form.tradePlaceId) return setError('거래 희망 장소를 선택해주세요.')
    setError('')
    setSubmitting(true)

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      categoryId: form.categoryId,
      tradePlaceId: form.tradePlaceId,
      imageIds: form.images.map((img) => img.id),
    }

    try {
      if (isEditMode) {
        const updated = await updatePost(postId, { ...payload, version })
        navigate(`/posts/${updated.id}`)
      } else {
        const created = await createPost(payload)
        navigate(`/posts/${created.id}`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠어요?')) return
    try {
      await deletePost(postId, version)
      navigate('/mypage', { replace: true })
    } catch (err) {
      setError(err.message)
    }
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

        <CategorySelect value={form.categoryId} onChange={update('categoryId')} options={categories} />
        <LocationSelect value={form.tradePlaceId} onChange={update('tradePlaceId')} options={tradePlaces} />

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
