import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col px-4 py-8">
      <Link to="/" className="mb-10 self-start text-sm font-semibold text-body underline underline-offset-4">
        ← 둘러보기
      </Link>

      <h1 className="text-[48px] font-black leading-[1.02] tracking-tight text-ink">
        다시 만나서
        <br />
        반가워요
      </h1>
      <p className="mb-8 mt-3 text-base text-body">우리 학교 학생들과 안전하게 거래해요.</p>

      <div className="rounded-3xl bg-canvas p-6">
        <LoginForm
          notice={location.state?.signedUp ? '가입이 완료됐어요. 로그인해주세요.' : ''}
          onSuccess={() => navigate(location.state?.from?.pathname ?? '/', { replace: true })}
          onSignupClick={() => navigate('/signup')}
        />
      </div>
    </div>
  )
}
