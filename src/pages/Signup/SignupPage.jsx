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
    if (form.password.length < 8 || form.password.length > 72) next.password = '비밀번호는 8자 이상 72자 이하여야 합니다.'
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
      navigate('/login', { replace: true, state: { signedUp: true } })
    } catch (err) {
      // 서버 검증 오류와 중복 오류는 해당 입력칸에, 그 외는 이메일 칸에 표시합니다.
      const fieldErrors = err.fieldErrors ?? {}
      if (Object.keys(fieldErrors).length) setErrors(fieldErrors)
      else if (err.code === 'NICKNAME_ALREADY_EXISTS') setErrors({ nickname: err.message })
      else setErrors({ email: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col px-4 py-8">
      <Link to="/" className="mb-10 self-start text-sm font-semibold text-body underline underline-offset-4">
        ← 둘러보기
      </Link>

      <h1 className="text-[48px] font-black leading-[1.02] tracking-tight text-ink">
        캠퍼스마켓
        <br />
        시작하기
      </h1>
      <p className="mb-8 mt-3 text-base text-body">이메일로 가입하고 바로 거래를 시작해요.</p>

      <div className="rounded-3xl bg-canvas p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="이메일"
            type="email"
            placeholder="student@example.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            autoComplete="email"
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="8자 이상 입력하세요"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            autoComplete="new-password"
            required
          />
          <Input
            label="비밀번호 확인"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={form.passwordConfirm}
            onChange={handleChange('passwordConfirm')}
            error={errors.passwordConfirm}
            autoComplete="new-password"
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

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? '가입 중...' : '가입하기'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-body">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-ink underline underline-offset-4">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
