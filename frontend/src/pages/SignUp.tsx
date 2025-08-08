import { CheckPasswordForm, EmailForm, NicknameForm, PasswordForm } from '../components/ui/Form'
import { SignupButton } from '../components/ui/Button'
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../store/authStore';

const SignUp = () => {
  // 모달 상태 관리
  // isModalOpen을 useState로 초기화하여 모달의 열림/닫음 상태를 관리
  // 초기값은 false로 설정하여 모달이 닫힌 상태로 시작
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // const setTokens = useAuthStore((state) => state.setTokens); // 회원가입 후 로그인 된 상태로 메인으로 이동할 거면 사용

  // useNavigate 훅을 사용하여 페이지 이동
  // useNavigate를 사용하여 페이지 이동을 위한 navigate 함수를 생성
  const navigate = useNavigate();

  // 로그인 된 유저가 회원가입 페이지에 접근할 경우, 홈으로 리다이렉트
  // useEffect를 사용하여 컴포넌트가 마운트될 때 로그인 상태를 확인
  // localStorage에서 accessToken을 가져와 로그인 상태를 확인하고, 로그인 상태일 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/'); // 로그인 상태일 경우 홈으로 이동
    }
  }, [isLoggedIn ,navigate]);

  // 모달 닫기 핸들러
  // 모달이 열려있을 때, 확인 버튼 클릭 시 모달을 닫고 로그인 페이지로 이동
  // setIsModalOpen을 false로 설정하여 모달을 닫고, navigate를 사용하여 로그인 페이지로 이동
  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login'); // 모달 닫기 후 로그인 페이지로 이동
  }

  // zod 스키마 정의
  const signupSchema = z.object({
    nickname: z.string()
      .min(2, '닉네임은 2자 이상이어야 합니다.')
      .max(10, '닉네임은 10자 이하여야 합니다.')
      .regex(/^[가-힣a-zA-Z0-9]+$/, '닉네임은 한글, 영어, 숫자만 사용할 수 있습니다.')
      .refine(val => !/\s/.test(val), '닉네임에 공백을 포함할 수 없습니다.'),
    email: z.string()
      .trim()
      .min(1, '이메일을 입력해주세요.')
      .max(50, '이메일은 50자 이하여야 합니다.')
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '유효한 이메일 형식을 입력해주세요.')
      .refine(val => !/\s/.test(val), '이메일에 공백을 포함할 수 없습니다.'),
    password: z.string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(20, '비밀번호는 20자 이하여야 합니다.')
      .refine(val => !/\s/.test(val), '비밀번호에 공백을 포함할 수 없습니다.'),
    checkPassword: z.string()
      .min(8, '비밀번호 확인은 8자 이상이어야 합니다.')
      .max(20, '비밀번호 확인은 20자 이하여야 합니다.')
      .refine(val => !/\s/.test(val), '비밀번호 확인에 공백을 포함할 수 없습니다.')
  }).refine(data => data.password === data.checkPassword, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['checkPassword']
  });

  // useForm 훅 사용
  // zod 스키마를 resolver로 사용
  type SignupFormData = z.infer<typeof signupSchema>;

  // useForm 훅을 사용하여 폼 상태 관리
  // zodResolver를 사용하여 유효성 검사
  // mode를 'onBlur'로 설정하여 포커스가 벗어날 때 유효성 검사 수행
  // formState에서 errors를 추출하여 유효성 검사 오류 메시지 사용
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur'
  });

  const onValid = async (data: SignupFormData) => {
    try {
      // 여기에 실제 API 호출 코드 작성
      await axios.post('https://booktalk-server.onrender.com/auth/signup', {
        nickname: data.nickname,
        email: data.email,
        password: data.password
      });

      // Zustand 스토어에 토큰 저장 (회원가입 == 즉시 로그인) : 만약 이렇게 사용할거면 await 앞에 const res 변수 필요
      // setTokens(res.data.accessToken, res.data.refreshToken);

      setIsModalOpen(true); // 모달 열기
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      }
    }
  }

  return (
    <>
      <div className="min-h-full pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">회원 가입</h1>
        {/* 에러 메시지 출력 */}
        {
          errorMsg && <div className="text-red-500 text-sm mb-2">{ errorMsg }</div>
        }
        {/* 회원가입 폼 */}
        <form className="w-full max-w-md space-y-4" onSubmit={ handleSubmit(onValid) }>
          {/* 닉네임 */}
          <NicknameForm {...register('nickname')} error={errors.nickname?.message} />

          {/* 이메일 */}
          <EmailForm {...register('email')} error={errors.email?.message} />

          {/* 비밀번호 */}
          <PasswordForm {...register('password')} error={errors.password?.message} />

          {/* 비밀번호 확인 */}
          <CheckPasswordForm {...register('checkPassword')} error={errors.checkPassword?.message} />

          {/* 가입 버튼 */}
          <SignupButton />
        </form>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-white p-8 rounded-md shadow-lg min-w-[320px] flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4">회원가입 완료</h2>
            <p className="mb-6 text-center">회원가입이 성공적으로 완료되었습니다.</p>
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              onClick={ handleModalClose }
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default SignUp
