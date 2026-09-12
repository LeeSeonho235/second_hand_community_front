import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useAuthStore } from '../../store/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate(location.state?.from?.pathname ?? '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-brand-600">캠퍼스마켓</h1>
      <p className="mb-8 text-sm text-gray-400">우리 학교 학생들과 안전하게 거래해요</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Input
          label="아이디"
          placeholder="아이디를 입력하세요"
          value={form.username}
          onChange={handleChange('username')}
          autoComplete="username"
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
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-3">
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        아직 회원이 아니신가요?{' '}
        <Link to="/signup" className="font-semibold text-brand-500">
          회원가입
        </Link>
      </p>

      <p className="mt-8 text-center text-xs text-gray-300">
        테스트 계정: sunny95 / 1234
      </p>
    </div>
  )
}
