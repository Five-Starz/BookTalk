import axios from 'axios'
import { LoginButton } from '../components/ui/Button'
import { EmailForm, PasswordForm } from '../components/ui/Form'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:8000/auth/login', {
        email,
        password,
      },
      {
        withCredentials: true
      }
    );
      console.log('Login Success', res.data);
      navigate('/'); // 로그인 성공 후 홈으로 이동
    } catch (error) {
      console.log('Login Failed', error);
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  }

  return (
    <>
      <div className="min-h-full pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">로그인</h1>
        {/* 로그인 폼 */}
        <form className="w-full max-w-md space-y-4" onSubmit={ handleLogin }>
          {/* 이메일 */}
          <EmailForm value={ email } onChange={ setEmail } />

          {/* 비밀번호 */}
          <PasswordForm value={ password } onChange={ setPassword }/>

          {/* 로그인 버튼 */}
          <LoginButton />
        </form>
      </div>
    </>
  )
}

export default Login
