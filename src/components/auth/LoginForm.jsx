import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { useAuthStore } from '../../store/useAuthStore'
import { USE_MOCK } from '../../api/client'

// 로그인 페이지와 로그인 모달이 함께 쓰는 폼입니다.
export default function LoginForm({ onSuccess, onSignupClick, notice = '' }) {
  const login = useAuthStore((s) => s.login)

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      onSuccess?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {notice && <p className="rounded-xl bg-primary-pale px-4 py-3 text-sm font-semibold text-positive-deep">{notice}</p>}
        <Input
          label="이메일"
          type="email"
          placeholder="student@example.com"
          value={form.email}
          onChange={handleChange('email')}
          autoComplete="email"
          required
        />
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleChange('password')}
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-negative">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-body">
        아직 회원이 아니신가요?{' '}
        <button type="button" onClick={onSignupClick} className="font-semibold text-ink underline underline-offset-4">
          회원가입
        </button>
      </p>

      {USE_MOCK && <p className="mt-4 text-center text-xs text-mute">테스트 계정: sunny95@campus.ac.kr / 1234</p>}
    </>
  )
}
