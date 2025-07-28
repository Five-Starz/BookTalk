import { LoginButton } from '../components/ui/Button'
import { EmailForm, PasswordForm } from '../components/ui/Form'

const Login = () => {
  return (
    <>
      <div className="min-h-full pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">로그인</h1>
        {/* 로그인 폼 */}
        <form className="w-full max-w-md space-y-4">
          {/* 이메일 */}
          <EmailForm />

          {/* 비밀번호 */}
          <PasswordForm />

          {/* 로그인 버튼 */}
          <LoginButton />
        </form>
      </div>
    </>
  )
}

export default Login
