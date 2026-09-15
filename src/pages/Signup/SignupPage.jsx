import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuthStore } from '../../store/useAuthStore'

const INITIAL_FORM = { email: '', password: '', passwordConfirm: '', nickname: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const navigate = useNavigate()
  const signup = useAuthStore((s) => s.signup)

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!EMAIL_PATTERN.test(form.email)) next.email = '올바른 이메일 형식을 입력하세요.'
    if (form.password.length < 4) next.password = '비밀번호는 4자 이상이어야 합니다.'
    if (form.password !== form.passwordConfirm) next.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    if (!form.nickname.trim()) next.nickname = '닉네임을 입력하세요.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signup(form)
      navigate('/login', { replace: true })
    } catch (err) {
      setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-brand-600">회원가입</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="이메일"
          type="email"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleChange('password')}
          error={errors.password}
          required
        />
        <Input
          label="비밀번호 확인"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          value={form.passwordConfirm}
          onChange={handleChange('passwordConfirm')}
          error={errors.passwordConfirm}
          required
        />
        <Input
          label="닉네임"
          placeholder="사용할 닉네임을 입력하세요"
          value={form.nickname}
          onChange={handleChange('nickname')}
          error={errors.nickname}
          required
        />

        <Button type="submit" disabled={loading} className="mt-3">
          {loading ? '가입 중...' : '가입하기'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-semibold text-brand-500">
          로그인
        </Link>
      </p>
    </div>
  )
}
