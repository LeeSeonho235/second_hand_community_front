import { useEffect, useState } from 'react'
import FilterChips from './FilterChips'
import { fetchCategories } from '../../api/categories'

const ALL_OPTION = { value: 'all', label: '전체' }

export default function CategoryFilter({ value, onChange }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // 카테고리를 못 불러와도 "전체" 필터로 목록은 볼 수 있습니다.
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const options = [ALL_OPTION, ...categories.map((c) => ({ value: c.id, label: c.name }))]

  return <FilterChips options={options} value={value} onChange={onChange} />
}
