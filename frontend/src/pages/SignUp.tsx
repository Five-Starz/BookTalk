import React from 'react'
import { EmailForm, NicknameForm, PasswordForm } from '../components/ui/Form'
import { SignupButton } from '../components/ui/Button'

const SignUp = () => {
  return (
    <>
      <div className="min-h-[80vh] pt-24 pb-24 flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-bold  mb-8">회원 가입</h1>
        {/* 회원가입 폼 */}
        <form className="w-full max-w-md space-y-4">
          {/* 닉네임 */}
          <NicknameForm />

          {/* 이메일 */}
          <EmailForm />

          {/* 비밀번호 */}
          <PasswordForm />

          {/* 가입 버튼 */}
          <SignupButton />
        </form>
      </div>
    </>
  )
}

export default SignUp
