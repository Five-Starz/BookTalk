import axios from 'axios'
import { LoginButton } from '../components/ui/Button'
import { EmailForm, PasswordForm } from '../components/ui/Form'
import { useNavigate } from 'react-router-dom'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';

// JWT 디코딩 및 만료 확인 함수
const parseJwt = (token: string) => {
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = atob(payloadBase64);
    return JSON.parse(decodedPayload);
  } catch {
    return null;
  }
}

// JWT 토큰 만료 여부 확인 함수
const isTokenExpired = (token: string) => {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true; // 만료 정보가 없으면 만료된 것으로 간주
  const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
  return payload.exp < currentTime; // 만료 시간과 비교
}

// access Token 유효성 체크하고 만료 시 /auth/refresh로 갱신 요청
const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const userId = localStorage.getItem('userId');

  if (!accessToken || isTokenExpired(accessToken)) {
    if (!userId) {
      return null; // userId가 없으면 토큰 갱신 불필요
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/auth/refresh',
        { userId},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      localStorage.setItem('accessToken', newAccessToken);

      return newAccessToken;
    } catch {
      localStorage.clear(); // 갱신 실패 시 localStorage 초기화
      window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      return null; // 토큰 갱신 실패 시 null 반환
    }
  }
  return accessToken; // 유효한 토큰 반환
}

// 로그인 컴포넌트
const Login = () => {
  // useNavigate 훅을 사용하여 페이지 이동
  const navigate = useNavigate();

  // 로그인 된 유저가 회원가입 페이지에 접근할 경우, 홈으로 리다이렉트
  // useEffect를 사용하여 컴포넌트가 마운트될 때 로그인 상태를 확인
  // localStorage에서 accessToken을 가져와 로그인 상태를 확인하고, 로그인 상태일 경우 홈으로 리다이렉트
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/'); // 로그인 상태일 경우 홈으로 이동
    }
  }, [navigate]);


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
      const res = await axios.post('http://localhost:8000/auth/login', {
        email: data.email,
        password: data.password,
      },
      {
        withCredentials: true
      }
    );
      console.log('Login Success', res);

      // localStorage에 Token 저장
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('userId', res.data.user.userId);

      navigate('/'); // 로그인 성공 후 홈으로 이동
    } catch {
      return;
    }
  }

  return (
    <>
      <div className="min-h-full pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">로그인</h1>
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
