// login.tsx
// access token만 저장 후 처리 전 저장
import axios from 'axios'
import { LoginButton } from '../components/ui/Button'
import { EmailForm, PasswordForm } from '../components/ui/Form'
import { useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';

import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');

  // useNavigate 훅을 사용하여 페이지 이동
  const navigate = useNavigate();

  // Zustand에서 로그인 상태 가져오기!
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useUserStore((state) => state.setUser);

  // 로그인된 상태면 즉시 홈으로 이동 (새로고침 없이도 동작)
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // 로그인 상태일 경우 홈으로 이동
    }
  }, [isLoggedIn, navigate]);


  // zod 스키마 정의
  // 이메일과 비밀번호 유효성 검사
  const loginSchema = z.object({
    email: z.string()
      .trim()
      .min(1, '이메일을 입력해주세요.')
      .max(50, '이메일은 50자 이하여야 합니다.')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '유효한 이메일 형식을 입력해주세요.')
      .refine(val => !/\s/.test(val), '이메일에 공백을 포함할 수 없습니다.'),
    password: z.string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.')
      .refine(val => !/\s/.test(val), '비밀번호에 공백을 포함할 수 없습니다.')
  });

  type LoginFormData = z.infer<typeof loginSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  const onValid = async (data: LoginFormData) => {
    try {
      const res = await axios.post('https://booktalk-server.onrender.com/auth/login', {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true
      }
    );

      // Zustand 전역 상태에 저장
      setTokens(res.data.accessToken, res.data.refreshToken); // 토큰 저장
      const { user } = res.data;
      setUser({ userId: user.userId, nickname: user.nickname });

      // navigate('/')는 없어도 됨: isLoggedIn이 true로 바뀌면 useEffect가 자동으로 이동시킴
      // navigate('/'); // 로그인 성공 후 홈으로 이동
    } catch(err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      }
    }
  }

  return (
    <>
      <div className="min-h-full pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">로그인</h1>
        {/* 에러 메시지 출력 */}
        {
          errorMsg && <div className="text-red-500 text-sm mb-2">{ errorMsg }</div>
        }
        {/* 로그인 폼 */}
        <form className="w-full max-w-md space-y-4" onSubmit={ handleSubmit(onValid) }>
          {/* 이메일 */}
          <EmailForm {...register('email')} error={errors.email?.message} />

          {/* 비밀번호 */}
          <PasswordForm {...register('password')} error={errors.password?.message} />

          {/* 로그인 버튼 */}
          <LoginButton />
        </form>
      </div>
    </>
  )
}

export default Login
